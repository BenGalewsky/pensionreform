source('source_functions.R')

# Hard-coded values for now
start_year = 2014
maxage = 120
starting_wealth = c(56789460)

server <- shinyServer(function(input,output,clientData,session) {
  
  # Load population
  population = load_population_data(maxage)
  curr_actives_tier1 = population[[1]]$Count * population[[1]]$Pct.T1
  curr_actives_tier2 = population[[1]]$Count * (1-population[[1]]$Pct.T1)
  #actives_avg_years = population[[1]]$Avg.Years.of.Service
  
  curr_beneficiaries = population[[2]]$Count
  curr_inactives_tier1 = population[[3]]$Count * population[[3]]$Pct.T1
  curr_inactives_tier2 = population[[3]]$Count * (1-population[[3]]$Pct.T1)
  curr_inactives = curr_inactives_tier1 + curr_inactives_tier2
  #inactives_avg_years = population[[3]]$Avg.Years.of.Service

  # Load salary and benefits
  curr_avg_salary = population[[1]]$Avg.Salary
  #curr_actives_avg_benefits = population[[1]]$Avg.Earned.Benefit
  curr_actives_avg_benefits = calculate_earned_benefit(population[[1]])
  curr_avg_benefits = population[[2]]$Avg.Benefits
  inactive_avg_salary = population[[3]]$Avg.Contributions / population[[3]]$Avg.Years.of.Service * 1 / (.115)
  inactive_avg_salary[is.nan(inactive_avg_salary)] = 0
  # Is this what they mean by a 10% load?
  inactive_avg_benefits = population[[3]]$Avg.Benefits + .1*inactive_avg_salary
  inactive_avg_benefits[is.nan(inactive_avg_benefits)] = 0
  
  initial_actives_forecast <- reactive({forecast_curr_actives(curr_actives_tier1,curr_actives_tier2,curr_actives_avg_benefits,input$ben,input$salary,input$inf)})
  initial_inactives_forecast <- reactive({forecast_curr_actives(curr_inactives_tier1,curr_inactives_tier2,inactive_avg_benefits,input$ben,0,input$inf)})
  initial_beneficiary_forecast <- reactive({forecast_beneficiaries(curr_beneficiaries,curr_avg_benefits,80,input$ben)})
  
  # Forecast population and benefits for existing beneficiaries
  beneficiary_forecast <- reactive({forecast_beneficiaries(curr_beneficiaries,curr_avg_benefits,input$npers,input$ben)})
  
  # Calculate active population, active salary, new retirees and future average benefits
  actives_forecast <- reactive({forecast_actives(curr_actives_tier1,curr_actives_tier2,curr_avg_salary,input$npers,input$ben,input$salary,input$rr,input$inf)})
  
  # Calculate liability assuming no replacement rate and an 80 year forecast?
  actives_liability <- reactive({calculate_annuitant_liability(initial_actives_forecast(),input$ror)})
  inactives_liability <- reactive({calculate_annuitant_liability(initial_inactives_forecast(),input$ror)})
  annuitant_liability <- reactive({calculate_annuitant_liability(initial_beneficiary_forecast(),input$ror)})
  survivor_liability <- reactive ({calculate_annuitant_liability(list(initial_beneficiary_forecast()[[3]],initial_beneficiary_forecast()[[4]]),input$ror)})
  
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
  fundingRatio <- reactive({100 * starting_wealth[1] / (sum(actives_liability()[[1]]) + sum(annuitant_liability()[[1]]) + sum(inactives_liability()[[1]]) + sum(survivor_liability()[[1]]))})
  
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
  
  # This depends on periods and the discount rate in some interesting way
  output$requiredAnnualContribution <- renderText({
    contributions_needed = (input$tfr / fundingRatio() - 1) * starting_wealth[1]
    if (contributions_needed < 0) {
      contributions_needed = 0
    }
    rate = input$ror/100
    level_pay = (rate + rate / ((1+rate)^(input$amort)-1))*contributions_needed
    paste("Annual Payment: $",formatC(level_pay,format="f",digits=0,big.mark=","),sep="")
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
      datasetInput = switch(input$forecastData,"1" = initial_beneficiary_forecast()[[1]],"2" = initial_beneficiary_forecast()[[2]], 
                            "3" = initial_actives_forecast()[[3]],"4" = initial_actives_forecast()[[1]],"5" = initial_actives_forecast()[[2]])
      write.csv(datasetInput,file)
    })
  
})
