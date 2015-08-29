
# Forecast population using the current active, current beneficiaries distributions, the replacement rate and number of periods
forecast_population <- function(curr_actives,curr_beneficiaries,npers,replacement_rate=0) {
  
  # Initialize the output matrices
  actives_forecast = matrix(rep(curr_actives,npers),nrow=length(curr_actives))
  beneficiaries_forecast = matrix(rep(curr_beneficiaries,npers),nrow=length(curr_beneficiaries))
  
  for (t in 2:npers) {
    
    # Calculate distribution of ages in the next period, using basic mortality and simple probability of retirement
    for (age in 2:length(curr_actives)) {
      # Basic mortality assumption
      actives_forecast[age,t] = actives_forecast[age-1,t-1]*1/(1+exp(-9.193343+0.105681*(age-1)))
      beneficiaries_forecast[age,t] = beneficiaries_forecast[age-1,t-1]*1/(1+exp(-9.193343+0.105681*(age-1)))
      
      # Simple retirement probability assumption (P=(min(age,64)-54)/10) for flowing actives into beneficiaries after age 55
      if (age >= 55) {
        actives_forecast[age,t] = actives_forecast[age-1,t-1]*(1 - (min(age,64)-54)/10)
        beneficiaries_forecast[age,t] = beneficiaries_forecast[age,t] + actives_forecast[age-1,t-1]*((min(age,64)-54)/10)
      }
    }
    
    # Calculate net outflow, for replacements
    outflows = sum(actives_forecast[,t-1])-sum(actives_forecast[,t])
    
    # Apply replacement rate, assuming everyone new joins at age 21
    actives_forecast[21,t] = replacement_rate * outflows
  }
  
  # Output is expected as a two matrix list, with ages as rows and periods as columns
  return(list(actives_forecast,beneficiaries_forecast))
}
