pensionApp.controller('PensionController', function($scope, $rootScope, $modal, $http, $log) {
  /* 'simple' mode is for when there is a continuous salary, no gaps, otherwise 'detailed' mode */
//  $rootScope.salaryMode = 'simple';

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
  //var salaryGraph=new SalaryGraph("#simpleContributionsGraph");
  //salaryGraph.setup();




  //model setup...
  $scope.vals=vals;//provide access to person model's values which is a global variable set in startup.js
  $scope.vals.$apply=function(){$scope.$apply();};//used by graphing callbacks to update the $scope model...
  $scope.occupations=[
      {label:'State Police/SERS',occupation:'policeOfficer',system:'SERS', coveredBySocialSecurity:false},
      {label:'Teacher/TRS',occupation:'teachers',system:'TRS', coveredBySocialSecurity:false},
      {label:'Judge/??',occupation:'judges',system:'??', coveredBySocialSecurity:true}]


  $scope.calculateContribution=1;
  $rootScope.statusContribution=1;
  // statusContribution is used by the salaryModalController to store its state.
  //0=do not include, 1=simple estimate, 2=detailed estimate

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
    var sers_model = calculate_model_data(pension.SERS.constructModelData(vals));
    vals.models.current=sers_model;
    var tier2_model = calculate_model_data(pension.Tier2.constructModelData(vals));
    vals.models.tier2=tier2_model;
    explain_output_graph(sers_model);
  }

  //run once to set estimated years and salaries...
  $scope.setEstimatedSH();
  vals.getProbableAgeAtDeath();
  
  calculate_model_data = function(model){
    model.calculate();
    model.contributionFund=model.history[model.person.retirementYear-model.person.hireYear].contributionFund;
    model.benefitFund=model.history[model.person.retirementYear-model.person.hireYear].benefitFund;
    model.contributionFund_npv=model.history[model.person.retirementYear-model.person.hireYear].contributionFund_npv;
    model.pctFunded=Math.round(model.contributionFund/model.benefitFund*100);
    model.benefitFund_npv=model.history[model.person.retirementYear-model.person.hireYear].benefitFund_npv;
    model.avgYr = vals.avgYr;
    model.finalAverageSalary = vals.finalAverageSalary;
    model.salaryHistory = vals.salaryHistory;
    model.yearOfRetirement = vals.ageAtRetirement+vals.birthYear;
    return model;
  }

  display_output_graph = function(model){
    $("#outputGraph").html();
    var outputGraph=new OutputGraph("#outputGraph");
    outputGraph.setup();
    outputGraph.render(model);
    outputGraph.drawGraph();
    outputGraph=new OutputGraph("#outputGraph2");
    outputGraph.setup();
    outputGraph.render(model,true);
    outputGraph.drawGraph(true);
  }

  explain_output_graph = function(model){
    $("#outputGraph").html("");
    var outputGraph=new OutputGraph("#outputGraph");
    outputGraph.setup();
    outputGraph.render(model);
    explain_script(explain_output_graph_script,$("#outputExplanation"), outputGraph)
  }

  explain_script = function(steps, explain_area, graph_object){
    explain_area.html("<table style='width: 100%; max-width: 860px;'><tr><td><span class='btn btn-mini explain_previous'><i class='icon-chevron-left icon-white'></i>Previous Step</span></td><td><span class='btn btn-mini explain_next pull-right'>Next Step<i class='icon-chevron-right icon-white'></i></span></td></tr><tr><td colspan=2 class='explanation-td'><span class='explanation'></td></tr></table>");
    var explain_span = explain_area.find(".explanation");
    var step_index = 0;
    explain_previous = function(){
      explain_area.find(".explain_previous").addClass("btn-primary");
      explain_area.find(".explain_next").addClass("btn-primary");
      if(step_index > 0) {
        step_index--;
      }
      else explain_area.find(".explain_previous").removeClass("btn-primary");
      var step=steps[step_index];
      if(step.context_script) {
        for(i=0;i<step.context_script.length;i++){
          graph_object[step.context_script[i]]();
        }
      }
      explain_span.html(step.explanation);
      if(step.forward_script) {
        for(i=0;i<step.forward_script.length;i++){
          graph_object[step.forward_script[i]]();
        }
      }
    }
    explain_next = function(){
      explain_area.find(".explain_previous").addClass("btn-primary");
      explain_area.find(".explain_next").addClass("btn-primary");
      if(step_index < steps.length-1) {
        step_index++;
      }
      else explain_area.find(".explain_next").removeClass("btn-primary");
      var step=steps[step_index];
      explain_span.html(step.explanation);
      if(step.forward_script) {
        for(i=0;i<step.forward_script.length;i++){
          graph_object[step.forward_script[i]]();
        }
      }
      if(step.forward_only_script) {
        for(i=0;i<step.forward_only_script.length;i++){
          graph_object[step.forward_only_script[i]]();
        }
      }
    }
    explain_area.find(".explain_previous").click(explain_previous);
    explain_area.find(".explain_next").click(explain_next);
    explain_previous();
  }

  explain_output_graph_script = [
    { explanation: "To understand the table below, first lets walk through graph underneath.  The tall green bars show your salary across the years.  Click Next Step!",
      forward_script: [
        "smallScale",
        "drawSalaryBars"
      ]
    },
    { explanation: "The solid green bars show the ammount you contributed each year to your pension, typically 8%.",
      context_script: [
        "smallScale",
        "drawSalaryBars"
      ],
      forward_script: [
        "drawContributionBars"
      ]
    },
    { explanation: "The solid red bars show your estimated retirement benefits across the years.",
      context_script: [
        "smallScale",
        "drawSalaryBars",
        "drawContributionBars"
      ],
      forward_script: [
        "drawBenefitBars"
      ]
    },
    { explanation: "Next we are shrinking the scale of your salary and benefits so we can show how they acrue over time",
      context_script: [
        "setup",
        "smallScale",
        "drawSalaryBars",
        "drawContributionBars",
        "drawBenefitBars"
      ],
      forward_only_script: [
        "labelShrinkingScale"
      ]
    },
    { explanation: "The solid green line shows the value of your contributions over the years if they were invested and acruing a return.",
      forward_script: [
        "setup",
        "fullScale",
        "drawSalaryBars",
        "drawContributionBars",
        "drawBenefitBars",
        "drawContributionFundLine"
      ]
    },
    { explanation: "The dashed green line shows the value of a hypothetical matching 401K if the state had matched your contribution all those years.  This is simply for comparison purposes.",
      context_script: [
        "fullScale",
        "drawSalaryBars",
        "drawContributionBars",
        "drawBenefitBars",
        "drawContributionFundLine"
      ],
      forward_script: [
        "drawMatching401KLine"
      ]
    },
    { explanation: "The solid red line shows how much the state owes you in future benefits (your pension) if the state created a fund to pay out the benefits until your anticipated death year.",
      context_script: [
        "fullScale",
        "drawSalaryBars",
        "drawContributionBars",
        "drawBenefitBars",
        "drawContributionFundLine",
        "drawMatching401KLine"
      ],
      forward_script: [
        "drawBenefitFundLine"
      ]
    },
    { explanation: "At the retirement year we can compare how much all your contributions were worth to how much the state will owe you in future benefits.  And we can determine what percentage of your pension is self funded by you.  The balance will be paid by the state.",
      context_script: [
        "fullScale",
        "drawSalaryBars",
        "drawContributionBars",
        "drawBenefitBars",
        "drawContributionFundLine",
        "drawBenefitFundLine"
      ],
      forward_script: [
        "drawPctSelfFunded"
      ]
    },
    { explanation: "Now let's return to the table below which shows this same information.   Look above for the percentage of your pension that is self funded.  Note that that the percentage self funded allows you to compare various reform proposals.  Also note that the contribution and benefit values are shown in current dollars as well as retirement year dollars (future).",
      context_script: [
        "fullScale",
        "drawSalaryBars",
        "drawContributionBars",
        "drawBenefitBars",
        "drawContributionFundLine",
        "drawBenefitFundLine"
      ],
      forward_script: [
      ]
    }
  ]

});//end controller function...
