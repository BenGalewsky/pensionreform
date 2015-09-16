import csv

# Generate an array of objects to accumulate data on active plan members in each age from zero to 100 years old
pop = [{'count':0, 'male':0, 'female':0,'t1':0, 't2':0, 'totSalary':0, 'totYears':0} for k in range(100)]

with open('C:\\dev\GitHub\\pensionreform\\src\\R\\pension-modeling\\CSVs\\Melton FOIA GARS active 51315.csv', 'rb') as csvfile:
    activesReader = csv.DictReader(csvfile, delimiter=',', quotechar='"')
    for row in activesReader:

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

        # The file was produced on May 13, 2015 - the YTD salary figure needs to be extended out
        # to the end of the year. On that date there are 232 more days in the year
        fullYrSalery = float(row['Calendar YTD Earnings'].replace(',', '')) * (12.0/4.0)
        pop[age]['totSalary'] += fullYrSalery
        
        pop[age]['totYears']+=float(row['Years of Service'])

# Generate a header
print ",".join(['Age','Count', 'Avg Salary', 'Avg Years of Service', 'Pct Male', 'Pct T1'])
for i in range(len(pop)):
    count = float(pop[i]['count'])
    avgSalary = 0
    pctMale = 0
    pctT1 = 0
    avgYears = 0

    # Compute averages
    if count > 0:
        avgSalary = pop[i]['totSalary'] / count
        pctMale = pop[i]['male'] /  count
        pctT1 = pop[i]['t1'] / count
        avgYears = pop[i]['totYears'] / count

    rslt = [i, count, avgSalary, avgYears, pctMale, pctT1]     
    print ','.join(str(x) for x in rslt)

