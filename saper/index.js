
//starter elements
let el;
let label;
let submit = document.createElement("input");
let inputFields = ["height", "width", "mines"];
let div = document.createElement("div");
div.setAttribute("style", "display: flex; flex-wrap: wrap; width: 120px");

//display input fields
inputFields.forEach(field => {
    el = document.createElement("input");
    label = document.createElement("label");
    el.id = field;
    el.type = "number";
    label.innerText = field.charAt(0).toUpperCase() + field.slice(1) + ": ";
    div.append(label, el);
})

submit.type = "submit";
submit.value = "Generate";
submit.id = "submit";
div.append(submit);

//add on click generate
let div2 = document.createElement("div");
div2.setAttribute("style", "display: flex; flex-direction: column; align-items: center; justify-content: center; width");
let remaining = document.createElement("div");
let timer = document.createElement("div");
remaining.id = "remaining";
timer.id = "timer";
remaining.style.display = "none";
timer.style.display = "none";

div2.append(remaining, timer);

//add to DOM
document.body.append(div, div2);

height = document.getElementById("height");
width = document.getElementById("width");
mines = document.getElementById("mines");
submit = document.getElementById("submit");
remaining = document.getElementById("remaining");
timer = document.getElementById("timer");

//generate onclick
submit.addEventListener("click", function () {
    if (height.value == '' || width.value == '' || mines.value == '') {
        alert("Fill all fields!");
    } else {
        timer.innerText = countTime();
        remaining.innerText = "Remaining mines: " + mines.value;
        remaining.style.display = "block";
        timer.style.display = "block";
        generateBoard();
    }
});

//time
function countTime() {
    let time = 0;
    setInterval(function () {
        time++;
        timer.innerText = "Your play time: " + time + "s";
    }, 1000);
}

//generate board
const BOARD = [[], []];
const FIELD = {
    isRevealed: false,
    isThereQuestionMark: false,
    isThereFlag: false,
    isThereMine: false,
    number: 0
}

function generateBoard() {
    let row;
    let cell;
    let board = document.createElement("table");
    board.setAttribute("style", "border-collapse: collapse;");

    for (let h = 0; h < height.value; h++) {
        row = document.createElement("tr");
        for (let w = 0; w < width.value; w++) {
            BOARD.push(FIELD);
            cell = document.createElement("td");
            cell.setAttribute("style", "border: 1px solid white; width: 20px; height: 20px; background-color: grey;");
            row.append(cell);
        }
        board.append(row);
    }

    document.body.append(board);

}