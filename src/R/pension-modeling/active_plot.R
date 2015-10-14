if (is.null(input$in_period)) {
  in_period = 1
} else {
  in_period = input$in_period - start_year + 1
}

pop_dist = actives_forecast()[[1]][20:maxage,in_period]
age = seq(20,maxage)
df = as.data.frame(cbind(age,pop_dist))

p <- ggplot(df,aes(age,pop_dist)) + ylab("# of actives") +
  geom_bar(stat="identity",position="identity",width=1,fill='skyblue4') +
  theme(panel.background = element_rect(fill = "white"), plot.background = element_rect(fill='grey97'))
print(p)