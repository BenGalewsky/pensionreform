
# Not sure if we need specific inputs here?
# Output a vector containing average income at each age
load_benefits_data <- function(maxage) {
  
  beneficiaries = read.csv("CSVs/Illinois GARS Initial Beneficiaries 2015.csv")
  curr_benefits = beneficiaries[beneficiaries$Age > 0 & beneficiaries$Age <= maxage,]$Avg.Benefits
  
  # Extent vector to maxage
  while (length(curr_benefits) < maxage) {
    curr_benefits = c(curr_benefits,0)
  }
  
  return(list(curr_benefits,beneficiaries))
}