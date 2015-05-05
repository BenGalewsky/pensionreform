pensionApp.directive("probabilityOfSurviving", function(){
  return {
    link: function(scope, element, attrs){
      scope.$watch('vals.gender', function(){
        scope.vals.getProbabilityOfDeath();
      });
    },
    template: "<span ng-class=\"{'alert alert-danger': vals.probabilityOfSurvival<.4 || vals.probabilityOfSurvival>.6}\">Probability of living this long: {{vals.probabilityOfSurvivalInt }}%{{(vals.probabilityOfSurvival<.4?'. Try a lower age.':(vals.probabilityOfSurvival>.6?'. Try a higher age.':''))}}</span>"
  }
})
