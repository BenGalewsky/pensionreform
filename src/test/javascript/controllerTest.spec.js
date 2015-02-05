var vals=new pension.person();

xdescribe('Pension Site Front End', function() {
  beforeEach(module('pensionApp'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));

  describe('test $scope', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = {};
      controller = $controller('PensionController', { $scope: $scope });
    });

    it('set salary array when status401k is 0', function() {
      $scope.status401k=0;
      $scope.setSalaryEstimates();
      expect($scope.vals.salaryHistory.length).toEqual(1);
    });
    it('set salary array when status401k is 1', function() {
      $scope.status401k=1;
      $scope.setSalaryEstimates();
      expect($scope.vals.salaryHistory.length).toEqual(1);
    });
    it('set salary array when status401k is 2', function() {
      $scope.status401k=2;
      $scope.setSalaryEstimates();
      expect($scope.vals.salaryHistory.length).toEqual(1);
    });

  });
});