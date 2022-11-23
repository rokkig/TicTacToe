const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const create = document.getElementById('createGame');
const winningMessageElement = document.getElementById("winningMessage");
const restartButton = document.getElementById('restartButton');
const createButton = document.getElementById('createButton');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')

let xCount = 0;
let oCount = 0;
let boardCheck = [];
let circleTurn;
let gameKey = undefined;

restartButton.addEventListener('click', resetGame);
createButton.addEventListener('click', createGame);

function createGame() {
    gameKey = document.getElementById('gameKey').value
    fetch("http://3.210.183.75:8080/tictactoe/tictactoeserver/createGame?key=" + gameKey)
        .then(res => res.text())
        .then(resData => {
            if (resData == 'X') {
                console.log("waiting for other player")
                checkLoop();
            } if (resData == 'O') {
                console.log("Let the games begin!")
                startGameO();
            } else {
                console.log(resData)
            }
        })
        .catch(error => console.warn(error));
}

function resetGame() {
    fetch("http://3.210.183.75:8080/tictactoe/tictactoeserver/reset?key=" + gameKey)
        .then(res => res.text())
        .then(resData => {
            if (resData == "[EXIT]") {
                gameKey = undefined;
                board.style.display = "none";
                create.style.display = "block";
                winningMessageElement.classList.remove('show')
            }
        })
    }
    
    function startGameX() {
        create.style.display = "none";
        setBoardHoverClassX();
        board.style.display = "grid";
        circleTurn = false;
        cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS)
        cell.classList.remove(O_CLASS)
        cell.addEventListener('click', handleClickX)
        cell.addEventListener('click', handleClickX, { once: true })
        xCount = 0;
        oCount = 0;
        })
    }

    function startGameO() {
        create.style.display = "none";
        setBoardHoverClassO();
        board.style.display = "grid";
        circleTurn = false;
        cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS)
        cell.classList.remove(O_CLASS)
        cell.addEventListener('click', handleClickO)
        cell.addEventListener('click', handleClickO, { once: true })
        xCount = 0;
        oCount = 0;
        })
    }

function checkLoop() {
    fetch("http://3.210.183.75:8080/tictactoe/tictactoeserver/check?key=" + gameKey)
        .then(res => {return res.text()})
        .then(resData => {if(resData == false){
            checkLoop()}})
        .then(startGameX())
        .catch(error => console.warn(error));
}

function check() {
    fetch("http://3.210.183.75:8080/tictactoe/tictactoeserver/check?key=" + gameKey)
        .then(res => res.text())
        .then(resData => {return resData})
        .catch(error => console.warn(error));
}

function handleClickX(e) {
    boardDetails();
    boardCheckCount();
    if(xCount <= oCount){
        const cell = e.target;
        const coordinates = e.target.id.split(",")
        const y = coordinates[0];
        const x = coordinates[1];
    
        fetch("http://3.210.183.75:8080/tictactoe/tictactoeserver/move?key=" + gameKey + "&tile=" + X_CLASS + "&y=" + y + "&x=" + x)
            .then(res => {return res.text()})
            .then(resData => {
                console.log(resData)
                if (resData != "[TAKEN]") {
                    placeMark(cell, X_CLASS)
                    if (checkWin(X_CLASS)) {
                        endGame(false)
                        console.log("X is the winner!")
                    } else if (isDraw()) {
                        endGame(true)
                    } else {
                        boardDetails();
                        // swapTurns();
                        // setBoardHoverClass();
                    }
                } else {
                    let i = 0;
                    do {
                        boardDetails();
                        console.log("boardCheck array: " + boardCheck);
                        if (boardCheck[i] != "") {
                            placeMark(cell, boardCheck[i])
                        }
                        i++
                    } while (i <= boardCheck.length);
                }
            })
            .catch(error => console.warn(error));
    } else {console.log("It's not yet your turn!")}
}

function handleClickO(e) {
    boardDetails();
    boardCheckCount();
    if(xCount > oCount){

        // console.log("clicked");
        // placeMark
        // Check for Win
        // Check for Draw
        // Switch Turns
    
        const cell = e.target;
        // const currentClass = circleTurn ? O_CLASS : X_CLASS;
    
        const coordinates = e.target.id.split(",")
        const y = coordinates[0];
        const x = coordinates[1];
    
        // console.log(y);
        // console.log(x);
    
    
        fetch("http://3.210.183.75:8080/tictactoe/tictactoeserver/move?key=" + gameKey + "&tile=" + O_CLASS + "&y=" + y + "&x=" + x)
            .then(res => {return res.text()})
            .then(resData => {
                console.log(resData)
                if (resData != "[TAKEN]") {
                    placeMark(cell, O_CLASS)
                    if (checkWin(O_CLASS)) {
                        endGame(false)
                        console.log("O is the winner!")
                    } else if (isDraw()) {
                        endGame(true)
                    } else {
                        boardDetails();
                        boardCheckCount();
                        // swapTurns();
                        // setBoardHoverClass();
                    }
                } else {
                    let i = 0;
                    do {                    
                        boardDetails();
                        console.log("boardCheck array: " + boardCheck);
                        if (boardCheck[i] != "") {
                            placeMark(cell, boardCheck[i])
                        }
                        i++
                    } while (i <= boardCheck.length);
                }
            })
            .catch(error => console.warn(error));
    } else{console.log("It's not yet your turn!")}
}

function endGame(draw) {
    if (draw) {
        winningMessageTextElement.innerText = "Draw!"
    } else {
        winningMessageTextElement.innerText = `${circleTurn ? "O" : "X"} Wins!`
    }
    winningMessageElement.classList.add('show')
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS)
    })
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass)
}

// function swapTurns() {
//     circleTurn = !circleTurn;
// }

// function setBoardHoverClass() {
//     board.classList.remove(X_CLASS)
//     board.classList.remove(O_CLASS)
//     if (circleTurn) {
//         board.classList.add(O_CLASS)
//     } else {
//         board.classList.add(X_CLASS)
//     }
// }

function setBoardHoverClassO(){
    board.classList.add(O_CLASS)
}

function setBoardHoverClassX() {
    board.classList.add(X_CLASS)
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass)
        })
    })
}

function boardDetails() {
    fetch("http://3.210.183.75:8080/tictactoe/tictactoeserver/board?key=" + gameKey)
        .then(res => {return res.text()})
        .then(resData => boardCheck = resData.split(":"))
        .catch(error => console.warn(error));
}

function boardCheckCount(){
    let i = 0;
    console.log(boardCheck)
    xCount = 0;
    do{
        if (boardCheck[i] == 'x'){
            xCount = xCount + 1
        } else if(boardCheck[i] == 'o'){
            oCount = oCount + 1
        } i++
    } while(i < boardCheck.length);
}