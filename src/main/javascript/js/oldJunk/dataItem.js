PC.dataItems = {};

PC.Date = function(y, m, d) {
    
    if (arguments.length == 1) {
    
        var dateStr = y;
        
        var matches = PC.Date.MDYregex.exec(dateStr);
        if (matches) {
            this.dateObj = new Date(matches[3], parseInt(matches[1])-1, matches[2]);
            return;
        }
        
        var mon;
        matches = PC.Date.monDYregex.exec(dateStr);
        if (matches) {
            d = matches[2];
            mon = matches[1];
            y = matches[3];
        } else {
            matches = PC.Date.DmonYregex.exec(dateStr);
            if (matches) {
                d = matches[1];
                mon = matches[2];
                y = matches[3];
            }
        }
        
        if (!mon) return;
        
        mon = mon.charAt(0).toUpperCase() + mon.substr(1).toLowerCase();
        m = -1;
        for (var i in PC.Date.mons) {
            if (mon == PC.Date.mons[i]) {
                m = i;
                break;
            }
        }
    } else {
        --m;
    }
    
    if (m >= 0) {
        this.dateObj = new Date(y, m, d);
        return
    }
    
}
PC.Date.MDYregex = /(\d{1,2})[\/\-\.\s](\d{1,2})[\/\-\.\s](\d{4})/;
PC.Date.monDYregex = /(\w{3})\D*(\d{1,2})\D+(\d{4})/;
PC.Date.DmonYregex = /(\d{1,2})\W*(\w{3})\D+(\d{4})/;
PC.Date.SEPARATOR = "/";
PC.Date.mons = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
PC.Date.prototype = {
    getMonth: function() {
        return this.dateObj.getMonth() + 1;
    },
    
    getDay: function() {
        return this.dateObj.getDate();
    },
    
    getYear: function() {
        return this.dateObj.getFullYear();
    },
    
    isValid: function() {
        return (this.dateObj) ? true : false;
    },
    
    toString: function() {
        return this.getMonth() + PC.Date.SEPARATOR + this.getDay() + PC.Date.SEPARATOR + this.getYear();
    },
    
    isAfter: function(other) {
        if (typeof(other) == 'string') other = new PC.Date(other);
        if (this.getYear() != other.getYear()) return (this.getYear() > other.getYear());
        if (this.getMonth() != other.getMonth()) return (this.getMonth() > other.getMonth());
        return (this.getDay() > other.getDay());
    },
    
    isBefore: function(other) {
        if (typeof(other) == 'string') other = new PC.Date(other);
        if (this.getYear() != other.getYear()) return (this.getYear() < other.getYear());
        if (this.getMonth() != other.getMonth()) return (this.getMonth() < other.getMonth());
        return (this.getDay() < other.getDay());
    },
    
    isAfterOrEqual: function(other) {
        if (typeof(other) == 'string') other = new PC.Date(other);
        return (this.isAfter(other) || this.isEqual(other)); 
    },
    
    isBeforeOrEqual: function(other) {
        if (typeof(other) == 'string') other = new PC.Date(other);
        return (this.isBefore(other) || this.isEqual(other));
    },
    
    isEqual: function(other) {
        if (typeof(other) == 'string') other = new PC.Date(other);
        if (this.getYear() != other.getYear()) return false;
        if (this.getMonth() != other.getMonth()) return false;
        if (this.getDay() != other.getDay()) return false;
        
        return true;
    },
    
    dayDiff: function(other) {
        if (typeof(other) == 'string') other = new PC.Date(other);
        var t2 = this.dateObj.getTime();
        var t1 = other.dateObj.getTime();
        return (t2-t1)/(24*3600*1000);
    },

    yearDiff: function(other) {
        if (typeof(other) == 'string') other = new PC.Date(other);
        return this.dayDiff(other)/365;
    },
    
    addYears: function(years) {
        return new PC.Date(this.getYear() + years, this.getMonth(), this.getDay());
    },
    
    compare: function(other) {
        if (typeof(other) == 'string') other = new PC.Date(other);
        if (this.isEqual(other)) return 0;
        if (this.isBefore(other)) return -1;
        return 1;
    }
};
PC.Date.compareStrings = function(a, b) {
    a = new PC.Date(a);
    b = new PC.Date(b);
    return a.compare(b);
};


