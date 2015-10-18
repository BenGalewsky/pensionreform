source('source_functions.R')

# Hard-coded values for now
start_year = 2014
maxage = 105
starting_wealth = c(56789460)

server <- shinyServer(function(input,output,clientData,session) {
  
  # Load population
  population = load_population_data(maxage)
  curr_actives_tier1 = population[[1]]
  curr_actives_tier2 = population[[2]]
  curr_beneficiaries = population[[3]]
  curr_inactives_tier1 = population[[4]]
  curr_inactives_tier2 = population[[5]]

  # Load salary and benefits
  curr_avg_salary = load_salary_data(maxage)
  curr_avg_benefits = load_benefits_data(maxage)[[1]]
  
  # Forecast population and benefits for existing beneficiaries
  beneficiary_forecast <- reactive({forecast_beneficiaries(curr_beneficiaries,curr_avg_benefits,input$npers,input$ben)})
  
  # Calculate annuitant liability for existing beneficiaries both discounted and nominal
  annuitant_liability <- reactive({calculate_annuitant_liability(beneficiary_forecast(),input$npers,input$ror)})
  
  #actives_benefit_forecast <- reactive({generate_actives_benefits(curr_actives_tier1,curr_actives_tier2,curr_avg_salary,input$npers,input$ben)})
  
  # Calculate active population, active salary, new retirees and future average benefits
  actives_forecast <- reactive({forecast_actives(curr_actives_tier1,curr_actives_tier2,curr_avg_salary,input$npers,input$ben,input$salary,input$rr)})
  
  # Calculate liability assuming no replacement rate
  actives_liability <- reactive({calculate_actives_liability(forecast_actives(curr_actives_tier1,curr_actives_tier2,curr_avg_salary,input$npers,input$ben,0),input$npers,input$ror)})
  
  # Forecast the fund's wealth
  wealth <- reactive({forecast_wealth(starting_wealth,actives_forecast(),beneficiary_forecast(),input$npers,input$ror,input$cont)})
  
  # Plot the distribution of actives for each period
  output$active_plot <- renderPlot({source('active_plot.R',local=TRUE)})
  # Plot the distribution of beneficiaries for each period
  output$beneficiary_plot <- renderPlot({source('beneficiary_plot.R',local=TRUE)})
  # Plot the new beneficiaries for each period
  output$new_beneficiary_plot <- renderPlot({source('new_beneficiary_plot.R',local=TRUE)})
  # Plot year-by-year wealth flows
  output$wealthflowPlot <- renderPlot({source('wealthflowPlot.R',local=TRUE)})
  # Plot forecast of pension fund wealth
  output$wealthPlot <- renderPlot({source('wealthPlot.R',local=TRUE)})
  
  # Calculate the funding ratio given PV liabilities and assets
  fundingRatio <- reactive({100 * starting_wealth[1] / (sum(actives_liability()[[1]]) + sum(annuitant_liability()[[1]]))})
  
  # Output the current funded ratio
  output$fundingRatio <- renderText({paste("Funded Ratio: ",round(fundingRatio(),2),"%",sep="")})
  
  # Calculate contribution target based on the funding ratio
  output$contributionTarget <- renderText({
    contributions_needed = (input$tfr / fundingRatio() - 1) * starting_wealth[1]
    if (contributions_needed < 0) {
      contributions_needed = 0
    }
    paste("Asset Shortfall: $",formatC(contributions_needed,format="f",digits=0,big.mark=","),sep="")
  })
  
  # Market value of pension assets
  output$pensionAssets <- renderText({paste("Pension Assets: $",formatC(starting_wealth[1],format="f",digits=0,big.mark=","),sep="")})
  
  # Output valuation details
  output$details <- renderTable({
    source("valuation_details.R",local=TRUE)
    df
  }, include.rownames=FALSE, include.colnames=FALSE,digits=0,align=c("left","left","left","right"))
  
  # Dynamic slider input
  output$timeSlider <- renderUI({sliderInput("in_period","Select Period",start_year,start_year+input$npers-1,value=start_year,animate=TRUE)})
  
  output$downloadData <- downloadHandler(
    filename = function() {"forecastdata.csv"},
    content = function(file) {
      datasetInput = switch(input$forecastData,"1" = beneficiary_forecast()[[1]],"2" = beneficiaries_forecast()[[2]],"3" = actives_forecast()[[1]],"4" = actives_forecast()[[2]])
      write.csv(datasetInput,file)
    })
  
})
