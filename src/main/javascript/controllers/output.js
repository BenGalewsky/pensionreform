OutputGraph=function(nodeSelector){//ie... "#contributionsGraph"
    //if showNPV then show contribution bars and benefit bars but drop text for those.. .and show NPV text and lines
    //otherwise, just show bars and text in full scale, don't show NPV lines...
    var ns=$(nodeSelector);
    
    //cformat converts number to formatted currency string...
    var cformat=d3.format("$,.3r");
   
    // current scope object... gets set in render function... but is made globally available...
    var model={};
    var xmax=0;
    var xmin=0;
    var retirementYear;
    var dt=new Date();
    var currYear=dt.getFullYear();
    
    this.render = function(model_data) {
      model = model_data;
    }

    this.drawScale = function(showNPV) {
      svg.selectAll("*").remove();
      var mxValue;
      if(showNPV) mxValue=d3.max(model.history,function(d){return Math.max(d.contributionFund*2, d.benefitFund, d.contributionFund_npv*2, d.benefitFund_npv)});
      else  mxValue=d3.max(model.history,function(d){return Math.max(d.salary, d.benefit, d.contribution_npv, d.benefit_npv)});

      //reset the domain of the coordinate calculators
      var yrarr=model.history.map(
          function(d) { 
              return d.year; 
          }
      );
      //assign year array to x domain...
      x.domain(yrarr);
      //and assign maximum value from current history to the y domain
      y.domain([0, mxValue]);
      //else  y.domain([0, Math.max(model.annuityCost,model.contributionNPV )*1.2]);
      
      //determine boundaries of x axis..
      xmin=d3.min(x.domain());
      xmax=d3.max(x.domain());
      
      //draw axis
      drawAxis();
    }

    this.smallScale = function(){
      this.drawScale(false)
    }

    this.fullScale = function(){
      this.drawScale(true)
    }

    //use model.salaryHistory to draw graph...
    this.obsrender=function(model_data, showNPV){//model_data is the scope object with various year and salary properties...
        //set model_data to scope object
        model=model_data;
        //if ns is hidden, we need to show it to be able to render things like text properly
        // so we will slide off the page, show and then slide back and hide at the bottom of this script
        var isHidden=(ns.hasClass("ng-hide"));
        var hlft,hpos;
        if(isHidden) {
            hlft=ns.css("margin-left");
            hpos=ns.css("position");
            ns.css("position", "absolute");
            ns.css("margin-left","2500px");
            ns.removeClass("ng-hide");
        }

        var mxValue;
        if(showNPV) mxValue=d3.max(model.history,function(d){return Math.max(d.contributionFund, d.benefitFund, d.contributionFund_npv, d.benefitFund_npv)});
        else  mxValue=d3.max(model.history,function(d){return Math.max(d.salary, d.benefit, d.contribution_npv, d.benefit_npv)});

        //reset the domain of the coordinate calculators
        var yrarr=model.history.map(
            function(d) { 
                return d.year; 
            }
        );
        //assign year array to x domain...
        x.domain(yrarr);
        //and assign maximum value from current history to the y domain
        y.domain([0, mxValue]);
        //else  y.domain([0, Math.max(model.annuityCost,model.contributionNPV )*1.2]);
        
        //determine boundaries of x axis..
        xmin=d3.min(x.domain());
        xmax=d3.max(x.domain());
        
        //draw axis
        drawAxis();

        if(isHidden) {
            ns.css("position", hpos);
            ns.css("margin-left",hlft);
            ns.addClass("ng-hide")
        }
    };//end render...
    var render=this.render;//makes it available internally...

    this.drawGraph = function(showNPV){
//        drawSalaryBars();
      drawContributionBars();
      drawSalaryBars();
      //draw benefits
      drawBenefitBars();
//        drawRetirementYear();
      //drawBarEditor();
      if(showNPV){
          drawContributionFundLine();
          //draw benefits
          drawBenefitFundLine();
          //draw percent self funded
          drawPctSelfFunded();
      }
      //draw npv contributions
    }

    var drawAxis=function(){
        //need to call the axis setup scripts again
        axes.selectAll(".x.axis").call(xAxis);
        axes.selectAll(".y.axis").call(yAxis);
        
        $("g.x g.tick text").show();
        //adjust ticks when more than 25 years, skip odd ticks...
        if(xmax-xmin>25) $("g.x g.tick text:odd").hide();
    };
    
    var drawBenefitBars=function(){
        //get the collection of bars that already exist (if any) and attach model.salaryHistory to it...
        var bars=svg.selectAll(".bbar")
          .data(model.history);
        //then reset the shape and title of each existing bar based on new data...
        bars.attr("x", function(d) { return x(d.year); })
          .classed("future",function(d,i){
              //this guy will set or remove the class "future" depending on whether the function returns true... 
              //this is how we change the appearance of future bars as opposed to existing bars...
              if(d.year>currYear) return true; 
              else return false;
          })
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d.benefit); })
          .attr("title", function(d) { return "Benefit: "+ cformat(d.benefit)+(currYear<d.year?" (estimated)":""); })
          .attr("height", function(d) { return height - y(d.benefit); });
        //same as above except that the enter() applies only when there is more data than existing bars... 
        //so for each new data point it gets a rect tag appended and all the shape and title settings appied...
        bars.enter().append("rect")
          .attr("class", "bbar")
          .attr("x", function(d) { return x(d.year); })
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d.benefit); })
          .attr("height", function(d) { return height - y(d.benefit); })
          .classed("future",function(d){if(d.year>currYear) return true; else return false;})
          .append("title")
          .text( function(d) { return "Benefit: "+ cformat(d.benefit)+(currYear<d.year?" (estimated)":""); })
          ;
        // and when there are more existing bars than data, exit() is appied and it removes the bar...
        bars.exit().remove();
    };//end of drawSalaryBars

    var drawSalaryBars=function(){
        //get the collection of bars that already exist (if any) and attach model.salaryHistory to it...
        var bars=svg.selectAll(".sbar")
          .data(model.history);
        //then reset the shape and title of each existing bar based on new data...
        bars.attr("x", function(d) { return x(d.year); })
          .classed("future",function(d,i){
              //this guy will set or remove the class "future" depending on whether the function returns true... 
              //this is how we change the appearance of future bars as opposed to existing bars...
              if(d.year>currYear) return true; 
              else return false;
          })
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d.salary); })
          .attr("title", function(d) { return "Salary: "+cformat(d.salary)+", Contribution: "+ cformat(d.contribution)+(currYear<d.year?" (estimated)":""); })
          .attr("height", function(d) { return height - y(d.salary); });
        //same as above except that the enter() applies only when there is more data than existing bars... 
        //so for each new data point it gets a rect tag appended and all the shape and title settings appied...
        bars.enter().append("rect")
          .attr("class", "sbar")
          .attr("x", function(d) { return x(d.year); })
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d.salary); })
          .attr("height", function(d) { return height - y(d.salary); })
          .classed("future",function(d){if(d.year>currYear) return true; else return false;})
          .append("title")
          .text( function(d) { return "Salary: "+cformat(d.salary)+", Contribution: "+ cformat(d.contribution)+(currYear<d.year?" (estimated)":""); });
        // and when there are more existing bars than data, exit() is appied and it removes the bar...
        bars.exit().remove();
        
    };//end of drawSalaryBars

    var drawContributionBars=function(){
        //get the collection of bars that already exist (if any) and attach model.salaryHistory to it...
        var bars=svg.selectAll(".cbar")
          .data(model.history);
        //then reset the shape and title of each existing bar based on new data...
        bars.attr("x", function(d) { return x(d.year); })
          .classed("future",function(d,i){
              //this guy will set or remove the class "future" depending on whether the function returns true... 
              //this is how we change the appearance of future bars as opposed to existing bars...
              if(d.year>currYear) return true; 
              else return false;
          })
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d.contribution); })
          .attr("title", function(d) { return "Contribution: "+ cformat(d.contribution)+(currYear<d.year?" (estimated)":""); })
          .attr("height", function(d) { return height - y(d.contribution); });
        //same as above except that the enter() applies only when there is more data than existing bars... 
        //so for each new data point it gets a rect tag appended and all the shape and title settings appied...
        bars.enter().append("rect")
          .attr("class", "cbar")
          .attr("x", function(d) { return x(d.year); })
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d.contribution); })
          .attr("height", function(d) { return height - y(d.contribution); })
          .classed("future",function(d){if(d.year>currYear) return true; else return false;})
          .append("title")
          .text( function(d) { return "Contribution: "+ cformat(d.contribution)+(currYear<d.year?" (estimated)":""); });
        // and when there are more existing bars than data, exit() is appied and it removes the bar...
        bars.exit().remove();
        
    };//end of drawContributionBars
    
    var getLineHoverYear = function(x_screen, x_domain){
      var leftEdgeArray=x_domain.range();
      for(var i=1;i<leftEdgeArray.length;i++){
        if(x_screen<leftEdgeArray[i]) return x_domain.domain()[i-1]
      }
      return "";
    }

    var mMove=function(id, msg){
      return function(){
         var curentValue = cformat(Math.round(y.invert(d3.mouse(this)[1])));
         var currentYear = getLineHoverYear(d3.mouse(this)[0], x);
         var tx= msg + ' ('+curentValue+', '+currentYear+')'
         d3.select("#"+id).select("title").text(tx);            
      }
    }

