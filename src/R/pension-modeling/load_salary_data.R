
# Not sure if we need specific inputs here?
# Output a vector containing average income at each age
load_salary_data <- function(maxage) {
  
  actives = read.csv("CSVs/Illinois GARS Initial Actives 2015.csv")
  curr_salary = actives[actives$Age > 0 & actives$Age <= maxage,]$Avg.Salary
  
  # Extend vector to maxage
  while (length(curr_salary) < maxage) {
    curr_salary = c(curr_salary,0)
  }
  
  return(curr_salary)
}