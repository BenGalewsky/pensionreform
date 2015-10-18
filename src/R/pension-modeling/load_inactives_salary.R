
# Not sure if we need specific inputs here?
# Output a vector containing average benefits and beneficiaries at each age
load_inactives_salary <- function(maxage) {
  
  inactives = read.csv("CSVs/Illinois GARS Initial Inactives 2015.csv")
  years = inactives[inactives$Age > 0 & inactives$Age <= maxage,]$Avg.Years.of.Service
  curr_salary = inactives[inactives$Age > 0 & inactives$Age <= maxage,]$Avg.Contributions / years * 1/ (.115)
  curr_salary[is.nan(curr_salary)] = 0
  
  # Extent vector to maxage
  while (length(curr_salary) < maxage) {
    curr_salary = c(curr_salary,0)
  }
  
  return(list(curr_salary,inactives))
}