PC.DataItem = function(args) {
    this._complexity = 1.0;
    this._alternatives = [];
    this._alternativeFuncs = {};
    this._checks = [];
    this._checkFuncs = {};
    this._ask = true;
    this._defaults = {};
    this._alwaysAsk = false;
    
    this._question = args.question;
    this._name = args.name;

    if ("complexityMultiplier" in args) this._complexity *= args.complexityMultiplier;
    if ('alternatives' in args) this.addAlternatives(args.alternatives);
    if ('checks' in args) this.addChecks(args.checks);

    this._order = args.order || 0;
    
    if ('hint' in args) this._defaults.hint = args.hint;
    
    this.clear();
};
PC.Utils.setProperties(PC.DataItem.prototype, {
    clear: function() {
        this._hints = {};
        if ('hint' in this._defaults) this._hints.all = this._defaults.hint;
        this._askIfs = {};
        this._alwaysAsk = false;
        this._askIfFuncs = {};
        this._prereqs = {};
        this._prereqs.all = [];
        this._prereqFuncs = {};
    },
    
    _storeInput: function(input) {
        PC.SessionStorage.set('dataItems.'+this.getId(), input);
    },
    
    _getStoredInput: function() {
        var key = 'dataItems.'+this.getId();
        if (PC.SessionStorage.exists(key)) return PC.SessionStorage.get(key);
        return '';
    },
    
    addAlternative: function(alternatives, func) {
        this._alternatives.push(alternatives);
        this._alternativeFuncs[alternatives.sort()] = func;
    },
    
    addAlternatives: function(alts) {
        for (var i = 0, imax = alts.length; i < imax; i += 2) {
            this.addAlternative(alts[i], alts[i+1]);
        }
    },
    
    addCheck: function(fields, func) {
        this._checks.push(fields);
        this._checkFuncs[fields.sort()] = func;
    },
    
    addChecks: function(fields) {
        for (var i = 0, imax = fields.length; i < imax; i += 2) {
            this.addCheck(fields[i], fields[i+1]);
        }
    },
    
    addPrereqs: function(state, prereqs) {
        this._prereqs.all = PC.Utils.mergeArrays(this._prereqs.all, prereqs[0]);
        if (prereqs[1]) {
            this._prereqs[state] = prereqs[0];
            this._prereqFuncs[state] = prereqs[1];
        }
    },
    
    subPrereq: function(replaceReq, withReqs) {
        if (!this._prereqs.all.length) return;
        var i = PC.Utils.indexOf(replaceReq, this._prereqs.all);
        if (i < 0) return;
        this._prereqs.all.splice(i, 1);
        this._prereqs.all = PC.Utils.mergeArrays(this._prereqs.all, withReqs);
    },
    
    hasPrereqs: function() {
        return (this._prereqs.all.length > 0);
    },
    
    addAskIf: function(state, askIf) {
        this._prereqs.all = PC.Utils.mergeArrays(this._prereqs.all, askIf[0]);
        this._askIfs[state] = askIf[0];
        this._askIfFuncs[state] = askIf[1];
    },
    
    getAlternatives: function() {
        return this._alternatives;
    },
    
    getValue: function(state) {
        return this._value;
    },
    
    setValue: function(value) {
        this._value = value;
    },
    
    getFormattedValue: function() {
        return this._value;
    },
    
    setValueFromAlternatives: function(alternatives, values) {
        alternatives = alternatives.sort();
        if (!(alternatives in this._alternativeFuncs)) return false;
        this._value = this._alternativeFuncs[alternatives](values);
        this._storeInput(this._value);
        return true;
    },
    
    getName: function() {
        return this._name;
    },
    
    getHint: function(state) {
        if (state) {
            if (state in this._hints) return this._hints[state];
            if ("all" in this._hints) return this._hints.all;
        } else {
            return this._hints;
        }
    },
    
    setHint: function(state, hint) {
        this._hints[state] = hint;
    },
    
    getQuestion: function() {
        return this._question;
    },
    
    getId: function() {
        if (!('_id' in this)) this._id = PC.Utils.indexOf(this, PC.dataItems);
        return this._id;
    },
    
    check: function(val) {
        var previousVals = PC.QuestionController.getPreviousValues();
        if (PC.Utils.objIsEmpty(previousVals)) return false;
        
        for (var i in this._checks) {
            var check = this._checks[i];
            if (PC.Utils.subsetInArray(check, PC.Utils.getKeys(previousVals))) {
                var error = this._checkFuncs[check.sort()](val, previousVals);
                if (error) return error;
            } else {
                
                var alts = [];
                PC.QuestionController.expandAlternatives(alts, check, check, []);
                for (var i in alts) {
                    if (PC.Utils.subsetInArray(alts[i][0], PC.Utils.getKeys(previousVals))) {
                        PC.QuestionController.addAlternativeValues(previousVals, alts[i][1]);
                        var error = this._checkFuncs[check.sort()](val, previousVals);
                        if (error) return error;
                        break;
                    }
                }
            }
        }
    },

    ask: function() {
        return this._ask;
    },
    
    preAsk: function(states, vals) {
        for (var s in this._prereqs) {
            var svals = {};
            if (s == 'all') continue;
            for (var i in this._prereqs[s]) {
                svals[this._prereqs[s][i]] = vals[this._prereqs[s][i]];
            }
            this._prereqFuncs[s](svals);
        }
        
        if (this._alwaysAsk) {
            this._ask = true;
            return true;
        }
        
        if (!PC.Utils.objIsEmpty(this._askIfs)) {
            for (j in states) {
                var state = states[j];
                if (state in this._askIfs) {
                    var svals = {};
                    for (var i in this._askIfs[state]) {
                        svals[this._askIfs[state][i]] = vals[this._askIfs[state][i]];
                    }
                    if (this._askIfFuncs[state](svals)) {
                        this._ask = true;
                        return true;
                    }
                }
            }
            this._ask = false;
            return false;
        }
        this._ask = true;
        return true;
        
    },
    
    getComplexity: function() {
        return this._complexity;
    },
    
    addRequirement: function(state, args) {
        if ("hint" in args) this._hints[state] = args.hint;
        if ('askIf' in args) this.addAskIf(state, args.askIf);
        else this._alwaysAsk = true;
        if ('prereqs' in args) this.addPrereqs(state, args.prereqs);
    }
});

