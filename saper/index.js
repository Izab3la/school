//basic info
const WIDTH = 40;
const HEIGHT = 40;
let time = 0;
let remainingMines;
//score storing structure
let topScores = [];
topScores = JSON.parse(document.cookie.split("=")[1])

const GameStatus = {
    INIT: 0,
    PLAYING: 1,
    FINISHED: 2
}
let gameStatus = GameStatus.INIT;
//board field object that describes it and its properties
const FIELD = {
    isRevealed: false,
    isThereQuestionMark: false,
    isThereFlag: false,
    isThereMine: false,
    isMineDetonated: false,
    minesAround: 0
}

const timer = document.createElement("div");
const remaining = document.createElement("div");
const userUI = document.createElement("div");
const table = document.createElement("table");

init()
const height = document.getElementById("height");
const width = document.getElementById("width");
const mines = document.getElementById("mines");
const boardDimensions = {
    x: parseInt(width.value),
    y: parseInt(height.value)
}

//image url - image that is displayed on field
const Img = {
    BLANK: "./img/klepa.PNG",
    FLAG: "./img/flaga.PNG",
    QUESTION_MARK: "./img/pyt.png",
    MINE: "./img/pbomb.PNG",
    DETONATED_MINE: "./img/bomb.PNG",
}

//starter elements - basic input fields
function init() {
    const submit = document.createElement("input");
    const inputFields = ["height", "width", "mines"];
    const div = document.createElement("div");
    div.setAttribute("style", "display: flex; flex-wrap: wrap; width: 120px");

    //display input fields - height, width, mines
    inputFields.forEach(field => {
        const el = document.createElement("input");
        const label = document.createElement("label");
        el.id = field;
        el.type = "text";
        label.innerText = field.charAt(0).toUpperCase() + field.slice(1) + ": ";
        div.append(label, el);
    })

    //display submit button
    submit.type = "submit";
    submit.value = "Generate";
    submit.id = "submit";
    div.append(submit);

    //add invisible info about remaining mines and time
    userUI.setAttribute("style", "display: flex; flex-direction: column; align-items: center; justify-content: center; ");
    userUI.style.display = "none";
    userUI.append(remaining, timer);
    table.setAttribute("style", "border-collapse: collapse; border: solid lightgray 1px;");
    userUI.append(table);

    //append everything to DOM and start timing function
    document.body.append(div, userUI);
    countTime();

    //delete input that is not numeric
    inputFields.forEach(field => {
        const el = document.getElementById(field);
        el.oninput = () => {
            if (isNaN(el.value)) {
                setTimeout(() => {
                    el.value = '';
                }, 1000)
            }

        }
    })

    //submit on click
    submit.addEventListener("click", function () {
        boardDimensions.x = parseInt(width.value);
        boardDimensions.y = parseInt(height.value);
        //check if input is valid
        if (height.value == '' || width.value == '' || mines.value == '') {
            alert("Fill all fields!");
        } else {
            restart()
        }
    });
}

function restart() {
    gameStatus = GameStatus.INIT;
    time = 0;
    remainingMines = mines.value
    //show invisible information and board, start timer
    remaining.innerText = "Remaining mines: " + remainingMines;
    userUI.style.display = "block";

    displayScores();

    //generate board
    const board = JSON.parse(JSON.stringify(Array(boardDimensions.y).fill() // create array of y elements filled with undefined
        .map(() => Array(boardDimensions.x).fill(FIELD)))); // map each elment of 1d array to an array of x elements filled with FIELD

    drawBoard(table, board);
}

//time counter - start
function countTime() {
    timer.innerText = "Your play time: " + time + "s";
    setInterval(function () {
        if (gameStatus == GameStatus.PLAYING) {
            time++;
            timer.innerText = "Your play time: " + time + "s";
        }
    }, 1000);
}

function drawBoard(table, board) {
    table.innerHTML = "";

    board.forEach((row, y) => {
        const tr = document.createElement("tr");
        row.forEach((field, x) => {
            const td = document.createElement("td");
            td.setAttribute("style", `border: 1px solid white; width: ${WIDTH}px; height: ${HEIGHT}px; background-repeat: no-repeat; background-size: cover;`);
            //displaying correct image for the field state
            if (field.isThereFlag) {
                td.style.backgroundImage = `url(${Img.FLAG})`;
            } else if (field.isThereQuestionMark) {
                td.style.backgroundImage = `url(${Img.QUESTION_MARK})`;
            } else if (field.isMineDetonated) {
                td.style.backgroundImage = `url(${Img.DETONATED_MINE})`;
            } else if (!field.isRevealed) {
                td.style.backgroundImage = `url(${Img.BLANK})`;
            } else if (field.isThereMine) {
                td.style.backgroundImage = `url(${Img.MINE})`;
            } else if (field.minesAround > 0) {
                td.innerText = field.minesAround;
                td.style.backgroundColor = 'lightgray';
                td.style.color = ['red', 'green', 'blue', 'purple', 'orange', 'pink', 'black', 'brown'][field.minesAround - 1];
                td.style.textAlign = 'center';
            } else {
                td.style.backgroundColor = 'lightgray';
            }

            td.addEventListener("click", () => onCellClick(board, field, x, y));
            td.addEventListener("contextmenu", (event) => {
                event.preventDefault();
                onRightClick(board, field)
            });
            tr.append(td);
        });
        table.append(tr);
    })
}

