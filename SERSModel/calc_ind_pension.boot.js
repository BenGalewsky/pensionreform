
function main(pension_parms){
  if(pension_parms["type_of_plan"] == "sers"){
    return sers(pension_parms)
  }
}


test_pension_parms = {"type_of_plan": "sers",
		"age_at_retirement": 64,
		"years_of_service": 38,
		"alt_plan": true,
		"with_social": true,
		"date_of_hire": "1/1/1984",
		"final_average_salary": 100000
};

main(test_pension_parms);