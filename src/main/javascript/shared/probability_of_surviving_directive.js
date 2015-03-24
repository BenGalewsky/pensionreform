pensionApp.directive("probabilityOfSurviving", function(){
  vals.getProbabilityOfDeath();
  return {
    template: "<span ng-class=\"{'alert alert-danger': vals.probabilityOfSurvival<.35 || vals.probabilityOfSurvival>.65}\">Probability of living this long: {{vals.probabilityOfSurvivalInt }}%</span>"
  }
})
