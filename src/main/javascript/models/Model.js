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
  							
				annuityCost += payment * discount;
				rslt.benefitHistory.push({
					"age" : age + i,
					"payment" : payment,
					"presentValue" : payment * discount,
					"accumulatedCost" : annuityCost
				});
				console.log(rslt.benefitHistory.slice(-1)[0]);
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