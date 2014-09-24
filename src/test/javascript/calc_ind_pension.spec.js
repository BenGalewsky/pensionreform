describe("Pension Calculator", function(){
	describe("State Employee Retirement System", function(){
			describe("System Tiers", function(){
				beforeEach(function(){
					parms = {"type_of_plan": "sers",
							"age_at_retirement": 64,
							"years_of_service": 38,
							"alt_plan": true,
							"with_social": true,
							"final_average_salary": 100000
					};
				});
				
				it("Should use Tier 1 for hire date before 1/1/2011", function(){
					parms["date_of_hire"] = "1/1/1984";
					sers(parms);
					expect(parms["tier"]).toEqual(1);
				});
				
				it("Should use Tier 2 for hire date after 1/1/2011", function(){
					parms["date_of_hire"] = "1/1/2011";
					sers(parms);
					expect(parms["tier"]).toEqual(2);
				});
			});
});

});