PC.DataItem.sort = function(ids) {
    var sortedIds = [];
    
    for (var i = 0; i < ids.length; i++) {
        var newId = ids[i];
        var newDataItem = PC.dataItems[newId];
        var inserted = false;
        
        for (var j = 0; j < sortedIds.length; j++) {
            var oldId = sortedIds[j];
            var oldDataItem = PC.dataItems[oldId];
            
            if (PC.Utils.inArray(newId, oldDataItem._prereqs.all)) {
                sortedIds.splice(j, 0, newId);
                inserted = true;
                break;
            }
        }
        
        if (!inserted) {
            for (var j = sortedIds.length - 1; j >= 0; j--) {
                var oldId = sortedIds[j];
                var oldDataItem = PC.dataItems[oldId];
                
                if (PC.Utils.inArray(oldId, newDataItem._prereqs.all) || newDataItem._order < oldDataItem._order) {
                    sortedIds.splice(j + 1, 0, newId);
                    inserted = true;
                    break;
                }
            }
        }
        
        if (!inserted) sortedIds.splice(0, 0, newId);
    }
    
    return sortedIds;
}

PC.DataItem.Exact = function(args) {
    PC.DataItem.apply(this, arguments);
    
    if ("min" in args) this._defaults.min = args.min;
    if ("max" in args) this._defaults.max = args.max;
    
    this._inputSize = args.inputSize || 10;
};
PC.Utils.copyPrototype(PC.DataItem.Exact, PC.DataItem);
PC.Utils.setProperties(PC.DataItem.Exact.prototype, {
    clear: function() {
        PC.DataItem.prototype.clear.apply(this, arguments);
        
        this._min = {};
        this._max = {};
        this._softMin = {};
        this._softMax = {};
        
        if ('min' in this._defaults) this._min.all = this._defaults.min;
        if ('max' in this._defaults) this._max.all = this._defaults.max;
    },
    
    attach: function(obj) {
        delete this._value;
    
        this._input = document.createElement("input");
        this._input.className = 'PC.input.text';
        this._input.size = this._inputSize;
        this._input.type = "text";
        
        this._input.value = this._getStoredInput();
        
        obj.appendChild(this._input);
    },
    
    addRequirement: function(state, args) {
        PC.DataItem.prototype.addRequirement.apply(this, arguments);
        if ("min" in args) {
            this._min[state] = args.min;
            if (args.min < this._min.all) this._min.all = args.min; 
        }
        if ("max" in args) {
            this._min[state] = args.max;
            if (args.max < this._max.all) this._max.all = args.max; 
        }
        
        if ("softMin" in args) this._softMin[state] = args.softMin;
        if ("softMax" in args) this._softMax[state] = args.softMax;
    }    
});


