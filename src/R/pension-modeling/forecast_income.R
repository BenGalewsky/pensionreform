
# Forecast incomes at each age for a given number of periods
forecast_income <- function(curr_income,npers,income_growth_rate) {
  
  # Initialize the output matrix
  income_forecast = matrix(rep(curr_income,npers),nrow=length(curr_income))
  
  for (t in 2:npers) {
    income_forecast[,t] = income_forecast[,t-1] * (1+income_growth_rate/100)
  }
  
  # Output is expected as a matrix with ages as rows and periods as columns
  return(income_forecast)
}
