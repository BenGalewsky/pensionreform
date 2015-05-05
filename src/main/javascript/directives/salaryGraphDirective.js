pensionApp.directive("salaryGraph", function(){
  function link($scope, element, attrs){
    var salaryGraph=new SalaryGraph(element[0]);
    salaryGraph.setup();
    salaryGraph.render($scope.vals);
    $scope.$on("reviseSalaryGraph", function(event){ salaryGraph.render($scope.vals)})
    $scope.$on("salaryGraphEditBar", function(event, yearArray){ salaryGraph.bar_edit_show(yearArray)})
  }
  return {
    link: link, 
    restrict: 'E'
  }
})

SalaryGraph=function(nodeSelector){//ie... "#contributionsGraph"
    var ns=$(nodeSelector);
    
    //cformat converts number to formatted currency string...
    var cformat=d3.format("$,.3r");
   
    // current scope object... gets set in render function... but is made globally available...
    var v={};
    var xmax=0;
    var xmin=0;
    var retirementYear;
    
    //use v.salaryHistory to draw graph...
    this.render=function(scope){//v is the scope object with various year and salary properties...
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


        //reset the domain of the coordinate calculators
        var yrarr=v.salaryHistory.map(
            function(d) { 
                return d.year; 
            }
        );
        retirementYear=v.birthYear+v.ageAtRetirement;
        // add a couple more years or out to retirement date if it is less than current year...
        var mxyr=yrarr[yrarr.length-1];
        for(var j=mxyr+1;j<Math.max(mxyr+3,retirementYear+3,v.currentYear+3);j++){
            yrarr.push(j);
        }
//        yrarr.push(yrarr[yrarr.length-1]+1);
  //      yrarr.push(yrarr[yrarr.length-1]+1);
        //assign year array to x domain...
        x.domain(yrarr);
        y.domain([0, d3.max(v.salaryHistory, function(d) { return d.salary*1.2; })]);
        
        //determine boundaries of x axis..
        xmin=d3.min(x.domain());
        xmax=d3.max(x.domain());
        
        //draw axis
        drawAxis();
        //draw salary bars
        drawSalaryBars();
        drawContributionBars();
        drawBarEditor();
        //draw Average final salary text
        drawAvgFinalSalary();
        //draw contributions
        drawContributions();
        drawTotalContribution();
        drawRetirementYear();
        //draw benefits
        drawBenefits();
        //draw npv contributions
        drawNPVContributions();
        //draw NPV benefits
        drawNPVBenefits();
        if(isHidden) {
            ns.css("position", hpos);
            ns.css("margin-left",hlft);
            ns.addClass("ng-hide")
        }
    };
    var render=this.render;//makes it available internally...
    
    var drawAxis=function(){
        //need to call the axis setup scripts again
        svg.selectAll(".x.axis").call(xAxis);
        svg.selectAll(".y.axis").call(yAxis);
        
        $("g.x g.tick text").show();
        //adjust ticks when more than 25 years, skip odd ticks...
        if(xmax-xmin>25) $("g.x g.tick text:odd").hide();
    };
    var drawSalaryBars=function(){
        //get the collection of bars that already exist (if any) and attach v.salaryHistory to it...
        var bars=svg.selectAll(".bar")
          .data(v.salaryHistory);
        //then reset the shape and title of each existing bar based on new data...
        bars.attr("x", function(d) { return x(d.year); })
          .classed("future",function(d,i){
              //this guy will set or remove the class "future" depending on whether the function returns true... 
              //this is how we change the appearance of future bars as opposed to existing bars...
              var dt=new Date();
              if(d.year>dt.getFullYear()) return true; 
              else return false;
          })
          .attr("width", function(d){return x.rangeBand()*d.yearsOfService;})
          .attr("y", function(d) { return y(d.salary); })
          .attr("title", function(d) { var dt=new Date(); return "Salary: "+ cformat(d.salary)+(dt.getFullYear()<d.year?" (estimated)":""); })
          .attr("height", function(d) { return height - y(d.salary); });
        //same as above except that the enter() applies only when there is more data than existing bars... 
        //so for each new data point it gets a rect tag appended and all the shape and title settings appied...
        bars.enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.year); })
          .attr("width", function(d){return x.rangeBand()*d.yearsOfService;})
          .attr("y", function(d) { return y(d.salary); })
          .attr("title", function(d) { var dt=new Date(); return "Salary: "+ cformat(d.salary)+(dt.getFullYear()<d.year?" (estimated)":""); })
          .attr("height", function(d) { return height - y(d.salary); })
          .classed("future",function(d){var dt=new Date();if(d.year>dt.getFullYear()) return true; else return false;});
        // and when there are more existing bars than data, exit() is appied and it removes the bar...
        bars.exit().remove();
        
        $(".bar").click(function(){
            //set bar edit to show the current year...
                v.salaryHistoryEditYear=bar_edit_last_index[0];
                v.salaryHistoryEditIndex=bar_edit_last_index[1];
                v.$apply();
                bar_edit_show(bar_edit_last_index);
            
        })
    };//end of drawSalaryBars

    var drawContributionBars=function(){
        //get the collection of bars that already exist (if any) and attach v.salaryHistory to it...
        var bars=svg.selectAll(".cbar")
          .data(v.salaryHistory);
        //then reset the shape and title of each existing bar based on new data...
        bars.attr("x", function(d) { return x(d.year); })
          .classed("future",function(d,i){
              //this guy will set or remove the class "future" depending on whether the function returns true... 
              //this is how we change the appearance of future bars as opposed to existing bars...
              var dt=new Date();
              if(d.year>dt.getFullYear()) return true; 
              else return false;
          })
          .attr("width", function(d){return x.rangeBand()*d.yearsOfService;})
          .attr("y", function(d) { return y(d.contribution); })
          .attr("title", function(d) { var dt=new Date(); return "Contribution: "+ cformat(d.contribution)+(dt.getFullYear()<d.year?" (estimated)":""); })
          .attr("height", function(d) { return height - y(d.contribution); });
        //same as above except that the enter() applies only when there is more data than existing bars... 
        //so for each new data point it gets a rect tag appended and all the shape and title settings appied...
        bars.enter().append("rect")
          .attr("class", "cbar")
          .attr("x", function(d) { return x(d.year); })
          .attr("width", function(d){return x.rangeBand()*d.yearsOfService;})
          .attr("y", function(d) { return y(d.contribution); })
          .attr("title", function(d) { var dt=new Date(); return "Contribution: "+ cformat(d.contribution)+(dt.getFullYear()<d.year?" (estimated)":""); })
          .attr("height", function(d) { return height - y(d.contribution); })
          .classed("future",function(d){var dt=new Date();if(d.year>dt.getFullYear()) return true; else return false;});
        // and when there are more existing bars than data, exit() is appied and it removes the bar...
        bars.exit().remove();
    };//end contribution bars...

    // a utility used below in drawBarEdit()...
    var bar_edit_last_index=[0,-1];
    var bar_edit_show=function(yr){//yr is an array [yr, i] where i is index of year in array...
        if(yr&&yr[0]>0){
            be.style("visibility","visible");
            //then add margin back in to position bareditor on cnvs...  and center it...
            be.attr("transform","translate("+Math.round(x(yr[0])+margin.left+x.rangeBand()/2-7.5)+", 0)");
            be.selectAll(".be_year").text(yr[0]);
            bar_edit_last_index=yr;
        }
        else be.style("visibility","hidden");
    }
    this.bar_edit_show=bar_edit_show;//make it public...
    
    var drawBarEditor=function(){
        cnvs.on("mousemove",function(){//we are observing mouse on the full canvas...
            var coordinates=d3.mouse(this);
            // get year from mouse position on svg.x=cnvs.x-margin.left
            var yr=ordinalInvert(coordinates[0]-margin.left,x);
            bar_edit_show(yr);
        })
        cnvs.on("mouseout",function(){
            bar_edit_show([v.salaryHistoryEditYear, v.salaryHistoryEditIndex]);
        });
        be.selectAll(".be_delete")
            .on("mouseover", function(){
                be.selectAll(".be_delete")
                    .attr("xlink:href","graphics/deleteOnE5.png")
            })
            .on("mouseout", function(){
                be.selectAll(".be_delete")
                    .attr("xlink:href","graphics/deleteOffE5.png")
            })
            .on("click", function(){
                v.salaryHistoryEditYear=bar_edit_last_index[0];
                v.salaryHistoryEditIndex=bar_edit_last_index[1];
                v.salaryHistory[bar_edit_last_index[1]].salary=0;
                v.salaryHistory[bar_edit_last_index[1]].contribution=0;
                v.salaryHistory[bar_edit_last_index[1]].yearsOfService=0;
                v.$apply();
                bar_edit_show(bar_edit_last_index);
                vals.computeFinalAverageSalary();
                render(vals);
            })
        be.selectAll(".be_edit")
            .on("mouseover", function(){
                be.selectAll(".be_edit")
                    .attr("xlink:href","graphics/editOnE5.png")
            })
            .on("mouseout", function(){
                be.selectAll(".be_edit")
                    .attr("xlink:href","graphics/editOffE5.png")
            })
            .on("click", function(){
                v.salaryHistoryEditYear=bar_edit_last_index[0];
                v.salaryHistoryEditIndex=bar_edit_last_index[1];
                v.$apply();
                bar_edit_show(bar_edit_last_index);
            })
    }
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
    var margin = {top: 20, right: 80, bottom: 30, left: 45},
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
        .orient("bottom");

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
    be.append("svg:image")
        .attr("class", "be_delete")
        .attr("xlink:href","graphics/deleteOffE5.png")
        .attr("width",15)
        .attr("height",15)
        .attr("y",20);
    be.append("svg:image")
        .attr("class", "be_edit")
        .attr("xlink:href","graphics/editOffE5.png")
        .attr("width",15)
        .attr("height",15)
        .attr("y",40);
    be.append("text")
        .attr("class","be_year")
        .attr("text-anchor", "middle")
        .attr("x",7.5)
        .attr("y",15);

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
          .text("Salary");


    };
    
}

//utilities... 

// to wrap text blocks...
function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", text.attr("x")).attr("y", y);
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", text.attr("x")).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        //console.log(tspan);
      }
    }
    //console.log("wrap done: "+text.text());
  });
}
// a patch to return ordinal invert values (mouse pos -> year)
function ordinalInvert(pos, scale) {
    var previous = [-1,-1];
    var domain = scale.domain();
    for(var idx in domain) {
        if(scale(domain[idx]) > pos) {
            return previous;
        }
        previous = [domain[idx],1*idx];
    }
    return previous;
}