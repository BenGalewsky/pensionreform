
# Forecast incomes at each age for a given number of periods using the income forecast
# May ultimately need to be modeled jointly with income forecast
forecast_benefits <- function(curr_benefits,forecast_income,npers,benefits_growth_rate) {
  
  # Initialize the output matrix
  benefits_forecast = matrix(rep(curr_benefits,npers),nrow=length(curr_benefits))
  
  for (t in 2:npers) {
    benefits_forecast[,t] = benefits_forecast[,t-1] * (1+benefits_growth_rate/100)
  }
  
  # Output is expected as a matrix with ages as rows and periods as columns
  return(benefits_forecast)
}
