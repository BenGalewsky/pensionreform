import csv
import math

def benefitRate(years, tier):
    tier1 = [0.03,0.06,0.09,0.12,0.155,0.19,0.23,0.27,0.315,0.36,0.405,0.45]
    iYears = math.floor(years)
 
    rate = 0.0
    if tier==1:
        rate = tier1[min(11, iYears-1)]
        rate += 0.05 * max(0, iYears-12)
        rate = min(0.85, rate)

    if tier==2:
        rate = 0.022 * years
        rate = min(0.75, rate)
    return rate

def isEligible(years, tier):
    if tier == 1:
        return years >= 4
    else:
        return years >=10


# Generate an array of objects to accumulate data on active plan members in each age from zero to 100 years old
pop = [{'count':0, 'male':0, 'female':0,'t1':0, 't2':0, 'totSalary':0, 'totYears':0, 'totEarnedBenefit':0.0} for k in range(100)]

with open('C:\\dev\GitHub\\pensionreform\\src\\R\\pension-modeling\\CSVs\\Melton FOIA GARS active 51315.csv', 'rt') as csvfile:
    activesReader = csv.DictReader(csvfile, delimiter=',', quotechar='"')
    for row in activesReader:

        # Find the age in years in the field containing years and months
        age = int(str.split(row['Current Age'], 'yrs')[0])

        # Accumulate number of members in this age bucket
        pop[age]['count'] += 1

        # Keep track of percentage by teir
        if row['Tier'] == '1':
            pop[age]['t1'] += 1
            tier = 1
        else:
            pop[age]['t2'] += 1
            tier = 2

        # By gender
        if row['Gender'] == 'Male':
            pop[age]['male']+=1
        else:
            pop[age]['female']+=1

        # The file was produced on May 13, 2015 - the YTD salary figure needs to be extended out
        # to the end of the year. On that date there are 232 more days in the year
        fullYrSalery = float(row['Calendar YTD Earnings'].replace(',', '')) * (12.0/4.0)
        pop[age]['totSalary'] += fullYrSalery

        years = float(row['Years of Service'])
        pop[age]['totYears']+=years

        # Compute earned benefit
        pop[age]['totEarnedBenefit'] += fullYrSalery * benefitRate(years, tier)

# Generate a header
print(",".join(['Age','Count', 'Avg Salary', 'Avg Years of Service', 'Pct Male', 'Pct T1','Avg Earned Benefit']))
for i in range(len(pop)):
    count = float(pop[i]['count'])
    avgSalary = 0
    pctMale = 0
    pctT1 = 0
    avgYears = 0
    avgEarnedBenefit = 0

    # Compute averages
    if count > 0:
        avgSalary = pop[i]['totSalary'] / count
        pctMale = pop[i]['male'] /  count
        pctT1 = pop[i]['t1'] / count
        avgYears = pop[i]['totYears'] / count
        avgEarnedBenefit = pop[i]['totEarnedBenefit'] / float(count)

    rslt = [i, count, avgSalary, avgYears, pctMale, pctT1, avgEarnedBenefit]     
    print(','.join(str(x) for x in rslt))