PC.DataItem.Exact.Int = function(args) {
    PC.DataItem.Exact.apply(this, arguments);
};
PC.Utils.copyPrototype(PC.DataItem.Exact.Int, PC.DataItem.Exact);
PC.Utils.setProperties(PC.DataItem.Exact.Int.prototype, {
    process: function() {
        var val = this._input.value;
        
        if (!val.length) return 'Please enter a value';
        
        val = val.replace(",", "");
        val = Math.round(val);
        
        if (isNaN(val)) return 'Please enter a valid number';

        if ("all" in this._min && val < this._min.all) return 'The number you entered is too low';
        if ("all" in this._max && val > this._max.all) return 'The number you entered is too high';
        
        var checkError = this.check(val);
        if (checkError) return checkError;
        
        this._storeInput(val);
        
        var state = PC.QuestionController.getState();
        if (state in this._softMin && val < this._softMin[state]) val = this._softMin[state];
        if (state in this._softMax && val > this._softMax[state]) val = this._softMax[state];
        
        this._value = val;
        
        val = PC.formatNumber(val);
        this._input.value = val;
    },

    getFormattedValue: function() {
        return PC.formatNumber(this._value);
    }
});


PC.DataItem.Exact.Money = function(args) {
    PC.DataItem.Exact.apply(this, arguments);
};
PC.Utils.copyPrototype(PC.DataItem.Exact.Money, PC.DataItem.Exact);
PC.Utils.setProperties(PC.DataItem.Exact.Money.prototype, {
    attach: function(obj) {
        delete this._value;
    
        obj.appendChild(document.createTextNode('$ '));
        
        this._input = document.createElement("input");
        this._input.className = 'PC.input.text';
        this._input.size = this._inputSize;
        this._input.type = "text";
        
        this._input.value = this._getStoredInput();
        
        obj.appendChild(this._input);
    },
    
    process: function() {
        
        var val = this._input.value;
        
        if (!val.length) return 'Please enter a value';
        
        val = val.replace(/,/g, "");

        val = Math.round(val);
        
        if (isNaN(val)) return 'Please enter a valid amount';
        
        var state = PC.QuestionController.getState();
        if (state in this._softMin && val < this._softMin[state]) val = this._softMin[state];
        if (state in this._softMax && val > this._softMax[state]) val = this._softMax[state];
        
        if ("all" in this._min && val < this._min.all) return 'The amount you entered is too low';
        if ("all" in this._max && val > this._max.all) return 'The amount you entered is too high';

        this._value = val;
        val = PC.formatNumber(val);
        this._storeInput(val);
        this._input.value = val;
        
    },

    getFormattedValue: function() {
        return '$'+PC.formatNumber(this._value);
    }
});


PC.DataItem.Exact.Date = function(args) {
    PC.DataItem.Exact.apply(this, arguments);
    this._complexity *= 1.8;
};
PC.Utils.copyPrototype(PC.DataItem.Exact.Date, PC.DataItem.Exact);
PC.Utils.setProperties(PC.DataItem.Exact.Date.prototype, {
    process: function() {
    
        var date = new PC.Date(this._input.value);
        if (!date.isValid()) return "Invalid date. Please enter as MM/DD/YYYY.";
        
        var val = date.toString();
        this._input.value = val;
    
        if ("all" in this._min && date.isBefore(this._min.all)) return 'The date you entered is too early';
        if ("all" in this._max && date.isAfter(this._max.all)) return 'The date you entered is too late';
        
        var checkError = this.check(date);
        if (checkError) return checkError;
        
        this._value = date;
        this._storeInput(val);
    },

    getFormattedValue: function() {
        return this._value.toString();
    }
});


