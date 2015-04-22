var pension = pension || {};

pension.model = function(aPerson) {
	var that = {
		person : aPerson,
		minRetirementAge : {},
		minYearsOfService : {},
		eligibleForSoSec : false,
		maxMultiplier : {},
		annualMultiplier : {},
		benefitReduction : {},
		maxAnnualPension : {},
		COLA : {},
		contribPct : {},
		totalContributions : {},
                env:{},

		getMultiplier : function() {
			var benefitMultiplier = this.person.yearsOfService * this.annualMultiplier;
			if (benefitMultiplier > this.maxMultiplier)
				benefitMultiplier = this.maxMultiplier;

			return benefitMultiplier;
		},

		getAnnualPensionBenefit : function() {
			var benefitMultiplier = this.getMultiplier();
			var pension = aPerson.finalAverageSalary * benefitMultiplier * (1 - this.benefitReduction);

			// This really should be max salary and move it up to the pension calc above
			// Saturate pension
			if (pension > this.maxAnnualPension) {
				pension = this.maxAnnualPension;
			}
			return pension;
		},

		calculate : function(aEnv) {
                    if(aEnv===undefined) aEnv=this.env;
                    
                    // Please call this before calling calculate
                    this.person.computeRetirementYear();
                    this.person.computeDeathYear();
                    
                    //get benefit history...
                    var aResult= this.calculateAnnuity(
                        this.COLA, 
                        this.getAnnualPensionBenefit(),
					    this.person.ageAtRetirement, 
                        this.person.ageAtDeath, 
                        aEnv
                    );
                    //get contribution history... replace any previous contribution calc, uses the model's pct contribution function or rate...
                    this.benefitHistory=aResult.benefitHistory;
                    this.generateContributionHistory(this.person);

                    //now create year by year history with values: 
                    //  contribution - in that year's dollars,
                    //  contributionFund - sum of all previous contributions plus a return in that year's dollars,
                    //  benefit - in that year's dollars,
                    //  benefitFund - annuity fund value required to make subsequent benefit payouts while earning a return, all in that year's dollars,
                    //  contribution_npv, contributionFund_npv, benefit_npv, and benefitFunc_npv - The same as above but all in current year's dollars (so discounted by inflation),
                    //
                    this.history=[];//couldn't use a named array, didn't play well with d3...

                    //now walk through all years and create history of contributions and benefits
                    //start with a named array of years...
                    for(var i=this.person.hireYear;i<=this.person.deathYear;i++){
                        this.history.push({
                            "year":i, 
                            "age":i-this.person.birthYear,
                            "contribution":0,
                            "contributionFund":0,
                            "benefit":0,
                            "benefitFund":0,
                            "contribution_npv":0,
                            "contributionFund_npv":0,
                            "benefit_npv":0,
                            "benefitFund_npv":0,
                            "salary":0
                        });
                    }
                    //next add all the contributions to the history array...
                    for(var i=0;i<this.contributionHistory.length;i++){
                        var c=this.contributionHistory[i];
                        var yr=c.year-this.person.hireYear;
                        if(yr<0||yr>this.history.length) console.log("error: contribution year not in range");
                        else {
                            var h=this.history[yr];
                            h.contribution=c.contribution;
                            h.salary=c.salary;
                        }
                    }
                    //and add all the benefits to the history array...
                    for(var i=0;i<this.benefitHistory.length;i++){
                        var b=this.benefitHistory[i];
                        var yr=b.year-this.person.hireYear;
                        if(yr<0||yr>this.history.length) console.log("error: benefit year not in range");
                        else {
                            var h=this.history[yr];
                            h.benefit=b.benefit;
                        };
                    }
                    //now, walk through the entire history calculating contribution_fund and benefit_fund based on rate of return (=inflation + real rate of return)
                    //do this in separate method so that it can be re-run if rate of return is changed...
                    this.calculateFundValues();
                    //and lastly, calculate npv of all fields
                    //again use a separate method so that it can be re-run with a different inflation rate
                    this.convertToRealDollars();
		},
                
                
        calculateFundValues:function(discountRate){
            if(discountRate == undefined) discountRate=this.env.DISCOUNT_RATE;
            var cfund=0;
            var lastBenefit=0;
            var bfund=this.recalculateAnnuity(discountRate);
            for(var i=0;i<this.history.length;i++){
                var h=this.history[i];
                if(h.year<this.person.retirementYear) {
                    // Assumes discountRate = "the rate of return on an investment"
                    cfund=cfund*(1+discountRate)+h.contribution;
                    h.contributionFund=cfund;
                }
                else if (h.year==this.person.retirementYear){
                    // We need to determine if you worked through the
                    // entire year or retired at the beginning of the year
                    // if worked through the year, this is right.
                    h.contributionFund = cfund*(1+discountRate);
                    // otherwise, this is right
                    h.benefitFund = bfund ;
                    lastBenefit = h.benefit;
                }
                else {

                    bfund=bfund*(1+discountRate)-lastBenefit;
                    h.benefitFund=bfund;
                    lastBenefit = h.benefit;
                }
            }
        },
        
        recalculateAnnuity:function(discountRate){
            //calculate how much we need to save to cover all benefits given the current rate
            if(discountRate == undefined) discountRate=this.env.DISCOUNT_RATE;
            var bfund=0, discount=1;
            for(var i=0;i<this.benefitHistory.length;i++){
                discount=discount*(1+discountRate);
                bfund+= this.benefitHistory[i].benefit/discount;
            }
            return bfund;
        },
        
        convertToRealDollars:function(inflRate){
            //calculate the current value of all variables...
            if(inflRate == undefined) inflRate=this.env.INFLATION_RATE;
            //determine the starting discount rate which will be the inflation rate raised to the power of however many years difference bbetween the hire year and the current year... 
            //This should be a number less than one in the past and greater than one in the future
            //it is then divided into the present value dollar amount to calculate the current value...
            var discount=Math.pow(1+inflRate, this.person.currentYear-this.person.hireYear); 
            for(var i=0;i<this.history.length;i++){
                var h=this.history[i];
                h.contribution_npv=h.contribution*discount;
                h.contributionFund_npv=h.contributionFund*discount;
                h.benefit_npv=h.benefit*discount;
                h.benefitFund_npv=h.benefitFund*discount;
                discount/=(1+inflRate);
            }
        },

		calculateAnnuity : function(COLAObj, annualPension, age, ageAtDeath, aEnv) {
			var discount = 1.0, COLA = 0.0;
			var COLAStart = COLAObj.start;
			var COLAMax = COLAObj.max;
			var rslt = {
				cola : COLAStart,
				annualPension : annualPension,
				benefitHistory : []
			};


			for (var i = 0, imax = ageAtDeath - age; i < imax; i++) {
				if (i) {
					discount /= 1 + aEnv.DISCOUNT_RATE;
					COLA = COLAObj.rateForYear(i, COLA);			
				}

				var payment = (!COLAMax || COLAMax >= annualPension) ? 
  							annualPension * (1 + COLA)
						: 	COLAMax * COLA + annualPension;
  							
				rslt.benefitHistory.push({
					"year":this.person.retirementYear+i,
                    "age" : age + i,
					"benefit" : payment,
					"presentValue" : Math.round(payment * discount),
					"accumulatedCost" : 0
				});
			}
			
            // reversing the accumulatedCost as a draw-down on how much the state has to 
			// have in the fund today to cover the cost of the benefits....
			var annuityCost = 0.0;
            for(var i=rslt.benefitHistory.length-1;i>-1;i--){
                annuityCost += rslt.benefitHistory[i].presentValue;
                rslt.benefitHistory[i].accumulatedCost=annuityCost;
            }
			rslt.annuity = annuityCost;
			return rslt;
		},

		// Update this model by computing the history of contributions
		// made under the plan.
		// Updates:
		//		totalContributions
		//		contributionHistory
		generateContributionHistory : function(aPerson) {
			this.contributionHistory = [];
			this.totalContributions = 0;
            var isFunc=false;
            if($.isFunction(this.contribPct)) isFunc=true;

            for (var i = 0; i < aPerson.salaryHistory.length; i++) {
				//var copyOfHist = aPerson.salaryHistory[i].clone();
                var copyOfHist={"salary":aPerson.salaryHistory[i].salary,"contribution":0, "year":aPerson.salaryHistory[i].year, "yearsOfService":aPerson.salaryHistory[i].yearsOfService};
				copyOfHist.contribution = copyOfHist.salary * (isFunc?this.contribPct():this.contribPct);
				this.contributionHistory.push(copyOfHist);
                                
				this.totalContributions += copyOfHist.contribution;
			}
		},		
	};

	return that;

};