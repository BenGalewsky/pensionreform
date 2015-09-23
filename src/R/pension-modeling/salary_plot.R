in_period = input$in_period - start_year + 1
salary_forecast = avg_salary_forecast()[20:maxage,in_period]
age = seq(20,maxage)
df = as.data.frame(cbind(age,salary_forecast))

p <- ggplot(df,aes(age,salary_forecast/1000)) + ylab("Average Salary ($'000s)") +
  geom_bar(stat="identity",position="identity",width=1,fill='skyblue4') +
  theme(panel.background = element_rect(fill = "white"), plot.background = element_rect(fill='grey97'))

print(p)