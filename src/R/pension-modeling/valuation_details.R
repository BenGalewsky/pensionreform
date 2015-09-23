ca = curr_actives_tier1 + curr_actives_tier2
cb = curr_beneficiaries
curr_benefit_details = load_benefits_data(maxage)[[2]]

retirees = round(sum(curr_benefit_details$Count * (1-curr_benefit_details$Pct.Surv)))
survivors = round(sum(curr_benefit_details$Count * curr_benefit_details$Pct.Surv))
total_benefits = round(sum(curr_benefit_details$Count * curr_benefit_details$Avg.Benefits))

annuitants = forecast_population(rep(0,maxage),curr_beneficiaries,input$npers)[[2]]

pv_outflows = c()

for (n in 1:input$npers) {
  outflow = annuitants[,n] * avg_benefits_forecast()[,n]
  pv_outflows = c(pv_outflows,outflow / (1+input$ror/100)^n)
}

col11 = c("1. Current Members", "", "", "", "", "", "")
col12 = c("2. Current Payroll","")
col13 = c("3. Current Benefits","")
col14 = c("4. Annuitant Liability","")
col15 = c("5. Inactive Liability","")
col16 = c("6. Active Liability","")
col17 = c("7. Total Liability","")
col21 = c("", "a. Active", "b. Inactive", "c. Retirees", "d. Survivors", "e. Total","")
col22 = c("","")
col23 = c("","")
col24 = c("","")
col25 = c("","")
col26 = c("","")
col27 = c("","")
col31 = c(NA,sum(ca), NA, retirees, survivors, sum(ca + cb), NA)
col32 = c(prettyNum(sum(curr_avg_salary*ca),big.mark=','), NA)
col33 = c(prettyNum(total_benefits,big.mark=','),NA)
col34 = c(prettyNum(sum(pv_outflows),big.mark=','),NA)
col35 = c(NA,NA)
col36 = c(NA,NA)
col37 = c(NA,NA)
df = data.frame(c(col11,col12,col13,col14,col15,col16,col17),c(col21,col22,col23,col24,col25,col26,col27),c(col31,col32,col33,col34,col35,col36,col37))

