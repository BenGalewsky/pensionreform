# Takes age, returns a vectory of retirement rate for (tier1, tier2)
cumulative_retire_rate = function(age) {
  
  # Retirement rates for tier 2 employees
  if (age==62) {
    retire_rate2 = .4
  }
  else if (age==63) {
    retire_rate2 = (1-.4)*(1-.15)
  }
  else if (age==64) {
    retire_rate2 = (1-.4)*(1-.15)*(1-.2)
  }
  else if (age==65) {
    retire_rate2 = (1-.4)*(1-.15)*(1-.2)*(1-.25)
  }
  else if (age==66) {
    retire_rate2 = (1-.4)*(1-.15)*(1-.2)*(1-.25)*(1-.3)
  }
  else if (age==67) {
    retire_rate2 = (1-.4)*(1-.15)*(1-.2)*(1-.25)*(1-.3)*(1-.4)
  }
  else if (age>=68 & age <= 79) {
    retire_rate2 = (1-.4)*(1-.15)*(1-.2)*(1-.25)*(1-.3)*(1-.4)*(1-.05)^(age-67)
  }
  else if (age>=80) {
    retire_rate2 = 1
  }
  else {
    retire_rate2 = 0
  }
  
  # Define retirement rates for tier 1 employees
  if (age==55) {
    retire_rate1 = (1-.1)
  }
  else if (age>=56 & age<79) {
    retire_rate1 = (1-.1)*(1-.085)^(age-55)
  }
  else if (age>=80) {
    retire_rate1 = 1
  }
  else {
    retire_rate1 = 0
  }
  
  return(c(retire_rate1, retire_rate2))
}