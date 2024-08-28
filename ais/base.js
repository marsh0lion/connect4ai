export default class Base {
    constructor() {}

    /**
     * Places a tile in a random location
     */
    placeRandom(board) {
        let num;
        do {
            num = Math.floor(Math.random() * 7);
        } while (!this.isOpen(num, board));
        return num;
    };

    isOpen(n, board) {
        return board[n].length < 6;
    };

    move(board) {
        return this.placeRandom(board);
    };

    async train(boards) {
        console.error('Cant train base classs');
    }
};
