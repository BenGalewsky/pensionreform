import csv

# Generate an array of objects to accumulate data on active plan members in each age from zero to 100 years old
pop = [
        {'retiree':{'count':0, 'male':0, 'female':0,'t1':0, 't2':0, 'retiree':0,'survivor':0, 'totBenefits':0, 'totYears':0},
         'survivor':{'count':0, 'male':0, 'female':0,'t1':0, 't2':0, 'retiree':0,'survivor':0, 'totBenefits':0, 'totYears':0}}for k in range(101)]

with open('Melton FOIA GARS beneficiaries and retirees 51315.csv', 'r') as csvfile:
    benReader = csv.DictReader(csvfile, delimiter=',', quotechar='"')
    for row in benReader:
        if row['Name']=='':
            continue
        else:

            # Keep track of beneficiaries vs. survivors
            if row['Annuity Type']=='Retiree':
                recordType = 'retiree'
            else:
                recordType = 'survivor'
                
            # Find the age in years in the field containing years and months
            age = int(str.split(row['Current Age'], 'yrs')[0])
    
            # Accumulate number of members in this age bucket
            pop[age][recordType]['count'] += 1
    
            # Keep track of percentage by teir
            if row['Tier'] == '1':
                pop[age][recordType]['t1'] += 1
            else:
                pop[age][recordType]['t2'] += 1
    
            # By gender
            if row['Gender'] == 'Male':
                pop[age][recordType]['male']+=1
            else:
                pop[age][recordType]['female']+=1
                

    
            # The file was produced on May 13, 2015 - the YTD salary figure needs to be extended out
            # to the end of the year. On that date there are 232 more days in the year
            fullYrBenefits = float(row['Current Monthly Amount'].replace(',', ''))*12
            pop[age][recordType]['totBenefits'] += fullYrBenefits
            
            pop[age][recordType]['totYears']+=float(row['Years of Service'])

with open('Illinois GARS Initial Beneficiaries 2015.csv', 'w', newline='') as benOutFile, \
     open('Illinois GARS Initial Survivors 2015.csv', 'w', newline='') as surviverOutFile:    
        fieldnames = ['Age','Count', 'Avg Benefits', 'Avg Years of Service', 'Pct Male', 'Pct T1']
        benWriter = csv.DictWriter(benOutFile, delimiter=',', quotechar='"', fieldnames=fieldnames)
        benWriter.writeheader()

        surviveWriter = csv.DictWriter(surviverOutFile, delimiter=',', quotechar='"', fieldnames=fieldnames)
        surviveWriter.writeheader()
        
        for i in range(len(pop)):
            for recordType in ['retiree','survivor']:
                count = pop[i][recordType]['count']
                avgBenefits = 0
                pctMale = 0
                pctT1 = 0
                pctSurv = 0
                avgYears = 0

                # Compute averages
                if count > 0:
                    avgBenefits = pop[i][recordType]['totBenefits'] / float(count)
                    pctMale = pop[i][recordType]['male'] /  float(count)
                    pctT1 = pop[i][recordType]['t1'] / float(count)
                    avgYears = pop[i][recordType]['totYears'] / float(count)
                    pctSurv = pop[i][recordType]['survivor'] / float(count)

                theWriter = benWriter if recordType == 'retiree' else surviveWriter
                theWriter.writerow({'Age':i,
                                    'Count': count,
                                    'Avg Benefits':avgBenefits,
                                    'Avg Years of Service':avgYears,
                                    'Pct Male':pctMale,
                                    'Pct T1':pctT1})

