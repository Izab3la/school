//basic info
const WIDTH = 16;
const HEIGHT = 16;
const BOARD = [];
//board field object that describes it and its properties
const FIELD = {
    isRevealed: false,
    isThereQuestionMark: false,
    isThereFlag: false,
    isThereMine: false,
    number: 0
}
//image url - image that is displayed on field
const IMG = {
    blank: "./img/klepa.PNG",
    flag: "./img/flaga.PNG",
    questionMark: "./img/pyt.png",
    mine: "./img/pbomb.PNG",
    detonatedMine: "./img/bomb.PNG",
}


//starter elements - basic input fields
function start() {
    let el;
    let label;
    let submit = document.createElement("input");
    let inputFields = ["height", "width", "mines"];
    let div = document.createElement("div");
    div.setAttribute("style", "display: flex; flex-wrap: wrap; width: 120px");

    //display input fields - height, width, mines
    inputFields.forEach(field => {
        el = document.createElement("input");
        label = document.createElement("label");
        el.id = field;
        el.type = "number";
        label.innerText = field.charAt(0).toUpperCase() + field.slice(1) + ": ";
        div.append(label, el);
    })
    //display submit button
    submit.type = "submit";
    submit.value = "Generate";
    submit.id = "submit";
    div.append(submit);

    //add invisible info about remaining mines and time
    let div2 = document.createElement("div");
    div2.setAttribute("style", "display: flex; flex-direction: column; align-items: center; justify-content: center; width");
    let remaining = document.createElement("div");
    let timer = document.createElement("div");
    remaining.id = "remaining";
    timer.id = "timer";
    remaining.style.display = "none";
    timer.style.display = "none";

    div2.append(remaining, timer);

    //append everything to DOM
    document.body.append(div, div2);

    displayOnSubmit();
}

//display elements on submit
function displayOnSubmit() {
    //get elements from DOM
    let height = document.getElementById("height");
    let width = document.getElementById("width");
    mines = document.getElementById("mines");
    submit = document.getElementById("submit");
    remaining = document.getElementById("remaining");
    timer = document.getElementById("timer");

    //submit on click
    submit.addEventListener("click", function () {
        //check if input is valid
        if (height.value == '' || width.value == '' || mines.value == '') {
            alert("Fill all fields!");
        } else {
            //show invisible information and board, start timer
            timer.innerText = countTime();
            remaining.innerText = "Remaining mines: " + mines.value;
            remaining.style.display = "block";
            timer.style.display = "block";
            generateBoard();
        }
    });

}

//time counter - start
function countTime() {
    let time = 0;
    setInterval(function () {
        time++;
        timer.innerText = "Your play time: " + time + "s";
    }, 1000);
}

//generate board function - start
function generateBoard() {
    let row;
    let cell;
    let table = document.createElement("table");
    table.setAttribute("style", "border-collapse: collapse;");

    //create board
    //add objects to board array
    //add event listeners to fields
    //create table
    for (let h = 0; h < height.value; h++) {
        row = document.createElement("tr");
        BOARD[h] = [];
        for (let w = 0; w < width.value; w++) {
            BOARD[h].push(FIELD);
            cell = document.createElement("td");
            cell.setAttribute("style", `border: 1px solid white; width: ${WIDTH}px; height: ${HEIGHT}px; background-image: url('${IMG.blank}');`);
            cell.addEventListener("click", startGame);
            row.append(cell);
        }
        table.append(row);
    }

    document.body.append(table);
}

//start game on first click
function startGame() {
    //remove start game clicker
    this.removeEventListener("click", startGame);

    //get starter board positions
    addMines();
    console.log(BOARD);


    //add event listeners to all fields
    for (let h = 0; h < height.value; h++) {
        let row = document.getElementsByTagName("tr")[h];
        for (let w = 0; w < width.value; w++) {
            let cell = row.getElementsByTagName("td")[w];
            cell.addEventListener("click", leftClick);
            cell.addEventListener("contextmenu", rightClick);
        }
    }
}

//add mines to board
function addMines() {
    let minesLeft = mines.value;

    while (minesLeft > 0) {
        let h = Math.floor(Math.random() * height.value);
        let w = Math.floor(Math.random() * width.value);
        if (BOARD[h][w].isThereMine == false) {
            BOARD[h][w].isThereMine = true;
            minesLeft--;
        }
    }


}

//actions on left clicks - reveal field
function leftClick() {
    let cell = this;
    console.log('left');

    //disable click on revealed
    cell.removeEventListener("click", leftClick);
}

//actions on right clicks - flags/question marks
function rightClick(ev) {
    let cell = this;
    console.log('right');

    //disable displaying context menu
    ev.preventDefault();
}

start();