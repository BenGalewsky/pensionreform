

calculate_earned_benefit <- function(population) {
  
  pct_t1 = population$Pct.T1
  avg_salary = population$Avg.Salary
  avg_years = population$Avg.Years.of.Service
  maxage = length(avg_salary)
  
  earned_benefit = c()
  
  for (n in 1:maxage) {
    t1_benefit = calculate_benefit(1,ceiling(avg_years[n])) * pct_t1[n] * avg_salary[n]
    t2_benefit = calculate_benefit(2,ceiling(avg_years[n])) * (1 - pct_t1[n]) * avg_salary[n]
    earned_benefit = c(earned_benefit,t1_benefit+t2_benefit)
  }
  
  return(earned_benefit)
  
}