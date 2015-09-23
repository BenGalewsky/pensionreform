nper = input$npers
Year = seq(start_year,nper+start_year-1)
inflows = as.data.frame(list(rep("Inflows",nper),wealth()[[2]],Year))[2:nper,]
outflows = as.data.frame(list(rep("Outflows",nper),-wealth()[[3]],Year))[2:nper,]
colnames(inflows) = c("Flowtype","Flows","Year")
colnames(outflows) = c("Flowtype","Flows","Year")

df = rbind(inflows,outflows)
net = as.data.frame(list(wealth()[[2]] - wealth()[[3]],Year))[2:nper,]
colnames(net) = c("net","Year")

p <- ggplot(df,aes(x=Year)) + geom_bar(data=subset(df,Flowtype=="Inflows"), aes(y = Flows/1000000,fill=Flowtype),position="stack",stat="identity",width=0.8)+
  geom_bar(data=subset(df,Flowtype=="Outflows"),aes(y = Flows/1000000,fill=Flowtype),position="stack",stat="identity",width=0.8) +
  theme(panel.background = element_rect(fill = "white"), plot.background = element_rect(fill='grey97')) +
  scale_fill_manual(values=c(Inflows="chartreuse4",Outflows="firebrick2")) + ylab("Flows ($mm)")
p <- p + geom_line(data=net,aes(x=Year,y=net/1000000,group=1), size=1)
print(p)