//http://webdesign.tutsplus.com/tutorials/how-to-use-animatetransform-for-inline-svg-animation--cms-22296
//for transition ideas...
    var labelShrinkingScale = function() {
      resize_coordinates(svg);
      resize_coordinates(axes);
    }

    var resize_coordinates = function(coordinate_area){

      fullScaleMaxValue=d3.max(model.history,function(d){return Math.max(d.contributionFund*2, d.benefitFund, d.contributionFund_npv*2, d.benefitFund_npv)});
      smallScaleMaxValue=d3.max(model.history,function(d){return Math.max(d.salary, d.benefit, d.contribution_npv, d.benefit_npv)});
      scaleProportion = smallScaleMaxValue/fullScaleMaxValue;
      scaledY = (Math.round(220/scaleProportion)-20)
      coordinate_area.append("animateTransform")
      .attr("attributeName", "transform")
      .attr("attributeType", "XML")
      .attr("type","scale")
      .attr("from","1 1")
      .attr("to","1 "+Math.round(scaleProportion*1000)/1000)
      .attr("begin","indefinite")
      .attr("dur","2s")
      .attr("additive", "sum")
      .attr("fill", "freeze")
      coordinate_area.append("animateTransform")
      .attr("attributeName", "transform")
      .attr("attributeType", "XML")
      .attr("type","translate")
      .attr("from","0 0")
      .attr("to","0 "+ scaledY)
      .attr("values", "0 0;0 0;0 "+scaledY)
      .attr("keyTimes", "0; 0.6; 1")
      .attr("begin","indefinite")
      .attr("dur","3s")
      .attr("additive", "sum")
      .attr("fill", "freeze")
      trans_nodes = coordinate_area.selectAll("animateTransform");
      for(var i=0; i<trans_nodes[0].length; i++){
        trans_nodes[0][i].beginElement();
      }
      var a = coordinate_area;
    }

    var hideLabelShrinkingScale = function(){

    }

    var drawBenefitFundLine=function(){

        var lineFunc=d3.svg.line()
            .x(function(d){ return x(d.year);})
            .y(function(d){ return y(d.benefitFund);})
            .interpolate('linear');
        svg.append('svg:path')
            .attr('d', lineFunc(model.history.slice(model.person.retirementYear-model.person.hireYear,model.history.length)))
            .attr('stroke', '#c33')
            .attr('stroke-width',3)
            .attr('fill','none')
            .attr('id', 'benefitFund')
            .on("mousemove", mMove('benefitFund','Value of my annuity fund plus investment returns as it gets drawn down'))
            .append("title");
        drawLabel(model.yearOfRetirement, model.benefitFund, (model.pctFunded>90 ? 'right' : 'left'), 180, "Total Benefit " + cformat(model.benefitFund) + "\n(aka Value of Pension)", "tblabel", true)
    };//end of drawBenefitFundLine

    var drawContributionFundLine=function(){
        var lineFunc=d3.svg.line()
            .x(function(d){ return x(d.year);})
            .y(function(d){ return y(d.contributionFund);})
            .interpolate('linear');
        svg.append('svg:path')
            .attr('d', lineFunc(model.history.slice(0,model.person.retirementYear-model.person.hireYear+1)))
            .attr('stroke', '#3c3')
            .attr('stroke-width',3)
            .attr('fill','none')
            .attr('id', 'contributionFund')
            .on("mousemove", mMove('contributionFund','Value of my accumulated contributions plus investment returns'))
            .append("title");
        drawLabel(model.yearOfRetirement, model.contributionFund, (model.pctFunded>90 ? 'left' : 'right'), 180, "Total Contribution " + cformat(model.contributionFund), "tclabel", true)
    };

    var drawMatching401KLine=function(){
        //draw matching line...
        var lineFunc2=d3.svg.line()
            .x(function(d){ return x(d.year);})
            .y(function(d){ return y(d.contributionFund*2);})
            .interpolate('linear');
        svg.append('svg:path')
            .attr('d', lineFunc2(model.history.slice(0,model.person.retirementYear-model.person.hireYear+1)))
            .attr('stroke', '#3c3')
            .attr('stroke-width',1)
            .attr('fill','none')
            .attr('stroke-dasharray',("3,3"))
            .attr('id', 'contributionFundx1')
            .on("mousemove", mMove('contributionFundx1','1x - If the state matched your contributions'))
            .append("title");
        drawLabel(model.yearOfRetirement, model.contributionFund*2, 'right', 180, "Hypothetical 401k Value " + cformat(model.contributionFund*2), "2xlabel", true)

    };//end of drawBenefitFundLine

    var drawPctSelfFunded=function(){
        //get the bar that already exists (if any) and attach model.total_benefits and total_contributuions
        var bars=svg.selectAll(".tbbar")
          .data([model]);
        //then reset the shape and title of each existing bar based on new data...
        bars.attr("x", function(d) { return x(d.yearOfRetirement); })
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d.benefitFund); })
          .attr("title", function(d) { return "Total Benefit: "+ cformat(d.benefitFund); })
          .attr("height", function(d) { return height - y(d.benefitFund); });
        //same as above except that the enter() applies only when there is more data than existing bars... 
        //so for each new data point it gets a rect tag appended and all the shape and title settings appied...
        bars.enter().append("rect")
          .attr("class", "tbbar")
          .attr("x", function(d) { return x(d.yearOfRetirement); })
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d.benefitFund); })
          .attr("height", function(d) { return height - y(d.benefitFund); })
          .append("title")
          .text( function(d) { return "Total Benefit: "+ cformat(d.benefitFund); });
        // and when there are more existing bars than data, exit() is appied and it removes the bar...
        bars.exit().remove();
        
        //get the bar that already exists (if any) and attach model.total_benefits and total_contributuions
        var bars=svg.selectAll(".tcbar")
          .data([model]);
        //then reset the shape and title of each existing bar based on new data...
        bars.attr("x", function(d) { return x(d.yearOfRetirement); })
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d.contributionFund); })
          .attr("title", function(d) { return "Total Benefit: "+ cformat(d.contributionFund); })
          .attr("height", function(d) { return height - y(d.contributionFund); });
        //same as above except that the enter() applies only when there is more data than existing bars... 
        //so for each new data point it gets a rect tag appended and all the shape and title settings appied...
        bars.enter().append("rect")
          .attr("class", "tcbar")
          .attr("x", function(d) { return x(d.yearOfRetirement); })
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d.contributionFund); })
          .attr("height", function(d) { return height - y(d.contributionFund); })
          .append("title")
          .text( function(d) { return "Total Benefit: "+ cformat(d.contributionFund); });
        // and when there are more existing bars than data, exit() is appied and it removes the bar...
        bars.exit().remove();

        svg.selectAll(".tclabel").remove();
        drawLabel(model.yearOfRetirement, model.contributionFund, (model.pctFunded>90 ? 'left' : 'right'), 180, "Percent Self Funded: " + model.pctFunded + "% \nTotal Contribution " + cformat(model.contributionFund), "tclabel", true)
        
    };//end of drawPctSelfFunded
    
    var drawLabel=function(year, ammount, position, width, label, classname, line){
      //given a year and amount, draw a label either to the 'left' or 'right' of that bar
      //with an optional line... 
      if(!classname) classname = label.replace(" ", "_");
      if(!width) width = 80;
      positionIncrement = 1;
      if(position == 'left') positionIncrement = -1;
//      $("." + classname).remove();
      if(line){
        svg.append("line").attr("class",classname)
           .attr("x1", x(year+positionIncrement)+positionIncrement)
           .attr("y1", y(ammount))
           .attr("x2", x(year + positionIncrement) + positionIncrement * x.rangeBand())
           .attr("y2", y(ammount))
           .attr("stroke","steelblue")
           .attr("stroke-width","3")
           .style("stroke-dasharray",("3, 3"));
      }
      //and the text
      svg.append("text").attr("class", classname)
        .attr("x", x(year + positionIncrement) + positionIncrement * (x.rangeBand() + 10))
        .attr("y", y(ammount))
        .attr("fill","steelblue")
        .attr("dy",".7em")
        .style("text-anchor", position == "left" ? "end" : "start")
        .text(label)
        .call(wrap, width);//see the utility function 'wrap' below, this is not native to d3...
          
    }//this is the end drawRetirementYear


    var drawAvgFinalSalary=function(){
        //draw avg salary line
        $(".avsal").remove();
        svg.append("line").attr("class","avsal")
           .attr("x1",x(model.avgYr)-50/(xmax-xmin))
           .attr("y1",y(model.finalAverageSalary))
           .attr("x2",width+margin.right)
           .attr("y2",y(model.finalAverageSalary))
           .attr("stroke","red")
           .attr("stroke-width","3")
           .style("stroke-dasharray",("3, 3"));
        //and the text
        svg.append("text").attr("class","avsal")
          .attr("x", width)
          .attr("y",y(model.finalAverageSalary)-10)
          .attr("fill","red")
          .attr("dy",".7em")
          .style("text-anchor", "start")
          .text("Average Final Salary "+cformat(model.finalAverageSalary))
          .call(wrap, 40);//see the utility function 'wrap' below, this is not native to d3...
          
    }//this is the end drawAvgFinalSalary
    var drawTotalContribution=function(){
        //draw avg salary line
        var totContribution=0;
        var lastContribution=0;
        for(var i=0;i<model.salaryHistory.length;i++){
            lastContribution=model.salaryHistory[i].contribution;
            totContribution+=lastContribution;
        };
        $(".totcontr").remove();
        svg.append("line").attr("class","totcontr")
           .attr("x1",x(model.salaryHistory[model.salaryHistory.length-1].year))
           .attr("y1",y(lastContribution))
           .attr("x2",width+margin.right)
           .attr("y2",y(lastContribution))
           .attr("stroke","#6c6")
           .attr("stroke-width","3")
           .style("stroke-dasharray",("3, 3"));
        //and the text
        svg.append("text").attr("class","avsal")
          .attr("x", width)
          .attr("y",y(lastContribution)-50)
          .attr("fill","#6c6")
          .attr("dy",".7em")
          .style("text-anchor", "start")
          .text("Total Contribution "+cformat(totContribution))
          .call(wrap, 40);//see the utility function 'wrap' below, this is not native to d3...
          
    }//this is the end drawTotalContribution
    var drawRetirementYear=function(){
        $(".retyear").remove();
        svg.append("line").attr("class","retyear")
           .attr("x1",x(retirementYear+1)+1)
           .attr("y1",0)
           .attr("x2",x(retirementYear+1)+1)
           .attr("y2",y(0))
           .attr("stroke","steelblue")
           .attr("stroke-width","3")
           .style("stroke-dasharray",("3, 3"));
        //and the text
        svg.append("text").attr("class","retyear")
          .attr("x", x(retirementYear+1)+10)
          .attr("y",-20)
          .attr("fill","steelblue")
          .attr("dy",".7em")
          .style("text-anchor", "start")
          .text("Retirement Year: "+retirementYear)
          .call(wrap, 60);//see the utility function 'wrap' below, this is not native to d3...
          
    }//this is the end drawRetirementYear


    var drawContributions=function(){};
    var drawBenefits=function(){};
    var drawNPVContributions=function(){};
    var drawNPVBenefits=function(){};

    //set up global variables...
    var margin = {top: 20, right: 80, bottom: 30, left: 65},
        width = 860 - margin.left - margin.right,
        height =300 - margin.top - margin.bottom;

    //scale is a very clever d3 function where you set 
    //- your scale type 1) ordinal is discreet values like years or 2)  linear is continuous values like salary...
    //- range is the boundary of your plot in pixels
    //- later we will set the domain on each scale as the range of values that maps to the range of pixels
    //     so for x the domain is first year to last year
    //     and for y the domain is 0 to max salary
    //then the scale object can be used to caculate pixel coordinates for any year and any salary
    //  like x(2018) will give the x coordinate for the bar associated with the year 2018
    //  and y(50000) will give the y ooordinate for the bar with salary of $50,000
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    //functions to set up axes...
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(function(d,i){
            if(Math.round(d/5)*5==d) return d;
            else return "";
        });

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10, "$");

    //set up graphing space...
    var cnvs = d3.select(nodeSelector).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    cnvs.append("rect")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("fill","#e5e5e5")
        .attr("stroke","#e5e5e5");
    //svg is the drawing surface...
    var svg=cnvs.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    //axes is the drawn axes for the drawing surface
    //  we separate the drawn axes from the drawing surface simply to make it easier to redraw svg
    var axes=cnvs.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    //set up bar editor menu...
    var be=cnvs.append("g")
        .attr("id","barEditor")
        .style("visibility","hidden");

    //one time only, draw the axes on the graphing space... based on any data that exists...
    this.setup= function() {
//        var data=[];
  //    x.domain(data.map(function(d) { return d.year; }));
    //  y.domain([0, d3.max(data, function(d) { return d.salary; })]);

      axes.selectAll("*").remove();
      axes.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      axes.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Actual Value");


    };

    this.drawContributionBars = drawContributionBars;
    this.drawSalaryBars = drawSalaryBars;
    this.drawBenefitBars = drawBenefitBars;
    this.drawContributionFundLine = drawContributionFundLine;
    this.drawBenefitFundLine = drawBenefitFundLine;
    this.drawPctSelfFunded = drawPctSelfFunded;
    this.drawMatching401KLine = drawMatching401KLine;
    this.labelShrinkingScale = labelShrinkingScale;
    this.hideLabelShrinkingScale = hideLabelShrinkingScale;
}

