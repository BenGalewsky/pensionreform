var formula_table = {"sers": {"alt_false": {"social_false": 2.20, "social_true": 1.67},
                  "alt_true": {"social_false": 3.00, "social_true": 2.50}}};


// var pension_parms = {"type_of_plan": ["sers", "surs", "gars"], 
//                      "age_at_retirement": "integer",
//                      "years_of_service": "integer",
//                      "alt_plan": "boolean",
//                      "with_social": "boolean",
//                      "date_of_hire": "mm/dd/yyyy",
//                      "final_average_salary": "integer",
//                      "tier": "integer"
//                      }

// benefits grow approximately with inflation so we will disregard this

function calculate_sers_benefits(discount_rate, pension_parms, formula_table){
  raw_pension_rate =  discount_rate * pension_parms["years_of_service"] * 
  formula_table["sers"]["alt_" + pension_parms["alt_plan"].toString()]["social_" + pension_parms["with_social"].toString()] * 0.01;
  // Unclear if thresholding should occur before or after discounting
  if(pension_parms["alt_plan"]) {
    pension_rate = Math.min(raw_pension_rate, 0.80);
  } 
  else { 
    pension_rate = Math.min(raw_pension_rate, 0.75);
  }
  yearly_benefit = pension_parms["final_average_salary"] * pension_rate;
  if(pension_parms["with_social"]) {
    yearly_benefit = Math.max(yearly_benefit, 15 * pension_parms["years_of_service"]);
  } 
  else {
    yearly_benefit = Math.max(yearly_benefit, 25 * pension_parms["years_of_service"]);
  }
  return yearly_benefit;
}

function get_sers_discount(pension_parms){
  // Returns discount rate given pension parameters
  //   1 is no discount, 0 is ineligible!
  if(pension_parms["tier"] == 1){
    if(pension_parms["years_of_service"] < 8){
      return 0;
    }
    if(pension_parms["alt_plan"] == false){
      if(pension_parms["age_at_retirement"] >= 60){
        return 1;
      }
      if(pension_parms["age_at_retirement"] + pension_parms["years_of_service"] >= 85){
        return 1;
      }
      if(pension_parms["age_at_retirement"] >= 55 & pension_parms["years_of_service"] >= 25){
        return 1 - 0.05 * (60 - pension_parms["age_at_retirement"]) * 12;
      }
    }
    if(pension_parms["alt_plan"] == true){
      if(pension_parms["age_at_retirement"] >= 50 & pension_parms["years_of_service"] >= 25)
        return 1;
      if(pension_parms["age_at_retirement"] >= 55 & pension_parms["years_of_service"] >= 20){
        return 1;
      }
    }
  }
  if(pension_parms["tier"] == 2){
    if(pension_parms["alt_plan"] == false){
      if(pension_parms["years_of_service"] < 10){
        return 0;
      }
      if(pension_parms["age_at_retirement"] >= 67){
        return 1;
      }
      if(pension_parms["age_at_retirement"] >= 62){
        return 1 - (67 - pension_parms["age_at_retirement"]) * 12 * 0.005;
      }
    }
    if(pension_parms["alt_plan"] == true){
      if(pension_parms["age_at_retirement"] >= 60 & pension_parms["years_of_service"] >= 20){
        return 1;
      }
    }
  }
  return 0;    
}


function sers(pension_parms){
  if(pension_parms["date_of_hire"] < Date.parse("01/01/2011")){
    pension_parms["tier"] = 1;
  }
  else{
    pension_parms["tier"] = 2;
  }
  discount_rate = get_sers_discount(pension_parms);
  benefits = calculate_sers_benefits(discount_rate, pension_parms, formula_table);
  return benefits
}

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