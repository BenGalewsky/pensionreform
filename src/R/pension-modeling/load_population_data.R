
# Not sure if we need specific inputs here?
# Output a list of two vectors containing the count of actives and the count of beneficiaries at each age
load_population_data <- function(maxage) {
  
  beneficiaries = read.csv("CSVs/Illinois GARS Initial Beneficiaries 2015.csv")
  actives = read.csv("CSVs/Illinois GARS Initial Actives 2015.csv")
  actives_tier1 = actives[actives$Age > 0 & actives$Age <= maxage,]$Count * actives[actives$Age > 0 & actives$Age <= maxage,]$Pct.T1
  actives_tier2 = actives[actives$Age > 0 & actives$Age <= maxage,]$Count * (1-actives[actives$Age > 0 & actives$Age <= maxage,]$Pct.T1)
  
  inactives = read.csv("CSVs/Illinois GARS Initial Inactives 2015.csv")
  inactives_tier1 = inactives[inactives$Age > 0 & inactives$Age <= maxage,]$Count * inactives[inactives$Age > 0 & inactives$Age <= maxage,]$Pct.T1
  inactives_tier2 = inactives[inactives$Age > 0 & inactives$Age <= maxage,]$Count * (1-inactives[inactives$Age > 0 & inactives$Age <= maxage,]$Pct.T1)
  
  #curr_beneficiaries = c(rep(0,55),rep(2,5),rep(5,10),rep(3,5),rep(2,5),rep(2,5),rep(1,5)) * runif(maxage,.9,1.1)
  curr_beneficiaries = beneficiaries[beneficiaries$Age > 0 & beneficiaries$Age <= maxage,]$Count
  
  # Extend vectors to maxage
  while (length(actives_tier1) < maxage) {
    actives_tier1 = c(actives_tier1,0)
  }
  while (length(actives_tier2) < maxage) {
    actives_tier2 = c(actives_tier2,0)
  }
  while (length(curr_beneficiaries) < maxage) {
    curr_beneficiaries = c(curr_beneficiaries,0)
  }
  
  return(list(actives_tier1,actives_tier2,curr_beneficiaries,inactives_tier1,inactives_tier2))
}