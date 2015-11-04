
# Create a separate forecast just for the existing beneficiaries
forecast_beneficiaries <- function(curr_beneficiaries,curr_benefits,npers,benefits_growth_rate) {
  
  beneficiaries_forecast = matrix(rep(curr_beneficiaries,npers),nrow=length(curr_beneficiaries))
  maxage = length(curr_benefits)
  # Initialize the output matrix
  benefits_forecast = matrix(rep(curr_benefits,npers),nrow=length(curr_benefits))
  survivor_forecast = matrix(rep(rep(0,maxage),npers),nrow=maxage)
  survivor_benefits = matrix(rep(rep(0,maxage),npers),nrow=maxage)
  
  for (t in 2:npers) {
    # Calculate distribution of ages in the next period, using basic mortality and simple probability of retirement
    for (age in maxage:15) {
      # Basic mortality assumption
      mortality = beneficiaries_forecast[age-1,t-1]*(2*male_mortality(age-3)+female_mortality(age-2))/3
      beneficiaries_forecast[age,t] = beneficiaries_forecast[age-1,t-1] - mortality
      
      survivor_forecast[age-4,t] = .75*mortality + survivor_forecast[age-5,t-1]
      if (survivor_benefits[age-5,t-1]>0) {
        survivor_benefits[age-4,t] = (1+benefits_growth_rate/100) * (survivor_forecast[age-5,t-1] * survivor_benefits[age-5,t-1] + .75 * mortality * .67 * benefits_forecast[age-1,t-1]) / (survivor_forecast[age-5,t-1] + .75 * mortality)
      }
      else {
        survivor_benefits[age-4,t] = (1+benefits_growth_rate/100) * .67 * benefits_forecast[age-1,t-1]
      }
      
      survivor_forecast[age-4,t] = survivor_forecast[age-4,t]*(1-(male_mortality(age-7)+2*female_mortality(age-6))/3)
      
      # Removal of very young survivor beneficiaries after 4 periods
      if (t > 4 & age < 50) {
        beneficiaries_forecast[age,t] = 0
        benefits_forecast[age,t] = 0
      }
      benefits_forecast[age,t] = benefits_forecast[age-1,t-1] * (1+benefits_growth_rate/100)
    }
  }
  
  # Output is expected as a two matrix list, with ages as rows and periods as columns
  return(list(beneficiaries_forecast,benefits_forecast,survivor_forecast,survivor_benefits))
}