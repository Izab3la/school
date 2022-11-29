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

init()

// starter elements
function init() {
    const game = document.createElement('div');
    game.id = 'game';
    const container = document.getElementById('container');
    container.append(game);

    // mapping board
    board = new Array(boardDimensions.height).fill(null).map(() => new Array(boardDimensions.width).fill(FIELD));

    drawBoard(board);
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

// drawing board
function drawBoard(board) {
    // create html board
    const table = document.createElement('table');
    board.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(field => {
            const td = document.createElement('td');

            // change images according to board
            if (field.isThereSnake) {
                td.style.backgroundImage = Img.SNAKE_BODY;
            } else if (field.isThereFruit) {
                td.style.backgroundImage = Img.FRUIT;
            }

            tr.append(td);
        })
        table.append(tr);
    })
    document.querySelector('#game').append(table);


}