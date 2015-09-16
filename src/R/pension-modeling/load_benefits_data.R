
# Not sure if we need specific inputs here?
# Output a vector containing average income at each age
load_benefits_data <- function(maxage) {
  
  beneficiaries = read.csv("CSVs/Illinois GARS Initial Beneficiaries 2015.csv")
  curr_benefits = beneficiaries[beneficiaries$Age > 0 & beneficiaries$Age <= maxage,]$Avg.Benefits
  
  # Extent vector to maxage
  while (length(curr_benefits) < maxage) {
    curr_benefits = c(curr_benefits,0)
  }
  
  for (i in 1:length(curr_benefits)) {
    if (i==1) {
      j = 40000
    }
    else {
      j = curr_benefits[i-1]
    }
    
    if (curr_benefits[i]==0) {
      curr_benefits[i] = j
    }
  }
  
  #curr_avg_income = 50000*1.05^(seq(1,maxage)/10 - .2) * c(rep(0,19),rep(1,maxage-19)) * runif(maxage,0.9,1.1)
  
  return(curr_benefits)
}