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
// direction
let direction;
let snake
const move = null

let gameEnded = false

init()

// starter elements
function init() {
    direction = 'up'
    // snake positions
    snake = [{
        x: 3,
        y: 9,
        direction: 'up'
    }, {
        x: 3,
        y: 10,
        direction: 'up'
    }
    ];
    // board
    const container = document.getElementById('container');
    container.innerHTML = '';
    const game = document.createElement('div');
    game.id = 'game';
    container.append(game);

    // mapping board
    board = JSON.parse(JSON.stringify(new Array(boardDimensions.height).fill(null).map(() => new Array(boardDimensions.width).fill(FIELD))));

    // adding starter snake position and first fruit
    board[snake[0].y][snake[0].x].isThereSnake = true;
    board[snake[1].y][snake[1].x].isThereSnake = true;

    getFruit();
    drawBoard(board, snake);

    document.addEventListener('keydown', changeDirection);

    move = setInterval(() => {
        if (!gameEnded) {
            moveSnake(board, snake);
        }
    }, 300);
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
                y: snake[0].y - 1,
                direction: 'up'
            })
            break;
        case 'down':
            snake.unshift({
                x: snake[0].x,
                y: snake[0].y + 1,
                direction: 'down'
            })
            break;
        case 'left':
            snake.unshift({
                x: snake[0].x - 1,
                y: snake[0].y,
                direction: 'left'
            })
            break;
        case 'right':
            snake.unshift({
                x: snake[0].x + 1,
                y: snake[0].y,
                direction: 'right'
            })
            break;
    }
    // checkHit(board, snake)
    checkHit(board, snake);

    board[snake[0].y][snake[0].x].isThereSnake = true;
    eatFruit(board, snake);

    let removed = snake.pop();
    board[removed.y][removed.x].isThereSnake = false;

    drawBoard(board, snake);
}

// change direction of snake body
function changeFieldDirection(board, snake) {
    if (snake.length > 1) {
        const last = snake[snake.length - 1]
        const nextToLast = snake[snake.length - 2]

        if (last.y < nextToLast.y) {
            last.direction = 'down'
        }
        else if (last.y > nextToLast.y) {
            last.direction = 'up'
        }
        else if (last.x < nextToLast.x) {
            last.direction = 'right'
        }
        else if (last.x > nextToLast.x) {
            last.direction = 'left'
        }

        for (let i = 1; i < snake.length - 1; i++) {
            const next = snake[i + 1]
            const curr = snake[i]
            const prev = snake[i - 1]

            if (next.y < curr.y) {
                if (curr.x === prev.x) {
                    curr.direction = 'down'
                }
                else if (curr.x < prev.x) {
                    curr.direction = 'down left'
                }
                else if (curr.x > prev.x) {
                    curr.direction = 'down right'
                }
            } else if (next.y > curr.y) {
                if (curr.x === prev.x) {
                    curr.direction = 'up'
                }
                else if (curr.x < prev.x) {
                    curr.direction = 'up left'
                }
                else if (curr.x > prev.x) {
                    curr.direction = 'up right'
                }
            } else if (next.x < curr.x) {
                if (curr.y === prev.y) {
                    curr.direction = 'right'
                }
                else if (curr.y < prev.y) {
                    curr.direction = 'right up'
                }
                else if (curr.y > prev.y) {
                    curr.direction = 'right down'
                }
            } else if (next.x > curr.x) {
                if (curr.y === prev.y) {
                    curr.direction = 'left'
                }
                else if (curr.y < prev.y) {
                    curr.direction = 'left up'
                }
                else if (curr.y > prev.y) {
                    curr.direction = 'left down'
                }
            }
        }
    }

}

// drawing board
function drawBoard(board, snake) {
    document.querySelector('#game').innerHTML = '';
    // create html board
    const table = document.createElement('table');
    board.forEach((row, i) => {
        const tr = document.createElement('tr');
        row.forEach((field, j) => {
            const td = document.createElement('td');

            let imgRotation = ''
            changeFieldDirection(board, snake)

            // change images according to board
            if (field.isThereSnake === true && snake[0].x === j && snake[0].y === i) {
                td.style.backgroundImage = Img.SNAKE_HEAD;
                // check rotation
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
                td.style.transform = imgRotation;
            } else if (field.isThereSnake === true && snake[snake.length - 1].x === j && snake[snake.length - 1].y === i) {
                td.style.backgroundImage = Img.SNAKE_TAIL;
                // check rotation
                switch (snake[snake.length - 1].direction) {
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
                td.style.transform = imgRotation;
            } else if (field.isThereSnake === true) {
                td.style.backgroundImage = Img.SNAKE_CURVE;
                // check rotation
                const current = snake.find(el => el.x === j && el.y === i)
                switch (current.direction) {
                    case 'down':
                        td.style.backgroundImage = Img.SNAKE_BODY;
                        imgRotation = 'rotate(0deg)';
                        break;
                    case 'down right':
                        imgRotation = 'rotate(270deg)'
                        break;
                    case 'down left':
                        imgRotation = 'rotate(0deg)';
                        break;
                    case 'up':
                        td.style.backgroundImage = Img.SNAKE_BODY;
                        imgRotation = 'rotate(180deg)';
                        break;
                    case 'up left':
                        imgRotation = 'rotate(90deg)';
                        break;
                    case 'up right':
                        imgRotation = 'rotate(180deg)';
                        break;
                    case 'left':
                        td.style.backgroundImage = Img.SNAKE_BODY;
                        imgRotation = 'rotate(90deg)';
                        break;
                    case 'left down':
                        imgRotation = 'rotate(0deg)';
                        break;
                    case 'left up':
                        imgRotation = 'rotate(90deg)';
                        break;
                    case 'right':
                        td.style.backgroundImage = Img.SNAKE_BODY;
                        imgRotation = 'rotate(270deg)';
                        break;
                    case 'right up':
                        imgRotation = 'rotate(180deg)';
                        break;
                    case 'right down':
                        imgRotation = 'rotate(270deg)';
                        break;
                }
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

// eating fruit and growing snake
function eatFruit(board, snake) {
    if (board[snake[0].y][snake[0].x].isThereFruit) {
        board[snake[0].y][snake[0].x].isThereFruit = false;
        snake.push({
            x: snake[snake.length - 1].x,
            y: snake[snake.length - 1].y
        })
        getFruit();
    }
}

// check snake hitting the wall or itself
function checkHit(board, snake) {
    if (snake[0].x < 0 || snake[0].y < 0 || snake[0].x === boardDimensions.width || snake[0].y === boardDimensions.height) {
        gameEnded = true;
        clearInterval(move)
        setTimeout(() => {
            alert('YOU LOST! You hit the wall!');
        }, 400)
    } else if (board[snake[0].y][snake[0].x].isThereSnake === true) {
        gameEnded = true;
        clearInterval(move)
        setTimeout(() => {
            alert('YOU LOST! You hit yourself!');
        }, 400)
    }
}