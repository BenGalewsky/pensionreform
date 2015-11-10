library(shiny)
library(ggplot2)

# Loading populations
source('load_population_data.R')
# Retirement rates
source('retire_rate.R')
# PV calculation
source('calculate_annuitant_liability.R')
# Forecasts for populations and benefits
source('forecast_actives.R')
source('forecast_beneficiaries.R')
source('forecast_survivors.R')
# Compute mortality vectors
source('mortality.R')
# Compute funding ratio
source('calculate_funding_ratio.R')

# Not immediately needed, but may be useful later
#source('male_mortality.R')
#source('female_mortality.R')
#source('calculate_benefit.R')
#source('calculate_earned_benefit.R')