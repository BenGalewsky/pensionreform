nper = input$npers
wealth = wealth()[[1]]
Year = seq(start_year+1,start_year+nper)
df = as.data.frame(cbind(Year,wealth))

df$Net <- ifelse(df$wealth > 0, "Positive","Negative")

p <- ggplot(df,aes(Year,wealth/1000000)) +
  geom_bar(stat="identity",position="identity",aes(fill = Net),width=0.8) +
  theme(panel.background = element_rect(fill = "white"), plot.background = element_rect(fill='grey97')) +
  scale_fill_manual(values=c(Positive="chartreuse4",Negative="firebrick2")) + ylab("Wealth ($mm)")
print(p)