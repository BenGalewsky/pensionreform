pensionApp.controller('PensionController', function($scope) {
  //model setup...
  $scope.vals=vals;//provide access to person model's values
  $scope.vals.$apply=function(){$scope.$apply();};//used by graphing callbacks to update the $scope model...
  $scope.occupations=[
      {label:'State Police/SERS',occupation:'policeOfficer',system:'SERS', coveredBySocialSecurity:false},
      {label:'Teacher/TRS',occupation:'teachers',system:'TRS', coveredBySocialSecurity:false},
      {label:'Judge/??',occupation:'judges',system:'??', coveredBySocialSecurity:true}]
  $scope.vals.salaryHistoryEditYear=0;
  $scope.vals.salaryHistoryEditIndex=-1;
  $scope.salaryHistoryDecrement=function(){
      if($scope.vals.salaryHistoryEditIndex<1) $scope.vals.salaryHistoryEditIndex=$scope.vals.salaryHistory.length;
      $scope.vals.salaryHistoryEditIndex--;
      if($scope.vals.salaryHistoryEditIndex>=0&&$scope.vals.salaryHistoryEditIndex<$scope.vals.salaryHistory.length){
        $scope.vals.salaryHistoryEditYear=$scope.vals.salaryHistory[$scope.vals.salaryHistoryEditIndex].year;
        salaryGraph.be_show([$scope.vals.salaryHistoryEditYear,$scope.vals.salaryHistoryEditIndex]);
      }
      window.setTimeout(function(){
          $("#detailedSalaryField").focus();
      }, 100);
  }
  $scope.salaryHistoryIncrement=function(){
      if($scope.vals.salaryHistoryEditIndex>=$scope.vals.salaryHistory.length-1) $scope.vals.salaryHistoryEditIndex=-1;
      $scope.vals.salaryHistoryEditIndex++;
      if($scope.vals.salaryHistoryEditIndex>=0&&$scope.vals.salaryHistoryEditIndex<$scope.vals.salaryHistory.length){
        $scope.vals.salaryHistoryEditYear=$scope.vals.salaryHistory[$scope.vals.salaryHistoryEditIndex].year;
        salaryGraph.be_show([$scope.vals.salaryHistoryEditYear,$scope.vals.salaryHistoryEditIndex]);
      }
      $("#detailedSalaryField").focus();
  }
  $scope.prependYear=function(){
      var h=vals.salaryHistory[0];
      var sal=Math.round(h.salary/(1+vals.env.WAGE_INFLATION));
      vals.salaryHistory.unshift({"year":h.year-1,"salary":sal,"yearsOfService":1,"contribution":sal*0.08});
      $scope.setFinalAvgFromEstimates();
  }
  $scope.appendYear=function(){
      var h=vals.salaryHistory[vals.salaryHistory.length-1];
      var sal=Math.round(h.salary*(1+vals.env.WAGE_INFLATION));
      vals.salaryHistory.push({"year":h.year+1,"salary":sal,"yearsOfService":1,"contribution":sal*0.08});
      $scope.setFinalAvgFromEstimates();
  }
  $scope.calculateContribution=1;
  $scope.status401k=0;//0=do not include, 1=simple estimate, 2=detailed estimate
  $scope.spy=function(){
      var r={};
      for(var p in $scope){
          if(typeof($scope[p])!="object"&&typeof($scope[p])!="function") r[p]=$scope[p];
      };
      return JSON.stringify(r);
  }
  //for use with the datepicker on starting date...
  $scope.opendatepicker=function($event){
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  }
  
    //watch for changes...
    //moved trigger of setSalaryEstimates and setFinalAvgFromEstimates to the change event on the input fields
    //  rather than on a watch of the model because I didn't want changes to occur with every keystroke 
    // nor did I want to cause any circular references, I only wanted user changes to trigger updates.
    // so see index.html input fields for ng-blur events that trigger these updates.
    $scope.setSalaryEstimates=function(){
        //the base requirements have changed so recalculate contributions by deleting start, current, end info...
        if($scope.status401k<1){
            vals.startingSalary=null;
            vals.yearsOfService=null;
            vals.endinSalary=null;
            vals.endingYear=null;
            vals.currentSalary=null;
        }
        if($scope.status401k<2) vals.generateDefaultSalaryHistory();
        
        //we don't want to show current year salary if person is already retired...
        if(vals.currentYear>vals.endingYear)  $(".currentYear").hide();
        else $(".currentYear").show();

        salaryGraph.render(vals);
    }
    
    //when one of the salary estimates/years changes, this recalculates everything
    $scope.setFinalAvgFromEstimates=function(nv,ov,scope){
        if($scope.status401k<2) vals.generateDefaultSalaryHistory();
        else vals.computeFinalAverageSalary();
              
        //we don't want to show current year salary if person is already retired...
        if(vals.currentYear>vals.endingYear)  $(".currentYear").hide();
        else $(".currentYear").show();

        salaryGraph.render(vals);
        
    }
    //$scope.$watchGroup(["currentSalary","startingSalary","endingSalary","startingYear","endingYear"],setFinalAvgFromEstimates);

    var salaryGraph=new SalaryGraph("#contributionsGraph");
      salaryGraph.setup();

    //set up detailed salary editor...
    $scope.salaryHistoryIncrement();

    //when button is clicked...
    $scope.calculate=function(){
      var vals = new SERSVars();
      var model = new SERSModel();
      var calculator = new pension.calculator(model);
      vals.hireYear = new PC.Date(this.hireYear);
      vals.ageAtRetirement = parseInt(this.ageAtRetirement);
      vals.finalAverageSalary = parseInt(this.finalAverageSalary);
      vals.yearsOfService = parseInt(this.yearsOfService);
      vals.occupation=this.chosenOccupation.occupation;
      vals.startingYear=this.startingYear;
      vals.startingSalary=this.startingSalary;
      vals.currentYear=this.currentYear;
      vals.currentSalary=this.currentSalary;
      vals.endingYear=this.endingYear;
      vals.endingSalary=this.endingSalary;

      var result = calculator.calculate(vals);
      this.maleAnnuity=result.annuity.male;
      this.femaleAnnuity=result.annuity.female;
    }
    $scope.maleAnnuity='';
    $scope.femaleAnnuity='';


    //NAVIGATION scripts...
    $("#estimateContributions").hide();
    $("#detailedContributions").hide();
    $("#contributionsGraph").hide();
    $("#no401k").click(function(){
      $scope.status401k=0;
      $("#est401k span.btn-info").removeClass("btn-info");
      $(this).addClass("btn-info");
      $("#estimateContributions").hide();
      $("#detailedContributions").hide();
      $("#contributionsGraph").hide();
    })
    $("#simple401k").click(function(){
      $scope.status401k=1;
      $("#est401k span.btn-info").removeClass("btn-info");
      $(this).addClass("btn-info");
      $("#estimateContributions").show();
      $("#detailedContributions").hide();
      $("#contributionsGraph").show();
      salaryGraph.render($scope.vals);//need to refresh graph if it was generated while hidden because some text elements get displayed improperly...
    })
    $("#detailed401k").click(function(){
      $scope.status401k=2;
      $("#est401k span.btn-info").removeClass("btn-info");
      $(this).addClass("btn-info");
      $("#estimateContributions").hide();
      $("#detailedContributions").show();
      $("#contributionsGraph").show();
      salaryGraph.render($scope.vals);//need to refresh graph if it was generated while hidden because some text elements get displayed improperly...
    })

    //run once to set estimated years and salaries...
    $scope.setSalaryEstimates();
    

});//end controller function...
