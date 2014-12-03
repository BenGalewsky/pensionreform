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


angular.module('charts', [])
    .controller('mainCtrl', function AppCtrl ($scope) {

        // Calculator controls
        $scope.age = 30;
        $scope.gender = 'male';
        $scope.sProbabilities = [];

        $scope.getExpectancy = function(){
            var expectancy = 0;
            var survival_prob = 1.0;

            $scope.sProbabilities = [];
            $scope.data = [];
            
            if($scope.age >= 115){
                return($scope.age);
            }

            for(var y = $scope.age; y < PC.MAX_AGE; y++){
                var dying_probability = PC.mortalityRates[$scope.gender][y];
                expectancy += y * survival_prob * dying_probability;
                survival_prob *= (1 - dying_probability);
                if(y % 5 == 0){
                    $scope.sProbabilities.push([y, survival_prob])
                    $scope.data.push([y, survival_prob])
                }
                // else{
                //     $scope.sProbabilities.push([y, survival_prob])
                //     $scope.data.push([y, survival_prob])
                // }
            }
            expectancy += PC.MAX_AGE * survival_prob;

            return(expectancy);
        }

        // Chart controls

        $scope.options = {width: 500, height: 300, 'bar': 'aaa'};
        $scope.data = [];
        $scope.hovered = function(d){
            $scope.barValue = d;
            $scope.$apply();
        };
        $scope.barValue = 'None';

    })
    .directive('barChart', function(){
        var chart = d3.custom.barChart();
        return {
            restrict: 'E',
            replace: true,
            template: '<div class="chart"></div>',
            scope:{
                height: '=height',
                data: '=data',
                hovered: '&hovered'
            },
            link: function(scope, element, attrs) {
                var chartEl = d3.select(element[0]);
                chart.on('customHover', function(d, i){
                    scope.hovered({args:d[1]});
                });

                scope.$watch('data', function (newVal, oldVal) {
                    chartEl.datum(newVal).call(chart);
                });

                scope.$watch('height', function(d, i){
                    chartEl.call(chart.height(scope.height));
                })
            }
        }
    })
    .directive('chartForm', function(){
        return {
            restrict: 'E',
            replace: true,
            controller: function AppCtrl ($scope) {
                $scope.update = function(d, i){ $scope.data = randomData(); };
                function randomData(){
                    return d3.range(~~(Math.random()*50)+1).map(function(d, i){return ~~(Math.random()*1000);});
                }
            },
            template: '<div class="form">' +
                'Height: {{options.height}}<br />' +
                '<input type="range" ng-model="options.height" min="100" max="800"/>' +
                '<br /><button ng-click="update()">Update Data</button>' +
                '<br />Hovered bar data: {{barValue}}</div>'
        }
    })
    .directive('ageSlider', function(){
        return {
            restrict: 'E',
            replace: true,
            controller: function AppCtrl ($scope) {
                $scope.update = function(d, i){ $scope.data = randomData(); };
                function randomData(){
                    return d3.range(~~(Math.random()*50)+1).map(function(d, i){return ~~(Math.random()*1000);});
                }
            },
            template: '<div class="form">' +
//                'How old are you: <strong>{{age}}</strong><br />' +
//                '<input type="range" ng-model="age" min="1" max="120" step="1"/>'
                'Age? ' + '<strong>{{age}}</strong><br />' +
                '<input type="range" style="width: 300px" ng-model="age" min="1" max="120" step="1"/>'
        }
    });

