import Brain from "./ais/brain.js";

let brainAI = new Brain();
let board = []
let trainingData = [];
resetBoard();

function verify(letter, n) {
    let length = board[n].length;
    let height = length - 1;
    let testLength = 0;

    // vertical
    if (length >= 4) {
        if (board[n][length - 1] === letter
            && board[n][length - 2] === letter
            && board[n][length - 3] === letter
            && board[n][length - 4] === letter)
        {
            return true;
        }
    }

    // horizontal
    for (let index = Math.max(n - 4, 0); testLength < 4 && index < Math.min(6, n + 4); index++) {
        if (board[index] && board[index][height] === letter) {
            testLength++;
        } else {
            testLength = 0;
        }
    }
    if (testLength >= 4) {
        return true;
    }

    // positive angle
    testLength = 0;
    for (let check = Math.max(height - 4, n - 4, 0); testLength < 4 && check < Math.min(6, n + 4, height + 4); check++) {
        if (board[n + check] && board[n + check][height + check] === letter) {
            testLength++;
        } else {
            testLength = 0;
        }
    }
    if (testLength >= 4) {
        return true;
    }

    // negative angle
    testLength = 0;
    for (let check = Math.max(6 - height - 4, n - 4, 0); testLength < 4 && check < Math.min(6, n + 4, 6 - height + 4); check++) {
        if (board[n + check] && board[n + check][height - check] === letter) {
            testLength++;
        } else {
            testLength = 0;
        }
    }
    if (testLength >= 4) {
        return true;
    }
    return false;
};

function turn(n, letter) {
    board[n].push(letter);
    return verify(letter, n);
};

function flipBoard() {
    board = board.map((row) => {
        return row.map((column) => {
            return column === 'x' ? 'o' : 'x';
        });
    });
}

function resetBoard() {
    board = [[], [], [], [], [], [], []];
}

function isFull() {
    return board.filter((column) => column.length < 6).length === 0;
}

function trainingGame() {
    let player = 'o';
    
    let train1 = [];
    let train2 = [];
    let train = train1;
    let result = false;
    let num;

    do {
        player = player === 'x' ? 'o' : 'x';
        num = brainAI.move(board);
        let currentBoard = JSON.parse(JSON.stringify(board));
        let output = [0,0,0,0,0,0,0];
        output[num] = 1;
        if (player === 'x') {
            train1.push({input: currentBoard, output});
        } else {
            train2.push({input: currentBoard, output});
        }
        result = turn(num, 'x');
        flipBoard();
    } while (!result && !isFull());

    if (result) {
        if (player === 'x') {
            console.log('player 1 won');
            trainingData = trainingData.concat(train1);
        } else {
            console.log('player 2 won');
            trainingData = trainingData.concat(train2);
        }

    }
    resetBoard();
}

for (let i = 0; i < 10; i++) {
    console.log('loop:' + i);
    trainingGame();
}

brainAI.train(trainingData);

for (let i = 0; i < 100; i++) {
    console.log('loop:' + i);
    trainingGame();
}
console.log('finished');
