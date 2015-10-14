generate_actives_benefits <- function(tier1_actives,tier2_actives,curr_avg_salary,input$npers,input$ben) {
  
  maxage = length(curr_salary)
  
  tier1_benefits_earned = .6*curr_avg_salary
  tier2_benefits_earned = .4*curr_avg_salary
  
  # Initialize the output matrices
  tier1_forecast =        matrix(rep(tier1_actives,npers),nrow=maxage)
  tier2_forecast =        matrix(rep(tier2_actives,npers),nrow=maxage)
  tier1_beneficiaries =   matrix(rep(rep(0,maxage),npers),nrow=maxage)
  tier2_beneficiaries =   matrix(rep(rep(0,maxage),npers),nrow=maxage)
  tier1_benefits =        matrix(rep(rep(0,maxage),npers),nrow=maxage)
  tier2_benefits =        matrix(rep(rep(0,maxage),npers),nrow=maxage)
  
  for (t in 2:npers) {
    for (age in 20:maxage) {
      # Basic mortality assumption
      tier1_forecast[age,t] = tier1_forecast[age-1,t-1]*(1-male_mortality(age-5))
      tier2_forecast[age,t] = tier2_forecast[age-1,t-1]*(1-male_mortality(age-5))
      tier1_beneficiaries[age,t] = tier1_beneficiaries[age-1,t-1]*(1-male_mortality(age-5))
      tier2_beneficiaries[age,t] = tier2_beneficiaries[age-1,t-1]*(1-male_mortality(age-5))
      
      if (age >= 55) {
        t1_retirees = tier1_forecast[age,t]*retire_rate(age-1)[1]
        t2_retirees = tier2_forecast[age,t]*retire_rate(age-1)[2]
        tier1_forecast[age,t] = tier1_forecast[age,t] - t1_retirees
        tier2_forecast[age,t] = tier2_forecast[age,t] - t2_retirees
        tier1_beneficiaries[age,t] = tier1_beneficiaries[age,t] + t1_retirees 
        tier2_beneficiaries[age,t] = tier2_beneficiaries[age,t] + t2_retirees
        # Assuming 15 years of service
        t1_benefit = salary_forecast[age-1,t-1]*calculate_benefit(1,15)
        t2_benefit = salary_forecast[age-1,t-1]*calculate_benefit(2,15)
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
        tier2_benefits[age,t] = tier2_benefits[age,t] * (1+benefits_growth_rate/100)
        # Take the weighted average of the two tiers
        beneficiaries = tier1_beneficiaries[age,t]+tier2_beneficiaries[age,t]
        if (beneficiaries > 0) avg_benefits_forecast[age,t] = (tier1_benefits[age,t]*tier1_beneficiaries[age,t] + tier2_benefits[age,t]*tier2_beneficiaries[age,t]) / beneficiaries
        else avg_benefits_forecast[age,t] = 0
      }
    }
  }
}