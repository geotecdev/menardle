let allLetters = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z".split(",");
let keyboardContainer;
let Keyboard;
let kbContent;
//let kbKeys = [];
let currentDate;
let currentDateEl;
let currentDateText;
let solution = "";
let wordGuess = '';
let wordGuessArea;
let tileIndex = 0;
let rowIndex = 0;
let selectedTile;
let selectedRow;
let puzzleDatesDd;
let gameHasStarted = false;

window.onload = function() {
    //populate puzzleDatesBox with dates <= today
    //set solution for current 
    
    currentDate = new Date();   
    currentDateText = dateToString(currentDate);
    let avalibleDates = getAvalibleDates(currentDateText);
    puzzleDatesDd = document.querySelector("#puzzleDatesDropdown");
    //puzzleDatesDd.setAttribute("hidden", false);
    avalibleDates.forEach(aDate => {
        let option = document.createElement("option");
        option.value = aDate;
        option.innerHTML = aDate;
        puzzleDatesDd.appendChild(option);
    });

    //dd change event sets today as current date
    puzzleDateChange(puzzleDatesDd);

    keyboardContainer = document.querySelector("#keyboardContainer");
    kbContent = createKeyboard();
    keyboardContainer.appendChild(kbContent);
    selectedRow = document.querySelector("#tileRow0");
    selectedTile = document.querySelector('[data-tileIndex="' + tileIndex  +'"]');
    wordGuessArea = document.querySelector("#wordGuessArea");    
}

function puzzleDateChange(evt) {
    console.log(evt.options[evt.selectedIndex]);
    currentDateText = evt.options[evt.selectedIndex].text;
    currentDate = Date.parse(currentDateText);
    console.log("dd event: " + currentDateText);
    solution = solutionByDate(currentDateText)["solution"];
}

function dateToString(date) {
    return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
}

//event to listen for periferal keyboard input
document.onkeypress = function(evt) {
    evt = evt || window.event;
    let charCode = evt.keyCode || evt.which;
    let letterGuess = String.fromCharCode(charCode).toUpperCase();

    passLetter(letterGuess.toUpperCase());
}

function passLetter(letterGuess) {
    if (gameHasStarted === false) {
        gameHasStarted = true;                    
        puzzleDatesDd.setAttribute("hidden", true);
        console.log(puzzleDatesDd);
    }
    if (letterGuess.length === 1 && letterGuess.match(/[a-z]/i)) {
        letterGuess = letterGuess.toUpperCase();
        wordGuess += letterGuess;
        if (tileIndex == "4" || tileIndex == "9" || tileIndex == "14" || tileIndex == "19" || tileIndex == "24" || tileIndex == "29") {
            let guessColors = checkWordGuess(solution, wordGuess)
            //set tile colors
            let sRowTiles = selectedRow.getElementsByTagName("div");
            if (sRowTiles.length > 4) {
                for (let i = 0; i < 5; i++) {
                    let sTile = sRowTiles[i];
                    if (guessColors[i] === 2) {
                        sTile.style.backgroundColor = "green";
                        sTile.style.color = "white";
                    }
                    else if (guessColors[i] === 1) {
                        sTile.style.backgroundColor = "orange";
                        sTile.style.color = "white";
                    }
                }
            }

            //set keyboard colors
            setKeyColors(wordGuess, solution, guessColors);

            tileIndex++;
            rowIndex++;
            selectedTile.innerHTML = letterGuess;
            selectedRow = document.querySelector("#tileRow" + rowIndex);
            selectedTile = document.querySelector('[data-tileIndex="' + tileIndex  +'"]');

            //reset guess for next row
            wordGuess = ""; 
        }
        else {
            tileIndex++;
            selectedTile.innerHTML = letterGuess;
            selectedTile = document.querySelector('[data-tileIndex="' + tileIndex  +'"]');
        }
    } 
    else if (letterGuess == "backspace") {
        if (wordGuess.length > 0) {
            wordGuess = wordGuess.substring(0, wordGuess.length - 1);
            tileIndex--;
            selectedTile = document.querySelector('[data-tileIndex="' + tileIndex  +'"]');
            selectedTile.innerHTML = "";
        }
    }
}

function getKbKeys() {
    let allLetters = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z".split(",");
    let kbKeys = [];
    allLetters.forEach(oneLetter => {
        let matchKey = document.querySelector('[data-letter="' + oneLetter  +'"]');
        if (matchKey !== undefined) {
            kbKeys.push(matchKey);
        }
    });
    return kbKeys
}

function kbKeyByLetter(letter) {
    let kbKeys = getKbKeys();
    let selectedKey;
    if (kbKeys.length > 0) {
        selectedKeys = kbKeys.filter(function(kbKey) {
            return kbKey["data-letter"] = letter;
        })
        if (selectedKeys.length > 0) {
            selectedKey = selectedKeys[0];
        }
    }

    return selectedKey;
}

