
# Forecast incomes at each age for a given number of periods
forecast_salary <- function(curr_salary,forecastYears,wage_inflation) {
  
  # Initialize the result matrix
  income_forecast = matrix(rep(curr_salary,forecastYears),nrow=length(curr_salary))
  
  # Loop over ages and forecast years
  for(a in 2:length(curr_salary)) {
    for (t in 2:forecastYears) {
      # Look to copy cohort's salary from how old they were last year
      priorSalary = income_forecast[a-1,t-1]
      
      # If there was a cohort from last year then give them a raise based on wage inflation
      # If there was no cohort in the spot, then assume a new entrant at the initial average salary
      # plus an adjustment for wage inflation
      if(priorSalary > 0){
        income_forecast[a,t] = priorSalary * (1+wage_inflation/100)
      }
      else{
        income_forecast[a,t] = 67836 * (1+wage_inflation/100)^(t-1)
      }
    }
  }
  
  # Output is expected as a matrix with ages as rows and periods as columns
  return(income_forecast)
}