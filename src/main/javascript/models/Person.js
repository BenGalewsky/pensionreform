var pension = pension || {};
pension.person = function() {	
	var that = {
			hireDate : {},
			birthDate : {},
			initialSalary : {},
			currentSalary : {},	
			ageAtRetirement : {},
			salaryHistory : {},
			occupation: {},
			useAlternativeFormula: false,
			isCoveredBySocialSecurity: false,
			
			getYearsOfSvcAtDate: function(d){
				var years = d.getYear() - this.hireDate.getYear();    
			    return years;	
			},

			getYearsAtRetirement: function(){
				var dateOfRetirement = this.birthDate.addYears(this.ageAtRetirement);
				return this.getYearsOfSvcAtDate(dateOfRetirement);
			},

			getRetirementYear: function(){
				var dateOfRetirement = this.birthDate.addYears(this.ageAtRetirement);
				return dateOfRetirement.getYear();
			},

			// Estimate the employee's salary at any given year of their tenure
			// We know three points: Their initial salary, their current salary and their
			// estimated final average salary. 
			// Pass in an optional simDate to establish what date "current" is relative
			// to their salary history.
			getSalaryAtYear: function(yearOfSvc, simDate){
				// How many years of service today?
				simDate = simDate || new Date();
				
				simDate = new PC.Date(simDate);
				var currentYears = this.getYearsOfSvcAtDate(simDate);
				var yearsAtRetirement = this.getYearsAtRetirement();
				
				// Have they already retired?
				if(yearOfSvc > yearsAtRetirement){
					return 0;
				}
				
				// Prepare for interpolation
				var x0 = 0;
				var x1 = 0;
				var y0 = 0;
				var y1 = 0;
				
				
				// Is this year in the past? If so then interpolate between intial salary and current
				if(yearOfSvc <= currentYears){
					x1 = currentYears;
					y0 = this.initialSalary;
					y1 = this.currentSalary;		
				}else{ // Interpolate between current and final
					x0 = currentYears;
					x1 = yearsAtRetirement;
					y0 = this.currentSalary;
					y1 = this.finalAverageSalary;		
				}
				

				// Default value
				var x = y1;		

				// Avoid divide by zero
				if(x1 != yearOfSvc){
					x = y0 + (y1 - y0) * ((yearOfSvc - x0) / (x1 - yearOfSvc));
				}
				return x;
					
					
				},
				
				generateDefaultSalaryHistory: function(aCurrentDate){
                    //take starting, current, and ending salary info and convert to salary history array
                    // also compute final average in 4 best of last 10 years..
                        this.salaryHistory=[];

                        if (typeof aCurrentDate === "undefined") {
                        	aCurrentDate = new PC.Date( new Date() );
                        }

                        //calculate start to current ...
                        var yr1 = aCurrentDate.getYear();
                        var yr0 = this.hireDate.getYear();
                        
                        var s1=this.currentSalary, s0=this.startingSalary;
                        
                        // but only if current is less than ending year...
                        if(aCurrentDate.getYear() <=this.getRetirementYear()){
                            for(var i=yr0;i<yr1;i++){
                                var sal=s0+(i-yr0)/(yr1-yr0)*(s1-s0);
                                this.salaryHistory.push({"year":i,"salary":sal,"yearsOfService":1});   
                            };
                            //move current to start...
                            yr0=yr1;
                            s0=s1;
                        };
                        //now calculate from start (or current) to ending year...
                        yr1=this.getRetirementYear();
                        s1=this.endingSalary;
                        for(var i=yr0;i<=yr1;i++){
                            var sal=s0;
                            if(yr1!=yr0) sal=s0+(i-yr0)/(yr1-yr0)*(s1-s0);
                            this.salaryHistory.push({"year":i,"salary":sal,"yearsOfService":1});
                        };
                        this.computeFinalAverageSalary();
                    },		
                    
                    computeFinalAverageSalary:function(){
                        //calculate the average best 4 years in last 10...
                        var last10yrs=this.salaryHistory.slice(-10);
                        last10yrs.sort(function(a,b){return a.salary-b.salary;});
                        last10yrs=last10yrs.slice(-4);
                        this.avgYr=0;// avgYr and this.finalAverage become the first coordinates of the finalAverageSalary Line on the graph...
                        this.finalAverage=0;
                        for(var i=0;i<last10yrs.length;i++){
                            this.avgYr+=last10yrs[i].year;
                            this.finalAverage+=last10yrs[i].salary;
                        };
                        this.finalAverage=Math.round(this.finalAverage/last10yrs.length);
                        this.avgYr=Math.round(this.avgYr/last10yrs.length);                       
                    }                    
			
				
			
	};
	
	return that;
	
};