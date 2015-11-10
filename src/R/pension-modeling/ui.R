library(shiny)
library(ggplot2)

start_year = 2014

ui <- shinyUI(fluidPage(
  
  titlePanel(p("Illinois Pension Modeling",align="center")),br(),
  
  sidebarPanel(
    tabsetPanel(
    tabPanel("Shocks",br(),
      sliderInput('disc','Discount Rate',0,10,5,step=0.5),
      #sliderInput('ror',"Asset Rate of Return",0,10,5,step=0.5),
      sliderInput('tfr',"Target Funding Ratio",0,120,100,step=5),
      sliderInput('amort',"Amortization Period",0,60,30,step=5),
      sliderInput('mort',"Mortality Adjustment",0, 10, 0),
      sliderInput('retire',"Retirement Delay",0, 10, 0)),
    tabPanel("Inputs",br(),
      sliderInput('ben',"Benefit Growth Rate", 0, 10, 3,step=0.5),
      sliderInput('inf',"Inflation Rate",0,10,3,step=0.5),
      sliderInput('salary',"Salary Growth Rate", 0, 10, 3.5, step=0.5))),
      #sliderInput('npers',"Years in Forecast",10,100,30,step=5),
      #sliderInput('rr',"Replacement Rate",0, 2, 0, step=0.1),
      #sliderInput('cont',"Contribution Rate", 0, 15, 11, step=1))),
    width = 3
  ),
  
  mainPanel(
    tabsetPanel(
      tabPanel("Funding",br(),hr(),h3(textOutput('pensionAssets'),align="left"),h3(textOutput('fundingRatio'),align="left")
               ,h3(textOutput('contributionTarget'),align="left"),h3(textOutput('requiredAnnualContribution'),align="left")
               ,hr(),h3("Annual Fund Outflows",align='center'),br(),plotOutput('flowsPlot')),
      tabPanel("Valuation Details",br(),h3("Results of Actuarial Valuation")
               ,br(),tableOutput('details'),align="center"),
      tabPanel("Population",br(),
               uiOutput("timeSlider"),hr(),
               h3("Population Distribution",align="center"),
               br(),plotOutput('count_plot'),br())
      ,tabPanel("Downloads",br(),selectInput('forecastData',"Select Forecast",choices=c("Initial Annuitant Forecast" = 1,"Initial Annuitant Benefits Forecast" = 2, 
                "Initial Survivor Forecast" = 3, "Initial Survivor Benefits Forecast" = 4, "Initial Actives Forecast" = 5, "Beneficiaries from Actives Forecast" = 6, 
                "Actives Benefits Forecast" = 7, "Initial Inactives Forecast" = 8, "Beneficiares from Inactives Forecast" = 9, "Initial Inactives Benefits Forecast" = 10),selected=1),br(),
                downloadButton('downloadData','Download'))
    )
  )
))
