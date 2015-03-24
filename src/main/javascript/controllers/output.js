OutputGraph=function(nodeSelector){//ie... "#contributionsGraph"
    //if showNPV then show contribution bars and benefit bars but drop text for those.. .and show NPV text and lines
    //otherwise, just show bars and text in full scale, don't show NPV lines...
    var ns=$(nodeSelector);
    
    //cformat converts number to formatted currency string...
    var cformat=d3.format("$,.3r");
   
    // current scope object... gets set in render function... but is made globally available...
    var v={};
    var xmax=0;
    var xmin=0;
    var retirementYear;
    var dt=new Date();
    var currYear=dt.getFullYear();
    
    
    //use v.salaryHistory to draw graph...
    this.render=function(scope, showNPV){//v is the scope object with various year and salary properties...
        //set v to scope object
        v=scope;
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
        if(showNPV) mxValue=d3.max(v.models.current.history,function(d){return Math.max(d.contributionFund, d.benefitFund, d.contributionFund_npv, d.benefitFund_npv)});
        else  mxValue=d3.max(v.models.current.history,function(d){return Math.max(d.salary, d.benefit, d.contribution_npv, d.benefit_npv)});

        //reset the domain of the coordinate calculators
        var yrarr=v.models.current.history.map(
            function(d) { 
                return d.year; 
            }
        );
        //assign year array to x domain...
        x.domain(yrarr);
        //and assign maximum value from current history to the y domain
        y.domain([0, mxValue]);
        //else  y.domain([0, Math.max(v.models.current.annuityCost,v.models.current.contributionNPV )*1.2]);
        
        //determine boundaries of x axis..
        xmin=d3.min(x.domain());
        xmax=d3.max(x.domain());
        
        //draw axis
        drawAxis();
        //draw salary bars
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
        }
        //draw npv contributions
        if(isHidden) {
            ns.css("position", hpos);
            ns.css("margin-left",hlft);
            ns.addClass("ng-hide")
        }
    };//end render...
    var render=this.render;//makes it available internally...
    
    var drawAxis=function(){
        //need to call the axis setup scripts again
        svg.selectAll(".x.axis").call(xAxis);
        svg.selectAll(".y.axis").call(yAxis);
        
        $("g.x g.tick text").show();
        //adjust ticks when more than 25 years, skip odd ticks...
        if(xmax-xmin>25) $("g.x g.tick text:odd").hide();
    };
    
    var drawBenefitBars=function(){
        //get the collection of bars that already exist (if any) and attach v.salaryHistory to it...
        var bars=svg.selectAll(".bbar")
          .data(v.models.current.history);
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
        //get the collection of bars that already exist (if any) and attach v.salaryHistory to it...
        var bars=svg.selectAll(".sbar")
          .data(v.models.current.history);
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
        //get the collection of bars that already exist (if any) and attach v.salaryHistory to it...
        var bars=svg.selectAll(".cbar")
          .data(v.models.current.history);
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

    var drawBenefitFundLine=function(){

        var lineFunc=d3.svg.line()
            .x(function(d){ return x(d.year);})
            .y(function(d){ return y(d.benefitFund);})
            .interpolate('linear');
        svg.append('svg:path')
            .attr('d', lineFunc(v.models.current.history.slice(v.models.current.person.retirementYear-v.models.current.person.hireYear,v.models.current.history.length)))
            .attr('stroke', '#c33')
            .attr('stroke-width',3)
            .attr('fill','none')
            .attr('id', 'benefitFund')
            .on("mousemove", mMove('benefitFund','Value of my annuity fund plus investment returns as it gets drawn down'))
            .append("title");
    };//end of drawBenefitFundLine

    var drawContributionFundLine=function(){
        var lineFunc=d3.svg.line()
            .x(function(d){ return x(d.year);})
            .y(function(d){ return y(d.contributionFund);})
            .interpolate('linear');
        svg.append('svg:path')
            .attr('d', lineFunc(v.models.current.history.slice(0,v.models.current.person.retirementYear-v.models.current.person.hireYear+1)))
            .attr('stroke', '#c33')
            .attr('stroke-width',3)
            .attr('fill','none')
            .attr('id', 'contributionFund')
            .on("mousemove", mMove('contributionFund','Value of my accumulated contributions plus investment returns'))
            .append("title");
            
        //draw matching lines...
        var lineFunc2=d3.svg.line()
            .x(function(d){ return x(d.year);})
            .y(function(d){ return y(d.contributionFund*2);})
            .interpolate('linear');
        svg.append('svg:path')
            .attr('d', lineFunc2(v.models.current.history.slice(0,v.models.current.person.retirementYear-v.models.current.person.hireYear+1)))
            .attr('stroke', '#c33')
            .attr('stroke-width',1)
            .attr('fill','none')
            .attr('stroke-dasharray',("3,3"))
            .attr('id', 'contributionFundx1')
            .on("mousemove", mMove('contributionFundx1','1x - If the state matched your contributions'))
            .append("title");
        var lineFunc3=d3.svg.line()
            .x(function(d){ return x(d.year);})
            .y(function(d){ return y(d.contributionFund*3);})
            .interpolate('linear');
        svg.append('svg:path')
            .attr('d', lineFunc3(v.models.current.history.slice(0,v.models.current.person.retirementYear-v.models.current.person.hireYear+1)))
            .attr('stroke', '#c33')
            .attr('stroke-width',1)
            .attr('fill','none')
            .attr('stroke-dasharray',("3,6"))
            .attr('id', 'contributionFundx2')
            .on("mousemove", mMove('contributionFundx2','2x - If the state matched 2x your contributions'))
            .append("title");

    };//end of drawBenefitFundLine


    var drawAvgFinalSalary=function(){
        //draw avg salary line
        $(".avsal").remove();
        svg.append("line").attr("class","avsal")
           .attr("x1",x(v.avgYr)-50/(xmax-xmin))
           .attr("y1",y(v.finalAverageSalary))
           .attr("x2",width+margin.right)
           .attr("y2",y(v.finalAverageSalary))
           .attr("stroke","red")
           .attr("stroke-width","3")
           .style("stroke-dasharray",("3, 3"));
        //and the text
        svg.append("text").attr("class","avsal")
          .attr("x", width)
          .attr("y",y(v.finalAverageSalary)-10)
          .attr("fill","red")
          .attr("dy",".7em")
          .style("text-anchor", "start")
          .text("Average Final Salary "+cformat(v.finalAverageSalary))
          .call(wrap, 40);//see the utility function 'wrap' below, this is not native to d3...
          
    }//this is the end drawAvgFinalSalary
    var drawTotalContribution=function(){
        //draw avg salary line
        var totContribution=0;
        var lastContribution=0;
        for(var i=0;i<v.salaryHistory.length;i++){
            lastContribution=v.salaryHistory[i].contribution;
            totContribution+=lastContribution;
        };
        $(".totcontr").remove();
        svg.append("line").attr("class","totcontr")
           .attr("x1",x(v.salaryHistory[v.salaryHistory.length-1].year))
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
    var svg=cnvs.append("g")
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

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Actual Value");


    };
    
}

