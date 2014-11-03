(function() {

PC.dataItems.IN_exciseSystem = new PC.DataItem.Exact.Bool({
    name: "State Excise Police, Gaming Agent, Gaming Control Officer, and Conservation Officers' Retirement Plan of Indiana",
    question: "Are you a member of the State Excise Police, Gaming Agent, Gaming Control Officer, and Conservation Officers' Retirement Plan of Indiana?",
    order: 39
});

var getSystem = function (vals) {
    if (vals.occupation == "policeOfficer" || vals.occupation == "fireFighter") {
        return "1977";
    }
    
    if (vals.occupation == "judge") {
        return "JRS";
    }
    
    if (vals.occupation == "teacher") {
        return vals.hireDate.isAfterOrEqual("7/1/2011") ? "PERF" : "TRS";
    }
    
    if (vals.IN_exciseSystem) {
        return "Excise";
    }
    
    return "PERF";
}

PC.systems.IN = {
	requirements: {
		ageAtRetirement: {},
		yearsOfService: {},
        occupation: { standards: ["teacher", "policeOfficer", "fireFighter", "judge"] },
		IN_exciseSystem: {
            askIf: [
                ["occupation"],
                function (vals) {
                    return vals.occupation != "teacher"
                        && vals.occupation != "policeOfficer"
                        && vals.occupation != "fireFighter"
                        && vals.occupation != "judge";
                }
            ]
        },
        hireDate: {
            askIf: [
                ["occupation"],
                function (vals) {
                    return vals.occupation == "teacher"
                        || vals.occupation == "judge";
                }
            ]
        },
		finalAverageSalary: {
            prereqs: [
                ["occupation", "IN_exciseSystem", "hireDate"],
                function (vals) {
                    var hint;
                    
                    var system = getSystem(vals);
                    
                    if (system == "PERF") {
                        hint = "Average of highest paid 20 quarters (five years).";
                    } else if (system == "TRS") {
                        hint = "Average of highest paid 5 years.";
                    } else if (system == "1977") {
                        hint = "Base (first class) salary for the employee's position in the year of retirement.";
                    } else if (system == "JRS") {
                        if (vals.hireDate.isAfterOrEqual("9/1/1985")) {
                            hint = "Applicable salary determined by statute for employee's position at time of retirement.";
                        } else {
                            hint = "Salary at the time of retirement.";
                        }
                    } else if (system == "Excise") {
                        hint = "Highest paid five years in employee's last ten years of employment.";
                    }
                    
                    PC.dataItems.finalAverageSalary.setHint('IN', hint);
                }
            ]
        }
	},
	
	calculatePension: function (vals) {
	    var system = getSystem(vals);
	    
	    if (system == "PERF") {
	        var minYOS = 85 - vals.ageAtRetirement;
            if (minYOS < 0) minYOS = 0;
            if (minYOS > 15 && vals.ageAtRetirement >= 50) minYOS = 15;
            if (minYOS > 10 && vals.ageAtRetirement >= 65) minYOS = 10;
            
	        if (vals.ageAtRetirement < 50) return "You must be at least 50 years of age in order to retire in the Public Employees' Retirement System of Indiana.";
	        if (vals.yearsOfService < minYOS) return "You must have at least " + minYOS + " years of service in order to retire at age " + vals.ageAtRetirement + " in the Public Employees' Retirement System of Indiana";
	    
	        var multiplier = 0.011 * vals.yearsOfService;
	        
	        var reduction = 0;
	        if (vals.ageAtRetirement < 60) {
	            reduction = 0.11 + 0.05 * (59 - vals.ageAtRetirement);
	        }
	        if (reduction > 1) reduction = 1;
	        
	        var benefit = multiplier * vals.finalAverageSalary * (1 - reduction);
	        return benefit;
	    }
	    
	    if (system == "TRS") {
    	    var minYOS = 85 - vals.ageAtRetirement;
            if (minYOS < 0) minYOS = 0;
            if (minYOS > 15 && vals.ageAtRetirement >= 60) minYOS = 15;
            if (minYOS > 10 && vals.ageAtRetirement >= 65) minYOS = 10;
            
	        if (vals.ageAtRetirement < 55) return "You must be at least 55 years of age in order to retire in the Teachers' Retirement System of Indiana.";
	        if (vals.yearsOfService < minYOS) return "You must have at least " + minYOS + " years of service in order to retire at age " + vals.ageAtRetirement + " in the Teachers' Retirement System of Indiana";
	        
	        var multiplier = 0.011 * vals.yearsOfService;
	        
	        var reduction = 0;
	        if (vals.ageAtRetirement < 60) {
	            reduction = 0.11 + 0.05 * (59 - vals.ageAtRetirement);
	        }
	        if (reduction > 1) reduction = 1;
	        
	        var benefit = multiplier * vals.finalAverageSalary * (1 - reduction);
	        return benefit;
	    }
	    
	    if (system == "1977") {
	        if (vals.yearsOfService < 20) return "You must have at least 20 years of service in order to retire in the Police and Firefighters' Retirement Fund of Indiana.";
            if (vals.ageAtRetirement < 50) return "You must be at least 50 years of age in order to retire in the Police and Firefighters' Retirement Fund of Indiana.";
            
            var multiplier = 0.5;
            
            if (vals.yearsOfService > 20) {
                if (vals.yearsOfService < 32) {
                    multiplier += 0.02 * (vals.yearsOfService - 20);
                } else {
                    multiplier += 0.24;
                }
            }
            
            if (vals.ageAtRetirement < 52) {
                var reduction = 0.07 * (52 - vals.ageAtRetirement);
                multiplier -= reduction;
            }
            
            if (multiplier > 0.74) multiplier = 0.74;
            
            var benefit = vals.finalAverageSalary * multiplier;            
	        return benefit;
	    }
	    
	    if (system == "JRS") {
            var minYOS = 85 - vals.ageAtRetirement;
            if (minYOS < 0) minYOS = 0;
            if (minYOS > 8 && vals.ageAtRetirement >= 62) minYOS = 8;
            
	        if (vals.ageAtRetirement < 55) return "You must be at least 55 years of age in order to retire in the Judges' Retirement System of Indiana.";
	        if (vals.yearsOfService < minYOS) return "You must have at least " + minYOS + " years of service in order to retire at age " + vals.ageAtRetirement + " in the Judges' Retirement System of Indiana";
	        
	        var multiplier = 0.24;
            
            if (vals.yearsOfService > 8) {
                if (vals.yearsOfService < 30) {
                    multiplier += 0.03 * (vals.yearsOfService - 8);
                } else {
                    multiplier += 0.24;
                }
            }
            
            if (vals.ageAtRetirement < 65 && vals.ageAtRetirement + vals.yearsOfService < 85) {
                var reduction = 0.012 * (65 - vals.ageAtRetirement);
                multiplier -= reduction;
            }
            
            if (multiplier < 0) multiplier = 0;
            if (multiplier > 0.60) multiplier = 0.60;
            
            var benefit = vals.finalAverageSalary * multiplier;            
	        return benefit;
	    }
	    
	    if (system == "Excise") {
	        if (vals.yearsOfService < 15) return "You must have at least 15 years of service in order to retire in the State Excise Police, Gaming Agent, Gaming Control Officer, and Conservation Officers' Retirement Plan of Indiana.";
	        if (vals.ageAtRetirement < 45) return "You must be at least 45 years of age in order to retire in the State Excise Police, Gaming Agent, Gaming Control Officer, and Conservation Officers' Retirement Plan of Indiana.";
	    
	        var multiplier = 0.25;
	        if (vals.yearsOfService > 10) {
	            multiplier += 0.0167 * (vals.yearsOfService - 10);
	        }
	        
	        if (vals.ageAtRetirement < 60) {
	            multiplier -= 0.03 * (60 - vals.ageAtRetirement);
	        }
	        
	        if (multiplier < 0) multiplier = 0;
	    
	        return multiplier * vals.finalAverageSalary;
	    }
	},
	
	COLA: {
        rate: 0
    },
}; 

})();
