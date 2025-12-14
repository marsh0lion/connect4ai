import Base from './base.js';
import * as TF from "@tensorflow/tfjs";

export default class TensorFlow extends Base {
    constructor() {
        super();
        this.model = TF.sequential();
        this.model.add(TF.layers.dense({ units: 32, activation: 'relu', inputShape: [84] })); // Input shape is 1 (for 1D input)
        this.model.add(TF.layers.dense({ units: 16, activation: 'relu' }));
        this.model.add(TF.layers.dense({ units: 7 }));

        const optimizer = TF.train.adam(0.5);
        this.model.compile({
            optimizer: optimizer,
            loss: 'meanSquaredError', // Or other suitable loss function (e.g., 'meanAbsoluteError')
            metrics: ['mse'] // Optional metrics
        });

        this.trained = false;
    }

    flatten(board) {
        let ret = [];
        board.forEach(column => {
            for (let height = 0; height < 6; height++) {
                ret.push(column[height] && column[height] == 'x' ? 1 : 0);
            }
        });
        board.forEach(column => {
            for (let height = 0; height < 6; height++) {
                ret.push(column[height] && column[height] == 'o' ? 1 : 0);
            }
        });
        return ret;
    }

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
        if (!this.trained) {
            return this.placeRandom(board);
        }
        const inputTensor = TF.tensor2d([this.flatten(board)], [1, 84]);
        let prediction = this.model.predict(inputTensor);
        let column = prediction.arraySync();
        
        let max = 0;
        for (let pos = 1; pos < column[0].length; pos ++) {
            if (column[0][pos] > column[0][max]) {
                max = pos;
            }
        }
        console.log(max);
        if (!this.isOpen(max, board)) {
            return this.placeRandom(board);
        }
        return max;
    };

    name() {
        return 'TensorFlow';
    };

    async train(boards) {
        let tfInput = boards.map((board) => {
            return this.flatten(board.input);
        });
        let tfOutput = boards.map((board) => {
            return board.output;
        });

        const inputTensor = TF.tensor2d(tfInput, [tfInput.length, 84]);
        const labelTensor = TF.tensor2d(tfOutput, [tfOutput.length, 7]);
        
        // 4. Train the model
        await this.model.fit(inputTensor, labelTensor, {
            epochs: 5,
            callbacks: {
                onEpochEnd: (epoch, logs) => {
                    console.log(`Epoch ${epoch + 1}: Loss = ${logs.loss}`);
                }
            }
        });
        this.trained = true;
    }
};
