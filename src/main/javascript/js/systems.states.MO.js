(function() {

var reductionFactors = {
    "PSRS": {
        "25-and-Out": {
            25: 0.0220,
            26: 0.0225,
            27: 0.0230,
            28: 0.0235,
            29: 0.0240
        },
        "Age": {
            45: 0.2577,
            46: 0.2806,
            47: 0.3057,
            48: 0.3331,
            49: 0.3634,
            50: 0.3966,
            51: 0.4331,
            52: 0.4735,
            53: 0.5180,
            54: 0.5672,
            55: 0.6216,
            56: 0.6820,
            57: 0.7491,
            58: 0.8238,
            59: 0.9070
        }
    },
    "PEERS": {
        "25-and-Out": {
            25: 0.0151,
            26: 0.0153,
            27: 0.0155,
            28: 0.0157,
            29: 0.0159
        },
        "Age": {
            45: 0.2531,
            46: 0.2758,
            47: 0.3006,
            48: 0.3280,
            49: 0.3581,
            50: 0.3912,
            51: 0.4277,
            52: 0.4680,
            53: 0.5126,
            54: 0.5620,
            55: 0.6168,
            56: 0.6777,
            57: 0.7454,
            58: 0.8210,
            59: 0.9055
        }
    }
};

var getSystem = function (vals) {
    if (vals.occupation == "teacher") return "PSRS";
    if (vals.MO_publicEducationEmployee) return "PEERS";
    if (vals.MO_adminLawJudge || vals.MO_legalAdvisor) return "ALJLAP";
    
    if (vals.occupation == "judge") {
        if (vals.hireDate.isBefore("1/1/2011")) return "JP";
        return "JP 2011";
    }
    
    if (vals.hireDate.isBefore("7/1/2000")) return "MSEP";
    if (vals.hireDate.isBefore("1/1/2011")) return "MSEP 2000";
    return "MSEP 2011";
};

PC.dataItems.MO_adminLawJudge = new PC.DataItem.Exact.Bool({
	name: 'Administrative Law Judge',
	question: "Are you an administrative law judge?",
	order: 1
});

PC.dataItems.MO_legalAdvisor = new PC.DataItem.Exact.Bool({
	name: 'Legal Advisor',
	question: "Are you a legal advisor?",
	order: 1
});

PC.dataItems.MO_publicEducationEmployee = new PC.DataItem.Exact.Bool({
	name: 'Public Education Employee Retirement System Member',
	question: "Are you a member of the Public Education Employee Retirement System?",
	order: 1
});

PC.systems.MO = {
	requirements: {
    	ageAtRetirement: {},
		yearsOfService: {},
	    occupation: {
	        standards: ["teacher", "judge"]
	    },
	    hireDate: {
	        dividers: ["7/1/2000", "4/26/2005", "1/1/2011"]
        },
        MO_publicEducationEmployee: {
            askIf: [
                ["occupation", "hireDate"],
                function (vals) {
                    return vals.occupation != "teacher"
                        && vals.occupation != "judge"
                        && vals.occupation != "policeOfficer"
                        && vals.occupation != "fireFighter";
                }
            ]
        },
        MO_adminLawJudge: {
            askIf: [
                ["occupation", "hireDate"],
                function (vals) {
                    return vals.occupation == "judge" && vals.hireDate.isBefore("4/26/2005");
                }
            ]
        },
        MO_legalAdvisor: {
            askIf: [
                ["occupation", "hireDate", "MO_publicEducationEmployee"],
                function (vals) {
                    return !vals.MO_publicEducationEmployee
                        && vals.occupation != "teacher"
                        && vals.occupation != "judge"
                        && vals.occupation != "policeOfficer"
                        && vals.occupation != "fireFighter"
                        && vals.hireDate.isBefore("4/26/2005");
                }
            ]
        },
        retirementDateRange: {
            dividers: ["7/1/2013"],
            askIf: [
                ["occupation", "hireDate", "MO_publicEducationEmployee", "MO_legalAdvisor"],
                function (vals) {
                    var system = getSystem(vals);
                    return system == "PSRS" || system == "PEERS";
                }
            ]
        },
		finalAverageSalary: {
			prereqs: [
			    ["occupation", "hireDate", "SC_pensionSystem"],
			    function(vals) {
					var hint;
				    
				    if (vals.occupation == "judge" && !vals.MO_adminLawJudgeOrLegalAdvisor) {
				        hint = "The monthly salary for the highest court held at the time of retirement.";
				    } else if (vals.MO_adminLawJudgeOrLegalAdvisor) {
				        hint = "Average of highest 12 months of service.";
				    } else {
				        hint = "Average of highest 36 consecutive months of pay.";
				    }
				    
				    PC.dataItems.finalAverageSalary.setHint('MO', hint);
				}
			]
		}
	},
	
	calculatePension: function(vals) {
	    var system = getSystem(vals);
	
	    if (system == "MSEP") {
            var minYOS = 80 - vals.ageAtRetirement;
            if (vals.ageAtRetirement >= 55) minYOS = 10;
            if (vals.ageAtRetirement >= 65) minYOS = 5;
            
            if (vals.ageAtRetirement < 48) return "You must be at least 48 years of age in order to retire in the Missouri State Employees' Plan.";
            if (vals.yearsOfService < minYOS) return "You must have at least " + minYOS + " years of service in order to retire at age " + vals.ageAtRetirement + " in the Missouri State Employees' Plan.";
        
            var multiplier = 0.016 * vals.yearsOfService;
            var reduction = 0;
            if (!((vals.ageAtRetirement >= 65 && vals.yearsOfService >= 5)
                || (vals.ageAtRetirement >= 60 && vals.yearsOfService >= 15)
                || (vals.ageAtRetirement + vals.yearsOfService >= 80))) {
                var normalAge = vals.yearsOfService >= 15 ? 60 : 65;
                reduction = 0.06 * (normalAge - vals.ageAtRetirement);
            }

            multiplier *= (1 - reduction);
	        
            var benefit = multiplier * vals.finalAverageSalary;
            
            return benefit;
        }
        
        if (system == "MSEP 2000") {
            var minYOS = 80 - vals.ageAtRetirement;
            if (vals.ageAtRetirement >= 57) minYOS = 5;
            
            if (vals.ageAtRetirement < 48) return "You must be at least 48 years of age in order to retire in the Missouri State Employees' Plan 2000.";
            if (vals.yearsOfService < minYOS) return "You must have at least " + minYOS + " years of service in order to retire at age " + vals.ageAtRetirement + " in the Missouri State Employees' Plan 2000.";
        
            var multiplier = 0.017 * vals.yearsOfService;
            var reduction = 0;
            if (!((vals.ageAtRetirement >= 62 && vals.yearsOfService >= 5)
                || (vals.ageAtRetirement + vals.yearsOfService >= 80))) {
                reduction = 0.06 * (62 - vals.ageAtRetirement);
            }

            multiplier *= (1 - reduction);
	        
            var benefit = multiplier * vals.finalAverageSalary;
            
            return benefit;
        }
        
        if (system == "MSEP 2011") {
            var minYOS = 90 - vals.ageAtRetirement;
            if (vals.ageAtRetirement >= 62) minYOS = 10;
            
            if (vals.ageAtRetirement < 55) return "You must be at least 55 years of age in order to retire in the Missouri State Employees' Plan 2011.";
            if (vals.yearsOfService < minYOS) return "You must have at least " + minYOS + " years of service in order to retire at age " + vals.ageAtRetirement + " in the Missouri State Employees' Plan 2011.";
        
            var multiplier = 0.017 * vals.yearsOfService;
            var reduction = 0;
            if (!((vals.ageAtRetirement >= 67 && vals.yearsOfService >= 10)
                || (vals.ageAtRetirement + vals.yearsOfService >= 90))) {
                reduction = 0.06 * (67 - vals.ageAtRetirement);
            }

            multiplier *= (1 - reduction);
	        
            var benefit = multiplier * vals.finalAverageSalary;
            
            return benefit;
        }
        
        if (system == "JP") {
            var minYOS = 20;
            if (vals.ageAtRetirement >= 60) minYOS = 1;
        
            if (vals.ageAtRetirement < 55) return "You must be at least 55 years of age in order to retire in the Missouri State Judicial Plan.";
            if (vals.yearsOfService < minYOS) return "You must have at least " + minYOS + " years of service in order to retire at age " + vals.ageAtRetirement + " in the Missouri State Judicial Plan.";
        
            var multiplier = 0.5;
            
            if (vals.ageAtRetirement >= 62) {
                if (vals.yearsOfService < 12) multiplier *= vals.yearsOfService / 12.0;
            } else if (vals.ageAtRetirement >= 60) {
                if (vals.yearsOfService < 15) multiplier *= vals.yearsOfService / 15.0;
            }
	        
            var benefit = multiplier * vals.finalAverageSalary;
            
            return benefit;
        }
        
        if (system == "JP 2011") {
            if (vals.ageAtRetirement < 62) return "You must be at least 62 years of age in order to retire in the Missouri State Judicial Plan 2011.";
        
            var multiplier = 0.5;
            
            if (vals.ageAtRetirement >= 67) {
                if (vals.yearsOfService < 12) multiplier *= vals.yearsOfService / 12.0;
            } else if (vals.ageAtRetirement >= 62) {
                if (vals.yearsOfService < 20) multiplier *= vals.yearsOfService / 20.0;
            }
	        
            var benefit = multiplier * vals.finalAverageSalary;
            
            return benefit;
        }
        
        if (system == "ALJLAP") {
            var minYOS = 20;
            if (vals.ageAtRetirement >= 60) minYOS = 15;
            if (vals.ageAtRetirement >= 62) minYOS = 12;
            if (vals.ageAtRetirement >= 65) minYOS = 1;
        
            if (vals.ageAtRetirement < 55) return "You must be at least 55 years of age in order to retire in the Missouri State Administrative Law Judges and Legal Advisors Plan.";
            if (vals.yearsOfService < minYOS) return "You must have at least " + minYOS + " years of service in order to retire at age " + vals.ageAtRetirement + " in the Missouri State Administrative Law Judges and Legal Advisors Plan.";
        
            var multiplier = 0.5;
            
            if (vals.yearsOfService < 12) multiplier *= vals.yearsOfService / 12.0;
	        
            var benefit = multiplier * vals.finalAverageSalary;
            
            return benefit;
        }
        
        if (system == "PSRS") {
            var minYOS = 80 - vals.ageAtRetirement;
            if (vals.ageAtRetirement >= 45) minYOS = 25;
            if (vals.ageAtRetirement >= 55) minYOS = 5;
            
            if (vals.yearsOfService < minYOS) return "You must have at least " + minYOS + " years of service in order to retire at age " + vals.ageAtRetirement + " in the Missouri State Public Schools Retirement System.";
            
            var multiplier = 0.025 * vals.yearsOfService;

            if (vals.retirementDateRange.lt("7/1/2013")) {
                if (vals.yearsOfService > 30) {
                    multiplier = 0.0255 * vals.yearsOfService;
                } else if (vals.yearsOfService >= 25 && vals.yearsOfService + vals.ageAtRetirement < 80) {
                    multiplier = reductionFactors["PSRS"]["25-and-Out"][vals.yearsOfService] * vals.yearsOfService;               
                }
            }
            
            if (vals.ageAtRetirement < 60 && vals.yearsOfService < 25 && vals.yearsOfService + vals.ageAtRetirement < 80) {
                multiplier *= reductionFactors["PSRS"]["Age"][vals.ageAtRetirement];
            }
            
            if (multiplier > 1) multiplier = 1;
            
            var benefit = multiplier * vals.finalAverageSalary;
            return benefit;
        }
        
        if (system == "PEERS") {
            var minYOS = 80 - vals.ageAtRetirement;
            if (vals.ageAtRetirement >= 45) minYOS = 25;
            if (vals.ageAtRetirement >= 55) minYOS = 5;
            
            if (vals.yearsOfService < minYOS) return "You must have at least " + minYOS + " years of service in order to retire at age " + vals.ageAtRetirement + " in the Missouri State Public Education Employee Retirement System.";
            
            var multiplier = 0.0161 * vals.yearsOfService;

            if (vals.retirementDateRange.lt("7/1/2013") && vals.yearsOfService >= 25 && vals.yearsOfService + vals.ageAtRetirement < 80) {
                multiplier = reductionFactors["PEERS"]["25-and-Out"][vals.yearsOfService] * vals.yearsOfService;               
            }
            
            if (vals.ageAtRetirement < 60 && vals.yearsOfService < 25 && vals.yearsOfService + vals.ageAtRetirement < 80) {
                multiplier *= reductionFactors["PEERS"]["Age"][vals.ageAtRetirement];
            }
            
            if (multiplier > 1) multiplier = 1;
            
            var benefit = multiplier * vals.finalAverageSalary;
            return benefit;
        }
	},
	
	COLA: {
		rate: 0.02
	}
}; 

})();
