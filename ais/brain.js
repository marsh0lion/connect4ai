import Base from './base.js';
import brain from "brain.js";
import fs from "fs";

export default class Brain extends Base {
    net;
    crossValidate;

    constructor() {
        super();
        try {
        this.crossValidate = new brain.CrossValidate(() => new brain.NeuralNetwork());
        let injson = fs.readFileSync('./data/brain.json').toString();
        this.crossValidate.fromJSON(JSON.parse(injson));
        this.net = this.crossValidate.toNeuralNetwork();
        } catch (e) {
            console.log('file not loaded', e)
        }
        //this.crossValidate.train([]);
        //this.crossValidate.toJSON();
        //this.net = this.crossValidate.toNeuralNetwork();
        
    }

    move(board) {   
        if (this.net === undefined) {
            return this.placeRandom(board);
        }
        let prediction = this.net.run(this.flatten(board));
        let max = 0;
        for (let pos = 1; pos < prediction.length; pos ++) {
            if (prediction[pos] > prediction[max]) {
                max = pos;
            }
        }
        if (!this.isOpen(max, board)) {
            return this.placeRandom(board);
        }
        return max;
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

    async train(boards) {
        if (this.crossValidate === undefined) {
            this.crossValidate = new brain.CrossValidate(() => new brain.NeuralNetwork());
        }
        let brainData = boards.map(board => {return {output: board.output, input:this.flatten(board.input)};});
        await this.crossValidate.train(brainData, {log: true, iterations: 10});
        this.net = this.crossValidate.toNeuralNetwork();

        const json = this.net.toJSON(); // all stats in json as well as neural networks
        //this.net = this.crossValidate.toNeuralNetwork(); // get top performing net out of `crossValidate`
        //await net.trainAsync(brainData, {log: true, iterations: 2000})
        console.log("training finished");
        fs.writeFile('./data/brain.json', JSON.stringify(json), err => {
            if (err) {
            console.error(err);
            } else {
            // file written successfully
            }
        });

    }
}