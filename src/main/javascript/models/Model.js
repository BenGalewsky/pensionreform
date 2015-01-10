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

			// Saturate pension
			if (pension > this.maxAnnualPension) {
				pension = this.maxAnnualPension;
			}
			return pension;
		},

		calculate : function(aEnv) {
                    if(aEnv==undefined) aEnv=this.env;

                    var rslt = this.calculateAnnuity(this.COLA.rate, this.COLA.max,
					this.COLA.start, this.COLA.compounded, this
							.getAnnualPensionBenefit(),
					this.person.ageAtRetirement, this.person.ageAtDeath, aEnv);

			return rslt;
		},

		calculateAnnuity : function(COLARate, COLAMax, COLAStart,
				COLACompounded, annualPension, age, ageAtDeath, aEnv) {
			var discount = 1.0, COLA = 0.0;
			var rslt = {
				cola : COLAStart,
				annualPension : annualPension,
				benefitHistory : []
			};

			var annuityCost = 0.0;

			for (var i = 0, imax = ageAtDeath - age; i < imax; i++) {
				if (i) {
					discount /= 1 + aEnv.DISCOUNT_RATE;
					if (i >= COLAStart) {
						var rate;
						if (typeof (COLARate) == "function") {
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

				}

				var payment = (!COLAMax || COLAMax >= annualPension) ? 
  							annualPension * (1 + COLA)
						: 	COLAMax * COLA + annualPension;
  							
				
				rslt.benefitHistory.push({
					"age" : age + i,
					"payment" : payment,
					"presentValue" : Math.round(payment * discount),
					"accumulatedCost" : 0
				});
				console.log(rslt.benefitHistory.slice(-1)[0]);
			}
                        //reversing the accumulatedCost as a drawdown on how much the state has to have in the fund today to ocver the cost of the bbenefits....
                        annuityCost=0;
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

			for (var i = 0; i < aPerson.salaryHistory.length; i++) {
				var copyOfHist = aPerson.salaryHistory[i].clone();
				copyOfHist.contribution = copyOfHist.salary * this.contribPct;
				this.contributionHistory.push(copyOfHist);
				this.totalContributions += copyOfHist.contribution;
			}
		}

	};

	return that;

};