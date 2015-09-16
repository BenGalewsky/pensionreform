
# Not sure if we need specific inputs here?
# Output a list of two vectors containing the count of actives and the count of beneficiaries at each age
load_population_data <- function(maxage) {
  
  actives = read.csv("CSVs/Illinois GARS Initial Actives 2015.csv")
  actives_tier1 = actives[actives$Age > 0 & actives$Age <= maxage,]$Count * actives[actives$Age > 0 & actives$Age <= maxage,]$Pct.T1
  actives_tier2 = actives[actives$Age > 0 & actives$Age <= maxage,]$Count * (1-actives[actives$Age > 0 & actives$Age <= maxage,]$Pct.T1)
  
  curr_beneficiaries = c(rep(0,55),rep(2,5),rep(5,10),rep(3,5),rep(2,5),rep(2,5),rep(1,5)) * runif(maxage,.9,1.1)
  
  return(list(actives_tier1,actives_tier2,curr_beneficiaries))
}