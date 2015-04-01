describe('Person Object', function() {
    beforeEach(function() {
        person = pension.person();
    });

    describe("Current Age", function() {
        it("Should fail if birth year not provided", function() {
            person.birthYear = null;
            person.currentYear = 2015;
            expect(function() {
                person.computeCurrentAge();
            }).toThrow('Missing data');
        });
        it("Should fail if current year is not provided", function() {
            person.birthYear = 1900;
            person.currentYear = null;
            expect(function() {
                person.computeCurrentAge();
            }).toThrow('Missing data');
        });

        it('should be 100 if it is 2015 and you were born in 1915', function() {
            person.birthYear = 1915;
            person.currentYear = 2015;
            person.computeCurrentAge();
            expect(person.currentAge).toBe(100);
        });

    });

    describe("Mortality Calculations", function() {
        it("Should skip if no gender provided", function() {
            person.gender = null;
            expect(person.getProbabilityOfDeath()).toBe('?');
            expect(person.getProbableAgeAtDeath()).toBe(0);
        });
        it("Should skip if no current age provided", function() {
            person.gender = 'f';
            person.currentAge = null;
            expect(person.getProbabilityOfDeath()).toBe('?');
            expect(person.getProbableAgeAtDeath()).toBe(0);

        });
        it("Should skip if no age at death provided", function() {
            person.gender = 'f';
            person.birthYear = 2015;
            person.currentAge = 2015;
            person.ageAtDeath = null;
            expect(person.getProbabilityOfDeath()).toBe('?');
        });

        describe('Gender tables', function() {
            beforeEach(function() {
                pension.mortalityRates = {
                    "male" : 'male table',
                    "female" : 'female table'
                };

            });

            it("Should use the male table if gender is male", function() {
                person.gender = 'm';
                expect(person.getMortalityTable()).toBe('male table');
            });
            it("Should use the female table if gender is female", function() {
                person.gender = 'f';
                expect(person.getMortalityTable()).toBe('female table');
            });
        });
        
        describe('Probability of reaching age of death', function() {
            beforeEach(function() {
                spyOn(person, 'getMortalityTable').and.returnValue({56:0.9, 57:0.9});
            });
            it('Should be 10% if age of death is 1 year from now and mortality rate is 90%', function(){
                person.currentAge = 55;
                person.ageAtDeath = 56;
                expect(person.getProbabilityOfDeath()).toBe('10%');                
            });
            it('Should be 1% if age of death is 2 years from now and mortality rate is 90% each year', function(){
                person.currentAge = 55;
                person.ageAtDeath = 57;
                expect(person.getProbabilityOfDeath()).toBe('1%');                
            });            
        });

        describe('Probable age of death', function() {
            it('Should be 86 if current age is 85 and mortality rate is 51%', function(){
                spyOn(person, 'getMortalityTable').and.returnValue({86:0.51, 87:0.52});

                person.currentAge = 85;
                expect(person.getProbableAgeAtDeath()).toBe('86');                
            });
            it("Should be 87 if current age is 85 and each year's mortality rate is 25%", function(){
                spyOn(person, 'getMortalityTable').and.returnValue({86:0.33, 87:0.33});

                person.currentAge = 85;
                expect(person.getProbableAgeAtDeath()).toBe('87');                
            });
            it("Should be 113 if current age is 85 and they survive to the end of the table at 113", function(){
                spyOn(person, 'getMortalityTable').and.returnValue({112:0.0, 113:0.0});

                person.currentAge = 111;
                expect(person.getProbableAgeAtDeath()).toBe('113');                
            });             
        });
        

    });
    
    describe('Age Calculations', function(){
    	it('should retire in 2013 if birth year was 1953 and age at retirement is 60', function(){
    		person.birthYear = 1953;
    		person.ageAtRetirement = 60;
    		person.computeRetirementYear();
    		expect(person.retirementYear).toBe(2013);
    	});
    	
    	it('should die in 2023 if birth year was 1953 and age at death is 70', function(){
    		person.birthYear = 1953;
    		person.ageAtDeath = 70;
    		person.computeDeathYear();
    		expect(person.deathYear).toBe(2023);
    	});
    	
    });
});