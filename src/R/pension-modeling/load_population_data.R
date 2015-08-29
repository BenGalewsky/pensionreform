
# Not sure if we need specific inputs here?
# Output a list of two vectors containing the count of actives and the count of beneficiaries at each age
load_population_data <- function(maxage) {
  
  curr_actives = c(rep(0,20),rep(20,20),rep(15,10),rep(10,5),rep(5,5),rep(0,30)) * runif(maxage,.9,1.1)
  curr_beneficiaries = c(rep(0,55),rep(10,5),rep(20,10),rep(15,5),rep(10,5),rep(5,5),rep(2,5)) * runif(maxage,.9,1.1)
  
  return(list(curr_actives,curr_beneficiaries))
}