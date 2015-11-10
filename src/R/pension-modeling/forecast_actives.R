
forecast_actives <- function(tier1_actives,tier2_actives,earned_benefits,benefits_growth_rate,salary_growth_rate,inflation,npers,retire_age_adj,mortality_adj=0) {
  
  maxage = 120
  
  # Initialize output matrixes, for actives
  tier1_forecast =        matrix(rep(tier1_actives,npers),nrow=maxage)
  tier2_forecast =        matrix(rep(tier2_actives,npers),nrow=maxage)
  avg_earned_benefits =   matrix(rep(earned_benefits,npers),nrow=maxage)
  
  # Initial beneficiary / benefits output
  tier1_beneficiaries =   matrix(rep(rep(0,maxage),npers),nrow=maxage)
  tier2_beneficiaries =   matrix(rep(rep(0,maxage),npers),nrow=maxage)
  tier1_benefits =        matrix(rep(rep(0,maxage),npers),nrow=maxage)
  tier2_benefits =        matrix(rep(rep(0,maxage),npers),nrow=maxage)
  avg_benefits_forecast = matrix(rep(rep(0,maxage),npers),nrow=maxage)
  
  survivor_forecast = matrix(rep(rep(0,maxage),npers),nrow=maxage)
  survivor_benefits = matrix(rep(rep(0,maxage),npers),nrow=maxage)
  
  for (t in 2:npers) {
    
    t1_mortality = tier1_forecast[,t-1]*(1-2/3*.85*mm(3+mortality_adj)-1/3*.7*fm(2+mortality_adj))
    t2_mortality = tier2_forecast[,t-1]*(1-2/3*.85*mm(3+mortality_adj)-1/3*.7*fm(2+mortality_adj))
    tier1_forecast[,t] = c(0,t1_mortality[1:(maxage-1)])
    tier2_forecast[,t] = c(0,t2_mortality[1:(maxage-1)])
    
    t1_mortality = tier1_beneficiaries[,t-1]*(1-2/3*mm(3+mortality_adj)-1/3*fm(2+mortality_adj))
    t2_mortality = tier2_beneficiaries[,t-1]*(1-2/3*mm(3+mortality_adj)-1/3*fm(2+mortality_adj))
    tier1_beneficiaries[,t] = c(0,t1_mortality[1:(maxage-1)])
    tier2_beneficiaries[,t] = c(0,t2_mortality[1:(maxage-1)])
    
    # Apply salary growth to new benefits
    new_benefits = avg_earned_benefits[,t-1]*(1+salary_growth_rate/100)
    avg_earned_benefits[,t] = c(0,new_benefits[1:(maxage-1)])
    
    # Calculate new beneficiaries coming in, compute their benefits forecast
    for (age in 55:maxage) {
        t1_retirees = tier1_forecast[age,t]*retire_rate(age-1-retire_age_adj)[1]
        tier1_forecast[age,t] = tier1_forecast[age,t] - t1_retirees
        tier1_beneficiaries[age,t] = tier1_beneficiaries[age,t] + t1_retirees
        
        if (tier1_beneficiaries[age,t] > 0) {
          tier1_benefits[age,t] = (tier1_benefits[age-1,t-1]*(tier1_beneficiaries[age,t] - t1_retirees)*(1+benefits_growth_rate/100) + avg_earned_benefits[age,t]*t1_retirees) / tier1_beneficiaries[age,t]
        }
        else {
          tier1_benefits[age,t] = avg_earned_benefits[age,t]
        }
        
        t2_retirees = tier2_forecast[age,t]*retire_rate(age-1-retire_age_adj)[2]
        tier2_forecast[age,t] = tier2_forecast[age,t] - t2_retirees
        tier2_beneficiaries[age,t] = tier2_beneficiaries[age,t] + t2_retirees
        
        if (tier2_beneficiaries[age,t] > 0) {
          tier2_benefits[age,t] = (tier2_benefits[age-1,t-1]*(tier2_beneficiaries[age,t] - t2_retirees)*(1+min(benefits_growth_rate,inflation)/100) + avg_earned_benefits[age,t]*t2_retirees) / tier2_beneficiaries[age,t]
        }
        else {
          tier2_benefits[age,t] = avg_earned_benefits[age,t]
        }
    }
    
    # Take the weighted average of the two tiers
    beneficiaries = tier1_beneficiaries[,t] + tier2_beneficiaries[,t]
    avg_benefits_forecast[,t] = (tier1_benefits[,t]*tier1_beneficiaries[,t] + tier2_benefits[,t]*tier2_beneficiaries[,t]) / beneficiaries
    avg_benefits_forecast[is.nan(avg_benefits_forecast[,t]),t] = 0
    
    # Calculate new survivors, assuming 75% constant
    new_survivors = .75*(tier2_beneficiaries[,t-1]+tier1_beneficiaries[,t-1])*(2/3*mm(3+mortality_adj)-1/3*fm(2+mortality_adj))
    survivors = survivor_forecast[,t-1]*(1 - 1/3*mm(0+mortality_adj) - 2/3*fm(6+mortality_adj))
    survivor_forecast[,t] = c(0,survivors[1:(maxage-1)] + new_survivors[1:(maxage-1)])
    survivor_benefits[,t] = .67*avg_benefits_forecast[,t]
    
    # Apply replacement rate, assuming everyone new joins at age 42
    # outflows = sum(tier1_forecast[,t-1] + tier2_forecast[,t-1])-sum(tier1_forecast[,t] + tier2_forecast[,t])
    # tier2_forecast[42,t] = tier2_forecast[42,t] + replacement_rate * outflows
  }
  
  actives_forecast = tier1_forecast + tier2_forecast
  beneficiaries_forecast = tier1_beneficiaries + tier2_beneficiaries
  
  # Output is expected as a three matrix list, with ages as rows and periods as columns
  return(list(beneficiaries_forecast,avg_benefits_forecast,actives_forecast,survivor_forecast,survivor_benefits))
}
