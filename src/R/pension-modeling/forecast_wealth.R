# Outputs a list containing a vector of pension fund wealth, a vector of inflows and vector of outflows
# Each output vector is the length of the forecasting period (nper)
# Uses starting_wealth as a number, pop_forecast as a list of two matrixes (age by nper)
# Income forecast and benefits forecast matrixes (both age by nper), a ror in percent, and cont in percent
forecast_wealth <- function(starting_wealth,pop_forecast,income_forecast,benefits_forecast,ror,cont) {
  
  wealth = c(starting_wealth)
  inflows = c(0)
  outflows = c(0)
  
  active_forecast = pop_forecast[[1]]
  beneficiary_forecast = pop_forecast[[2]]
  nper = ncol(active_forecast)
  
  # Initial wealth of pension
  rate_of_return = ror / 100
  contribution_rate = cont / 100
  
  # Forecast plan wealth
  for (i in 2:nper) {
    total_income = active_forecast[,i]*income_forecast[,i]
    income_received = sum(total_income) * contribution_rate
    total_benefits = beneficiary_forecast[,i] * benefits_forecast[,i]
    benefits_paid = sum(total_benefits)
    
    if (wealth[i-1] > 0) {
      asset_return = wealth[i-1] * rate_of_return
    }
    
    wealth = c(wealth, wealth[i-1] + asset_return + income_received - benefits_paid)
    inflows = c(inflows, asset_return + income_received)
    outflows = c(outflows, benefits_paid)
  }
  
  list(wealth,inflows,outflows)
}