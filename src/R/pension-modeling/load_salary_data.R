
# Not sure if we need specific inputs here?
# Output a vector containing average income at each age
load_salary_data <- function(maxage) {
  
  actives = read.csv("CSVs/Illinois GARS Initial Actives 2015.csv")
  curr_salary = actives[actives$Age > 0 & actives$Age <= maxage,]$Avg.Salary
  
  # Extend vector to maxage
  while (length(curr_salary) < maxage) {
    curr_salary = c(curr_salary,0)
  }
  
  for (i in 1:length(curr_salary)) {
    if (i==1) {
      j = 67836
    }
    else {
      j = curr_salary[i-1]
    }
    
    if (curr_salary[i]==0) {
      curr_salary[i] = j
    }
    
    # Minimum salary for illinois reps
    if (curr_salary[i] < 67836) {
      curr_salary[i] = 67836
    }
  }
  
  #curr_avg_income = 50000*1.05^(seq(1,maxage)/10 - .2) * c(rep(0,19),rep(1,maxage-19)) * runif(maxage,0.9,1.1)
  
  return(curr_salary)
}