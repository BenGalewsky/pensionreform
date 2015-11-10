# from 'wealthPlot.R'
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

# from 'wealthflowPlot.R'
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

# from 'male_mortality.R'

# Source: https://www.soa.org/research/experience-study/pension/research-rp-2000-mortality-tables.aspx

male_mortality <- function(age) {
  
  if (age==0) 0.006569
  else if (age==1) 0.000637
  else if (age==2) 0.00043
  else if (age==3) 0.000357
  else if (age==4) 0.000278
  else if (age==5) 0.000255
  else if (age==6) 0.000244
  else if (age==7) 0.000234
  else if (age==8) 0.000216
  else if (age==9) 0.000209
  else if (age==10) 0.000212
  else if (age==11) 0.000219
  else if (age==12) 0.000228
  else if (age==13) 0.00024
  else if (age==14) 0.000254
  else if (age==15) 0.000269
  else if (age==16) 0.000284
  else if (age==17) 0.000301
  else if (age==18) 0.000316
  else if (age==19) 0.000331
  else if (age==20) 0.000345
  else if (age==21) 0.000357
  else if (age==22) 0.000366
  else if (age==23) 0.000373
  else if (age==24) 0.000376
  else if (age==25) 0.000376
  else if (age==26) 0.000378
  else if (age==27) 0.000382
  else if (age==28) 0.000393
  else if (age==29) 0.000412
  else if (age==30) 0.000444
  else if (age==31) 0.000499
  else if (age==32) 0.000562
  else if (age==33) 0.000631
  else if (age==34) 0.000702
  else if (age==35) 0.000773
  else if (age==36) 0.000841
  else if (age==37) 0.000904
  else if (age==38) 0.000964
  else if (age==39) 0.001021
  else if (age==40) 0.001079
  else if (age==41) 0.001142
  else if (age==42) 0.001215
  else if (age==43) 0.001299
  else if (age==44) 0.001397
  else if (age==45) 0.001508
  else if (age==46) 0.001616
  else if (age==47) 0.001734
  else if (age==48) 0.00186
  else if (age==49) 0.001995
  else if (age==50) 0.002138
  else if (age==51) 0.002449
  else if (age==52) 0.002667
  else if (age==53) 0.002916
  else if (age==54) 0.003196
  else if (age==55) 0.003624
  else if (age==56) 0.0042
  else if (age==57) 0.004693
  else if (age==58) 0.005273
  else if (age==59) 0.005945
  else if (age==60) 0.006747
  else if (age==61) 0.007676
  else if (age==62) 0.008757
  else if (age==63) 0.010012
  else if (age==64) 0.01128
  else if (age==65) 0.012737
  else if (age==66) 0.014409
  else if (age==67) 0.016075
  else if (age==68) 0.017871
  else if (age==69) 0.019802
  else if (age==70) 0.022206
  else if (age==71) 0.065841
  else if (age==72) 0.069405
  else if (age==73) 0.073292
  else if (age==74) 0.077512
  else if (age==75) 0.082067
  else if (age==76) 0.086951
  else if (age==77) 0.092149
  else if (age==78) 0.09764
  else if (age==79) 0.103392
  else if (age==80) 0.109372
  else if (age==81) 0.115544
  else if (age==82) 0.121877
  else if (age==83) 0.128343
  else if (age==84) 0.099779
  else if (age==85) 0.110757
  else if (age==86) 0.122797
  else if (age==87) 0.136043
  else if (age==88) 0.15059
  else if (age==89) 0.16642
  else if (age==90) 0.183408
  else if (age==91) 0.199769
  else if (age==92) 0.216605
  else if (age==93) 0.233662
  else if (age==94) 0.250693
  else if (age==95) 0.267491
  else if (age==96) 0.283905
  else if (age==97) 0.299852
  else if (age==98) 0.315296
  else if (age==99) 0.330207
  else if (age==100) 0.344556
  else if (age==101) 0.358628
  else if (age==102) 0.371685
  else if (age==103) 0.38304
  else if (age==104) 0.392003
  else if (age==105) 0.397886
  else if (age==106) 0.4
  else if (age==107) 0.4
  else if (age==108) 0.4
  else if (age==109) 0.4
  else if (age==110) 0.4
  else if (age==111) 0.4
  else if (age==112) 0.4
  else if (age==113) 0.4
  else if (age==114) 0.4
  else if (age==115) 0.4
  else if (age==116) 0.4
  else if (age==117) 0.4
  else if (age==118) 0.4
  else if (age==119) 0.4
  else 1
  
}

