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
  
  # Load salary and benefits
  curr_avg_salary = load_salary_data(maxage)
  curr_avg_benefits = load_benefits_data(maxage)[[1]]
  
  # Population forecast is a two matrix list, containing (actives,beneficiaries)
  pop_forecast <- reactive({
    tier1 = forecast_population(curr_actives_tier1,curr_beneficiaries,input$npers,tier=1,input$rr)
    tier2 = forecast_population(curr_actives_tier2,curr_beneficiaries,input$npers,tier=2,input$rr)
    list(tier1[[1]]+tier2[[1]],tier1[[2]]+tier2[[2]])
  })

  # Expects matrix of salary forecast as output
  avg_salary_forecast <- reactive({forecast_salary(curr_avg_salary,input$npers,input$salary,input$salary)})
  
  # Expects matrix of benefits forecast as output
  avg_benefits_forecast <- reactive({forecast_benefits(curr_avg_benefits,avg_salary_forecast(),input$npers,input$ben)})
  
  # Plot the distribution of actives for each period
  output$active_plot <- renderPlot({source('active_plot.R',local=TRUE)})
  
  # Forecast the fund's wealth
  wealth <- reactive({forecast_wealth(starting_wealth,pop_forecast(),avg_salary_forecast(),avg_benefits_forecast(),input$ror,input$cont)})
  
  # Plot year-by-year wealth flows
  output$wealthflowPlot <- renderPlot({source('wealthflowPlot.R',local=TRUE)})
  # Plot forecast of pension fund wealth
  output$wealthPlot <- renderPlot({source('wealthPlot.R',local=TRUE)})
  # Plot the distribution of benefits for a given period
  output$ben_plot <- renderPlot({source('ben_plot.R',local=TRUE)})
  # Plot the distribution of average salary for a given period
  output$salary_plot <- renderPlot({source('salary_plot.R',local=TRUE)})
  # Plot the distribution of beneficiaries for a given period
  output$beneficiary_plot <- renderPlot({source('beneficiary_plot.R',local=TRUE)})
  
  # Calculate the funding ratio given a no replacement population
  fundingRatio <- reactive({
    tier1 = forecast_population(curr_actives_tier1,curr_beneficiaries,input$npers,tier=1)
    tier2 = forecast_population(curr_actives_tier2,curr_beneficiaries,input$npers,tier=2)
    no_replacement_pop = list(tier1[[1]]+tier2[[1]],(tier1[[2]]+tier2[[2]])/2)
    calculate_funding_ratio(starting_wealth[1],no_replacement_pop,avg_benefits_forecast(),input$ror)
  })
  
  # Output the current funded ratio
  output$fundingRatio <- renderText({paste("Funded Ratio: ",round(fundingRatio(),2),"%",sep="")})
  
  # Calculate contribution target based on the funding ratio
  output$contributionTarget <- renderText({
    contributions_needed = starting_wealth[1] / fundingRatio() * input$tfr
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
  
})
