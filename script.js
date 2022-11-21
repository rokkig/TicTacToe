const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winningMessageElement = document.getElementById("winningMessage");
const restartButton = document.getElementById('restartButton');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
let circleTurn;

startGame();

restartButton.addEventListener('click', startGame);

function startGame(){
    fetch("http://3.210.183.75:8080/tictactoe/tictactoeserver/reset?key=rokki")
    .then(res => console.log(res.text()))

    fetch("http://3.210.183.75:8080/tictactoe/tictactoeserver/createGame?key=rokki")
    .then(res => console.log(res.text()))
    
    fetch("http://3.210.183.75:8080/tictactoe/tictactoeserver/createGame?key=rokki")
    .then(res => console.log(res.text()))

    const check = fetch("http://3.210.183.75:8080/tictactoe/tictactoeserver/check?key=rokki")
    .then(res => console.log(res.text()))
    .then(resData => {return resData})

    if(check){
        circleTurn = false;
        cellElements.forEach(cell => {
            cell.classList.remove(X_CLASS)
            cell.classList.remove(O_CLASS)
            cell.addEventListener('click', handleClick)
            cell.addEventListener('click', handleClick, {once: true})
        })
        setBoardHoverClass();
        winningMessageElement.classList.remove('show')
    }

}

function handleClick(e){
    // console.log("clicked");
    // placeMark
    // Check for Win
    // Check for Draw
    // Switch Turns
    
    const cell = e.target;
    const currentClass = circleTurn ? O_CLASS : X_CLASS;
    
    const coordinates = e.target.id.split(",")
    
    const y = coordinates[0];
    const x = coordinates[1];
    
    console.log(y);
    console.log(x); 
    
    
    fetch("http://3.210.183.75:8080/tictactoe/tictactoeserver/move?key=rokki&tile=" + currentClass + "&y=" + y + "&x=" + x)
    .then(res => res.text())
    .then(resData => {
        if (resData != "[TAKEN]"){
            placeMark(cell, currentClass)
            if(checkWin(currentClass)){
                endGame(false)
                console.log(currentClass + " is the winner!")
            } else if(isDraw()){
                endGame(true)
            } else{
                swapTurns()
                setBoardHoverClass()
            }
        } else{console.log("Taken")}    
    })
    .catch(function(error){
    console.log("error " + error)
    })
}

function endGame(draw){
    if(draw){
        winningMessageTextElement.innerText = "Draw!"
    } else{
        winningMessageTextElement.innerText = `${circleTurn ? "O" : "X"} Wins!`
    }
    winningMessageElement.classList.add('show')
}

function isDraw(){
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS)
    })
}

function placeMark(cell, currentClass){
    cell.classList.add(currentClass)
}

function swapTurns(){
    circleTurn = !circleTurn;
}

function setBoardHoverClass(){
    board.classList.remove(X_CLASS)
    board.classList.remove(O_CLASS)
    if(circleTurn){
        board.classList.add(O_CLASS)
    }else{
        board.classList.add(X_CLASS)
    }
}

function checkWin(currentClass){
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass)
        })
    })
}

function boardDetails(){
    fetch("http://3.210.183.75:8080/tictactoe/tictactoeserver/board?key=rokki")
    .then(x => console.log(x.text()))
    .catch(error => console.warn(error));
}