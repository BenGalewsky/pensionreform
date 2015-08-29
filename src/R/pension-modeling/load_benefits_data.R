
# Not sure if we need specific inputs here?
# Output a vector containing average income at each age
load_benefits_data <- function(maxage) {
  
  curr_avg_benefits = 30000*1.03^(seq(1,maxage)/10 - .55) * c(rep(0,54),rep(1,maxage-54)) * runif(maxage,0.9,1.1)
  
  return(curr_avg_benefits)
}