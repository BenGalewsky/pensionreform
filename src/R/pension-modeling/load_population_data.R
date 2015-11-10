
load_population_data <- function(maxage) {
  
  beneficiaries = read.csv("CSVs/Illinois GARS Initial Beneficiaries 2015.csv")
  beneficiaries = beneficiaries[beneficiaries$Age > 0 & beneficiaries$Age <= maxage,]
  survivors = read.csv("CSVs/Illinois GARS Initial Survivors 2015.csv")
  survivors = survivors[survivors$Age > 0 & survivors$Age <= maxage,]
  actives = read.csv("CSVs/Illinois GARS Initial Actives 2015.csv")
  actives = actives[actives$Age > 0 & actives$Age <= maxage,]
  inactives = read.csv("CSVs/Illinois GARS Initial Inactives 2015.csv")
  inactives = inactives[inactives$Age > 0 & inactives$Age <= maxage,]
  
  # Extend vectors to maxage
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
    ben_append = data.frame(Age = seq(nrow(beneficiaries)+1,maxage), Count = rep(0,diff), Avg.Benefits = rep(0,diff), Avg.Years.of.Service = rep(0,diff), Pct.Male = rep(0,diff), Pct.T1 = rep(0,diff))
  }
  
  if (nrow(survivors) < maxage) {
    diff = maxage - nrow(survivors)
    survivor_append = data.frame(Age=seq(nrow(survivors)+1,maxage), Count = rep(0,diff), Avg.Benefits = rep(0,diff), Avg.Years.of.Service = rep(0,diff), Pct.Male = rep(0,diff), Pct.T1 = rep(0,diff))
  }
  
  actives = rbind(actives,actives_append)
  inactives = rbind(inactives,inactives_append)
  beneficiaries = rbind(beneficiaries,ben_append)
  survivors = rbind(survivors,survivor_append)
  
  return(list(actives,beneficiaries,inactives,survivors))
}
