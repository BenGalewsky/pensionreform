source('source_functions.R')

# Hard-coded values for now
start_year = 2014
maxage = 90
starting_wealth = c(56789460)

server <- shinyServer(function(input,output,clientData,session) {
  
  # Load population
  population = load_population_data(maxage)
  curr_actives_tier1 = population[[1]]
  curr_actives_tier2 = population[[2]]
  curr_beneficiaries = population[[3]]
  
  # Load income and benefits
  curr_avg_income = load_income_data(maxage)
  curr_avg_benefits = load_benefits_data(maxage)
  
  # Population forecast is a two matrix list, containing (actives,beneficiaries)
  pop_forecast <- reactive({
    tier1 = forecast_population(curr_actives_tier1,curr_beneficiaries,input$npers,tier=1,input$rr)
    tier2 = forecast_population(curr_actives_tier2,curr_beneficiaries,input$npers,tier=2,input$rr)
    list(tier1[[1]]+tier2[[1]],tier1[[2]]+tier2[[2]])
  })

  # Expects matrix of income forecast as output
  avg_income_forecast <- reactive({
    forecast_income(curr_avg_income,input$npers,input$inc)
  })
  
  # Expects matrix of benefits forecast as output
  avg_benefits_forecast <- reactive({
    forecast_benefits(curr_avg_benefits,avg_income_forecast(),input$npers,input$ben)
  })
  
  # Plot the distribution of benefits for a given period
  output$ben_plot <- renderPlot({
    in_period = input$in_period - start_year + 1
    ben_forecast = avg_benefits_forecast()[20:maxage,in_period]
    
    age = seq(20,maxage)
    df = as.data.frame(cbind(age,ben_forecast))
    
    p <- ggplot(df,aes(age,ben_forecast/1000)) + ylab("Average Benefits ($'000s)") +
      geom_bar(stat="identity",position="identity",width=1,fill='skyblue4') +
      theme(panel.background = element_rect(fill = "white"), plot.background = element_rect(fill='grey97'))
    
    print(p)
  })
  
  # Plot the distribution of average income for a given period
  output$inc_plot <- renderPlot({
    in_period = input$in_period - start_year + 1
    inc_forecast = avg_income_forecast()[20:maxage,in_period]
    age = seq(20,maxage)
    df = as.data.frame(cbind(age,inc_forecast))

    p <- ggplot(df,aes(age,inc_forecast/1000)) + ylab("Average Income ($'000s)") +
      geom_bar(stat="identity",position="identity",width=1,fill='skyblue4') +
      theme(panel.background = element_rect(fill = "white"), plot.background = element_rect(fill='grey97'))
    
    print(p)
  })
  
  # Plot the distribution of beneficiaries for a given period
  output$beneficiary_plot <- renderPlot({
    in_period = input$in_period - start_year + 1
    pop_dist = pop_forecast()[[2]][20:maxage,in_period]
    age = seq(20,maxage)
    df = as.data.frame(cbind(age,pop_dist))
    
    p <- ggplot(df,aes(age,pop_dist)) + ylab("# of beneficiaries") +
      geom_bar(stat="identity",position="identity",width=1,fill='skyblue4') +
      theme(panel.background = element_rect(fill = "white"), plot.background = element_rect(fill='grey97'))
    print(p)
  })
  
  # Plot the distribution of actives for each period
  output$active_plot <- renderPlot({
    in_period = input$in_period - start_year + 1
    pop_dist = pop_forecast()[[1]][20:maxage,in_period]
    age = seq(20,maxage)
    df = as.data.frame(cbind(age,pop_dist))
    
    p <- ggplot(df,aes(age,pop_dist)) + ylab("# of actives") +
      geom_bar(stat="identity",position="identity",width=1,fill='skyblue4') +
      theme(panel.background = element_rect(fill = "white"), plot.background = element_rect(fill='grey97'))
    print(p)
  })
  
  # Forecast the fund's wealth
  wealth <- reactive({
    forecast_wealth(starting_wealth,pop_forecast(),avg_income_forecast(),avg_benefits_forecast(),input$ror,input$cont)
  })
  
  # Plot year-by-year wealth flows
  output$wealthFlows <- renderPlot({
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
    
  })
  
  # Plot forecast of pension fund wealth
  output$wealthPlot <- renderPlot({
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
  })
  
  # Calculate the funding ratio given a no replacement population
  fundingRatio <- reactive({
    tier1 = forecast_population(curr_actives_tier1,curr_beneficiaries,input$npers,tier=1)
    tier2 = forecast_population(curr_actives_tier2,curr_beneficiaries,input$npers,tier=2)
    no_replacement_pop = list((tier1[[1]]+tier2[[1]])/2,(tier1[[2]]+tier2[[2]])/2)
    calculate_funding_ratio(starting_wealth[1],no_replacement_pop,avg_benefits_forecast(),input$ror)
  })
  
  # Calculate funding ratio assuming no replacement
  output$fundingRatio <- renderText({
    paste("Funded Ratio: ",round(fundingRatio(),2),"%",sep="")
  })
  
  # Calculate contribution target based on the funding ratio
  output$contributionTarget <- renderText({
    contributions_needed = (input$tfr-fundingRatio())/100*starting_wealth[1]
    if (contributions_needed < 0) {
      contributions_needed = 0
    }
    paste("Asset Shortfall: $",formatC(contributions_needed,format="f",digits=0,big.mark=","),sep="")
  })
  
  output$pensionAssets <- renderText({
    paste("Pension Assets: $",formatC(starting_wealth[1],format="f",digits=0,big.mark=","),sep="")
  })
  
  output$proposal <- renderText({
    paste("Just testing")
  })
  
})
