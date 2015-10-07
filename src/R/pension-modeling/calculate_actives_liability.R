
# Calculate liability of existing active population
calculate_actives_liability <- function(actives_forecast,npers,ror) {
  beneficiaries = actives_forecast[[2]]
  avg_benefits_forecast = actives_forecast[[4]]
  
  pv_outflows = c()
  outflows = c()
  
  for (n in 2:npers) {
    outflow = beneficiaries[,n] * avg_benefits_forecast[,n]
    outflows = c(outflows,outflow)
    pv_outflows = c(pv_outflows, outflow / (1+ror/100)^(n-1))
  }
  
  return(list(pv_outflows,outflows))
}