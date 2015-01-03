var pension = pension || {};
var curryr=new Date();
pension.person = function(aEnv) {
        if(aEnv==undefined) aEnv=pension.environment();
	var that = {
                        env:aEnv,
			hireYear : 1994,
			birthYear : 1960,
			startingSalary : null,//to be calculated...
                        currentYear: curryr.getFullYear(),
			currentSalary : null,//to be calculated or entered...
                        endingYear: null,//to be calculated or entered...
                        endingSalary: null,//to be calculated or entered...
                        finalAverageSalary: 75000,
                        yearsOfService: null,//to be calculated or entered...
			ageAtRetirement : 65,
                        gender:'f',
			salaryHistory : [],
			occupation: "",
			useAlternativeFormula: false,
			isCoveredBySocialSecurity: false,
			
			getYearsOfSvcAtDate: function(y){
				var years = y - this.hireYear;    
			    return years;	
			},

			getYearsAtRetirement: function(){
				var yearOfRetirement = this.birthYear+this.ageAtRetirement;
				return this.getYearsOfSvcAtDate(yearOfRetirement);
			},

			getRetirementYear: function(){
				var dateOfRetirement = this.birthYear+this.ageAtRetirement;
				return dateOfRetirement;
			},

			// Estimate the employee's salary at any given year of their tenure
			// We know three points: Their initial salary, their current salary and their
			// estimated final average salary. 
			// Pass in an optional simYear to establish what date "current" is relative
			// to their salary history.
			getSalaryAtYear: function(yearOfSvc, simYear){
				// How many years of service today?
				simYear = simYear || curryr.getFullYear();
				
				//simYear = new PC.Date(simYear);
				var currentYears = this.getYearsOfSvcAtDate(simYear);
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
                        finalFromFinalAvgSalary:function(f,r){
                            //if s1=s0*(r)^yrs and we want to average the last four years then 
                            //  start with the final salary and go backwards with
                            //  
                            //  f=finalAvg=
                            return f*4/(Math.pow(r,-3)+Math.pow(r,-2)+Math.pow(r,-1)+1);
                        },
				
			generateDefaultSalaryHistory: function(aCurrentYear){
                            if (typeof aCurrentYear === "undefined") {
                                    aCurrentYear = curryr.getFullYear();
                            }
                            //take starting, current, and ending salary info and convert to salary history array
                            // also compute final average in 4 best of last 10 years..
                            this.salaryHistory=[];
                            
                            //estimate start, current, and ending year/salary if they are not provided...
                            yr1=this.getRetirementYear();//based on birthYear and RetirementAge
                            if(!this.endingYear) this.endingYear=yr1;
                            if(!this.endingSalary) this.endingSalary=Math.round(this.finalFromFinalAvgSalary(this.finalAverageSalary,(1+this.env.WAGE_INFLATION)));//assume average wage inflation of 4% for two years after the average
                            if(!this.yearsOfService) this.yearsOfService=this.endingYear-this.hireYear;
                            if(!this.startingSalary) this.startingSalary=Math.round(this.endingSalary/Math.pow((1+this.env.WAGE_INFLATION),this.yearsOfService));
                            if(aCurrentYear<=this.endingYear&&!this.currentSalary)  this.currentSalary=Math.round(this.endingSalary/Math.pow((1+this.env.WAGE_INFLATION),this.endingYear-aCurrentYear));


                            //calculate start to current ...
                            var yr1 = aCurrentYear;
                            var yr0 = this.hireYear;

                            var s1=this.currentSalary, s0=this.startingSalary;
                            var r=1.04;//rate of inflation between salary points... recalculated below.
                            var sal=0;//salary... calculated below...

                            // but only if current is less than ending year...
                            if(aCurrentYear <=this.getRetirementYear()){
                                r=Math.pow(s1/s0,1/(yr1-yr0));//determine the rate of inflation between yr0 and yr1...
                                for(var i=yr0;i<yr1;i++){
                                    sal=Math.round(s0*Math.pow(r,i-yr0));
                                    this.salaryHistory.push({"year":i,"salary":sal,"yearsOfService":1,"contribution":Math.round(sal*.08)});   
                                };
                                //move current to start...
                                yr0=yr1;
                                s0=s1;
                            };
                            //now calculate from start (or current) to ending year...
                            s1=this.endingSalary;
                            yr1=this.endingYear;
                            r=Math.pow(s1/s0,1/(yr1-yr0));
                            for(var i=yr0;i<=yr1;i++){
                                var sal=s0;
                                if(yr1!=yr0) sal=Math.round(s0*Math.pow(r,i-yr0));

                                this.salaryHistory.push({"year":i,"salary":sal,"yearsOfService":1,"contribution":Math.round(sal*.08)});
                            };
                            this.computeFinalAverageSalary();
                        },		

                        computeFinalAverageSalary:function(){
                            //calculate the average best 4 years in last 10...
                            var last10yrs=this.salaryHistory.slice(-10);
                            last10yrs.sort(function(a,b){return a.salary-b.salary;});
                            last10yrs=last10yrs.slice(-4);
                            this.avgYr=0;// avgYr and this.finalAverageSalary become the first coordinates of the finalAverageSalary Line on the graph...
                            this.finalAverageSalary=0;
                            for(var i=0;i<last10yrs.length;i++){
                                this.avgYr+=last10yrs[i].year;
                                this.finalAverageSalary+=last10yrs[i].salary;
                            };
                            this.finalAverageSalary=Math.round(this.finalAverageSalary/last10yrs.length);
                            this.avgYr=Math.round(this.avgYr/last10yrs.length);                       
                        }

				
			
	};
	
	return that;
	
};