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
      $scope.setDetailedSH();
  }
  $scope.appendYear=function(){
      var h=vals.salaryHistory[vals.salaryHistory.length-1];
      var sal=Math.round(h.salary*(1+vals.env.WAGE_INFLATION));
      vals.salaryHistory.push({"year":h.year+1,"salary":sal,"yearsOfService":1,"contribution":sal*0.08});
      $scope.setDetailedSH();
  }
  $scope.calculateContribution=1;
  $scope.statusContribution=1;//0=do not include, 1=simple estimate, 2=detailed estimate
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
    
    //This will set any missing data with an estimate and then fill in the salary and contribution array
    // so see index.html input fields for ng-blur and ng-change events that trigger these updates.
    $scope.setSalaryEstimates=function(){
        //exit if we have a crazy value (like when we are editing...
        if(vals.hireYear<1950||vals.birthYear<1900||vals.ageAtRetirement<50) return;
        //we don't want to show current year salary if person is already retired...
        if(vals.isActiveOrRetired()) $("#currentYear").show();
        else $("#currentYear").hide();
        //test to see if active and Contribution=0 and finalAverageSalary has been modified by more than 1% of the estimate... in that case switch to Contribution=1
        if($scope.vals.active&&$scope.statusContribution<2&&$scope.manualAvgSalary){
            var estimatedFinalAvgSalary=vals.finalAvgFromCurrentSalary();
            if(estimatedFinalAvgSalary&&Math.abs((estimatedFinalAvgSalary-vals.finalAverageSalary)/estimatedFinalAvgSalary)>.01) {
                $scope.statusContribution=1; 
                vals.finalEndingSalary=null;//this will get recalculated in vals.generateDefaultSalaryHistory...
            }
            else $scope.manualAvgSalary=false;
        }
        //the base requirements have changed so recalculate contributions by deleting start, current, end info...
        if($scope.statusContribution<2){
            //if not retired yet, current salary is the default starting point for estimates
            if(vals.active&&vals.currentSalary&&!$scope.manualAvgSalary) {
                vals.finalAverageSalary=null;
            }
            else vals.currentSalary=null;
            vals.startingSalary=null;
            //vals.yearsOfService=null;//this can be set by user...
            vals.endingSalary=null;
            vals.endingYear=null;
        }
        if($scope.statusContribution<2) vals.generateDefaultSalaryHistory();
        
        salaryGraph.render(vals);
    }
    $scope.resetEndingYear=function(){//used by change of years of service...
        //recalculate ending year if years of service is set explicitly... and we are in estimating modes 0 or 1...
        if($scope.statusContribution<2) {
            vals.endingYear=vals.hireYear+vals.yearsOfService;
            vals.endingSalary=null;
            vals.finalAvgSalary=null;
        }
    }

    //whenever one of the primary required fields changes, 
    //if in estimated or simple mode, calculate simple fields and then recalculate SH (Salary HIstory)
    //if in detailed mode, alert that details override simple estimates...
    $scope.setEstimatedSH=function(){
        if($scope.hasDetails&&!confirm("There are detailed changes stored in salary history, click OK to override previous changes with this simple estimate.  OR click CANCEL and return to the Detailed Estimate view.")) {
            $scope.statusContribution=2;
            return;
        }
        else $scope.hasDetails=false;
        //check mode
        if($scope.statusContribution==2) {
            alert("Use the graph and detailed fields below to edit salary history");
            return;
        }
        //check we have enough data on the years...
        if(!(vals.birthYear>1900&&vals.ageAtRetirement>50&&vals.hireYear>1900)) return;
        //if no yearsOfService yet, calculate from retirement date
        if(!vals.yearsOfService) vals.yearsOfService=vals.birthYear+vals.ageAtRetirement-vals.hireYear;
        vals.endingYear=vals.hireYear+vals.yearsOfService;
        //check we have enough dat aon the salary...
        if(vals.currentSalary<1000&&vals.finalAverageSalary<1000&&vals.endingSalary<1000) return;
        //determine estimates from current or ending salary depending on active or retired... if neither of those exist, use finalAvgSalary
        if(vals.isActiveOrRetired()&&vals.currentSalary)  vals.estimateFromCurrent();
        else if(!vals.active&&vals.endingSalary) vals.estimateFromEnding();
        else if(vals.finalAverageSalary) vals.estimateFromFinalAvg();
        else return;
        vals.computeFinalAverageSalary();
        salaryGraph.render(vals);
    }
    
    //whenever one fo the simple estimate fields is changed
    //if in simple mode, calculate SH based on simple fields: startingSalary, endingSalary, endingyear, currentyear...
    // if in any other mode, you wouldn't see or edit simple fields...
    $scope.setSimpleSH=function(){
        if($scope.hasDetails&&!confirm("There are detailed changes stored in salary history, click OK to override previous changes with this simple estimate.  OR click CANCEL and return to the Detailed Estimate view.")) {
            $scope.statusContribution=2;
            return;
        }
        else $scope.hasDetails=false;
        vals.generateDefaultSalaryHistory();
        vals.computeFinalAverageSalary();
        vals.computeYearsOfService();
        salaryGraph.render(vals);
    }
    
    //whenever the finalAvgSalary field is changed, delete current and ending salaries and then run setEstimatedSH
    $scope.finalAvgSalaryChanged=function(){
        vals.currentSalary=null;
        vals.endingSalary=null;
        $scope.manualAvgSalary=true;
        $scope.setEstimatedSH();
    }
    
    //whenever the detailed fields change, we only want to update the finalAverage and years of service...
    $scope.setDetailedSH=function(){
        vals.computeFinalAverageSalary();
        vals.computeYearsOfService();
        salaryGraph.render(vals);
        $scope.hasDetails=true;
    }


    //when one of the salary estimates/years changes, this recalculates everything
    $scope.obs_setFinalAvgFromEstimates=function(nv,ov,scope){
        //test to see if active and Contribution=0 and finalAverageSalary has been modified by more than 1% of the estimate... in that case switch to Contribution=1
        if($scope.vals.active&&$scope.statusContribution<2){
            var estimatedFinalAvgSalary=vals.finalAvgFromCurrentSalary();
            if(estimatedFinalAvgSalary&&Math.abs((estimatedFinalAvgSalary-vals.finalAverageSalary)/estimatedFinalAvgSalary)>.01) {
                $scope.manualAvgSalary=true;
                $scope.statusContribution=1; 
                vals.finalEndingSalary=null;//this will get recalculated in vals.generateDefaultSalaryHistory...
            }
            else $scope.manualAvgSalary=false;
        }
        //unless we are in detail mode, rerun the history array...
        if($scope.statusContribution<2) vals.generateDefaultSalaryHistory();
        else vals.computeFinalAverageSalary();
        //calls to this function all come from simple or detailed inputs so it is safe to recalculate the years of service without a circular reference... 
        vals.computeYearsOfService();
        //we don't want to show current year salary if person is already retired...
        if(vals.isActiveOrRetired()) $("#currentYear").show();
        else $("#currentYear").hide();

        salaryGraph.render(vals);
        
    }
    //$scope.$watchGroup(["currentSalary","startingSalary","endingSalary","startingYear","endingYear"],setFinalAvgFromEstimates);

    var salaryGraph=new SalaryGraph("#contributionsGraph");
      salaryGraph.setup();

    //set up detailed salary editor...
    $scope.salaryHistoryIncrement();
    
    $scope.getProbableAgeAtDeath=function(){vals.getProbableAgeAtDeath();}

    //when calculate button is clicked...
    $scope.calculate=function(){
      var model = pension.SERS.constructModelData(vals);
      model.calculate();
      model.contributionFund=model.history[model.person.retirementYear-model.person.hireYear].contributionFund;
      model.benefitFund=model.history[model.person.retirementYear-model.person.hireYear].benefitFund;
      model.contributionFund_npv=model.history[model.person.retirementYear-model.person.hireYear].contributionFund_npv;
      model.pctFunded=Math.round(model.contributionFund/model.benefitFund*100);
      model.benefitFund_npv=model.history[model.person.retirementYear-model.person.hireYear].benefitFund_npv;
      vals.models.current=model;
      $("#outputGraph").html();
      var outputGraph=new OutputGraph("#outputGraph");
      outputGraph.setup();
      outputGraph.render(vals);
      outputGraph=new OutputGraph("#outputGraph2");
      outputGraph.setup();
      outputGraph.render(vals,true);
      
    }

    $scope.contributionType = '';
    $scope.$watch(function(){return $scope.contributionType;}, function(oldvalue, newvalue){
      if(newvalue == 'simple' || newvalue == 'detailed') {
        salaryGraph.render($scope.vals);//need to refresh graph if it was generated while hidden because some text elements get displayed improperly...
        $scope.$apply();
      }
    })

    //NAVIGATION scripts...
