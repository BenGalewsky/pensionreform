
# Create a separate forecast just for the survivors
forecast_survivors <- function(survivors,avg_benefits,npers,benefits_growth_rate,mortality_adj) {
  
  maxage=120
  survivor_forecast = matrix(rep(survivors,npers),nrow=maxage)
  survivor_benefits = matrix(rep(avg_benefits,npers),nrow=maxage)
  
  for (t in 2:npers) {
    mortality = survivor_forecast[,t-1] * (2/3*(1-fm(2+mortality_adj)) + 1/3*(1-mm(3+mortality_adj)))
    survivor_forecast[,t] = c(0,mortality[1:(maxage-1)])
    survivor_benefits[,t] = c(0,survivor_benefits[1:(maxage-1),t-1]) * (1+benefits_growth_rate/100)
    
    # Getting rid of young beneficiaries after 4 periods
    if (t > 4) {
      survivor_forecast[1:50,t] = 0
    }
  }
  
  # Output is expected as a two matrix list, with ages as rows and periods as columns
  return(list(survivor_forecast,survivor_benefits))
}
