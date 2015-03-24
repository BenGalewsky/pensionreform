var pension = pension || {};
var curryr = new Date();
pension.person = function(aEnv) {

    if (aEnv === undefined)
        aEnv = pension.environment();

    var that = {
        env : aEnv,
        hireYear : 2000,
        birthYear : 1970,
        ageAtDeath : null,
        probabilityOfSurvival: null,
        probabilityOfSurvivalInt: null,
        currentYear : curryr.getFullYear(), // This should move to env
        currentAge : null,
        ageAtRetirement : 65,
        currentSalary : 70000,
        startingSalary : null,
        endingYear : null,
        endingSalary : null,
        yearsOfService : null,
        finalAverageSalary : null,
        gender : "f",
        active : null,// true or false...
        salaryHistory : [],
        occupation : "",
        useAlternativeFormula : false,
        isCoveredBySocialSecurity : false,
        totalContributions : null,
        models : {},// will be used to store calculated outputs...

        computeCurrentAge : function() {
            if (!this.birthYear || !this.currentYear) {
                throw "Missing data";
            }
            this.currentAge = this.currentYear - this.birthYear;
        },

        getMortalityTable : function() {
            return pension.mortalityRates[this.gender == 'f' ? "female" : "male"];
        },
        
        computeRetirementYear : function(){
            this.retirementYear=this.birthYear+this.ageAtRetirement;       
        },
        
        computeDeathYear : function(){
            this.deathYear=this.birthYear+this.ageAtDeath;
        },

        // Should be get probability of reaching person's age of death
        getProbabilityOfDeath : function() {
            this.computeCurrentAge();
            if (!this.gender || !this.currentAge || !this.ageAtDeath)
                return "?";
            var tbl = this.getMortalityTable();
            var prob = 1;
            for ( var i in tbl) {
                if (i > this.currentAge && i <= this.ageAtDeath)
                    prob *= (1 - tbl[i]);
            }
            this.probabilityOfSurvival=prob;
            this.probabilityOfSurvivalInt=Math.round(prob*100);
        },

        getProbableAgeAtDeath : function() {
            this.computeCurrentAge();
            if (!this.gender || !this.currentAge)
                return 0;
            var tbl = this.getMortalityTable();
            var prob = 1;
            var age = 0;
            for ( var i in tbl) {
                if (tbl.hasOwnProperty(i) && i > this.currentAge) {
                    age = i;
                    prob *= (1 - tbl[i]);
                }

                if (prob < 0.51) {
                    break;
                }
            }
            return age*1;
        },

        finalAvgFromCurrentSalary : function(c, r) {
            if (c == undefined)
                c = this.currentSalary;
            if (r == undefined)
                r = 1 + this.env.WAGE_INFLATION;
            if (!this.currentYear || !this.endingYear)
                return 0;
            var finalSalary = Math.round(c * Math.pow((1 + this.env.WAGE_INFLATION), (this.endingYear - this.currentYear)));
            // we have the final Salary, now do the inverse of the next
            // function...
            return Math.round(c / 4 * (Math.pow(r, -3) + Math.pow(r, -2) + Math.pow(r, -1) + 1));
        },

        finalFromFinalAvgSalary : function(f, r) {
            if (f == undefined)
                f = this.finalAverageSalary;
            if (r == undefined)
                r = 1 + this.env.WAGE_INFLATION;
            // if s1=s0*(r)^yrs and we want to average the last four years then
            // start with the final salary and go backwards with
            //  
            // f=finalAvgSalary
            return f * 4 / (Math.pow(r, -3) + Math.pow(r, -2) + Math.pow(r, -1) + 1);
        },

        isActiveOrRetired : function() {// retired or inactive...
            if (!this.birthYear || !(this.endingYear || this.yearsOfService || this.ageAtRetirement))
                this.active = null;
            else {

                var lastYear = 0;
                if (this.endingYear)
                    lastYear = this.endingYear;
                else if (this.yearsOfService)
                    lastYear = this.hireYear + this.yearsOfService;
                else
                    lastYear = this.birthYear + this.ageAtRetirement;
                this.active = (lastYear >= this.currentYear);

            }
            return this.active;
        },

        setCurrentYear : function() {
            if (!this.currentYear)
                this.currentYear = curryr.getFullYear();
        },

        // uses current salary to estimate ending salary
        estimateFromCurrent : function() {
            this.setCurrentYear();
            this.endingSalary = Math.round(this.currentSalary
                    * Math.pow((1 + this.env.WAGE_INFLATION), (this.endingYear - this.currentYear)));
            this.startingSalary = Math.round(this.currentSalary
                    * Math.pow((1 + this.env.WAGE_INFLATION), (this.hireYear - this.currentYear)));
            this.generateDefaultSalaryHistory();
        },

        // uses ending salary to estimate other salaries
        estimateFromEnding : function() {
            this.setCurrentYear();
            this.currentSalary = Math.round(this.endingSalary
                    * Math.pow((1 + this.env.WAGE_INFLATION), (this.currentYear - this.endingYear)));
            this.startingSalary = Math.round(this.endingSalary
                    * Math.pow((1 + this.env.WAGE_INFLATION), (this.hireYear - this.endingYear)));
            this.generateDefaultSalaryHistory();
        },

        // uses finalAvgSalary to estimate other salaries
        estimateFromFinalAvg : function() {
            this.endingSalary = Math.round(this.finalFromFinalAvgSalary());
            this.estimateFromEnding();
        },

        // this will create a salary history array from estimated data points
        // Assumes we know beginning and ending years and salaries, also current
        // if an active employee...
        generateDefaultSalaryHistory : function() {
            if (!this.hireYear || !this.startingSalary || !this.currentSalary || !this.endingSalary || !this.endingYear)
                ;
            this.salaryHistory = [];

            // calculate start to current ...
            var yr1 = this.currentYear;
            var yr0 = this.hireYear;

            var s1 = this.currentSalary, s0 = this.startingSalary;
            var r = (1 + this.env.WAGE_INFLATION);// rate of inflation between
            // salary points...
            // recalculated below.
            var sal = 0;// salary... calculated below...
            var i;

            // but only if current is less than ending year...
            if (this.currentYear < this.endingYear) {
                r = Math.pow(s1 / s0, 1 / (yr1 - yr0));// determine the rate of
                // inflation between yr0
                // and yr1...
                for (i = yr0; i < yr1; i++) {
                    sal = Math.round(s0 * Math.pow(r, i - yr0));
                    this.salaryHistory.push({
                        "year" : i,
                        "salary" : sal,
                        "yearsOfService" : 1,
                        "contribution" : Math.round(sal * 0.08)
                    });
                }

                // move current to start...
                yr0 = yr1;
                s0 = s1;
            }

            // now calculate from start (or current) to ending year...
            s1 = this.endingSalary;
            yr1 = this.endingYear;
            r = Math.pow(s1 / s0, 1 / (yr1 - yr0));
            for (i = yr0; i < yr1; i++) {
                sal = s0;
                if (yr1 != yr0)
                    sal = Math.round(s0 * Math.pow(r, i - yr0));

                this.salaryHistory.push({
                    "year" : i,
                    "salary" : sal,
                    "yearsOfService" : 1,
                    "contribution" : Math.round(sal * 0.08)
                });
            }

        },

        computeFinalAverageSalary : function() {
            // calculate the average best 4 years in last 10...
            var last10yrs = this.salaryHistory.slice(-10);
            last10yrs.sort(function(a, b) {
                return a.salary - b.salary;
            });
            last10yrs = last10yrs.slice(-4);
            this.avgYr = 0;// avgYr and this.finalAverageSalary become the
            // first coordinates of the finalAverageSalary Line
            // on the graph...
            this.finalAverageSalary = 0;
            for (var i = 0; i < last10yrs.length; i++) {
                this.avgYr += last10yrs[i].year;
                this.finalAverageSalary += last10yrs[i].salary;
            }

            this.finalAverageSalary = Math.round(this.finalAverageSalary / last10yrs.length);

            this.avgYr = Math.round(this.avgYr / last10yrs.length);
        },

        computeYearsOfService : function() {
            var t = 0;
            for (var i = 0; i < this.salaryHistory.length; i++) {
                t += this.salaryHistory[i].yearsOfService;
            }
            this.yearsOfService = t;
        }

    };
    that.ageAtDeath=that.getProbableAgeAtDeath();
    return that;

};