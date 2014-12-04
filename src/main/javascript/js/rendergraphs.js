SalaryGraph=function(nodeSelector){//ie... "#contributionsGraph"
    
    
    //use v.salaryHistoryArray to draw graph...
    this.render=function(v){//v is the scope object with various year and salary properties...

        //reset the domain of the coordinate calculators
        x.domain(v.salaryHistoryArray.map(function(d) { return d.year; }));
        y.domain([0, d3.max(v.salaryHistoryArray, function(d) { return d.salary; })]);

        //cformat converts number to formatted currency string...
        var cformat=d3.format("$,.3r");
        //get the collection of bars that already exist (if any) and attach v.salaryHistoryArray to it...
        var bars=svg.selectAll(".bar")
          .data(v.salaryHistoryArray);
        //then reset the shape and title of each existing bar based on new data...
        bars.attr("x", function(d) { return x(d.year); })
          .classed("future",function(d,i){
              //this guy will set or remove the class "future" depending on whether the function returns true... 
              //this is how we change the appearance of future bars as opposed to existing bars...
              var dt=new Date();
              if(d.year>dt.getFullYear()) return true; 
              else return false;
          })
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d.salary); })
          .attr("title", function(d) { var dt=new Date(); return cformat(d.salary)+(dt.getFullYear()<d.year?" (estimated)":""); })
          .attr("height", function(d) { return height - y(d.salary); });
        //same as above except that the enter() applies only when there is more data than existing bars... 
        //so for each new data point it gets a rect tag appended and all the shape and title settings appied...
        bars.enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.year); })
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d.salary); })
          .attr("title", function(d) { var dt=new Date(); return cformat(d.salary)+(dt.getFullYear()<d.year?" (estimated)":""); })
          .attr("height", function(d) { return height - y(d.salary); })
          .classed("future",function(d){var dt=new Date();if(d.year>dt.getFullYear()) return true; else return false;});
        // and when there are more existing bars than data, exit() is appied and it removes the bar...
        bars.exit().remove();
        //need to call the axis setup scripts again
        svg.selectAll(".x.axis").call(xAxis);
        svg.selectAll(".y.axis").call(yAxis);
        
        //determine boundaries of x axis..
        var xmin=d3.min(x.domain());
        var xmax=d3.max(x.domain());

        //adjust ticks when more than 25 years, skip odd ticks...
        if(xmax-xmin>25) $("g.x g.tick text:odd").hide();
        else $("g.x g.tick text:odd").show();

        //draw avg salary line
        $(".avsal").remove();
        svg.append("line").attr("class","avsal")
           .attr("x1",x(v.avgYr)-50/(xmax-xmin))
           .attr("y1",y(v.finalAverage))
           .attr("x2",width+margin.right)
           .attr("y2",y(v.finalAverage))
           .attr("stroke","red")
           .attr("stroke-width","3")
           .style("stroke-dasharray",("3, 3"));
        //and the text
        svg.append("text").attr("class","avsal")
          .attr("x", width)
          .attr("y",y(v.finalAverage))
          .attr("fill","red")
          .attr("dy",".7em")
          .style("text-anchor", "start")
          .text("Average Final Salary "+cformat(v.finalAverage))
          .call(wrap, 40);//see the utility function 'wrap' below, this is not native to d3...
          
    }//this is the end of the render function

    //This is all one time setup stuff....
    var margin = {top: 20, right: 80, bottom: 30, left: 40},
        width = 860 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;

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
    var svg = d3.select(nodeSelector).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
      }
    }
  });
}
