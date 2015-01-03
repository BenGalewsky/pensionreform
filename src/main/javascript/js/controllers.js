'use strict';


/* Controllers */
var env={inflation:.03,rr:.07};
var pensionApp = angular.module('pensionApp', ['ui.bootstrap']);
var myscope;
pensionApp.controller('PensionController', function($scope) {
    myscope=$scope;
  //model setup...
  $scope.ageAtRetirement = 65;
  $scope.finalAverageSalary=75000;
  $scope.yearsOfService=20;
  $scope.gender='f';
  $scope.hireDate="1/1/1994";
  $scope.occupations=[
      {label:'State Police/SERS',occupation:'policeOfficer',system:'SERS', coveredBySocialSecurity:false},
      {label:'Teacher/TRS',occupation:'teachers',system:'TRS', coveredBySocialSecurity:false},
      {label:'Judge/??',occupation:'judges',system:'??', coveredBySocialSecurity:true}]
  $scope.chosenOccupation = $scope.occupations[0];//default to police...
  $scope.startingYear=null;
  $scope.startingSalary=30000;
  var curryr=new Date();
  $scope.currentYear=curryr.getFullYear();
  $scope.currentSalary=70000;
  $scope.endingYear=null;
  $scope.salaryHistoryArray=[];
  $scope.salaryHistoryEditYear=0;
  $scope.salaryHistoryEditIndex=-1;
  $scope.salaryHistoryDecrement=function(){
      if($scope.salaryHistoryEditIndex<1) $scope.salaryHistoryEditIndex=$scope.salaryHistoryArray.length;
      $scope.salaryHistoryEditIndex--;
      if($scope.salaryHistoryEditIndex>=0&&$scope.salaryHistoryEditIndex<$scope.salaryHistoryArray.length){
        $scope.salaryHistoryEditYear=$scope.salaryHistoryArray[$scope.salaryHistoryEditIndex].year;
        salaryGraph.be_show([$scope.salaryHistoryEditYear,$scope.salaryHistoryEditIndex]);
      }
  }
  $scope.salaryHistoryIncrement=function(){
      if($scope.salaryHistoryEditIndex>=$scope.salaryHistoryArray.length-1) $scope.salaryHistoryEditIndex=-1;
      $scope.salaryHistoryEditIndex++;
      if($scope.salaryHistoryEditIndex>=0&&$scope.salaryHistoryEditIndex<$scope.salaryHistoryArray.length){
        $scope.salaryHistoryEditYear=$scope.salaryHistoryArray[$scope.salaryHistoryEditIndex].year;
        salaryGraph.be_show([$scope.salaryHistoryEditYear,$scope.salaryHistoryEditIndex]);
      }
  }
  $scope.endingSalary=78000;
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
    // so see index.html input fields for ng-change events that trigger these updates.
    $scope.setSalaryEstimates=function(){
        var model = new SERSModel();
        var calculator = new pension.calculator(model);
        var scope=$scope;
        calculator.setSalaryEstimates(scope);//causes sideffect on scope to include scope.salaryHistoryArray
        //we don't want to show current year salary if person is already retired...
        if(scope.currentYear>scope.endingYear)  $(".currentYear").hide();
        else $(".currentYear").show();
        if(!scope.finalAverageSalary||!scope.yearsOfService) return;
        calculator.computeSalaryHistory(scope);
        salaryGraph.render(scope);
    }
    
    //$scope.$watchGroup(["yearsOfService","finalAverageSalary","hireDate"],setSalaryEstimates);
    $scope.setFinalAvgFromEstimates=function(nv,ov,scope){
        var scope=$scope;
        //check for gaps in years if years were incremented
        var i=0, lastyr=0, thisyr=0;
        var yra={};
        while(i<$scope.salaryHistoryArray.length&&i<40){
            yra=$scope.salaryHistoryArray[i++];
            while(lastyr>=yra.year) yra.year++;
            if(yra&&yra.year) thisyr=yra.year;
            if(lastyr>0 && thisyr-lastyr>1) {
                $scope.salaryHistoryArray.splice(i-1,0,{"year":lastyr+1, "salary":0,"yearsOfService":0});
            }
            lastyr=$scope.salaryHistoryArray[i-1].year;
        }
        //get model and compute final avg salary
        var model = new SERSModel();
        var calculator = new pension.calculator(model);
        calculator.computeFinalAverageSalary(scope);
        salaryGraph.render(scope);
        //then we need to calculate the finalAverageSalary... and years of service
        scope.yearsOfService=scope.endingYear-scope.startingYear;
        //use the data created by computeSalaryHistory to calculate the average...
        scope.finalAverageSalary=scope.finalAverage;
        //and reset the starting year...
        scope.hireDate=scope.hireDate.substring(0,scope.hireDate.lastIndexOf("/"))+"/"+scope.startingYear;
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
      vals.hireDate = new PC.Date(this.hireDate);
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
      salaryGraph.render($scope);//need to refresh graph if it was generated while hidden because some text elements get displayed improperly...
    })
    $("#detailed401k").click(function(){
      $scope.status401k=1;
      $("#est401k span.btn-info").removeClass("btn-info");
      $(this).addClass("btn-info");
      $("#estimateContributions").hide();
      $("#detailedContributions").show();
      $("#contributionsGraph").show();
      salaryGraph.render($scope);//need to refresh graph if it was generated while hidden because some text elements get displayed improperly...
    })

    //run once to set estimated years and salaries...
    $scope.setSalaryEstimates();
    

});//end controller function...


//UTILITIES...
//...... COULD NOT GET EITEHR OF THESE DIRECTIVES TO WORK.... 
pensionApp.directive('set-salary-estimates-on-blur',[function(){
        return{
            restrict:'A',
            require:'ngModel',
            link: function(scope, element, attrs, ctrl){
                element.bind('blur',function(evt){
                    scope.setSalaryEstimates();
                });
            }
        }
}])


//utility to map field input back to numbers in the model...
pensionApp.directive('toInt', function () {
        return {
            restrict:'A',
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                ctrl.$parsers.push(function (value) {
                    return parseInt(value || '',10);
                });
            }
        };
    });
