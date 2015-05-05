pensionApp.controller('PensionController', function($scope, $rootScope, $modal, $http, $log) {
  /* 'simple' mode is for when there is a continuous salary, no gaps, otherwise 'detailed' mode */
  $rootScope.salaryMode = 'simple';

  $scope.openSalaryModal = $rootScope.openSalaryModal = function () {
    var modalInstance;
    if($rootScope.salaryMode == 'simple') {
      modalInstance = $modal.open({
        templateUrl: 'templates/simpleSalary.html',
        controller: 'SalaryModalController',
        backdropClass: 'modal-backdrop-centered',
        windowClass: 'modal-wide',
        resolve: {
          vals: function(){return vals;}
        }
      });
    }
    else {
      modalInstance = $modal.open({
        templateUrl: 'templates/detailedSalary.html',
        controller: 'SalaryModalController',
        backdropClass: 'modal-backdrop-centered',
        windowClass: 'modal-wide',
        resolve: {
          vals: function(){return vals;}
        }
      });
    }

    modalInstance.result.then(function (vals) {
      $scope.vals = vals;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  var showOutputArea = false;
  $scope.showOutputArea = function(){
    return showOutputArea;
  }

  var originalContent="";
  $scope.fetchContent = function(url){
    var mainContent = $("#mainContent");
    if(originalContent == '')  originalContent = mainContent.html();
    if(!url) mainContent.html(originalContent);
    else {
      $http.get("templates/"+url).then(function(result){
          mainContent.html(result.data);
      });      
    }
  }

  //obsolete.. need to dump all references to this in this file, then remove these next two lines
  //all salaryGraph modelling is done in the salaryGraphDirective now...
  var salaryGraph=new SalaryGraph("#simpleContributionsGraph");
  salaryGraph.setup();




  //model setup...
  $scope.vals=vals;//provide access to person model's values
  $scope.vals.$apply=function(){$scope.$apply();};//used by graphing callbacks to update the $scope model...
  $scope.occupations=[
      {label:'State Police/SERS',occupation:'policeOfficer',system:'SERS', coveredBySocialSecurity:false},
      {label:'Teacher/TRS',occupation:'teachers',system:'TRS', coveredBySocialSecurity:false},
      {label:'Judge/??',occupation:'judges',system:'??', coveredBySocialSecurity:true}]


  $scope.calculateContribution=1;
  $rootScope.statusContribution=1;//0=do not include, 1=simple estimate, 2=detailed estimate
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
      if($scope.vals.active&&$rootScope.statusContribution<2&&$scope.manualAvgSalary){
          var estimatedFinalAvgSalary=vals.finalAvgFromCurrentSalary();
          if(estimatedFinalAvgSalary&&Math.abs((estimatedFinalAvgSalary-vals.finalAverageSalary)/estimatedFinalAvgSalary)>.01) {
              $rootScope.statusContribution=1; 
              vals.finalEndingSalary=null;//this will get recalculated in vals.generateDefaultSalaryHistory...
          }
          else $scope.manualAvgSalary=false;
      }
      //the base requirements have changed so recalculate contributions by deleting start, current, end info...
      if($rootScope.statusContribution<2){
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
      if($rootScope.statusContribution<2) vals.generateDefaultSalaryHistory();
      
  }
  $scope.resetEndingYear=function(){//used by change of years of service...
      //recalculate ending year if years of service is set explicitly... and we are in estimating modes 0 or 1...
      if($rootScope.statusContribution<2) {
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
          $rootScope.statusContribution=2;
          return;
      }
      else $scope.hasDetails=false;
      //check mode
      if($rootScope.statusContribution==2) {
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
  }

  
  $scope.getProbableAgeAtDeath=function(){vals.getProbableAgeAtDeath();}

  //when calculate button is clicked...
  $scope.calculate=function(){
    showOutputArea = true;
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

  //run once to set estimated years and salaries...
  $scope.setEstimatedSH();
  vals.getProbableAgeAtDeath();
  

});//end controller function...
