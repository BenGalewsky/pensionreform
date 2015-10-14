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

