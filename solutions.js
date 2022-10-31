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
    "GLOVE;8/08/2022;8/14/2022;;./images/8-8-glove-image.jpg;Safety GLOVEs are an important part of standard Personal Protective Equipment (PPE) worn on site by our crews." + "\n" +
    "WATER;8/15/2022;8/21/2022;https://www.menardgroupusa.com/solutions/wick-drains-for-ground-improvement/;;WATER is the staff of life, but the culprit of many foundation and geotechnical issues. [Wick Drains] aka Prefabricated Vertical Drains are used to alleviate groundwater pore pressure and expedite consolidation settlement in soft, compressible layers." + '\n' +
    "SILTY;8/22/2022;8/28/2022;https://dot.ca.gov/-/media/dot-media/programs/maintenance/documents/office-of-concrete-pavement/pavement-foundations/uscs-a11y.pdf;;SILTY is a modifier to describe a relatively high silt content in soil.  For example, silty sand (SM) and silty gravel (GM) as classified under the [Unified Soil Classification System]." + '\n' +
    "AUGER;8/29/2022;9/04/2022;https://www.menardgroupusa.com/resource/port-gulfport-restoration-program/;./images/8-29-auger-image.jpg;AUGERS were used to pre-loosen upper dense soils in advance of wick drain installation for the Port of Gulfport, [MS Restoration Program.]" + '\n' +
    "SHAFT;9/05/2022;9/11/2022;https://www.nicholsonconstruction.com/drill-down;;Our friends at Nicholson Construction offer a range of support of excavation and hydraulic cutoff services for tunnel and SHAFT structures.  Read more in the [Nicholson Drill Down!]" + '\n' +
    "VUGGY;9/12/2022;9/18/2022;;./images/9-12-vuggy-image.jpg; Sorry Menardlers! This is a tough one! VUGGY is containing vugs which are small to medium-sized cavities or pores in rock that are commonly lined with mineral deposits." + '\n' +
    "SIEVE;9/19/2022;9/25/2022;;./images/9-19-sieve-image.jpg; SIEVE analysis consists of shaking soil through a set of sieves that have progressively smaller openings in order to determine the particle size distribution of coarse soils." + '\n' +
    "RIGID;9/26/2022;10/02/2022;https://www.menardgroupusa.com/solutions/controlled-modulus-column-rigid-inclusions-for-ground-improvement/;;Well of course RIGID is a Menardle word! [Controlled Modulus Column (CMC)®] rigid inclusions increase bearing capacity and reduce settlement under light to heavy loads in most types of ground." + '\n' +
    "PANEL;10/03/2022;10/09/2022;https://reinforcedearth.com/projects/architectural-gallery/;./images/10-3-panel-image.jpg;There are many types of [PANELs] used in construction, but some of the most beautiful  are seen on The Reinforced Earth Company’s walls." + '\n' +
    "SLING;10/10/2022;10/16/2022;;./images/10-10-sling-image.jpg;Rigging or lifting SLINGs are made of cable, chain, rope or webbing, and used with a lift or crane to safely move heavy items." + "\n" +
    "KARST;10/17/2022;10/23/2022;https://earthtech.com/sinkhole-grouting-and-foundation-repair/;;KARST is a topography formed from the dissolution of soluble rocks such as limestone, dolomite, and gypsum. [Earth Tech, LLC] has been grouting sinkholes in Karstic limestone since 1991." + "\n" +
    "SLAKE;10/24/2022;10/30/2022;https://www.youtube.com/watch?v=5UfnbiBo-Ds;;SLAKE is generally defined as the breakdown of earth materials when exposed to water. The concept is demonstrated [here]" + "\n" +
    "SHEAR;10/31/2022;11/06/2022;https://www.menardgroupusa.com/solutions/soil-mixing-for-ground-improvement/;;SHEAR strength in soils refers to the maximum shear stress that a soil can sustain without experiencing failure.  [Soil mixing] is one of many ground improvement techniques that can increase the shear strength of soil layers. ";

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