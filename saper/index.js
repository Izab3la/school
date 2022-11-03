
//starter elements
let el;
let label;
let submit = document.createElement("input");
let fields = ["height", "width", "mines"];
let div = document.createElement("div");
div.setAttribute("style", "display: flex; flex-wrap: wrap; width: 180px");

//display input fields
fields.forEach(field => {
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
let remaining = document.createElement("div");
let timer = document.createElement("div");
remaining.id = "remaining";
timer.id = "timer";
remaining.style.display = "none";
timer.style.display = "none";

div.append(remaining, timer);

//add to DOM
document.body.append(div);

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
        timer.innerText = startTimer();
        remaining.innerText = "Remaining mines: " + mines.value;
        remaining.style.display = "block";
        timer.style.display = "block";
    }
});

//time
function startTimer() {
    let time = 0;
    setInterval(function () {
        time++;
        timer.innerText = "Your play time: " + time + "s";
    }, 1000);
}

//generate board
const BOARD = [];

function generateBoard() {
    for (let h = 0; h < height.value; h++) {
        for (let w = 0; w < width.value; w++) {
        }
    }

}