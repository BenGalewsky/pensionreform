
# Create a separate forecast just for the existing beneficiaries
forecast_beneficiaries <- function(curr_beneficiaries,curr_benefits,npers,benefits_growth_rate) {
  
  beneficiaries_forecast = matrix(rep(curr_beneficiaries,npers),nrow=length(curr_beneficiaries))
  maxage = length(curr_benefits)
  # Initialize the output matrix
  benefits_forecast = matrix(rep(curr_benefits,npers),nrow=length(curr_benefits))
  
  for (t in 2:npers) {
    # Calculate distribution of ages in the next period, using basic mortality and simple probability of retirement
    for (age in 2:maxage) {
      # Basic mortality assumption
      beneficiaries_forecast[age,t] = beneficiaries_forecast[age-1,t-1]*(1-male_mortality(age-5))
      # Removal of very young survivor beneficiaries after 4 periods
      if (t > 4 & age < 50) {
        beneficiaries_forecast[age,t] = 0
        benefits_forecast[age,t] = 0
      }
      benefits_forecast[age,t] = benefits_forecast[age-1,t-1] * (1+benefits_growth_rate/100)
    }
  }
  
  # Output is expected as a two matrix list, with ages as rows and periods as columns
  return(list(beneficiaries_forecast,benefits_forecast))
}