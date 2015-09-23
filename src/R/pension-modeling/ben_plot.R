in_period = input$in_period - start_year + 1
ben_forecast = avg_benefits_forecast()[20:maxage,in_period]

age = seq(20,maxage)
df = as.data.frame(cbind(age,ben_forecast))

p <- ggplot(df,aes(age,ben_forecast/1000)) + ylab("Average Benefits ($'000s)") +
  geom_bar(stat="identity",position="identity",width=1,fill='skyblue4') +
  theme(panel.background = element_rect(fill = "white"), plot.background = element_rect(fill='grey97'))

print(p)