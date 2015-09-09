# Takes age, returns a vectory of retirement rate for (tier1, tier2)
retire_rate = function(age) {
  
  # Retirement rates for tier 2 employees
  if (age==62) {
    retire_rate2 = .4
  }
  else if (age==63) {
    retire_rate2 = .15
  }
  else if (age==64) {
    retire_rate2 = .2
  }
  else if (age==65) {
    retire_rate2 = .25
  }
  else if (age==66) {
    retire_rate2 = .3
  }
  else if (age==67) {
    retire_rate2 = .4
  }
  else if (age>=68 & age <= 79) {
    retire_rate2 = .05
  }
  else if (age>=80) {
    retire_rate2 = 1
  }
  else {
    retire_rate2 = 0
  }
  
  # Define retirement rates for tier 1 employees
  if (age==55) {
    retire_rate1 = .1
  }
  else if (age>=56 & age<79) {
    retire_rate1 = .085
  }
  else if (age>=80) {
    retire_rate1 = 1
  }
  else {
    retire_rate1 = 0
  }
           
  return(c(retire_rate1, retire_rate2))
}