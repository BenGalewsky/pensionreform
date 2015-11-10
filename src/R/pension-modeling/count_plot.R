if (is.null(input$in_period)) {
  in_period = 1
} else {
  in_period = input$in_period - start_year + 1
}

actives = initial_actives_forecast()[[3]][31:100,in_period]
inactives = initial_inactives_forecast()[[3]][31:100,in_period]
beneficiaries = initial_actives_forecast()[[1]][31:100,in_period] + initial_inactives_forecast()[[1]][31:100,in_period] + initial_survivor_forecast()[[1]][31:100,in_period] + 
  initial_beneficiary_forecast()[[1]][31:100,in_period] + initial_actives_forecast()[[4]][31:100,in_period] + + initial_inactives_forecast()[[4]][31:100,in_period]

pop_dist = c(actives,inactives,beneficiaries)
Type = c(rep("Actives",70),rep("Inactives",70),rep("Beneficiaries",70))
Age = rep(seq(31,100),3)
df = data.frame(Age,pop_dist,Type)

p <- ggplot(df,aes(x=Age,y=pop_dist,fill=Type)) + ylab("# of participants") +
  geom_bar(stat="identity",width=.8) + theme(panel.background = element_rect(fill = "white"), plot.background = element_rect(fill='grey97')) + ylim(0,26)
print(p)
