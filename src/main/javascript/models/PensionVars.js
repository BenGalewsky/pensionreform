
function SERSVars(){
		this.hireDate = {};
		this.birthDate = {};
		this.initialSalary = {};
		this.currentSalary = {};		
		this.ageAtRetirement = {};
		this.salaryHistory = {};
		
		this.occupation = {
            standards: ['teacher', 'judge', 'policeOfficer'],
            hint: "Police Officers include State police, conservation police, SOS investigators and similar."
        };
		IL_pensionSystem = {
			standards: ['GARS', 'SURS', 'SERS'],
			askIf: [
			    ['occupation'],
			    function (args) {
			    	return (args.occupation != 'teacher' && args.occupation != 'judge' && args.occupation != 'policeOfficer' && args.occupation != 'fireFighter');
			    }
			]      
		};
		IL_SERSAlternativeFormula = {
			askIf: [
			    ['occupation', 'hireDate', 'IL_pensionSystem'],
			    function (vals) {
			    	var system = getSystem(vals);
					var tier = getTier(vals);
			    	return (system == 'SERS' && tier == 1);
			    }
			]      
		};
		
		finalAverageSalary = {
			prereqs: [
			    ["occupation", "hireDate", "IL_pensionSystem", "IL_SERSAlternativeFormula"],
			    function(vals) {
			    	var system = getSystem(vals);
					var tier = getTier(vals);
					var hint = "N/A";
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
		};
	
}



SERSVars.prototype = {

		getSystem: function(){
	var system;
	if (this.occupation == 'teacher') {
		system = 'TRS';
	} else if (this.occupation == 'judge') {
		system = 'JRS';
    } else if (this.occupation == 'policeOfficer' || this.occupation == 'fireFighter') {
        system = 'SERS';
	} else {
		system = IL_pensionSystem;
	}
	return system;
},

getTier: function(){
	return (this.hireDate.isBefore('1/1/2011')) ? 1 : 2;
},

isCoveredBySocialSecurity: function(){
	var coveredBySocialSecurity = true;
    if (this.occupation == 'policeOfficer')
        coveredBySocialSecurity = false;
    return coveredBySocialSecurity;	
},

getYearsOfSvcAtDate: function(d){
	var years = d.getYear() - this.hireDate.getYear();    
    return years;	
},

getYearsAtRetirement: function(){
	var dateOfRetirement = this.birthDate.addYears(this.ageAtRetirement);
	return this.getYearsOfSvcAtDate(dateOfRetirement);
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
	calculateSalaryHistory: function(){
		
	}
};