# from 'female_mortality.R'

female_mortality <- function(age) {
  
  if (age==0) 0.005513
  else if (age==1) 0.000571
  else if (age==2) 0.000372
  else if (age==3) 0.000278
  else if (age==4) 0.000208
  else if (age==5) 0.000188
  else if (age==6) 0.000176
  else if (age==7) 0.000165
  else if (age==8) 0.000147
  else if (age==9) 0.00014
  else if (age==10) 0.000141
  else if (age==11) 0.000143
  else if (age==12) 0.000148
  else if (age==13) 0.000155
  else if (age==14) 0.000162
  else if (age==15) 0.00017
  else if (age==16) 0.000177
  else if (age==17) 0.000184
  else if (age==18) 0.000188
  else if (age==19) 0.00019
  else if (age==20) 0.000191
  else if (age==21) 0.000192
  else if (age==22) 0.000194
  else if (age==23) 0.000197
  else if (age==24) 0.000201
  else if (age==25) 0.000207
  else if (age==26) 0.000214
  else if (age==27) 0.000223
  else if (age==28) 0.000235
  else if (age==29) 0.000248
  else if (age==30) 0.000264
  else if (age==31) 0.000307
  else if (age==32) 0.00035
  else if (age==33) 0.000394
  else if (age==34) 0.000435
  else if (age==35) 0.000475
  else if (age==36) 0.000514
  else if (age==37) 0.000554
  else if (age==38) 0.000598
  else if (age==39) 0.000648
  else if (age==40) 0.000706
  else if (age==41) 0.000774
  else if (age==42) 0.000852
  else if (age==43) 0.000937
  else if (age==44) 0.001029
  else if (age==45) 0.001124
  else if (age==46) 0.001223
  else if (age==47) 0.001326
  else if (age==48) 0.001434
  else if (age==49) 0.00155
  else if (age==50) 0.001676
  else if (age==51) 0.001852
  else if (age==52) 0.002018
  else if (age==53) 0.002207
  else if (age==54) 0.002424
  else if (age==55) 0.002717
  else if (age==56) 0.00309
  else if (age==57) 0.003478
  else if (age==58) 0.003923
  else if (age==59) 0.004441
  else if (age==60) 0.005055
  else if (age==61) 0.005814
  else if (age==62) 0.006657
  else if (age==63) 0.007648
  else if (age==64) 0.008619
  else if (age==65) 0.009706
  else if (age==66) 0.010954
  else if (age==67) 0.012163
  else if (age==68) 0.013445
  else if (age==69) 0.01486
  else if (age==70) 0.016742
  else if (age==71) 0.018579
  else if (age==72) 0.020665
  else if (age==73) 0.02297
  else if (age==74) 0.025458
  else if (age==75) 0.028106
  else if (age==76) 0.030966
  else if (age==77) 0.034105
  else if (age==78) 0.037595
  else if (age==79) 0.041506
  else if (age==80) 0.045879
  else if (age==81) 0.05078
  else if (age==82) 0.056294
  else if (age==83) 0.062506
  else if (age==84) 0.069517
  else if (age==85) 0.077446
  else if (age==86) 0.086376
  else if (age==87) 0.096337
  else if (age==88) 0.107303
  else if (age==89) 0.119154
  else if (age==90) 0.131682
  else if (age==91) 0.144604
  else if (age==92) 0.157618
  else if (age==93) 0.170433
  else if (age==94) 0.182799
  else if (age==95) 0.194509
  else if (age==96) 0.205379
  else if (age==97) 0.21524
  else if (age==98) 0.223947
  else if (age==99) 0.231387
  else if (age==100) 0.237467
  else if (age==101) 0.244834
  else if (age==102) 0.254498
  else if (age==103) 0.266044
  else if (age==104) 0.279055
  else if (age==105) 0.293116
  else if (age==106) 0.307811
  else if (age==107) 0.322725
  else if (age==108) 0.337441
  else if (age==109) 0.351544
  else if (age==110) 0.364617
  else if (age==111) 0.376246
  else if (age==112) 0.386015
  else if (age==113) 0.393507
  else if (age==114) 0.398308
  else if (age==115) 0.4
  else if (age==116) 0.4
  else if (age==117) 0.4
  else if (age==118) 0.4
  else if (age==119) 0.4
  else 1
  
}

