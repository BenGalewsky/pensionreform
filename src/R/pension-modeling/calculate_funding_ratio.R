# Output should be a single number, the funding ratio as a percent
# Inputs: plan_assets is a single number, population_forecast is a list of two matrixes (age by period) assuming no replacement
# benefit_forecast is a matrix (age by period), discount_rate is a number in percent
calculate_funding_ratio <- function(plan_assets,population_forecast,benefits_forecast,discount_rate) {
  
  pv_benefits_paid = c(0)
  beneficiary_forecast = population_forecast[[2]]
  npers = ncol(beneficiary_forecast)
  maxage = nrow(beneficiary_forecast)
  
  for (t in 2:npers) {
    paid_this_period = 0
    for (i in 1:maxage) {
      paid_this_period = paid_this_period + beneficiary_forecast[i,t] * benefits_forecast[i,t]
    }
    pv_benefits_paid = c(pv_benefits_paid,sum(paid_this_period)/(1+discount_rate/100)^t)
  }
  
  pv_benefits = sum(pv_benefits_paid)
  
  funding_ratio = 100 * plan_assets / pv_benefits
  
  funding_ratio
}


