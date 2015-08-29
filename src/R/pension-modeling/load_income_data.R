
# Not sure if we need specific inputs here?
# Output a vector containing average income at each age
load_income_data <- function(maxage) {
  
  curr_avg_income = 50000*1.05^(seq(1,maxage)/10 - .2) * c(rep(0,19),rep(1,maxage-19)) * runif(maxage,0.9,1.1)
  
  return(curr_avg_income)
}