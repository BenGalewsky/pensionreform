
# Use a weighted average of previous incomes and previous benefits

# Forecast incomes at each age for a given number of periods using the income forecast
# May ultimately need to be modeled jointly with income forecast
forecast_benefits <- function(pop_forecast,curr_benefits,avg_salary_forecast,npers,benefits_growth_rate) {
  
  maxage = length(curr_benefits)
  # Initialize the output matrix
  benefits_forecast = matrix(rep(curr_benefits,npers),nrow=length(curr_benefits))
  
  # Forecasts of tier1 beneficiaries and tier2 beneficiaries
  tier1_pop = pop_forecast[[1]]
  tier2_pop = pop_forecast[[2]]
  
  for (t in 2:npers) {
    for (a in 1:maxage) {
      p1 = tier1_pop[a-1,t-1]
      p2 = tier2_pop[a-1,t-1]
      
      # Remove benefits for young survivors in the current data?
      if (t > 4 & a < 30) benefits_forecast[a,t] = 0
      
      # What to assume for new entrants to the beneficiary pool?
      if (a==1) benefits_forecast[a,t] = 0
      else if (p1 + p2 == 0) {
        benefits_forecast[a,t] = 0
      }
      else {
        if (benefits_forecast[a-1,t-1]==0) {
          benefits_forecast[a,t] = calculate_benefit(1,15) * avg_salary_forecast[a-t,t-1]
        }
        else if (avg_salary_forecast[a-1,t-1]==0) {
          benefits_forecast[a,t] = benefits_forecast[a-1,t-1] * (1+benefits_growth_rate/100)
        }
        else {
          benefits_forecast[a,t] = benefits_forecast[a-1,t-1] * (1+benefits_growth_rate/100) * .9 + calculate_benefit(1,10) * avg_salary_forecast[a-t,t-1] * .1
        }
      }
      # Benefits of newly retired beneficiaries
      #new_benefits_tier1 = calculate_benefit(1,10) * avg_salary_forecast[a-1,t-1]
      #new_benefits_tier2 = calculate_benefit(2,10) * avg_salary_forecast[a-1,t-1]
      #if (p1 + p2 == 0) wa_benefits = new_benefits_tier2
      #else wa_benefits = (tier1_pop[a-1,t-1] * new_benefits_tier1 + tier2_pop[a-1,t-1] * new_benefits_tier2) / (tier1_pop[a-1,t-1]+tier2_pop[a-1,t-1])
      
      #if (a==1) benefits_forecast = wa_benefits
      #else benefits_forecast[a,t] = benefits_forecast[a-1,t-1] * (1+benefits_growth_rate/100) * 0.9 + wa_benefits * 0.1
    }
  }
  
  # Output is expected as a matrix with ages as rows and periods as columns
  return(benefits_forecast)
}
