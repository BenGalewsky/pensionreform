PC.systems = {};

PC.QuestionController = (function() {
    
    var requirements;
    var requirementSubs;
    var currentReqIndex;
    var origReqNames;
    var stateSystems;
    var checkedAlternatives;
    
    var DISCOUNT_RATE = 0.03;
    
    function calculateAnnuity(COLARate, COLAMax, COLAStart, COLACompounded, annualPension, age) {
        var discount = 1.0, COLA = 0.0, maleMort = 1.0, femaleMort = 1.0;
        var annuityCost = {
            male: 0.0,
            female: 0.0
        };
        
        for (var i = 0, imax = PC.MAX_AGE - age; i < imax; i++) {
            if (i) {
                discount /= 1 + DISCOUNT_RATE;
                if (i >= COLAStart) {
                    var rate;
                    if (typeof(COLARate) == "function") {
                        rate = COLARate(i);
                    } else {
                        rate = COLARate;
                    }
                    
                    if (COLACompounded) {
                        COLA = (COLA + 1) * (1 + rate) - 1;
                    } else {
                        COLA += rate;
                    }
                }
                
                maleMort *= (1 - PC.mortalityRates.male[age + i - 1]);
                femaleMort *= (1 - PC.mortalityRates.female[age + i - 1]);
            }
         
            var payment = (!COLAMax || COLAMax >= annualPension) ? annualPension*(1+COLA) : COLAMax*COLA + annualPension;
            annuityCost.male += payment * discount * maleMort;
            annuityCost.female += payment * discount * femaleMort;
        }
        
        return annuityCost;
    }
    
    
    return {
        init: function(states) {

            currentReqIndex = 0;
            origReqNames = [];
            checkedAlternatives = [];
        
            if (typeof(states) == 'string') states = [states];
        
            stateSystems = states;
            
            for (i in states) {
                if (!(states[i] in PC.systems)) throw new Error("Undefined state system for '"+states[i]+"'");

                var system = PC.systems[states[i]];
                
                for (var req in system.requirements) {

                    if (!PC.Utils.inArray(req, origReqNames)) {
                        if (!(req in PC.dataItems)) throw new Error("Data item '"+req+"' not found for "+states[i]+".");
                        PC.dataItems[req].clear();
                        origReqNames.push(req);
                    }
                    
                    PC.dataItems[req].addRequirement(states[i], system.requirements[req]);
                }
            }
            
            if (!PC.Utils.inArray('ageAtRetirement', origReqNames)) {
                origReqNames.push('ageAtRetirement');
                PC.dataItems['ageAtRetirement'].addRequirement('all', {});    
            }
            
            checkedAlternatives.push([origReqNames, []]);
            
            PC.QuestionController.expandAlternatives(checkedAlternatives, origReqNames, origReqNames, []);
            
            var bestScore;
            
            for (var i in checkedAlternatives) {
                
                var reqlist = checkedAlternatives[i][0];
                var subs = checkedAlternatives[i][1];
                var score = 0;

                for (var j in reqlist) {
                    score += PC.dataItems[reqlist[j]].getComplexity();
                }
                
                if (i == 0 || score < bestScore) {
                    bestScore = score;
                    requirementSubs = subs;
                    requirements = reqlist;
                }
            }
            
            for (var i in requirements) {
                var dataItem = PC.dataItems[requirements[i]];
                if (!dataItem.hasPrereqs()) continue;
                for (var j in requirementSubs) {
                    dataItem.subPrereq(requirementSubs[j][0], requirementSubs[j][1]);
                }
            }
            
            requirements = PC.DataItem.sort(requirements);
        },
        
        expandAlternatives: function (checked, orig, list, route) {

            for (var i in list) {
                // Expand each item in the list in terms of its alternatives.
                if (!(list[i] in PC.dataItems)) throw new Error("Unable to find alternative data item '"+list[i]+"'");
                var alternatives = PC.dataItems[list[i]].getAlternatives();

                for (var j in alternatives) {
                    // For each alternative set in the array of alternatives
                    
                    // Copy the list as a new list
                    var n = list.slice(0);
                    // Copy the route
                    var r = route.slice(0);
                    
                    // Add the list of alternatives to the route
                    r.push([list[i], alternatives[j]]);
                    // Remove the current item from the new list
                    n.splice(i, 1);
                    // Merge the new alternatives into the new list
                    n = PC.Utils.mergeArrays(n, alternatives[j]);
                    
                    // If the original list of requirements are in the new list, then we don't need this.
                    if (PC.Utils.subsetInArray(orig, n)) continue;
                    
                    // Check if the requirements list has already been found.
                    var old = false;
                    for (var j in checked) {
                        if (PC.Utils.arraysAreEqual(checked[j][0], n)) {
                            old = true;
                            break;
                        }
                    }
                    // If it's unique, expand it again.
                    if (!old) {
                        checked.push([n, r]);
                        PC.QuestionController.expandAlternatives(checked, orig, n, r);
                    }
                }
            }
        },
        
        
        next: function() {
            var dataItem = PC.dataItems[requirements[currentReqIndex]];
            ++currentReqIndex;
            return dataItem;
        },
        
        moreQuestions: function() {
            if (currentReqIndex == requirements.length) return false;
            while (currentReqIndex < requirements.length) {
                var dataItem = PC.dataItems[requirements[currentReqIndex]];
                var vals = PC.QuestionController.getAllCurrentValues();
                if (dataItem.preAsk(PC.QuestionController.getStates(), vals)) return true;

                for (var i in requirementSubs) {
                    for (var j in requirementSubs[i][1]) {
                        if (requirementSubs[i][1][j] == requirements[currentReqIndex]) {
                            dataItem = PC.dataItems[requirementSubs[i][0]];
                            if (dataItem.preAsk(PC.QuestionController.getStates(), vals)) return true;
                        }
                    }
                }
                         
                currentReqIndex++;
            }
            return false;
        },
        
        getPreviousValues: function() {
            var vals = {};
            for (var i = 0; i < currentReqIndex-1; i++) {
                vals[requirements[i]] = PC.dataItems[requirements[i]].getValue();
            }
            return vals;
        },
        
        getAllCurrentValues: function() {
            var vals = {};
            for (var i = 0; i < currentReqIndex; i++) {
                vals[requirements[i]] = PC.dataItems[requirements[i]].getValue();
            }
            PC.QuestionController.setAlternativeValues(vals, requirementSubs);
            return vals;
        },
        
        setAlternativeValues: function(vals, subs, allRequired) {
            for (var i = subs.length-1; i >= 0; i--) {
                var determine = subs[i][0];
                var withList = subs[i][1];
                if (determine in vals) continue;
                if (!allRequired && !PC.Utils.subsetInArray(withList, PC.Utils.getKeys(vals))) continue;
                if (PC.dataItems[determine].setValueFromAlternatives(withList, vals)) {
                    vals[determine] = PC.dataItems[determine].getValue();
                }
            }
        },
        
        getResults: function(includeFormattedInputs) {
            
            var results = {};
            var vals = {};
            
            for (var i in requirements) {
                vals[requirements[i]] = PC.dataItems[requirements[i]].getValue(); 
            }
            
            PC.QuestionController.setAlternativeValues(vals, requirementSubs, true);
            
            for (var i in stateSystems) {
                var annualPension = PC.systems[stateSystems[i]].calculatePension(vals);
                
                if ('maxPension' in PC.systems[stateSystems[i]]) {
                    maxPension = PC.systems[stateSystems[i]].maxPension;
                    if (annualPension > maxPension) annualPension = maxPension;
                }

                if (typeof(annualPension) == 'string') {
                    results[stateSystems[i]] = { error: annualPension };
                    continue;
                }

                var COLARate = PC.systems[stateSystems[i]].COLA.rate;
                var COLAMax = PC.systems[stateSystems[i]].COLA.max || false;
                var COLAStart = PC.systems[stateSystems[i]].COLA.start || 1;
                var COLACompounded = PC.systems[stateSystems[i]].COLA.compounded || false;
                var annuity = calculateAnnuity(COLARate, COLAMax, COLAStart, COLACompounded, annualPension, vals.ageAtRetirement);

                results[stateSystems[i]] = {
                    annualPension: '$'+PC.formatNumber(annualPension),
                    monthlyPension: '$'+PC.formatNumber(annualPension/12.0),
                    maleAnnuity: '$'+PC.formatNumber(annuity.male),
                    femaleAnnuity: '$'+PC.formatNumber(annuity.female),
                    COLARate: COLARate
                };
            }
            
            if (includeFormattedInputs) results.formattedInputs = PC.QuestionController.getFormattedInputs();
            
            return results;
        },
        
        getAnnuityCostInfo: function() {
            var infos = {};
            for (var i in stateSystems) {
                                if ('info' in PC.systems[stateSystems[i]].COLA)
                    infos[stateSystems[i]] = PC.systems[stateSystems[i]].COLA.info || 1;    
            }
            return infos;
        },
        
        getFormattedInputs: function() {
            var inputs = {};
            for (var i in requirements) {
                var dataItem = PC.dataItems[origReqNames[i]];
                if (!dataItem.ask()) continue;
                inputs[origReqNames[i]] = {
                    name: dataItem.getName(),
                    value: dataItem.getFormattedValue()
                };
            }
            return inputs;
        },
        
        setCurrent: function(i) {
            var shown = 0, total = 0;
            while (total < requirements.length) {
                var dataItem = PC.dataItems[requirements[total]];
                if (dataItem.ask()) ++shown;
                ++total;
                if (shown == i) {
                    currentReqIndex = total; 
                    return;
                }
            }
        },
        
        getState: function() {
            return (stateSystems.length > 1) ? 'all' : stateSystems[0];
        },
        
        getStates: function() {
            return stateSystems;
        }
    };
})();
