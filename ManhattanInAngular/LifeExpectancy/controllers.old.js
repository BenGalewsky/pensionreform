'use strict';

/* Controllers */

var lifexpApp = angular.module('lifexpApp', []);

lifexpApp.controller('LifexpController', function($scope) {
    $scope.age = 30;
    $scope.gender = 'male';

    $scope.getExpectancy = function(){
        var expectancy = 0;
        var survival_prob = 1.0;

        if($scope.age >= 115){
            return($scope.age);
        }

        for(var y = $scope.age; y < PC.MAX_AGE; y++){
            var dying_probability = PC.mortalityRates[$scope.gender][y];
            expectancy += y * survival_prob * dying_probability;
            survival_prob *= (1 - dying_probability);
        }
        expectancy += PC.MAX_AGE * survival_prob;
        return(expectancy);
    }
});
