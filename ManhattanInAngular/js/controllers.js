'use strict';

/* Controllers */

var pensionApp = angular.module('pensionApp', []);

pensionApp.controller('PensionController', function($scope) {
  $scope.retireDate = '01/01/2020';
});
