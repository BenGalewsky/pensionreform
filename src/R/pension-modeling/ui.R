library(shiny)
library(ggplot2)

start_year = 2014

ui <- shinyUI(fluidPage(
  
  titlePanel(p("Illinois Pension Modeling",align="center")),br(),
  
  sidebarPanel(
    #selectInput('proposal',"Proposal",choices=c("Rauner June 2015"=1,"Madigan July 2015"=2,"Rahm August 2015"=3,"Federal Bailout"=4), selected=1),hr(),
    sliderInput('npers',"Years in Forecast",10,100,30,step=5),
    sliderInput('ror',"Rate of Return", 0, 16, 5),
    sliderInput('ben',"Benefit Growth Rate", 0, 16, 3),
    sliderInput('cont',"Contribution Rate", 0, 16, 2),
    sliderInput('inc',"Income Growth Rate", 0, 16, 3),
    sliderInput('rr',"Replacement Rate",0, 2, 0, step=0.05),
    sliderInput('tfr',"Target Funding Ratio", 0, 120, 100,step=5),
    width = 3
  ),
  
  mainPanel(
    tabsetPanel(
      tabPanel("Wealth",br(),hr(),h3(textOutput('pensionAssets')),h3(textOutput('fundingRatio'))
               ,h3(textOutput('contributionTarget'))
               ,hr(),br(),h3("Pension Wealth by Year",align='center')
               ,plotOutput('wealthPlot')
               # By component of wealth distribution show the flows
               ,br(),br(),h3("Wealth Flows by Year",align='center')
               ,plotOutput('wealthFlows')
               ),
      tabPanel("Population",br(),
               sliderInput("in_period","Select Period",start_year,start_year+40-1,12),hr(),
               h3("Active Population Distribution",align="center"),
               plotOutput('active_plot'),br(),
               h3("Beneficiary Population Distribution",align="center"),
               plotOutput('beneficiary_plot'),br(),
               h3("Income Distribution",align="center"),
               plotOutput('inc_plot'),br(),
               h3("Benefits Distribution",align="center"),
               plotOutput('ben_plot'),br(),br())
      #,tabPanel("Proposal",br(),h3("Proposal Details", align="center"),
               #br(),textOutput('prosposal'))
    )
  )
))
