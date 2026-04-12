import TensorFlow from "./ais/tensorflow.js";
import fs from 'fs';
import http2 from 'http2';
import { Board } from './types.js';

let tensorflow = new TensorFlow();
let board: Board = Array(7).fill(null).map(() => Array(6).fill(null));
let trainingData = [];
resetBoard();

function verify(letter: 'x' | 'o', n: number, row: number): boolean {
    // vertical
    let count = 1;
    for (let r = row - 1; r >= 0 && board[n][r] === letter; r--) count++;
    for (let r = row + 1; r < 6 && board[n][r] === letter; r++) count++;
    if (count >= 4) return true;

    // horizontal
    count = 1;
    for (let c = n - 1; c >= 0 && board[c][row] === letter; c--) count++;
    for (let c = n + 1; c < 7 && board[c][row] === letter; c++) count++;
    if (count >= 4) return true;

    // diagonal \
    count = 1;
    for (let d = 1; n - d >= 0 && row - d >= 0 && board[n - d][row - d] === letter; d++) count++;
    for (let d = 1; n + d < 7 && row + d < 6 && board[n + d][row + d] === letter; d++) count++;
    if (count >= 4) return true;

    // diagonal /
    count = 1;
    for (let d = 1; n - d >= 0 && row + d < 6 && board[n - d][row + d] === letter; d++) count++;
    for (let d = 1; n + d < 7 && row - d >= 0 && board[n + d][row - d] === letter; d++) count++;
    if (count >= 4) return true;

    return false;
};

function turn(n: number, letter: 'x' | 'o'): boolean {
    for (let row = 0; row < 6; row++) {
        if (board[n][row] === null) {
            board[n][row] = letter;
            return verify(letter, n, row);
        }
    }
    return false; // column full, but shouldn't happen
};

function flipBoard() {
    board = board.map((column) => {
        return column.map((cell) => {
            return cell === 'x' ? 'o' : cell === 'o' ? 'x' : null;
        });
    });
}

function resetBoard() {
    board = Array(7).fill(null).map(() => Array(6).fill(null));
}

function isFull(): boolean {
    return board.every((column) => column.every((cell) => cell !== null));
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
        num = tensorflow.move(board);
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

for (let i = 0; i < 100; i++) {
    console.log('loop:' + i);
    trainingGame();
}

await tensorflow.train(trainingData);

for (let i = 0; i < 1000; i++) {
    console.log('loop:' + i);
    trainingGame();
}

const server = http2.createSecureServer({
  key: fs.readFileSync('localhost-privkey.pem'),
  cert: fs.readFileSync('localhost-cert.pem'),
});
server.on('error', (err) => console.error(err));

server.on('stream', (stream, headers,c,d,e,f) => {
    console.log(stream, headers,c,d,e,f);
    // stream is a Duplex
    stream.respond({
        'content-type': 'text/html; charset=utf-8',
        ':status': 200,
    });
    stream.end('<h1>Hello World</h1>');
});

server.listen(8443);

console.log('finished');