PC.DataItem.Set = function(args) {
    PC.DataItem.apply(this, arguments);
    if ('items' in args) this._defaults.items = args.items;
    this._standards = args.standards || {};
    this._sort = true;
    if ("sort" in args) this._sort = args.sort;
    this._other = args.other || false;
};
PC.Utils.copyPrototype(PC.DataItem.Set, PC.DataItem);
PC.Utils.setProperties(PC.DataItem.Set.prototype, {
    clear: function() {
        PC.DataItem.prototype.clear.apply(this, arguments);
        this._items = this._defaults.items || [];
    },
    
    attach: function(obj) {
        delete this._value;
    
        this._input = document.createElement("select");
        this._input.className = 'PC.input.select';

        var items = this._items.slice(0);
        if (this._other) items.push('Other');
        var val = this._getStoredInput();
        
        if (items.length > 4) {
            this._inputType = 'select';
            
            for (var i in items) {
                var option = document.createElement('option');
                option.value = items[i];
                option.appendChild(document.createTextNode(items[i]));
                this._input.appendChild(option);
            }
            
            if (val) {
                this._input.value = val;
            } else {
                this._input.selectedIndex = -1;
            }
            
            obj.appendChild(this._input);
        } else {
            this._inputType = 'radio';
            
            this._radios = {};
            var table = document.createElement('table');
            table.className = 'PC.input.radioTable';
            
            for (var i in items) {
                
                var id = 'PC.DataItems.'+this._name+'.'+items[i];
                
                var radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = 'PC.DataItems.'+this._name;
                radio.value = items[i];
                radio.id = id;
                if (items[i] == val) radio.checked = true;
                
                var label = document.createElement('label');
                label.htmlFor = id;
                label.appendChild(document.createTextNode(items[i]));
                
                var row = table.insertRow(-1);
                var cell = row.insertCell(-1);
                cell.appendChild(radio);
                cell = row.insertCell(-1);
                cell.appendChild(label);
                
                this._radios[items[i]] = radio;
                
            }
            obj.appendChild(table);
        }
        
        
    },
    
    addRequirement: function(state, args) {
        PC.DataItem.prototype.addRequirement.apply(this, arguments);
        for (var i in args.items) {
            if (!PC.Utils.inArray(args.items[i], this._items)) {
                this._items.push(args.items[i])
            }
        }
        
        if (!args.standards) {
            args.standards = [];
            for (var standard in this._standards) {
                args.standards.push(standard);
            }
        }
        
        for (var i in args.standards) {
            if (!PC.Utils.inArray(this._standards[args.standards[i]], this._items)) {
                this._items.push(this._standards[args.standards[i]])
            }
        }
        if (this._sort) this._items = this._items.sort();
    },
    
    process: function() {
        var val;
        if (this._inputType == 'select') {
            val = this._input.value;
        } else if (this._inputType == 'radio') {
            for (var i in this._radios) {
                if (this._radios[i].checked) {
                    val = i;
                    break;
                }
            }
        }
        if (!PC.Utils.inArray(val, this._items) && val != 'Other') return 'You must select an option';
        this._value = val;
        this._storeInput(val);
    },
    
    getValue: function(state) {
        var val = this._value;
        for (var i in this._standards) {
            if (this._standards[i] == val) {
                val = i;
                break;
            }
        }
        return val;
    },
    
    getStandard: function(standard) {
        return this._standards[standard];
    },
    
    getComplexity: function() {
        return this._complexity*this._items.length/4;
    }
});


PC.DataItem.Exact.Bool = function(args) {
    PC.DataItem.Set.apply(this, arguments);
};
PC.Utils.copyPrototype(PC.DataItem.Exact.Bool, PC.DataItem.Set);
PC.Utils.setProperties(PC.DataItem.Exact.Bool.prototype, {
    getFormattedValue: function() {
        return this._value;
    },
    
    getValue: function(state) {
        return (this._value == 'Yes');
    },
    
    clear: function() {
        PC.DataItem.prototype.clear.apply(this, arguments);
        this._items = ['Yes', 'No'];
        this._sort = false;
    }
});



