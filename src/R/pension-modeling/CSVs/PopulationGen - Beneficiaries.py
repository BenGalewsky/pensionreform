import csv

# Generate an array of objects to accumulate data on active plan members in each age from zero to 100 years old
pop = [{'count':0, 'male':0, 'female':0,'t1':0, 't2':0, 'retiree':0,'survivor':0, 'totBenefits':0, 'totYears':0} for k in range(101)]

with open('Melton FOIA GARS beneficiaries and retirees 51315.csv', 'rb') as csvfile:
    activesReader = csv.DictReader(csvfile, delimiter=',', quotechar='"')
    for row in activesReader:
        if row['Name']=='':
            continue
        else:
            # Find the age in years in the field containing years and months
            age = int(str.split(row['Current Age'], 'yrs')[0])
    
            # Accumulate number of members in this age bucket
            pop[age]['count'] += 1
    
            # Keep track of percentage by teir
            if row['Tier'] == '1':
                pop[age]['t1'] += 1
            else:
                pop[age]['t2'] += 1
    
            # By gender
            if row['Gender'] == 'Male':
                pop[age]['male']+=1
            else:
                pop[age]['female']+=1
                
            # Keep track of beneficiaries vs. survivors
            if row['Annuity Type']=='Retiree':
                pop[age]['retiree']+=1
            else:
                pop[age]['survivor']+=1
    
            # The file was produced on May 13, 2015 - the YTD salary figure needs to be extended out
            # to the end of the year. On that date there are 232 more days in the year
            fullYrBenefits = float(row['Current Monthly Amount'].replace(',', ''))*12
            pop[age]['totBenefits'] += fullYrBenefits
            
            pop[age]['totYears']+=float(row['Years of Service'])

# Generate a header
print ','.join(['Age','Count', 'Avg Benefits', 'Avg Years of Service', 'Pct Male', 'Pct T1', 'Pct Surv'])
for i in range(len(pop)):
    count = pop[i]['count']
    avgBenefits = 0
    pctMale = 0
    pctT1 = 0
    pctSurv = 0
    avgYears = 0

    # Compute averages
    if count > 0:
        avgBenefits = pop[i]['totBenefits'] / float(count)
        pctMale = pop[i]['male'] /  float(count)
        pctT1 = pop[i]['t1'] / float(count)
        avgYears = pop[i]['totYears'] / float(count)
        pctSurv = pop[i]['survivor'] / float(count)

    rslt = [i, count, avgBenefits, avgYears, pctMale, pctT1, pctSurv]     
    print ','.join(str(x) for x in rslt)
