let allLetters = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z".split(",");
let keyboardContainer;
let Keyboard;
let kbContent;
//let kbKeys = [];
let currentDate;
let currentDateEl;
let currentDateText;
let solution = "";
let solutionObj;
let wordGuess = '';
let wordGuessArea;
let tileIndex = 0;
let rowIndex = 0;
let selectedTile;
let selectedRow;
let puzzleDatesDd;
let gameHasStarted = false;
let gameIsWon = false;
let resultsModal;
let resultsModalContent;
let closeSpan;
let resultsText;
let resetOnWinBtn;
let resultImage;
let gameResetBtn;
let rowIsLocked = false;

window.onload = function() {
    //populate puzzleDatesBox with dates <= today
    //set solution for current 
    resultsModal = document.querySelector("#resultsModal");
    resultsModalContent = document.querySelector("#resultsModalContent");
    closeSpan = document.querySelector("#closeSpan");
    closeSpan.addEventListener("click", function(evt) {
        evt.preventDefault();
        changeElementVisibility(resultsModal, "none");
    });
    resultsText = document.querySelector("#resultsText");
    resetOnWinBtn = document.querySelector("#resetOnWinBtn");
    resetOnWinBtn.addEventListener("click", function(evt) {
        evt.preventDefault();
        location.reload();
    });
    resultImage = document.querySelector("#resultImage");
    currentDate = new Date();
    currentDateText = dateToString(currentDate);
    let avalibleDates = getAvalibleDates(currentDateText);
    gameResetBtn = document.querySelector("#gameResetBtn");
    gameResetBtn.addEventListener("click", function(evt) {
        evt.preventDefault();
        location.reload();
    });
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
    solutionObj = solutionByDate(currentDateText)
    solution = solutionObj["solution"];
}

function dateToString(date) {
    return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
}

document.onkeydown = function(evt) {
    const key = evt.key;
    console.log(key);
    if (key === "Backspace") {
        backspaceKey();
    }
    else if (key === "Enter" && wordGuess.length === 5) {
        enterKey();
    }
}

//event to listen for peripheral keyboard input
document.onkeypress = function(evt) {
    evt = evt || window.event;
    let charCode = evt.keyCode || evt.which;
    let letterGuess = String.fromCharCode(charCode).toUpperCase();
    console.log(letterGuess);
    passLetter(letterGuess.toUpperCase());
}

function passLetter(letterGuess) {
    if (gameHasStarted === false) {
        gameHasStarted = true;                    
        puzzleDatesDd.setAttribute("hidden", true);
        changeElementVisibility(gameResetBtn, "block");
        console.log(puzzleDatesDd);
    }
    if (letterGuess.length === 1 && letterGuess.match(/[a-z]/i)) {
        if (rowIsLocked === false) {
            letterGuess = letterGuess.toUpperCase();
            wordGuess += letterGuess;
            if (tileIndex == "4" || tileIndex == "9" || tileIndex == "14" || tileIndex == "19" || tileIndex == "24" || tileIndex == "29") {
                enterKeyBtn = document.querySelector(".enterKey")
                changeElementVisibility(enterKeyBtn, "inline");
                selectedTile.innerHTML = letterGuess;
                //toggleEnterBackspace(true);
                rowIsLocked = true;
            }
            else {
                tileIndex++;
                selectedTile.innerHTML = letterGuess;
                selectedTile = document.querySelector('[data-tileIndex="' + tileIndex  +'"]');
            }
        }
    }
}

function enterKey() {
    if (wordGuess.length === 5) {
        console.log("t2");
        let guessColors = checkWordGuess(solution, wordGuess);
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
                    sTile.style.backgroundColor = "gold";
                    sTile.style.color = "white";
                }
            }
        }

        if (gameIsWon) {
            setTimeout(function() {
                gameIsWon = false;
                showResultsModal(solutionObj);                    
            }, 500);                
        }            

        //set keyboard colors
        setKeyColors(wordGuess, solution, guessColors);

        tileIndex++;
        rowIndex++;
        selectedTile.innerHTML = wordGuess[wordGuess.length - 1];
        selectedRow = document.querySelector("#tileRow" + rowIndex);
        selectedTile = document.querySelector('[data-tileIndex="' + tileIndex  +'"]');
        rowIsLocked = false;
        //reset guess for next row
        wordGuess = ""; 

        if (rowIndex === 6 && gameIsWon === false) {
            console.log("failed game breakpoint hit");
            showResultsModalFailed();
        }

        //disable enter button
        //toggleEnterBackspace(false);
        changeElementVisibility(enterKeyBtn, "none");
    }
}

