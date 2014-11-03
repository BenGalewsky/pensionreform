(function() {

PC.dataItems.IL_pensionSystem = new PC.DataItem.Set({
	name: 'Illinois Pension System',
	question: "To which Illinois pension system do you belong?",
	standards: {
	    'GARS': "General Assembly Retirement System (GARS)",
	    'SURS': "State Universities Retirement System (SURS)",
	    'SERS': "State Employee's Retirement System (SERS)"
	},
	hint: "Members of the General Assembly Retirement System include General Assembly memebers and certain elected state officials.<br /><br />\
	       Members of the State Universities Retirement System include workers with occupations ranging from professors and teachers to clerical, building service workers, and groundskeepers.<br /><br />\
	       Members of the State Employee's Retirement System include other state workers exluding teachers and judges.",
	order: 39,
	sort: false
});

PC.dataItems.IL_SERSAlternativeFormula = new PC.DataItem.Exact.Bool({
	name: "SERS of Illinois Alternative Formula Option",
	question: "Did you contribute towards the State Employees' Retirement System of Illinois Alternative Formula Option?",
	hint: "The Alternative Formula Option requires higher employee contributions and is available to state employees of Illinois in hisk-risk jobs. If you contributed towards the alternative option but do not meet the age and years of service requirements, you will receive a standard pension benefit and your additional contributions will be refunded."
});


PC.systems.IL = {
	requirements: {
		hireDate: {},
		yearsOfService: {},
		ageAtRetirement: {},
		occupation: {
            standards: ['teacher', 'judge', 'policeOfficer'],
            hint: "Police Officers include State police, conservation police, SOS investigators and similar."
        },
		IL_pensionSystem: {
			standards: ['GARS', 'SURS', 'SERS'],
			askIf: [
			    ['occupation'],
			    function (args) {
			    	return (args.occupation != 'teacher' && args.occupation != 'judge' && args.occupation != 'policeOfficer' && args.occupation != 'fireFighter');
			    }
			]      
		},
		IL_SERSAlternativeFormula: {
			askIf: [
			    ['occupation', 'hireDate', 'IL_pensionSystem'],
			    function (vals) {
			    	var system = getSystem(vals);
					var tier = getTier(vals);
			    	return (system == 'SERS' && tier == 1);
			    }
			]      
		},
		finalAverageSalary: {
			prereqs: [
			    ["occupation", "hireDate", "IL_pensionSystem", "IL_SERSAlternativeFormula"],
			    function(vals) {
			    	var system = getSystem(vals);
					var tier = getTier(vals);
					var hint;
					if (system == 'SERS' && tier == 1) {
						if (vals.IL_SERSAlternativeFormula) {
							hint = "Rate of pay on the last day of employment, or the average of the last 48 months of compensation, whichever is greater.";
						} else {
							hint = "Highest 48 consecutive months of service with the last 120 months of service.";
						}
					}
					if (system == 'SERS' && tier == 2) {
						hint = "Highest salary 8 years out of last 10 years of service";
					}
					if (system == 'GARS' && tier == 1) {
						hint = "Salary on the last day of service.";
					}
					if (system == 'GARS' && tier == 2) {
						hint = "Highest salary 8 years out of last 10 years of service";
					}
					if (system == 'JRS' && tier == 1) {
						hint = "Salary on the last day of employment as a judge or for any terminating service after July 14, 1995, the highest salary received as a judge for at least 4 consecutive years, whichever is greater, after 20 years of service.";
					}
					if (system == 'JRS' && tier == 2) {
						hint = "Highest salary 8 years out of last 10 years of service";
					}
					if (system == 'TRS' && tier == 1) {
						hint = "Average of the four highest consecutive annual salary rates within the last 10 years of service.";
					}
					if (system == 'TRS' && tier == 2) {
						hint = "Highest salary 8 years out of last 10 years of service";
					}
					if (system == 'SURS' && tier == 1) {
						hint = "Average annual earnings during the 4 consecutive academic years of service which his or her earnings were the highest.";
					}
					if (system == 'SURS' && tier == 2) {
						hint = "Highest salary 8 years out of last 10 years of service";
					}
					PC.dataItems.finalAverageSalary.setHint('IL', hint);
			    }
			]
		}
	},
	
	calculatePension: function(vals) {
		var system = getSystem(vals);
		var tier = getTier(vals);

                var COLA = PC.systems.IL.COLA;
                
		if (tier == 2) {
			COLA.start = 67 - vals.ageAtRetirement;
			if (COLA.start < 1) COLA.start = 1;
			COLA.start = COLA.start;
		} else if (system == 'SERS' || system == 'JRS' || system == 'SURS') {
			COLA.start = 1;
		} else if (system == 'GARS') {
			COLA.start = 60 - vals.ageAtRetirement;
			if (COLA.start < 1) COLA.start = 1;
			COLA.start = COLA.start;
		} else if (system == 'TRS') {
			COLA.start = 61 - vals.ageAtRetirement;
			if (COLA.start < 1) COLA.start = 1;
			COLA.start = COLA.start;
		}
		
		var coveredBySocialSecurity = true;
        if (vals.occupation == 'policeOfficer')
            coveredBySocialSecurity = false;
		
		if (system == 'SERS' && tier == 1) {
                        COLA.info = "Post retirement increases of 3% compounded are generally granted to members effective each January 1, after receipt of benefits for one full year.";
                    
                        var useAlternativeFormula = vals.IL_SERSAlternativeFormula;
			if (useAlternativeFormula) {
				if ( (vals.ageAtRetirement < 50) || (vals.ageAtRetirement < 55 && vals.yearsOfService < 25) || (vals.yearsOfService < 20) ) useAlternativeFormula = false;
                        }
                        if (useAlternativeFormula) {
				var benefitMultiplier = vals.yearsOfService * ((coveredBySocialSecurity) ? 0.025 : 0.03);
				if (benefitMultiplier > 0.80) benefitMultiplier = 0.80;
				
				return vals.finalAverageSalary * benefitMultiplier;
			} else {
				if (vals.ageAtRetirement < 55 && vals.yearsOfService + vals.ageAtRetirement < 85) return 'Your years of service and age at retirement must add to 85 in order to retire before age 55 in the State Employees\' Retirement System of Illinois.';
				if (vals.ageAtRetirement < 60 && vals.yearsOfService < 25) return "You must have at least 25 years of service in order to retire at age "+vals.ageAtRetirement+" in the State Employees' Retirement System of Illinois.";
				if (vals.yearsOfService < 8) return "You must have at least 8 years of service in order to retire at age "+vals.ageAtRetirement+" in the State Employees' Retirement System of Illinois.";
				
				var benefitReduction = 0;
				if (vals.ageAtRetirement < 60) {
					benefitReduction = 0.06 * (60 - vals.ageAtRetirement);
				}
				
				var benefitMultiplier = vals.yearsOfService * ((coveredBySocialSecurity) ? 0.0167 : 0.022);
				if (benefitMultiplier > 0.75) benefitMultiplier = 0.75;
				
				return vals.finalAverageSalary * benefitMultiplier * (1 - benefitReduction);
			}
		}
		
		if (system == 'SERS' && tier == 2) {
                        if (vals.ageAtRetirement < 62) return "You must be at least 62 in order to retire in the State Employees' Retirement System of Illinois.";
			if (vals.yearsOfService < 10) return "You must have at least 10 years of service in order to retire at age "+vals.ageAtRetirement+" in the State Employees' Retirement System of Illinois.";
			
			var benefitReduction = 0;
			if (vals.ageAtRetirement < 67) {
				benefitReduction = 0.06 * (67 - vals.ageAtRetirement);
			}
			
			var benefitMultiplier = vals.yearsOfService * ((coveredBySocialSecurity) ? 0.0167 : 0.022);
			if (benefitMultiplier > 0.75) benefitMultiplier = 0.75;
			
			var pension = vals.finalAverageSalary * benefitMultiplier * (1 - benefitReduction);
			if (pension > 106800) pension = 106800;
                        
                        COLA.info = "Adjustments begin at age 67 at the lesser of 3% or one-half of the annual increase in the CPI, simple interest.";
   
			return pension;
		}
		
		if (system == 'GARS' && tier == 1) {
			if (vals.ageAtRetirement < 55) return "You must be at least 55 in order to retire in the General Assembly Retirement System of Illinois.";
			if (vals.ageAtRetirement < 62 && vals.yearsOfService < 8) return "You must have at least 8 years of service in order to retire at age "+vals.ageAtRetirement+" in the General Assembly Retirement System of Illinois.";
			if (vals.yearsOfService < 4) return "You must have at least 4 years of service in order to retire at age "+vals.ageAtRetirement+" in the General Assembly Retirement System of Illinois.";
			
			// No benefit reduction for early retirement
			
			var benefitMultiplier = 0;
			for (var i = 1; i <= vals.yearsOfService; i++) {
				if (i <= 4) {
					benefitMultiplier += 0.03;
					continue
				}
				if (i <= 6) {
					benefitMultiplier += 0.035;
					continue
				}
				if (i <= 8) {
					benefitMultiplier += 0.04;
					continue
				}
				if (i <= 12) {
					benefitMultiplier += 0.045;
					continue
				}
				benefitMultiplier += 0.05;
			}
			if (benefitMultiplier > 0.85) benefitMultiplier = 0.85;
			
			var annualPension = vals.finalAverageSalary * benefitMultiplier;
			
			if (vals.hireDate.isBeforeOrEqual('8/8/2003') && vals.yearsOfService > 20) {
				var yearsSinceAge55 = vals.ageAtRetirement - 55;
				var yearsSince20YOS = vals.yearsOfService - 20;
				COLA.start = 1;
				var yearsToAdd = (yearsSinceAge55 < yearsSince20YOS) ? yearsSinceAge55 : yearsSince20YOS;
				for (var i = 0; i < yearsToAdd; i++) {
					annualPension *= 1.03;
				}
			}
			
			COLA.info = "Post-retirement increases of 3% of the current amount of annuity are granted to participants effective in January or July of the year following the first anniversary of retirement and in January or July of each year thereafter. However, if the participant has not attained age 60 at that date, the payment of such annual increase shall be deferred until the first of the month following their 60th birthday.<br /><br />For participants who first became members of the System on or before August 8, 2003 and remain in service after attaining 20 years of creditable service, the 3% annual increases shall begin to accrue on the January 1 following the date when the participant (1) attains age 55, or (2) attains 20 years of creditable service, whichever occurs later. In addition, the annual increases shall continue to accrue while the participant remains in service; however, such increases shall not become payable until (1) the January 1 or the July 1 next following the first anniversary of retirement, or (2) the first of the month following attainment of age 60, whichever occurs later.";
			
			return annualPension;
		}
		
		if (system == 'GARS' && tier == 2) {
			if (vals.ageAtRetirement < 62) return "You must be at least 62 in order to retire in the General Assembly Retirement System of Illinois.";
			if (vals.yearsOfService < 8) return "You must have at least 8 years of service in order to retire at age "+vals.ageAtRetirement+" in the General Assembly Retirement System of Illinois.";
			
			var benefitReduction = 0;
			if (vals.ageAtRetirement < 67) {
				benefitReduction = 0.06 * (67 - vals.ageAtRetirement);
			}
			
			var benefitMultiplier = 0.03 * vals.yearsOfService;
			if (benefitMultiplier > 0.6) benefitMultiplier = 0.6;
			
			var pension = vals.finalAverageSalary * benefitMultiplier * (1 - benefitReduction);
			if (pension > 106800) pension = 106800;
 
                        COLA.info = "Adjustments begin at age 67 at the lesser of 3% or one-half of the annual increase in the CPI, simple interest.";
                        
			return pension;
		}
		
		if (system == 'JRS' && tier == 1) {
			if (vals.ageAtRetirement < 55) return "You must be at least 55 in order to retire in the Judges' Retirement System of Illinois.";
			if (vals.ageAtRetirement < 62 && vals.yearsOfService < 10) return "You must have at least 10 years of service in order to retire at age "+vals.ageAtRetirement+" in the Judges' Retirement System of Illinois.";
			if (vals.yearsOfService < 6) return "You must have at least 6 years of service in order to retire at age "+vals.ageAtRetirement+" in the Judges' Retirement System of Illinois.";
			
			var benefitReduction = 0;
			if (vals.ageAtRetirement < 60 && vals.yearsOfService < 26) {
				benefitReduction = 0.06 * (60 - vals.ageAtRetirement);
			}
			
			var benefitMultiplier = 0;
			for (var i = 1; i <= vals.yearsOfService; i++) {
				if (i <= 10) {
					benefitMultiplier += 0.035;
					continue
				}
				benefitMultiplier += 0.05;
			}
			if (benefitMultiplier > 0.85) benefitMultiplier = 0.85;
			
                        COLA.info = "Post retirement increases of 3% of the current amount of annuity are granted to participants effective in January of the year next following the first anniversary of retirement and in January of each year thereafter.";
 
			return vals.finalAverageSalary * benefitMultiplier * (1 - benefitReduction);
		}

		if (system == 'JRS' && tier == 2) {
			if (vals.ageAtRetirement < 62) return "You must be at least 62 in order to retire in the Judges' Retirement System of Illinois.";
			if (vals.yearsOfService < 8) return "You must have at least 8 years of service in order to retire at age "+vals.ageAtRetirement+" in the Judges' Retirement System Illinois.";
			
			var benefitReduction = 0;
			if (vals.ageAtRetirement < 67) {
				benefitReduction = 0.06 * (67 - vals.ageAtRetirement);
			}
			
			var benefitMultiplier = 0.03 * vals.yearsOfService;
			if (benefitMultiplier > 0.6) benefitMultiplier = 0.6;
			
			var pension = vals.finalAverageSalary * benefitMultiplier * (1 - benefitReduction);
			if (pension > 106800) pension = 106800;
 
                        COLA.info = "Adjustments begin at age 67 at the lesser of 3% or one-half of the annual increase in the CPI, simple interest.";
 
			return pension;
		}
		
		if (system == 'TRS' && tier == 1) {
			if (vals.ageAtRetirement < 55) return "You must be at least 55 in order to retire in the Teachers' Retirement System of Illinois.";
			if (vals.ageAtRetirement < 60 && vals.yearsOfService < 20) return "You must have at least 20 years of service in order to retire at age "+vals.ageAtRetirement+" in the Teachers' Retirement System of Illinois.";
			if (vals.ageAtRetirement < 62 && vals.yearsOfService < 10) return "You must have at least 10 years of service in order to retire at age "+vals.ageAtRetirement+" in the Teachers' Retirement System of Illinois.";
			if (vals.yearsOfService < 5) return "You must have at least 5 years of service in order to retire at age "+vals.ageAtRetirement+" in the Teachers' Retirement System of Illinois.";
			
			var benefitReduction = 0;
			if (vals.ageAtRetirement < 60 && vals.yearsOfService < 26) {
				benefitReduction = 0.06 * (60 - vals.ageAtRetirement);
			}
			
			var lowerRateYears = 0;
			if (vals.hireDate.isBefore('7/1/1998')) {
				lowerRateYears = Math.floor(-vals.hireDate.yearDiff('7/1/1998'));
				if (lowerRateYears > vals.yearsOfService) lowerRateYears = vals.yearsOfService;
			}
			var higherRateYears = vals.yearsOfService - lowerRateYears;
			
			var benefitMultiplier = 0;
			for (var i = 1; i <= lowerRateYears; i++) {
				if (i <= 10) {
					benefitMultiplier += 0.0167;
					continue
				}
				if (i <= 20) {
					benefitMultiplier += 0.019;
					continue
				}
				if (i <= 30) {
					benefitMultiplier += 0.021;
					continue
				}
				benefitMultiplier += 0.023;
			}
			benefitMultiplier += 0.022 * higherRateYears;
			
			if (benefitMultiplier > 0.75) benefitMultiplier = 0.75;
			
                        COLA.info = "All retirees receive an annual 3% compounded increase in the current retirement benefit beginning January 1 following the attainment of age 61 or January 1 following the first anniversary in retirement, whichever is later.";
 
			return vals.finalAverageSalary * benefitMultiplier * (1 - benefitReduction);
		}
		
		if (system == 'TRS' && tier == 2) {
			if (vals.ageAtRetirement < 62) return "You must be at least 62 in order to retire in the Teachers' Retirement System of Illinois.";
			if (vals.yearsOfService < 10) return "You must have at least 10 years of service in order to retire at age "+vals.ageAtRetirement+" in the Teachers' Retirement System of Illinois.";
			
			var benefitReduction = 0;
			if (vals.ageAtRetirement < 67) {
				benefitReduction = 0.06 * (67 - vals.ageAtRetirement);
			}
			
			var benefitMultiplier = 0.022 * vals.yearsOfService;
			if (benefitMultiplier > 0.75) benefitMultiplier = 0.75;
			
			var pension = vals.finalAverageSalary * benefitMultiplier * (1 - benefitReduction);
			if (pension > 106800) pension = 106800;
 
                        COLA.info = "Adjustments begin at age 67 at the lesser of 3% or one-half of the annual increase in the CPI, simple interest.";
 
			return pension;
		}
		
		if (system == 'SURS' && tier == 1) {
			if (vals.ageAtRetirement < 55 && vals.yearsOfService < 30) return "You must have at least 30 years of service in order to retire at age "+vals.ageAtRetirement+" in the State Universities Retirement System of Illinois.";
			if (vals.ageAtRetirement < 62 && vals.yearsOfService < 8) return "You must have at least 8 years of service in order to retire at age "+vals.ageAtRetirement+" in the State Universities Retirement System of Illinois.";
			if (vals.yearsOfService < 5) return "You must have at least 5 years of service in order to retire at age "+vals.ageAtRetirement+" in the State Universities Retirement System of Illinois.";
			
			// No benefit reduction for early retirement
			
			var benefitMultiplier = 0.022 * vals.yearsOfService;
			if (benefitMultiplier > 0.8) benefitMultiplier = 0.8;
			
                        COLA.info = "Adjustments of 3% are applied January 1 of each year.";
 
			return vals.finalAverageSalary * benefitMultiplier;
		}
		
		if (system == 'SURS' && tier == 2) {
			if (vals.ageAtRetirement < 62) return "You must be at least 62 in order to retire in the State Universities Retirement System of Illinois.";
			if (vals.yearsOfService < 10) return "You must have at least 10 years of service in order to retire at age "+vals.ageAtRetirement+" in the State Universities Retirement System of Illinois.";
			
			var benefitReduction = 0;
			if (vals.ageAtRetirement < 67) {
				benefitReduction = 0.06 * (67 - vals.ageAtRetirement);
			}
			
			var benefitMultiplier = 0.022 * vals.yearsOfService;
			if (benefitMultiplier > 0.8) benefitMultiplier = 0.8;
			
			var pension = vals.finalAverageSalary * benefitMultiplier * (1 - benefitReduction);
			if (pension > 106800) pension = 106800;
 
                        COLA.info = "Adjustments begin at age 67 at the lesser of 3% or one-half of the annual increase in the CPI, simple interest.";
 
			return pension;
		}
	},
	
	COLA: {
		rate: 0.03
	}
};

function getSystem(vals) {
	var system;
	if (vals.occupation == 'teacher') {
		system = 'TRS';
	} else if (vals.occupation == 'judge') {
		system = 'JRS';
    } else if (vals.occupation == 'policeOfficer' || vals.occupation == 'fireFighter') {
        system = 'SERS';
	} else {
		system = vals.IL_pensionSystem
	}
	return system;
}

function getTier(vals) {
	return (vals.hireDate.isBefore('1/1/2011')) ? 1 : 2;
}

})();
