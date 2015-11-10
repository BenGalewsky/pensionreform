
# Create a separate forecast just for the existing beneficiaries
forecast_beneficiaries <- function(curr_beneficiaries,curr_benefits,npers,benefits_growth_rate,mortality_adj) {
  
  beneficiaries_forecast = matrix(rep(curr_beneficiaries,npers),nrow=length(curr_beneficiaries))
  maxage = length(curr_benefits)
  # Initialize the output matrix
  benefits_forecast = matrix(rep(curr_benefits,npers),nrow=length(curr_benefits))
  survivor_forecast = matrix(rep(rep(0,maxage),npers),nrow=maxage)
  survivor_benefits = matrix(rep(rep(0,maxage),npers),nrow=maxage)
  
  for (t in 2:npers) {
    # Calculate mortality, advance array
    mortality = beneficiaries_forecast[,t-1]*(1 - 2/3*mm(3+mortality_adj) - 1/3*fm(2+mortality_adj))
    beneficiaries_forecast[,t] = c(0,mortality[1:(maxage-1)])
    
    # Calculate new benefits, advance array
    new_benefits = benefits_forecast[,t-1] * (1+benefits_growth_rate/100)
    benefits_forecast[,t] = c(0,new_benefits[1:(maxage-1)])
    
    # Calculate new survivors, assuming 75% constant
    new_survivors = .75*beneficiaries_forecast[,t-1]*(2/3*mm(3+mortality_adj) + 1/3*fm(2+mortality_adj))
    survivors = survivor_forecast[,t-1]*(1 - 1/3*mm(0+mortality_adj) - 2/3*fm(6+mortality_adj))
    survivor_forecast[,t] = c(0,survivors[1:(maxage-1)] + new_survivors[1:(maxage-1)])
    survivor_benefits[,t] = .67*benefits_forecast[,t]
  }
  
  # Output is expected as a two matrix list, with ages as rows and periods as columns
  return(list(beneficiaries_forecast,benefits_forecast,survivor_forecast,survivor_benefits))
}