function backspaceKey() {
    if (wordGuess.length > 0) {
        rowIsLocked = false;
        if (wordGuess.length === 5) {
            wordGuess = wordGuess.substring(0, wordGuess.length - 1);
            selectedTile.innerHTML = "";
        } else {
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
                    let newColor = letterColor === 1 ? "gold" : "green";
                    kbKey.setAttribute("data-color", newColor);
                    console.log(newColor);
                    if (newColor === "green") {
                        kbKey.style.backgroundColor = "green";
                        kbKey.style.color = "white";
                    }
                    else {
                        kbKey.style.backgroundColor = "gold";
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
        gameIsWon = true;
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
        "enter", "space", "backspace"
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
            keyElement.innerHTML = "";
            keyElement.style.opacity = "0.3"
        }
        else if (key === "backspace") {
            keyElement.classList.add("keyboard__key--med");
            keyElement.classList.add("deleteKey");
            keyElement.innerHTML = "<img id=\"backspaceIcon\" src=\"delete_icon.jpg\" />";
            keyElement.addEventListener("click", () => {
                backspaceKey()
            });
        }
        else if (key === "enter") {
            keyElement.classList.add("keyboard__key--med");
            keyElement.classList.add("enterKey");
            keyElement.innerHTML = "ENTER";
            keyElement.addEventListener("click", () => {
                enterKey()
            });
            changeElementVisibility(keyElement, "none");
        }
        else if (key === "space") {
            keyElement.classList.add("keyboard__key--extra-wide");
            keyElement.innerHTML = "_";
            keyElement.style.opacity = "0.3";
        }
        else if (key === "," || key == ".") {
            keyElement.textContent = key.toUpperCase();            
            keyElement.style.opacity = "0.3";
            changeElementVisibility(keyElement, "none");
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

function showResultsModalFailed() {
    let modalHeader = document.querySelector("#modalHeader");
    modalHeader.innerHTML = "good try!";
    resultsText.innerHTML = "but unfortunately, you are out of guesses for this round. Would you like to try again?";
    changeElementVisibility(resultsModal, "block");
}

function showResultsModal(solutionObj) {
    if (solutionObj.linkUrl != undefined && solutionObj.linkUrl !== "") {
        //find text to attach link
        if (solutionObj.displayText.includes('[') && solutionObj.displayText.includes(']')) {
            let hlText = solutionObj.displayText.substring(solutionObj.displayText.indexOf("[") + 1, solutionObj.displayText.indexOf("]"));
            solutionObj.displayText = solutionObj.displayText.replace("[", "<a href='" + solutionObj.linkUrl + "'>");
            //solutionObj.displayText = solutionObj.displayText.replace("]", hlText + "</a>");
            solutionObj.displayText = solutionObj.displayText.replace("]", "</a>");            
        }
    }
    if (solutionObj.imageUrl != undefined && solutionObj.imageUrl !== "") {
        resultImage.setAttribute("src", solutionObj.imageUrl);
    }

    resultsText.innerHTML = solutionObj.displayText;
    changeElementVisibility(resultsModal, "block");

}

function changeElementVisibility(el, displayStyle) {
    el.style.display = displayStyle;
}

function toggleEnterBackspace(activateEnter=false) {
    let enterKey = document.querySelector(".enterKey")
    let deleteKey = document.querySelector(".deleteKey")
    console.log("enterKey");
    console.log(enterKey);
    if (activateEnter) {
        changeElementVisibility(enterKey, "block");
    } else {
        changeElementVisibility(enterKey, "none");
    }
}