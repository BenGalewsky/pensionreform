
# Forecast population using the current active, the replacement rate and number of periods
forecast_curr_actives <- function(tier1_actives,tier2_actives,earned_benefits,benefits_growth_rate,salary_growth_rate,inflation=2,npers=80) {
  
  maxage = length(tier1_actives)
  # Initialize the output matrices
  tier1_forecast =        matrix(rep(tier1_actives,npers),nrow=maxage)
  tier2_forecast =        matrix(rep(tier2_actives,npers),nrow=maxage)
  avg_earned_benefits =   matrix(rep(earned_benefits,npers),nrow=maxage)
  tier1_beneficiaries =   matrix(rep(rep(0,maxage),npers),nrow=maxage)
  tier2_beneficiaries =   matrix(rep(rep(0,maxage),npers),nrow=maxage)
  tier1_benefits =        matrix(rep(rep(0,maxage),npers),nrow=maxage)
  tier2_benefits =        matrix(rep(rep(0,maxage),npers),nrow=maxage)
  avg_benefits_forecast = matrix(rep(rep(0,maxage),npers),nrow=maxage)
  
  for (t in 2:npers) {
    # Calculate distribution of ages in the next period, using basic mortality and simple probability of retirement
    for (age in 20:maxage) {
      
      # Basic mortality assumption
      tier1_forecast[age,t] = tier1_forecast[age-1,t-1]*(1-(2*.85*male_mortality(age-3)+.7*female_mortality(age-2))/3)
      tier2_forecast[age,t] = tier2_forecast[age-1,t-1]*(1-(2*.85*male_mortality(age-3)+.7*female_mortality(age-2))/3)
      tier1_beneficiaries[age,t] = tier1_beneficiaries[age-1,t-1]*(1-(2*male_mortality(age-3)+female_mortality(age-2))/3)
      tier2_beneficiaries[age,t] = tier2_beneficiaries[age-1,t-1]*(1-(2*male_mortality(age-3)+female_mortality(age-2))/3)
      
      # Apply salary growth to earned benefits
      # salary_forecast[age,t] = salary_forecast[age-1,t-1]*(1+salary_growth_rate/100)
      avg_earned_benefits[age,t] = avg_earned_benefits[age-1,t-1]*(1+salary_growth_rate/100)
      
      # Retirement rate based on tier
      if (age >= 55) {
        t1_retirees = tier1_forecast[age,t]*retire_rate(age-1)[1]
        t2_retirees = tier2_forecast[age,t]*retire_rate(age-1)[2]
        tier1_forecast[age,t] = tier1_forecast[age,t] - t1_retirees
        tier2_forecast[age,t] = tier2_forecast[age,t] - t2_retirees
        tier1_beneficiaries[age,t] = tier1_beneficiaries[age,t] + t1_retirees
        tier2_beneficiaries[age,t] = tier2_beneficiaries[age,t] + t2_retirees
        #t1_benefit = salary_forecast[age-1,t-1]*calculate_benefit(1,15)
        #t2_benefit = salary_forecast[age-1,t-1]*calculate_benefit(2,15)
        t1_benefit = avg_earned_benefits[age-1,t-1]
        t2_benefit = avg_earned_benefits[age-1,t-1]
        # Weighted average of existing benefits and new inflows
        if (tier1_benefits[age-1,t-1] > 0) {
          tier1_benefits[age,t] = (tier1_benefits[age-1,t-1]*tier1_beneficiaries[age-1,t-1] + t1_benefit*t1_retirees) / (tier1_beneficiaries[age-1,t-1]+t1_retirees)
        }
        else if (tier1_beneficiaries[age-1,t-1] == 0 & t1_retirees > 0) {
          tier1_benefits[age,t] = t1_benefit
        }
        if (tier2_benefits[age-1,t-1] > 0) {
          tier2_benefits[age,t] = (tier2_benefits[age-1,t-1]*tier2_beneficiaries[age-1,t-1] + t2_benefit*t2_retirees) / (tier2_beneficiaries[age-1,t-1]+t2_retirees)
        }
        else if (tier2_beneficiaries[age-1,t-1] == 0 & t2_retirees > 0) {
          tier2_benefits[age,t] = t2_benefit
        }
        # Apply benefits growth rate
        tier1_benefits[age,t] = tier1_benefits[age,t] * (1+benefits_growth_rate/100)
        tier2_benefits[age,t] = tier2_benefits[age,t] * (1+min(benefits_growth_rate,inflation)/100)
        # Take the weighted average of the two tiers
        beneficiaries = tier1_beneficiaries[age,t]+tier2_beneficiaries[age,t]
        if (beneficiaries > 0) avg_benefits_forecast[age,t] = (tier1_benefits[age,t]*tier1_beneficiaries[age,t] + tier2_benefits[age,t]*tier2_beneficiaries[age,t]) / beneficiaries
        else avg_benefits_forecast[age,t] = 0
      }
    }
    
    # Calculate net outflow, for replacements
    # outflows = sum(tier1_forecast[,t-1] + tier2_forecast[,t-1])-sum(tier1_forecast[,t] + tier2_forecast[,t])
    
    actives_forecast = tier1_forecast + tier2_forecast
    
    # Apply replacement rate, assuming everyone new joins at age 42
    # tier2_forecast[42,t] = tier2_forecast[42,t] + replacement_rate * outflows
  }
  
  # actives_forecast = tier1_forecast + tier2_forecast
  beneficiaries_forecast = tier1_beneficiaries + tier2_beneficiaries
  
  # Output is expected as a two matrix list, with ages as rows and periods as columns
  return(list(beneficiaries_forecast,avg_benefits_forecast,actives_forecast))
}
