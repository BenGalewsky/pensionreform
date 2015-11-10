source('source_functions.R')

# Hard-coded values for now
start_year = 2015
maxage = 120
starting_wealth = c(51598149)

server <- shinyServer(function(input,output,clientData,session) {
  
  # Load population
  population = load_population_data(maxage)
  curr_actives_tier1 = population[[1]]$Count * population[[1]]$Pct.T1
  curr_actives_tier2 = population[[1]]$Count * (1-population[[1]]$Pct.T1)
  curr_beneficiaries = population[[2]]$Count
  curr_inactives_tier1 = population[[3]]$Count * population[[3]]$Pct.T1
  curr_inactives_tier2 = population[[3]]$Count * (1-population[[3]]$Pct.T1)
  curr_survivors = population[[4]]$Count
  curr_survivor_benefits = population[[4]]$Avg.Benefits
  curr_actives_avg_benefits = population[[1]]$Avg.Earned.Benefit
  curr_avg_benefits = population[[2]]$Avg.Benefits
  
  inactive_avg_salary = population[[3]]$Avg.Contributions / population[[3]]$Avg.Years.of.Service * 1 / (.115)
  inactive_avg_salary[is.nan(inactive_avg_salary)] = 0
  # Is this what they mean by a 10% load?
  inactive_avg_benefits = population[[3]]$Avg.Benefits + .1*inactive_avg_salary
  inactive_avg_benefits[is.nan(inactive_avg_benefits)] = 0
  
  initial_actives_forecast <- reactive({forecast_actives(curr_actives_tier1,curr_actives_tier2,curr_actives_avg_benefits,input$ben,input$salary,input$inf,60,input$retire,input$mort)})
  # Should inactives get 0% salary growth?
  initial_inactives_forecast <- reactive({forecast_actives(curr_inactives_tier1,curr_inactives_tier2,inactive_avg_benefits,input$ben,0,input$inf,60,input$retire,input$mort)})
  initial_beneficiary_forecast <- reactive({forecast_beneficiaries(curr_beneficiaries,curr_avg_benefits,60,input$ben,input$mort)})
  initial_survivor_forecast <- reactive({forecast_survivors(curr_survivors,curr_survivor_benefits,60,input$ben,input$mort)})
  
  # Calculate liability assuming no replacement rate and a 60 year forecast?
  actives_liability <- reactive({calculate_annuitant_liability(initial_actives_forecast(),input$disc,60)})
  inactives_liability <- reactive({calculate_annuitant_liability(initial_inactives_forecast(),input$disc,60)})
  survivor_liability <- reactive ({calculate_annuitant_liability(initial_survivor_forecast(),input$disc,60)})
  annuitant_liability <- reactive({calculate_annuitant_liability(initial_beneficiary_forecast(),input$disc,60)})
  new_survivor_liability <- reactive({calculate_annuitant_liability(list(initial_beneficiary_forecast()[[3]],initial_beneficiary_forecast()[[4]]),input$disc,60)})
  actives_survivor_liability <- reactive({calculate_annuitant_liability(list(initial_actives_forecast()[[4]],initial_actives_forecast()[[5]]),input$disc,60)})
  inactives_survivor_liability <- reactive({calculate_annuitant_liability(list(initial_inactives_forecast()[[4]],initial_inactives_forecast()[[5]]),input$disc,60)})
  
  # Fund outflows, by liability type
  output$flowsPlot <- renderPlot({source('flowsPlot.R',local=TRUE)})
  
  # Plot the distribution of actives for each period
  output$count_plot <- renderPlot({source('count_plot.R',local=TRUE)})
  
  # Calculate the funding ratio given PV liabilities and assets
  fundingRatio <- reactive({100 * starting_wealth[1] / (sum(actives_liability()[[1]] + actives_survivor_liability()[[1]] + annuitant_liability()[[1]] + new_survivor_liability()[[1]] + 
                                                              inactives_liability()[[1]] + inactives_survivor_liability()[[1]] + survivor_liability()[[1]]))})
  
  # Output the current funded ratio
  output$fundingRatio <- renderText({paste("Funded Ratio: ",round(fundingRatio(),2),"%",sep="")})
  
  # Calculate contribution target based on the funding ratio
  output$contributionTarget <- renderText({
    contributions_needed = (input$tfr / fundingRatio() - 1) * starting_wealth[1]
    if (contributions_needed < 0) contributions_needed = 0
    paste("Asset Shortfall: $",formatC(contributions_needed,format="f",digits=0,big.mark=","),sep="")
  })
  
  # Amortize the asset shortfall given the discount rate
  output$requiredAnnualContribution <- renderText({
    contributions_needed = (input$tfr / fundingRatio() - 1) * starting_wealth[1]
    if (contributions_needed < 0) contributions_needed = 0
    rate = input$disc/100
    if (input$amort==0) {
      level_pay = contributions_needed
    } else {
      level_pay = (rate + rate / ((1+rate)^(input$amort)-1))*contributions_needed
    }
    paste("Annual Payment: $",formatC(level_pay,format="f",digits=0,big.mark=","),sep="")
  })
  
  # Actuarial value of pension assets
  output$pensionAssets <- renderText({paste("Pension Assets: $",formatC(starting_wealth[1],format="f",digits=0,big.mark=","),sep="")})
  
  # Output valuation details
  output$details <- renderTable({
    source("valuation_details.R",local=TRUE)
    df
  }, include.rownames=FALSE, include.colnames=FALSE,digits=0,align=c("left","left","left","right"))
  
  # Dynamic slider input
  output$timeSlider <- renderUI({sliderInput("in_period","Select Period",start_year,start_year+60-1,value=start_year,animate=TRUE)})
  
  output$downloadData <- downloadHandler(
    filename = function() {"forecastdata.csv"},
    content = function(file) {
      datasetInput = switch(input$forecastData,"1" = initial_beneficiary_forecast()[[1]],"2" = initial_beneficiary_forecast()[[2]],
                            "3" = initial_survivor_forecast()[[1]],"4" = initial_survivor_forecast()[[2]],"5" = initial_actives_forecast()[[3]],"6" = initial_actives_forecast()[[1]],
                            "7" = initial_actives_forecast()[[2]],"8" = initial_inactives_forecast()[[3]],"9" = initial_inactives_forecast()[[1]],"10" = initial_inactives_forecast()[[2]])
      write.csv(datasetInput,file)
    })
  
})
