var pension = pension || {};
pension.calculator = function(amodel) {	
	var that = {
			model: amodel,
			DISCOUNT_RATE: 0.03,
			MAX_AGE: 114,
                        WAGE_INFLATION: 0.04, 
			
			calculate: function(vals){
				var cola = this.model.COLA(vals); // Scalar (percent, probably between -1%-5%)
				var annualPension = this.model.annualPensionBenefit(vals);
				var rslt = this.calculateAnnuity(cola.rate, cola.max, cola.start, cola.compounded, annualPension, vals.ageAtRetirement);
				
				rslt.discountRate = this.DISCOUNT_RATE;
				rslt.maxAge = this.MAX_AGE;
				rslt.multiplier = this.model.multiplier(vals);
				rslt.benefitReduction = this.model.benefitReduction(vals);
				return rslt;
			},
			
			calculateAnnuity: function(COLARate, COLAMax, COLAStart, COLACompounded, annualPension, age) {
				var discount = 1.0, COLA = 0.0, maleMort = 1.0, femaleMort = 1.0;
				var rslt = {
						cola: COLAStart,
						annualPension: annualPension												
				};
				
				var annuityCost = {
					male: 0.0,
					female: 0.0
				};
				
				for (var i = 0, imax = this.MAX_AGE - age; i < imax; i++) {
					if (i) {
						discount /= 1 + this.DISCOUNT_RATE;
						if (i >= COLAStart) {
							var rate;
							if (typeof(COLARate) == "function") {
								rate = COLARate(i);
							} else {
								rate = COLARate;
							}
							
							if (COLACompounded) {
								COLA = (COLA + 1) * (1 + rate) - 1;
							} else {
								COLA += rate;
							}
						}
						
						maleMort *= (1 - PC.mortalityRates.male[age + i - 1]);
						femaleMort *= (1 - PC.mortalityRates.female[age + i - 1]);
					}
				 
					var payment = (!COLAMax || COLAMax >= annualPension) ? annualPension*(1+COLA) : COLAMax*COLA + annualPension;
					annuityCost.male += payment * discount * maleMort;
					annuityCost.female += payment * discount * femaleMort;
				console.log("age:",age+i,", paymt:",payment,", pd:",payment*discount," pdm:",payment*discount*maleMort,"mort:",maleMort,"rate",PC.mortalityRates.male[age + i - 1],"cost:", annuityCost.male)
				}
				rslt.annuity = annuityCost; 
				return rslt;
			},
			
			calculateTotalContributions: function(vals){
				var totalContrib = 0;
				
				for(var i = 0; i < vals.getYearsAtRetirement(); i++){
					totalContrib += this.model.employeeContributionAtYear(vals,i);
				}
				
				return totalContrib;					
			},	
                        //takes vals object with hireDate, Years of service and final avg salary and estimates
                        // starting, current, and ending salaries and years.
                        //uses wage inflation to make estimates
                        setSalaryEstimates:function(v){
                            var scope=v;
                            var ndt=new Date(scope.hireDate);
                            if(!ndt) {
                                alert("Hire Date needs to be in a format like 1/1/1999");
                                return;
                            }
                            scope.startingYear=ndt.getFullYear();
                            if(!scope.startingYear||!scope.yearsOfService) return;
                            scope.endingYear=scope.startingYear+parseInt(scope.yearsOfService);
                            if(!scope.finalAverageSalary||!scope.yearsOfService) return;
                            if(scope.yearsOfService>4){
                                //if there is no starting salary, then caclulate it...
                                //assume that the last four years were the highest and the average of them is represented
                                //   by finalAverageSalary... so finalAverageSalary is the same as one and a half years prior to the 
                                //   final year
                                //TODO: confirm that one and a half years is the proper way to do this...
                                scope.startingSalary=Math.round(scope.finalAverageSalary/Math.pow((1+this.WAGE_INFLATION),(scope.yearsOfService-1.5)));
                                scope.endingSalary=Math.round(scope.finalAverageSalary*Math.pow((1+this.WAGE_INFLATION),(1.5)));
                            }
                            else{
                                //assume final average salary is in the middle of start and end years...
                                scope.startingSalary=Math.round(scope.finalAverageSalary/Math.pow((1+this.WAGE_INFLATION),((scope.yearsOfService-1)/2)));
                                scope.endingSalary=Math.round(scope.finalAverageSalary*Math.pow((1+this.WAGE_INFLATION),((scope.yearsOfService-1)/2)));
                            }
                            if(scope.startingYear&&scope.endingYear&&scope.currentYear<=scope.endingYear){
                                scope.currentSalary=Math.round(scope.startingSalary*Math.pow((1+this.WAGE_INFLATION),(scope.currentYear-scope.startingYear)));
                            }
                            else scope.currentSalary=null;//leave null if already retired...
                            return scope;
                        },
                        //take starting, current, and ending salary info and convert to salary history array
                        // also compute final average in 4 best of last 10 years..
                        //v is nearly identical to vals... it is the scope object on the controller... needs update
                        computeSalaryHistory:function(v){
                            if(!v.hasOwnProperty("salaryHistoryArray")) v.salaryHistoryArray=[];
                            while(v.salaryHistoryArray.length>0){ v.salaryHistoryArray.pop();};//empty the array if there is anything in there.
                            //calculate start to current ...
                            var yr1=v.currentYear, yr0=v.startingYear;
                            var s1=v.currentSalary, s0=v.startingSalary;
                            // but only if current is less than ending year...
                            if(v.currentYear<=v.endingYear){
                                for(var i=yr0;i<yr1;i++){
                                    var sal=s0+(i-yr0)/(yr1-yr0)*(s1-s0)
                                    v.salaryHistoryArray.push({"year":i,"salary":sal,"yearsOfService":1});   
                                };
                                //move current to start...
                                yr0=yr1;
                                s0=s1;
                            };
                            //now calculate from start (or current) to ending year...
                            yr1=v.endingYear;
                            s1=v.endingSalary;
                            for(var i=yr0;i<=yr1;i++){
                                var sal=s0;
                                if(yr1!=yr0) sal=s0+(i-yr0)/(yr1-yr0)*(s1-s0);
                                v.salaryHistoryArray.push({"year":i,"salary":sal,"yearsOfService":1, "contributionRate":8});
                            };
                            this.computeFinalAverageSalary(v);
                            return v;
                        },
                        computeFinalAverageSalary:function(v){
                            //calculate the average best 4 years in last 10...
                            var last10yrs=v.salaryHistoryArray.slice(-10);
                            last10yrs.sort(function(a,b){return a.salary-b.salary;});
                            last10yrs=last10yrs.slice(-4);
                            v.avgYr=0;// avgYr and this.finalAverage become the first coordinates of the finalAverageSalary Line on the graph...
                            v.finalAverage=0;
                            for(var i=0;i<last10yrs.length;i++){
                                v.avgYr+=last10yrs[i].year;
                                v.finalAverage+=last10yrs[i].salary;
                            };
                            v.finalAverage=Math.round(v.finalAverage/last10yrs.length);
                            v.avgYr=Math.round(v.avgYr/last10yrs.length);
                            return v;
                        }
	};
	
	return that;
	
	
};

