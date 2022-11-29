// changeable board size
const boardDimensions = {
    width: 15,
    height: 15
}
// object for each cell
const FIELD = {
    isThereSnake: false,
    isThereFruit: false,
}
// images
const Img = {
    SNAKE_BODY: 'url("images/snake_body.png")',
    SNAKE_HEAD: 'url("images/snake_head.png")',
    SNAKE_CURVE: 'url("images/snake_curve.png")',
    SNAKE_TAIL: 'url("images/snake_tail.png")',
    FRUIT: 'url("images/fruit.png")',
}
// snake positions
let snake = [{
    x: 3,
    y: 9
}, {
    x: 3,
    y: 10
}
];
// direction
let direction = 'up';

init()

// starter elements
function init() {
    const game = document.createElement('div');
    game.id = 'game';
    const container = document.getElementById('container');
    container.append(game);

    // mapping board
    board = JSON.parse(JSON.stringify(new Array(boardDimensions.height).fill(null).map(() => new Array(boardDimensions.width).fill(FIELD))));

    // adding starter snake position and first fruit
    board[snake[0].y][snake[0].x].isThereSnake = true;
    board[snake[1].y][snake[1].x].isThereSnake = true;

    getFruit();
    drawBoard(board, snake);

    document.addEventListener('keydown', changeDirection);

    // setInterval(() => {
    //     moveSnake(board, snake);
    // }, 300);
}

// random fruit position
function getFruit() {
    // getting random coordinates
    const x = Math.floor(Math.random() * boardDimensions.width)
    const y = Math.floor(Math.random() * boardDimensions.height)

    // changing board
    if (board[y][x].isThereSnake === false) {
        board[y][x].isThereFruit = true;
    } else {
        getFruit();
    }
}

// keyboard events
function changeDirection(e) {
    switch (e.key) {
        case 'ArrowUp':
            if (direction !== 'down') {
                direction = 'up';
            }
            break;
        case 'ArrowDown':
            if (direction !== 'up') {
                direction = 'down';
            }
            break;
        case 'ArrowLeft':
            if (direction !== 'right') {
                direction = 'left';
            }
            break;
        case 'ArrowRight':
            if (direction !== 'left') {
                direction = 'right';
            }
            break;
    }
}


// moving snake
function moveSnake(board, snake) {

    switch (direction) {
        case 'up':
            snake.unshift({
                x: snake[0].x,
                y: snake[0].y - 1
            })
            break;
        case 'down':
            snake.unshift({
                x: snake[0].x,
                y: snake[0].y + 1
            })
            break;
        case 'left':
            snake.unshift({
                x: snake[0].x - 1,
                y: snake[0].y
            })
            break;
        case 'right':
            snake.unshift({
                x: snake[0].x + 1,
                y: snake[0].y
            })
            break;
    }
    board[snake[0].y][snake[0].x].isThereSnake = true;

    let removed = snake.pop();
    board[removed.y][removed.x].isThereSnake = false;

    drawBoard(board, snake);
}

// drawing board
function drawBoard(board, snake) {
    document.querySelector('#game').innerHTML = '';
    // create html board
    const table = document.createElement('table');
    board.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(field => {
            const td = document.createElement('td');

            let imgRotation = ''
            switch (direction) {
                case 'down':
                    imgRotation = 'rotate(0deg)';
                    break;
                case 'up':
                    imgRotation = 'rotate(180deg)';
                    break;
                case 'left':
                    imgRotation = 'rotate(90deg)';
                    break;
                case 'right':
                    imgRotation = 'rotate(270deg)';
                    break;
            }

            // change images according to board
            if (field.isThereSnake === true && snake[0].x === row.indexOf(field) && snake[0].y === board.indexOf(row)) {
                td.style.backgroundImage = Img.SNAKE_HEAD;
                td.style.transform = imgRotation;
            } else if (field.isThereSnake === true && snake[snake.length - 1].x === row.indexOf(field) && snake[snake.length - 1].y === board.indexOf(row)) {
                td.style.backgroundImage = Img.SNAKE_TAIL;
                td.style.transform = imgRotation;
            } else if (field.isThereSnake === true) {
                td.style.backgroundImage = Img.SNAKE_BODY;
                td.style.transform = imgRotation;
            } else if (field.isThereFruit) {
                td.style.backgroundImage = Img.FRUIT;
            } else {
                td.style.backgroundImage = 'none';
            }

            tr.append(td);
        })
        table.append(tr);
    })
    document.querySelector('#game').append(table);


}