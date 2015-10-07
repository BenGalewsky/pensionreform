calculate_benefit <- function(tier, years) {
  benefit = 0
  if (tier==1) {
    y = years
    while (y > 0) {
      if (y > 12) {
        benefit = benefit + .05
      }
      else if (y>8) {
        benefit = benefit + .045
      }
      else if (y>6) {
        benefit = benefit + .04
      }
      else if (y>4) {
        benefit = benefit +.035
      }
      else {
        benefit = benefit + .03
      }
      y = y - 1
    }
    benefit = min(benefit,.85)
  }
  if (tier==2) {
    benefit = min(years * .03, .65)
  }
  return(benefit)
}