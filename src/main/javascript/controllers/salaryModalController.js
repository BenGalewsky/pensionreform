pensionApp.controller('SalaryModalController', function ($scope, $rootScope, $modalInstance, vals) {

  //sets vals object with all the data on it...
  $scope.vals = vals;

  $scope.switchToDetailed = function(){
    $rootScope.salaryMode='detailed';
    $scope.ok();
    window.setTimeout($rootScope.openSalaryModal,500);
  }

  $scope.switchToSimple = function(){
    $rootScope.salaryMode='simple';
    $scope.ok();
    window.setTimeout($rootScope.openSalaryModal,500);
  }

  if($scope.vals.salaryHistoryEditIndex === undefined) {
    $scope.vals.salaryHistoryEditIndex = -1;
  }
  if($scope.vals.salaryHistoryEditIndex < 0 && $scope.vals.salaryHistory.length > 0){
    $scope.vals.salaryHistoryEditIndex = 0;
    $scope.vals.salaryHistoryEditYear= $scope.vals.salaryHistory[0].year;
  }

  //whenever one fo the simple estimate fields is changed
  //if in simple mode, calculate SH based on simple fields: startingSalary, endingSalary, endingyear, currentyear...
  // if in any other mode, you wouldn't see or edit simple fields...
  $scope.setSimpleSH=function(){
      if($scope.hasDetails&&!confirm("There are detailed changes stored in salary history, click OK to override previous changes with this simple estimate.  OR click CANCEL and return to the Detailed Estimate view.")) {
          $rootScope.statusContribution=2;
          return;
      }
      else $scope.hasDetails=false;
      vals.generateDefaultSalaryHistory();
      vals.computeFinalAverageSalary();
      vals.computeYearsOfService();
      $scope.$broadcast("reviseSalaryGraph")
  }
  
  //whenever the detailed fields change, we only want to update the finalAverage and years of service...
  $scope.setDetailedSH=function(){
      vals.computeFinalAverageSalary();
      vals.computeYearsOfService();
      $scope.hasDetails=true;
      $scope.$broadcast("reviseSalaryGraph")
      $rootScope.statusContribution=2;
  }

  $scope.hasValidSalaryHistoryData = function(){
    return $scope.vals.salaryHistoryEditIndex > -1 && 
      $scope.vals.salaryHistoryEditIndex < $scope.vals.salaryHistory.length
  }

  //whenever the finalAvgSalary field is changed, delete current and ending salaries and then run setEstimatedSH
  $scope.finalAvgSalaryChanged=function(){
      vals.currentSalary=null;
      vals.endingSalary=null;
      $scope.manualAvgSalary=true;
      $scope.setEstimatedSH();
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

  $scope.salaryHistoryDecrement=function(){
    if($scope.vals.salaryHistoryEditIndex<1) $scope.vals.salaryHistoryEditIndex=$scope.vals.salaryHistory.length;
    $scope.vals.salaryHistoryEditIndex--;
    if($scope.vals.salaryHistoryEditIndex>=0&&$scope.vals.salaryHistoryEditIndex<$scope.vals.salaryHistory.length){
      $scope.vals.salaryHistoryEditYear=$scope.vals.salaryHistory[$scope.vals.salaryHistoryEditIndex].year;
      $scope.$broadcast('salaryGraphEditBar', [$scope.vals.salaryHistoryEditYear,$scope.vals.salaryHistoryEditIndex]);
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
      $scope.$broadcast('salaryGraphEditBar', [$scope.vals.salaryHistoryEditYear,$scope.vals.salaryHistoryEditIndex]);
    }
    $("#detailedSalaryField").focus();
  }

  $scope.ok = function () {
    $modalInstance.close($scope.vals);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});