PC.DataItem.Range = function(args) {
    PC.DataItem.Set.apply(this, arguments);
    this._defaultDividers = args.dividers || [];
    this._dividers = this._defaultDividers;
};
PC.Utils.copyPrototype(PC.DataItem.Range, PC.DataItem.Set);
PC.Utils.setProperties(PC.DataItem.Range.prototype, {
    addRequirement: function(state, args) {
        PC.DataItem.Set.prototype.addRequirement.apply(this, arguments);
        for (var i in args.dividers) {
            if (!PC.Utils.inArray(args.dividers[i], this._dividers)) {
                this._dividers.push(args.dividers[i])
            }
        }
        
        this._sortDividers();
        
        this._items = [];
        
        var num = this._dividers.length;
        
        this._items.push(this._preText(this._dividers[0]));
        for (var i = 0; i < num-1; i++) {
            this._items.push(this._betweenText(this._dividers[i], this._dividers[i+1]));
        }
        this._items.push(this._postText(this._dividers[num-1]));
    },
    
    getFormattedValue: function() {
        return this._value;
    },
    
    getRangeFromExact: function(exact) {
        for (var i in this._dividers) {
            if (exact < this._dividers[i]) {
                return this._items[i];
            }
        }
        return this._items[this._dividers.length];
    },
    
    getValue: function(state) {

        var i = PC.Utils.indexOf(this._value, this._items);
        
        return (function(i, value, dividers) {
            var lt = function(val) {
                if (dividers[i-1] >= val) return false;
                if (dividers[i] <= val) return true;
                throw new Error('Unable to determine comparison');
            };
            return {
                lt: lt,
                ge: function(val) {
                    return !lt(val);
                },
                value: value
            };
        })(i, this._value, this._dividers);
    },
    
    clear: function() {
        PC.DataItem.Set.prototype.clear.apply(this, arguments);
        this._dividers = this._defaultDividers;
    }
});

PC.DataItem.Range.Int = function(args) {
    PC.DataItem.Range.apply(this, arguments);
};
PC.Utils.copyPrototype(PC.DataItem.Range.Int, PC.DataItem.Range);
PC.Utils.setProperties(PC.DataItem.Range.Int.prototype, {
    _preText: function(txt) {
        return 'Fewer than ' + txt;
    },
    _postText: function(txt) {
        return txt + ' or more';
    },
    _betweenText: function(a, b) {
        return 'At least ' + a + ' but fewer than ' + b;
    },
    
    _sortDividers: function() {
        this._dividers = this._dividers.sort();
    }
});


PC.DataItem.Range.Date = function(args) {
    PC.DataItem.Range.apply(this, arguments);
    this._complexity *= 2;
};
PC.Utils.copyPrototype(PC.DataItem.Range.Date, PC.DataItem.Range);
PC.Utils.setProperties(PC.DataItem.Range.Date.prototype, {
    _preText: function(txt) {
        return 'Before ' + txt.toString();
    },
    _postText: function(txt) {
        return 'On or after ' + txt.toString();
    },
    _betweenText: function(a, b) {
        return 'On or after ' + a.toString() + ', but before ' + b.toString();
    },
    
    _sortDividers: function() {
        this._dividers = this._dividers.sort(PC.Date.compareStrings);
    },
    
    getValue: function(state) {

        var i = PC.Utils.indexOf(this._value, this._items);
        
        return (function(i, value, dividers) {
            var lt = function(val) {
                if (i > 0 && PC.Date.compareStrings(dividers[i-1], val) >= 0) return false;
                if (PC.Date.compareStrings(dividers[i], val) <= 0) return true;
                throw new Error('Unable to determine comparison');
            };
            return {
                lt: lt,
                ge: function(val) {
                    return !lt(val);
                },
                value: value
            };
        })(i, this._value, this._dividers);
    },
    
    getRangeFromExact: function(exact) {
        for (var i in this._dividers) {
            if (exact.isBefore(this._dividers[i])) {
                return this._items[i];
            }
        }
        return this._items[this._dividers.length];
    }
});
