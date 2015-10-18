import csv

# Generate an array of objects to accumulate data on active plan members in each age from zero to 100 years old
pop = [{'count':0, 'male':0, 'female':0,'t1':0, 't2':0, 'retiree':0, 'totContributions':0, 'totYears':0} for k in range(101)]

with open('Melton FOIA GARS inactives 51315.csv', 'rb') as csvfile:
    inactivesReader = csv.DictReader(csvfile, delimiter=',', quotechar='"')
    for row in inactivesReader:
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
                
            contributions = float(row['Total Contributions'].replace(',', ''))
            pop[age]['totContributions'] += contributions
            
            pop[age]['totYears']+=float(row['Years of Service'])

# Generate a header
print ','.join(['Age','Count', 'Avg Contributions', 'Avg Years of Service', 'Pct Male', 'Pct T1'])
for i in range(len(pop)):
    count = pop[i]['count']
    avgContrib = 0
    pctMale = 0
    pctT1 = 0
    avgYears = 0

    # Compute averages
    if count > 0:
        avgContrib = pop[i]['totContributions'] / float(count)
        pctMale = pop[i]['male'] /  float(count)
        pctT1 = pop[i]['t1'] / float(count)
        avgYears = pop[i]['totYears'] / float(count)

    rslt = [i, count, avgContrib, avgYears, pctMale, pctT1]     
    print ','.join(str(x) for x in rslt)
                
    contributions = float(row['Total Contributions'].replace(',', ''))
    pop[age]['totContributions'] += contributions
            
    pop[age]['totYears']+=float(row['Years of Service'])

# Generate a header
print ','.join(['Age','Count', 'Avg Contributions', 'Avg Years of Service', 'Pct Male', 'Pct T1'])
for i in range(len(pop)):
    count = pop[i]['count']
    avgContrib = 0
    pctMale = 0
    pctT1 = 0
    avgYears = 0

    # Compute averages
    if count > 0:
        avgContrib = pop[i]['totContributions'] / float(count)
        pctMale = pop[i]['male'] /  float(count)
        pctT1 = pop[i]['t1'] / float(count)
        avgYears = pop[i]['totYears'] / float(count)

    rslt = [i, count, avgContrib, avgYears, pctMale, pctT1]     
    print ','.join(str(x) for x in rslt)