//    $("#estimateContributions").hide();
  //  $("#detailedContributions").hide();
//    $("#contributionsGraph").hide();
    $("#noContribution").click(function(){
      $scope.statusContribution=0;
      $("#estContribution span.btn-info").removeClass("btn-info");
      $(this).addClass("btn-info");
//      $("#estimateContributions").hide();
//      $("#detailedContributions").hide();
 //     $("#contributionsGraph").hide();
      $scope.$apply();
    })
    $("#simpleContribution").click(function(){
      $scope.statusContribution=1;
      $("#estContribution span.btn-info").removeClass("btn-info");
      $(this).addClass("btn-info");
//      $("#estimateContributions").show();
//      $("#detailedContributions").hide();
 //     $("#contributionsGraph").show();
      salaryGraph.render($scope.vals);//need to refresh graph if it was generated while hidden because some text elements get displayed improperly...
      $scope.$apply();
    })
    $("#detailedContribution").click(function(){
      $scope.statusContribution=2;
      $("#estContribution span.btn-info").removeClass("btn-info");
      $(this).addClass("btn-info");
//      $("#estimateContributions").hide();
  //    $("#detailedContributions").show();
//      $("#contributionsGraph").show();
      salaryGraph.render($scope.vals);//need to refresh graph if it was generated while hidden because some text elements get displayed improperly...
      $scope.$apply();
    })

    //run once to set estimated years and salaries...
    $scope.setEstimatedSH();
    vals.getProbableAgeAtDeath();
    

});//end controller function...
