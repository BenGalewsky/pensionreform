ca = curr_actives_tier1 + curr_actives_tier2
cb = curr_beneficiaries
ci = curr_inactives_tier1 + curr_inactives_tier2
cs = curr_survivors
curr_avg_salary = population[[1]]$Avg.Salary

total_benefits = round(sum(curr_beneficiaries*curr_avg_benefits) + sum(curr_survivors*curr_survivor_benefits))

pv_beneficiaries = sum(annuitant_liability()[[1]]) + sum(new_survivor_liability()[[1]])
pv_survivors = sum(survivor_liability()[[1]])
pv_annuitants = pv_beneficiaries + pv_survivors
pv_actives = sum(actives_liability()[[1]] + actives_survivor_liability()[[1]])
pv_inactives = sum(inactives_liability()[[1]] + inactives_survivor_liability()[[1]])

col11 = c("1. Current Members", "", "", "", "", "", "")
col12 = c("2. Current Payroll","")
col13 = c("3. Current Benefits","")
col14 = c("4. Annuitant Liability","","","","")
col15 = c("5. Inactive Liability","")
col16 = c("6. Active Liability","")
col17 = c("7. Total Liability","")
col18 = c("8. Actuarial Value of Assets","")
col19 = c("9. Unfunded Actuarial Liability","")
col110 = c("10. Funded Percentage","")
col21 = c("", "a. Active", "b. Inactive", "c. Retirees", "d. Survivors", "e. Total","")
col22 = c("","")
col23 = c("","")
col24 = c("","a. Retirees","b. Survivors", "c. Total","")
col25 = c("","")
col26 = c("","")
col27 = c("","")
col28 = c("","")
col29 = c("","")
col210 = c("","")
col31 = c(NA,sum(ca), sum(ci), sum(cb), sum(cs), sum(ca + cb + ci + cs), NA)
col32 = c(prettyNum(sum(curr_avg_salary*ca),big.mark=','), NA)
col33 = c(prettyNum(total_benefits,big.mark=','),NA)
col34 = c(NA,prettyNum(pv_beneficiaries,big.mark=','),prettyNum(pv_survivors,big.mark=','),prettyNum(pv_annuitants,big.mark=','),NA)
col35 = c(prettyNum(pv_inactives,big.mark=','),NA)
col36 = c(prettyNum(pv_actives,big.mark=','),NA)
col37 = c(prettyNum(pv_annuitants + pv_actives + pv_inactives, big.mark=','),NA)
col38 = c(prettyNum(starting_wealth[1],big.mark=','),NA)
col39 = c(prettyNum((100 / fundingRatio() - 1) * starting_wealth[1],big.mark=','),NA)
col310 = c(paste(round(fundingRatio(),2),'%',sep=''),NA)
df = data.frame(c(col11,col12,col13,col14,col15,col16,col17,col18,col19,col110),c(col21,col22,col23,col24,col25,col26,col27,col28,col29,col210),c(col31,col32,col33,col34,col35,col36,col37,col38,col39,col310))