//on left click - reveal fields
function onCellClick(board, field, x, y) {
    if (gameStatus === GameStatus.INIT) {
        gameStatus = GameStatus.PLAYING;
        addMines(board, boardDimensions.x, boardDimensions.y, parseInt(mines.value), field)
    }

    if (gameStatus === GameStatus.PLAYING) {
        if (field.isThereMine) {
            field.isMineDetonated = true;
            board.forEach(row => row.forEach(field => {
                field.isRevealed = true;
                field.isThereFlag = false;
                field.isThereQuestionMark = false
            }));
            drawBoard(table, board);
            setTimeout(() => {
                alert("You lost!");
            }, 100);
            console.log(board);
            gameStatus = GameStatus.FINISHED;
        } else {
            revealField(board, field, x, y);
            drawBoard(table, board);
        }

        setTimeout(() => {
            checkWin(board);
        }, 100);
    }
}

//on right click - add question mark, flag, remove both
function onRightClick(board, field) {
    if ((gameStatus === GameStatus.PLAYING || gameStatus === GameStatus.INIT) && !field.isRevealed) {
        if (field.isThereFlag) {
            //changing flag to question mark and the number of remaining mines
            remainingMines++;
            remaining.innerText = "Remaining mines: " + remainingMines;
            field.isThereFlag = false;
            field.isThereQuestionMark = true;
        } else if (field.isThereQuestionMark) {
            //changing question mark to blank
            field.isThereQuestionMark = false;
        } else {
            // changing blank to flag and the number of remaining mines
            field.isThereFlag = true;
            remainingMines--;
            remaining.innerText = "Remaining mines: " + remainingMines;
        }
        drawBoard(table, board);

        setTimeout(() => {
            checkWin(board);
        }, 100);
    }
}

//add mines to board
function addMines(board, x, y, minesLeft, field) {
    //get random mine placement
    while (minesLeft > 0) {
        const h = Math.floor(Math.random() * y);
        const w = Math.floor(Math.random() * x);
        //check if there is already a mine
        //check if it is the cell clicked
        if (board[h][w].isThereMine === false && board[h][w] !== field) {
            //add mine
            //update the number of mines left to place
            board[h][w].isThereMine = true;
            minesLeft--;

            for (let height = h - 1; height <= h + 1; height++) {
                for (let width = w - 1; width <= w + 1; width++) {
                    if (height >= 0 && height < y && width >= 0 && width < x) {
                        board[height][width].minesAround++;
                    }
                }
            }
        }

    }
}

//reveal clicked cell and surrounding if 0
function revealField(board, field, x, y) {
    if (!field.isRevealed) {
        field.isRevealed = true;
        if (field.minesAround === 0) {
            for (let height = y - 1; height <= y + 1; height++) {
                for (let width = x - 1; width <= x + 1; width++) {
                    if (height >= 0 && height < boardDimensions.y && width >= 0 && width < boardDimensions.x) {
                        if (!board[height][width].isRevealed) {
                            revealField(board, board[height][width], width, height);
                        }
                    }
                }
            }
        }
    }
}

//check if the game is won
function checkWin(board) {
    if (board.every(row => row.every(field => (field.isThereMine && field.isThereFlag) || (field.isRevealed && !field.isThereMine)))) {
        gameStatus = GameStatus.FINISHED;
        setTimeout(() => {
            alert("You won!");
            topScoresTable();
        }, 100);
    }
}

//display top scores from cookies
function topScoresTable() {
    //getting current game info
    const currentGameMode = height.value + "x" + width.value + "x" + mines.value;
    const currentGameTime = time;
    const nick = prompt("Enter your nickname:");
    const mode = {
        "mode": currentGameMode,
        "scores": []
    }
    const score = {
        "nick": nick,
        "time": time
    }

    //check if nick is empty
    if (nick === null) {
        topScoresTable();
    } else {

        //check if mode already exists in object
        //add new mode if it doesn't
        const found = topScores.some(mode => mode.mode === currentGameMode);
        if (!found) {
            topScores.push(mode);
            topScores[topScores.length - 1].scores.push(score);
        } else {
            //if it exists - check where to add the score
            topScores.forEach(mode => {
                if (mode.mode === currentGameMode) {
                    for (let i = mode.scores.length - 1; i >= 0; i--) {
                        if (currentGameTime >= mode.scores[i].time) {
                            mode.scores.splice(i + 1, 0, score);
                            break;
                        } else if (i === 0) {
                            mode.scores.unshift(score);
                        }
                    }

                    //removing last score if there are more than 10
                    if (mode.scores.length > 10) {
                        mode.scores.pop();
                    }
                }
            });
        }
    }

    //adding scores to cookies that expire in 1 year
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    document.cookie = "topScores=" + JSON.stringify(topScores) + "; expires=" + date.toUTCString();

    displayScores();
}

//displaying top scores
function displayScores() {
    const scoreBoard = document.createElement("div");
    scoreBoard.setAttribute("style", "width: 300px; height: 500px; overflow: auto; border: solid black 1px; position: absolute; right: 0; top: 0; background-color: lightgray; text-align: center;");
    const scoreTable = topScores.find(score => score.mode === boardDimensions.x + "x" + boardDimensions.y + "x" + mines.value);
    if (scoreTable === undefined) {
        scoreBoard.innerText = `No scores 
        for mode ${boardDimensions.x}x${boardDimensions.y}x${mines.value}!`;
    } else {
        scoreBoard.innerText = `TOP SCORES
    for mode ${scoreTable.mode}`;
        scoreTable.scores.forEach(score => {
            const scoreDiv = document.createElement("div");
            scoreDiv.innerText = score.nick + " - " + score.time + "s";
            scoreBoard.append(scoreDiv);
        })
    }

    document.body.append(scoreBoard);
}