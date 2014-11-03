'use strict';

/* Controllers */

var pensionApp = angular.module('pensionApp', []);
var myscope;
pensionApp.controller('PensionController', function($scope) {
    myscope=$scope;
  $scope.ageAtRetirement = '65';
  $scope.finalAverageSalary='75000';
  $scope.yearsOfService='20';
  $scope.gender='f';
  $scope.hireDate="1/1/1984";
  $scope.occupations=[{label:'State Police/SERS',occupation:'policeOfficer',system:'SERS', coveredBySocialSecurity:false},{label:'Teacher/TRS',occupation:'teachers',system:'TRS', coveredBySocialSecurity:false},{label:'Judge/??',occupation:'judges',system:'??', coveredBySocialSecurity:true}]
  $scope.chosenOccupation = $scope.occupations[0];//default to police...
  $scope.calculate=function(){
    var vals = new SERSVars();
    var model = new SERSModel();
    var calculator = new PensionCalculator(model);
    vals.hireDate = new PC.Date(this.hireDate);
    vals.ageAtRetirement = parseInt(this.ageAtRetirement);
    vals.finalAverageSalary = parseInt(this.finalAverageSalary);
    vals.yearsOfService = parseInt(this.yearsOfService);
    vals.occupation=this.chosenOccupation.occupation;

    var result = calculator.calculate(vals);
    this.maleAnnuity=result.male;
    this.femaleAnnuity=result.female;
  }
  $scope.maleAnnuity='';
  $scope.femaleAnnuity='';
});
