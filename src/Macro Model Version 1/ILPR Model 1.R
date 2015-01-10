#
# ILPR_Model1.R
#
setwd('C:\\wamp\\www\\ccade\\pensionreform\\src\\Macro Model Version 1')

#
scenario_name                   <-'ILPR'
scenario_version_number         <-'1.0'
program_name                    <-'Model1'

filename_base                   <-paste(scenario_name,scenario_version_number,sep='_')
filename_cola                   <-paste(scenario_name,scenario_version_number,'cola.csv',sep='_')
filename_income                 <-paste(scenario_name,scenario_version_number,'income.csv',sep='_')
filename_payment                <-paste(scenario_name,scenario_version_number,'payment.csv',sep='_')
filename_cola                   <-paste(scenario_name,scenario_version_number,'cola.csv',sep='_')
filename_income                 <-paste(scenario_name,scenario_version_number,'income.csv',sep='_')
filename_yearsofservice         <-paste(scenario_name,scenario_version_number,'yearsofservice.csv',sep='_')
filename_activemembers          <-paste(scenario_name,scenario_version_number,'activemembers.csv',sep='_')
filename_annuitants             <-paste(scenario_name,scenario_version_number,'annuitants.csv',sep='_')
filename_servicetable           <-paste(scenario_name,scenario_version_number,'servicetable.csv',sep='_')

program_specific_filename_base  <-paste(filename_base,program_name,sep="_")
filename_sink                   <-paste(program_specific_filename_base,'sink.csv',sep="_")
filename_output                 <-paste(program_specific_filename_base,'output.pdf',sep="_")
filename_results                <-paste(program_specific_filename_base,'results.csv',sep="_")

pdf(filename_output,width=11)
sink(file=filename_output)

#
# Read modeling illinois pension reform tables (csv files)
#
cola.df                         <-read.csv(file=filename_cola,head=TRUE,sep=",")
income.df                       <-read.csv(file=filename_income,head=TRUE,sep=",")
payment.df                      <-read.csv(file=filename_payment,head=TRUE,sep=",")
yearsofservice.df               <-read.csv(file=filename_yearsofservice,head=TRUE,sep=",")
activemembers.df                <-read.csv(file=filename_activemembers,head=TRUE,sep=",")
annuitants.df                   <-read.csv(file=filename_annuitants,head=TRUE,sep=",")
servicetable.df                 <-read.csv(file=filename_servicetable,head=TRUE,sep=",")

#
# Compute rows and columns for indexing
#
YOS_Dim <-dim(yearsofservice.df)
YOS_Rows <-as.numeric(YOS_Dim[1])
YOS_Cols <-as.numeric(YOS_Dim[2])

#
# Reference: Pension Mathematics with Numerical Illustrations, Winklevoss, 1993
# Chapter 5: Pension Liability Measures
# 
# For this first version of the program, use the plan termination liability (PTL) 
# sometimes referred to as the plan's legal liability. Assuming that the benefit
# is in the form of an annuity payable for the lifetime of the retiree, define
# this liability for a particiant age x prior to retirement 
#
# Plan termination liability 
# = accrued benefit as defined by the plan
# = probability of living from age x to age r
# = interest discount from age x to age r
# = present value at age r of life annunity 
# where active employee

# Plan termination liability 
# = retirement benefit payable for life 
# = present value at age x of a life annuity 
# where annuitant

#
# Plan termination liability grand total 
# = plan termination liability for actives
# = plan termination liability for annuitants
#

#
# Program variables, initially coded in this program.
#
life_expectancy_age                         <-85
life_expectancy_after_retirement            <-20
percentage_of_final_salary                  <-.0167
discount                                    <-.0775

#
# Write .csv output file header 
#
sink(file=filename_results)
cat(
 'Year',
',Age',
',PTL_active',
',PTL_TTL_active',
',PTL_annuitant',
',PTL_TTL_annuitant',
',PTL_GRAND_TTL',
'\n')

#
# First column is age, columns 2 thorugh 103 are years 2014 through 2115
#
for (i in 2:YOS_Cols){
    
  PTL_active          <- 0
  PTL_annuitant       <- 0
  PTL_TTL_active      <- 0
  PTL_TTL_annuitant   <- 0
  PTL_GRAND_TTL       <- 0
  YOS_Year            <-colnames(cola.df)[i]
  
  #
  # First row is header, rows 2 through 126 are ages 1 through 125
  #
  for (j in 2:YOS_Rows){
    
    #
    # For each year/age select actives and annuitants
    #
    YOS_Age                       <-cola.df[j,1]
    active_members                <-as.numeric(activemembers.df[j,i])
    annuitants                    <-as.numeric(annuitants.df[j,i])
    
    #
    # Process active employees
    #
    if(active_members >0){
      income                      <-as.numeric(income.df[j,i])
      years_of_service            <-round(yearsofservice.df[j,i],)
      years_of_service_row        <-years_of_service + 1
      
      #
      # Future, not required for PTL, determine composite survival model
      #
      termination_factor          <-as.numeric(servicetable.df[years_of_service_row,2])
      terminations                <-active_members * termination_factor
      adjusted_active_members     <-round(active_members - terminations,0)
      
      #
      # accrued benefit as defined by the plan
      # based upon present service, retirement at age 65, life expectancy of 20 years
      # (more research is necessary)
      #
      monthly_benefit              <-(income * percentage_of_final_salary) * years_of_service
      annual_benefit               <-monthly_benefit * 12
      lifetime_benefit             <-annual_benefit  * life_expectancy_after_retirement

      #
      # interest discount from age x to age r (next step)
      #
      
      #
      # present value at age r of life annunity (next step)
      #
      
      #
      # Compute PTL for active employees
      #
      PTL_active                   <-lifetime_benefit * active_members
      PTL_TTL_active               <-PTL_TTL_active + PTL_active               # Active Subtotal
      
      #
      # Add PTL for active employees to PTL grand total
      #
      PTL_GRAND_TTL                <-PTL_GRAND_TTL +  PTL_active               # Grand Total
    }
    
    #
    # Process annuitants
    #
    if (annuitants >0)
    {
      payment                      <-as.numeric(payment.df[j,i])
      
      #
      # retirement benefit payable for life 
      # based upon current retiree age (as early as age 50) and life expectancy of age 85
      # if over age 85, give life expectancy of one year
      # (more research is necessary)
      #
      annual_payment               <-payment
      payment_years                <-life_expectancy_age - YOS_Age
      if (payment_years <1){
        payment_years              <-1
      }   
      lifetime_payment             <-payment_years * annual_payment
      
      #
      # present value at age x of a life annuity (next step)
      #
      
      #
      # Compute PTL for annuitants
      #
      PTL_annuitant               <-lifetime_payment * annuitants      
      PTL_TTL_annuitant           <-PTL_annuitant  + PTL_annuitant
      
      #
      # Add PTL for annuitants to PTL grand total
      #
      PTL_GRAND_TTL                <-PTL_GRAND_TTL + PTL_TTL_annuitant
    }
    
    #
    # Write .csv output file record at calendar year and age level 
    #
    cat(paste(
      YOS_Year,',',
      YOS_Age,',',
      PTL_active,',',
      PTL_TTL_active,',',
      PTL_annuitant,',',
      PTL_TTL_annuitant,',',
      PTL_GRAND_TTL,'\n'),sep='')
  }
}

#
# end of job
#
dev.off()
sink(file=NULL)