function solutionByDate(gameDateText) {
    
    let gameDate = parseDate(gameDateText);  
    let allSolutions = getPuzzleSolutions();
    
    let dateSolution;
    for (let i = 0; i < allSolutions.length; i++) {
        let sol = allSolutions[i];
        let solDate = sol["puzzleDate"];
        let maxDate = sol["maxDate"];
        if (gameDate >= solDate && gameDate <= maxDate) {
            dateSolution = sol;
            break;
        }
    }

    console.log('\n');
    console.log(dateSolution);
    return dateSolution;
}

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

function getAvalibleDates(gameDateText) {
    let gameDate = parseDate(gameDateText);
    let datesList = [];
    let allSolutions = getPuzzleSolutions();
    for (let i = allSolutions.length - 1; i >= 0; i--) {
        let sol = allSolutions[i];
        if (sol["puzzleDate"] <= gameDate) {
            datesList.push(sol["puzzleDate"].toLocaleDateString("en-US"));
        }        
    }

    return datesList;
}

function getPuzzleSolutions() {
    let solutionObjs = [];
    dataCsv =
    "solution;puzzleDate;maxDate;linkUrl;imageUrl;displayText" + '\n' +
    "GROUT;7/11/2022;7/17/2022;https://www.menardgroupusa.com/solutions/controlled-modulus-column-rigid-inclusions-for-ground-improvement/;;[Controlled Modulus Columns (CMC)®] are typically formed of cementitious GROUT. " + '\n' +
    "STONE;7/18/2022;7/24/2022;https://www.menardgroupusa.com/solutions/stone-columns-for-ground-improvement/;;STONE is one of the most ubiquitous construction materials in the world.  [Stone columns] are ground improvement elements commonly used to reinforce or densify the ground." + '\n' +
    "TRUCK;7/25/2022;7/31/2022;;https://www.menardgroupusa.com/wp-content/uploads/2022/06/Truck.jpeg;Rugged and dependable, the TRUCK is the vehicle of choice for many in the construction industry." + '\n' +
    "PRINT;8/01/2022;8/07/2022;https://www.menardgroupusa.com/solutions/dynamic-compaction-for-ground-improvement/;;The location of [dynamic compaction] drops, the depression or crater left behind is sometimes referred to as a PRINT." + '\n' +
    "GLOVE;8/08/2022;8/14/2022;https://hsi.com/blog/hand-safety-and-injury-prevention;;Safety [GLOVE]s are an important part of standard Personal Protective Equipment (PPE) worn on site by our crews.";

    let csvLines = dataCsv.split('\n');
    if (csvLines.length > 1)
    {        
        let firstLine = csvLines[0];
        let propNames = firstLine.split(';');
        for (let i = 1; i < csvLines.length; i++) {
            let line = csvLines[i];
            let lineParts = line.split(';');
            let j = 0;
            let solutionObj = {}
            while (j < lineParts.length && j < propNames.length) {
                let propName = propNames[j];
                if (propNames[j].includes("Date")) {
                    solutionObj[propName] = parseDate(lineParts[j]);
                }
                else {
                    solutionObj[propName] = lineParts[j];
                }                
                j++;
            }
            solutionObjs.push(solutionObj);
        }
    }

    console.log(solutionObjs)
    return solutionObjs;
}

function parseDate(input) {

    let parts = input.split('/');
  
    // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(parts[2], parts[0]-1, parts[1]); // Note: months are 0-based
  }