function setKeyColors(wordGuess, solution, guessColors) {
    kbKeys = getKbKeys()    
    console.log(kbKeys);
    for (var i = 0; i < 5; i++) {
        let gLetter = wordGuess[i];
        let letterColor = guessColors[i];      
        let matchKeys = kbKeys.filter(function(kbKey) {
            return kbKey.getAttribute("data-letter") === gLetter;
        });
        if (matchKeys.length > 0) {
            let kbKey = matchKeys[0];
            if (letterColor > 0) {
                if (parseInt(kbKey.getAttribute("data-colorId")) < letterColor) {
                    kbKey.setAttribute("data-colorId", letterColor);
                    let newColor = letterColor === 1 ? "orange" : "green";
                    kbKey.setAttribute("data-color", newColor);
                    console.log(newColor);
                    if (newColor === "green") {
                        kbKey.style.backgroundColor = "green";
                        kbKey.style.color = "white";
                    }
                    else {
                        kbKey.style.backgroundColor = "orange";
                        kbKey.style.color = "white";
                    }
                }
            }
            else {
                if(solution.includes(gLetter) === false) {

                    kbKey.setAttribute("data-colorId", 3);
                    kbKey.setAttribute("data-color", "dimgray");
                    kbKey.style.backgroundColor = "dimgray";
                }
            }
        }
    }
}

function checkWordGuess(solution, wordGuess) {
    if (wordGuess === solution) {
        alert("YOU WIN!!!!");
        return [ 2, 2, 2, 2, 2 ];
    }

    let skipIndexes = [];
    let sPartial = solution;
    let usedSLetters = [ false, false, false, false, false ];
    let guessColors = [ 0, 0, 0, 0, 0 ];
    //check direct matches (green)
    for (var i = 0; i < 5; i++) {
        let sLetter = solution[i];
        let gLetter = wordGuess[i];
        if (gLetter === sLetter) {
            usedSLetters[i] = true;
            guessColors[i] = 2;
        }
    }
    //check indirect matches (orange)
    for (var i = 0; i < 5; i++) {
        let guessColorAtIndex = guessColors[i];
        if (guessColorAtIndex === 0) {
            let gLetter = wordGuess[i];
            for (var j = 0; j < 5; j++) {
                let sLetterIsUsed = usedSLetters[j];
                if (sLetterIsUsed === false) {
                    let sLetter = solution[j];
                    if (gLetter === sLetter) {
                        usedSLetters[j] = true;
                        guessColors[i] = 1;
                        break;
                    }
                }
            }
        }
    }

    console.log(guessColors);
    return guessColors;
}

function createKeyboard()
{
    Keyboard = {
        elements: {
            main: null,
            keysContainer: null,
            keys: []
        },
    
        eventHandlers: {
            oninput: null,
            onclose: null
        },
    
        properties: {
            value: "",
            capsLock: false
        }
    }

    const fragment = document.createDocumentFragment();
    const keyLayout = [        
        "|", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
        "||", "a", "s", "d", "f", "g", "h", "j", "k", "l",
        "|||", "z", "x", "c", "v", "b", "n", "m", ",", ".",
        "space", "backspace"
    ];

    const indentOffsets = { "|": "keyboard__key--wide1", "||": "keyboard__key--wide2", "|||": "keyboard__key--wide3" }
    keyLayout.forEach(key => {
        const keyElement = document.createElement("button");
        const insertLineBreak = [ "p", "l", "."].indexOf(key) !== -1;

        // Add attributes/classes
        keyElement.setAttribute("type", "button");
        keyElement.classList.add("keyboard__key");

        if (key.includes("|")) {
            keyElement.classList.add("keyboard__key--wide");
            keyElement.innerHTML = key;
            
            //add offset based on | count
            keyElement.classList.add(indentOffsets[key]);
        }
        else if (key === "backspace") {
            keyElement.classList.add("keyboard__key--wide");
            keyElement.innerHTML = "←";
            keyElement.addEventListener("click", () => {
                passLetter("backspace")
            });
        }
        else if (key === "space") {
            keyElement.classList.add("keyboard__key--extra-wide");
            keyElement.innerHTML = "_";
        }
        else if (key === "," || key == ".") {
            keyElement.textContent = key.toUpperCase();
            keyElement.disabled = true;
        }
        else {
            keyElement.textContent = key.toUpperCase();
            keyElement.setAttribute("data-letter", key.toUpperCase());
            keyElement.setAttribute("data-color", "ghostwhite");
            keyElement.setAttribute("data-colorId", 0);
            keyElement.setAttribute("data-isLetterKey", true);
            keyElement.addEventListener("click", () => {
                let letterStr = key.toUpperCase();                
                passLetter(letterStr);
            });
        }

        fragment.appendChild(keyElement);

        if (insertLineBreak) {
            fragment.appendChild(document.createElement("br"));
        }
    });

    //keyboardContainer.appendChild(fragment);
    return fragment;
}
