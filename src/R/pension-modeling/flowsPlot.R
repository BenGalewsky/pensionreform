Year = rep(seq(2015,2074),4)
Flows = c(colSums(actives_liability()[[2]]), colSums(inactives_liability()[[2]]), colSums(survivor_liability()[[2]]), colSums(annuitant_liability()[[2]]) + colSums(new_survivor_liability()[[2]])) / 1000000
Type = c(rep("Actives",60),rep("Inactives",60),rep("Survivors",60),rep("Annuitants",60))

df = data.frame(Year,Flows,Type)

stacked_absolute<-ggplot(df,aes(x=Year,y=Flows,fill=Type)) +
  geom_area(colour="black",size=.2,alpha=.8) + ylab("$MM") + scale_fill_brewer(palette='Set1') + 
  theme(panel.background = element_rect(fill = "white"), plot.background = element_rect(fill='grey97'))

print(stacked_absolute)