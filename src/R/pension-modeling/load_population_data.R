
load_population_data <- function(maxage) {
  
  beneficiaries = read.csv("CSVs/Illinois GARS Initial Beneficiaries 2015.csv")
  beneficiaries = beneficiaries[beneficiaries$Age > 0 & beneficiaries$Age <= maxage,]
  
  actives = read.csv("CSVs/Illinois GARS Initial Actives 2015.csv")
  actives = actives[actives$Age > 0 & actives$Age <= maxage,]
  
  #actives_tier1 = actives[actives$Age > 0 & actives$Age <= maxage,]$Count * actives[actives$Age > 0 & actives$Age <= maxage,]$Pct.T1
  #actives_tier2 = actives[actives$Age > 0 & actives$Age <= maxage,]$Count * (1-actives[actives$Age > 0 & actives$Age <= maxage,]$Pct.T1)
  
  inactives = read.csv("CSVs/Illinois GARS Initial Inactives 2015.csv")
  inactives = inactives[inactives$Age > 0 & inactives$Age <= maxage,]
  
  #inactives_tier1 = inactives[inactives$Age > 0 & inactives$Age <= maxage,]$Count * inactives[inactives$Age > 0 & inactives$Age <= maxage,]$Pct.T1
  #inactives_tier2 = inactives[inactives$Age > 0 & inactives$Age <= maxage,]$Count * (1-inactives[inactives$Age > 0 & inactives$Age <= maxage,]$Pct.T1)
  
  #curr_beneficiaries = beneficiaries[beneficiaries$Age > 0 & beneficiaries$Age <= maxage,]$Count
  
  if (nrow(actives) < maxage) {
    diff = maxage - nrow(actives)
    actives_append = data.frame(Age = seq(nrow(actives)+1,maxage), Count = rep(0,diff),  Avg.Salary = rep(0,diff),  Avg.Years.of.Service = rep(0,diff), Pct.Male = rep(0,diff), Pct.T1 = rep(0,diff), Avg.Earned.Benefit = rep(0,diff))
  }
  
  if (nrow(inactives) < maxage) {
    diff = maxage - nrow(inactives)
    inactives_append = data.frame(Age = seq(nrow(inactives)+1,maxage), Count = rep(0,diff), Avg.Contributions = rep(0,diff), Avg.Years.of.Service = rep(0,diff), Pct.Male = rep(0,diff), Pct.T1 = rep(0,diff), Avg.Benefits = rep(0,diff))
  }
  
  if (nrow(beneficiaries) < maxage) {
    diff = maxage - nrow(beneficiaries)
    ben_append = data.frame(Age = seq(nrow(beneficiaries)+1,maxage), Count = rep(0,diff), Avg.Benefits = rep(0,diff), Avg.Years.of.Service = rep(0,diff), Pct.Male = rep(0,diff), Pct.T1 = rep(0,diff), Pct.Surv = rep(0,diff))
  }
  
  actives = rbind(actives,actives_append)
  inactives = rbind(inactives,inactives_append)
  beneficiaries = rbind(beneficiaries,ben_append)
  
  # Extend vectors to maxage
  #while (length(actives_tier1) < maxage) {
    #actives_tier1 = c(actives_tier1,0)
  #}
  #while (length(actives_tier2) < maxage) {
    #actives_tier2 = c(actives_tier2,0)
  #}
  #while (length(curr_beneficiaries) < maxage) {
    #curr_beneficiaries = c(curr_beneficiaries,0)
  #}
  #while(length(inactives_tier1) < maxage) {
    #inactives_tier1 = c(inactives_tier1,0)
  #}
  #while(length(inactives_tier2) < maxage) {
    #inactives_tier2 = c(inactives_tier2,0)
  #}
  
  return(list(actives,beneficiaries,inactives))
}