# from 'calculate_benefit.R'

calculate_benefit <- function(tier, years) {
  benefit = 0
  if (tier==1) {
    y = years
    while (y > 0) {
      if (y > 12) {
        benefit = benefit + .05
      }
      else if (y>8) {
        benefit = benefit + .045
      }
      else if (y>6) {
        benefit = benefit + .04
      }
      else if (y>4) {
        benefit = benefit +.035
      }
      else {
        benefit = benefit + .03
      }
      y = y - 1
    }
    benefit = min(benefit,.85)
  }
  if (tier==2) {
    benefit = min(years * .03, .65)
  }
  return(benefit)
}

# from 'calculate_earned_benefit.R'



calculate_earned_benefit <- function(population) {
  
  pct_t1 = population$Pct.T1
  avg_salary = population$Avg.Salary
  avg_years = population$Avg.Years.of.Service
  maxage = length(avg_salary)
  
  earned_benefit = c()
  
  for (n in 1:maxage) {
    t1_benefit = calculate_benefit(1,ceiling(avg_years[n])) * pct_t1[n] * avg_salary[n]
    t2_benefit = calculate_benefit(2,ceiling(avg_years[n])) * (1 - pct_t1[n]) * avg_salary[n]
    earned_benefit = c(earned_benefit,t1_benefit+t2_benefit)
  }
  
  return(earned_benefit)
  
}

# from 'ggplots.R'

#ggplot code for certain plot types
library("ggplot2")
install.packages("gcookbook")
library("gcookbook")

#from 02.2015.FinConditionILStateRetirementSys.6.30.2014.COGFA Rpt.

#see dave Melton's Email page 32
#Stacked bar graphs
stacked<-ggplot(cabbage_exp,aes(x=Date,y=Weight,fill=Cultivar))+
  geom_bar(stat="identity") + #as opposed to count
  guides(fill=guide_legend(reverse=TRUE)) + #reverse legend
  scale_fill_brewer(palette = "Set1") #the colors were really ugly
#scale_fill_manual(values=c('#CC6666','#7777DD')) #another option
stacked

#see dave Melton's Email page 41
#multiple line and point with lables 

#format sample data
install.packages(plyr)
library("plyr")
tg<-ddply(ToothGrowth,c("supp","dose"),summarise,length=mean(len)) #formatting sample data
View(tg)

fancy_line<-ggplot(tg,aes(x=dose,y=length,fill=supp)) +
  geom_point(size=6,shape=21) +
  geom_line() +
  scale_fill_brewer(palette = "Set1") + #same thing
  geom_text(aes(x=dose+.1, y=length+.1, label=length),size=4,hjust=0) 
#labeling based on data, can be adjusted for orientation, and whether or not they appear
fancy_line

#stacked graphs are cool
#stacked graphs, proportional and absolute

stacked_absolute<-ggplot(uspopage,aes(x=Year,y=Thousands,fill=AgeGroup)) +
  geom_area(colour="black",size=.2,alpha=.8)+
  scale_fill_brewer(palette="RdYlGn",breaks=rev(levels(uspopage$ageGroup)))
stacked_absolute

#format to proportional data
uspopage_prop<-ddply(uspopage, "Year",transform,Percent=Thousands/sum(Thousands)*100)

stacked_proportional<-ggplot(uspopage_prop,aes(x=Year,y=Percent,fill=AgeGroup)) +
  geom_area(colour="black",size=.2,alpha=.8)+
  scale_fill_brewer(palette="RdYlGn",breaks=rev(levels(uspopage$ageGroup)))
stacked_proportional
