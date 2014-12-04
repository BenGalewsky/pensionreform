(function() {

var multipliers = {
    1: 0.0273,
    2: 0.0545,
    3: 0.0818,
    4: 0.1091,
    5: 0.1364,
    6: 0.1636,
    7: 0.1909,
    8: 0.2182,
    9: 0.2455,
    10: 0.2727,
    11: 0.3,
    12: 0.3273,
    13: 0.3545,
    14: 0.3818,
    15: 0.4091,
    16: 0.4364,
    17: 0.4636,
    18: 0.4909,
    19: 0.5182,
    20: 0.5455,
    21: 0.5727,
    22: 0.6,
    23: 0.615,
    24: 0.63,
    25: 0.645,
    26: 0.66,
    27: 0.675,
    28: 0.69,
    29: 0.705,
    30: 0.72
};

function getClass(vals) {
    if (vals.occupation == "policeOfficer" && vals.policeOfficerType == "sheriff") {
        return "Sheriff";
    }
    
    if (vals.occupation == "fireFighter" || vals.occupation == "policeOfficer" || vals.IA_ProtectionClass) {
        return "Protection";
    }
    
    return "Regular";
}

PC.dataItems.IA_ProtectionClass = new PC.DataItem.Exact.Bool({
    name: "Protection Occupation Membership Class",
    question: "Are you a member of the Iowa Protection Occupation Class?",
    order: 38
});
    
PC.systems.IA = {
    requirements: {
        ageAtRetirement: {},
        yearsOfService: {},
        hireDateRange: { 
            dividers: ['7/1/2012']
        },
        occupation: { standards: ["policeOfficer"] },
        policeOfficerType: {
            standards: ["sheriff"],
            askIf: [
                ["occupation"],
                function (vals) {
                    return vals.occupation == "policeOfficer";
                }
            ]
        },
        IA_ProtectionClass: {
            askIf: [
                ["occupation", "policeOfficerType"],
                function (vals) {
                    if (vals.occupation == "fireFighter" || vals.occupation == "policeOfficer") {
                        return false;
                    }
                    
                    return true;
                }
            ]
        },
		finalAverageSalary: {
            prereqs: [
                ["hireDateRange", "occupation", "policeOfficerType"],
                function(vals) {
                    var memberClass = getClass(vals);
                    var hint = "Average of highest paid three years.";

                    if (memberClass == "Regular" && vals.hireDateRange.ge("7/1/2012")) {
                        hint = "Either the highest three year average salary as of June 30, 2012 or the highest five year average salary over employee's entire career, whichever is higher.";
                    }
                    
                    PC.dataItems.finalAverageSalary.setHint('IA', hint);
                }
            ]
        }
	},
	
    calculatePension: function (vals) {
        var memberClass = getClass(vals);

        if (memberClass == "Regular") {
            if (vals.ageAtRetirement + vals.yearsOfService < 88) {
                if (vals.ageAtRetirement < 55) return "You must be at least 55 years of age or your age and years of service must sum to 88 in order to retire in the Regular Membership Class of Iowa.";
            }
            
            var multiplier = 0.02 * vals.yearsOfService;
            if (vals.yearsOfService > 35) {
                multiplier = 0.65;
            } else if (vals.yearsOfService > 30) {
                multiplier = 0.6 + 0.01 * (vals.yearsOfService - 30);
            }
            
            if (!(vals.ageAtRetirement + vals.yearsOfService >= 88
                || vals.ageAtRetirement >= 65
                || (vals.ageAtRetirement >= 62 && vals.yearsOfService >= 20))) {
                // Early retirement
                var reductionRate = vals.hireDateRange.ge("7/1/2012") ? 0.06 : 0.03;
                
                var normalAge = 88 - vals.yearsOfService;
                if (vals.yearsOfService >= 20 && normalAge > 62) {
                    normalAge = 62;
                }
                if (normalAge > 65) {
                    normalAge = 65;
                }
                
                multiplier -= reductionRate * (normalAge - vals.ageAtRetirement);
                if (multiplier < 0) multiplier = 0;
            }
            
            var benefit = multiplier * vals.finalAverageSalary;
            return benefit;
        }
        
        if (memberClass == "Sheriff") {
            if (vals.ageAtRetirement < 50) return "You must be at least 50 years of age in order to retire in the Sheriff and Deputy Sheriff Membership Class of Iowa.";
            if (vals.ageAtRetirement < 55 && vals.yearsOfService < 22) return "You must have at least 22 years of service in order to retire at age " + vals.ageAtRetirement + " in the Sheriff and Deputy Sheriff Membership Class of Iowa.";
            
            var multiplier = multipliers[30];
            if (vals.yearOfService < 30) {
                multiplier = multipliers[vals.yearsOfService];
            }
            
            var benefit = multiplier * vals.finalAverageSalary;
            if (multiplier > 205000) {
                benefit = 205000;
            }
        }
        
        if (memberClass == "Protection") {
            if (vals.ageAtRetirement < 55) return "You must be at least 55 years of age in order to retire in the Protection Occupation Membership Class of Iowa.";
            
            var multiplier = multipliers[30];
            if (vals.yearOfService < 30) {
                multiplier = multipliers[vals.yearsOfService];
            }
            
            var benefit = multiplier * vals.finalAverageSalary;
            if (multiplier > 205000) {
                benefit = 205000;
            }
            
            return benefit;
        }
    },
	
	COLA: {
		rate: 0.015,
		info: "Minimum COLA of $25 anually granted by law. A higher dividend is permitted if funds are deemed available. Base on CPI increase for the year. Capped at 3%. An estimate of 1.5% is used in this calculator."
	}
};

})();
