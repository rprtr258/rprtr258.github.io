class NeuralNetwork {
    constructor(input, hidden, output, what) {
        if (input instanceof tf.Sequential) {
            this.model = input;
            this.input_nodes = hidden;
            this.hidden_nodes = output;
            this.output_nodes = what;
        } else {
            this.input_nodes = input;
            this.hidden_nodes = hidden;
            this.output_nodes = output;
            this.model = this.createModel();
        }
    }

    dispose() {
        this.model.dispose();
    }

    createModel() {
        const model = tf.sequential();
        const hidden = tf.layers.dense({
            units: this.hidden_nodes,
            inputShape: this.input_nodes,
            activation: "sigmoid"
        });
        model.add(hidden);
        const output = tf.layers.dense({
            units: this.output_nodes,
            activation: "sigmoid"
        });
        model.add(output);
        return model;
    }

    predict(input) {
        return tf.tidy(() => {
            const xs = tf.tensor2d([input]);
            const ys = this.model.predict(xs);
            const output = ys.dataSync();
            return output;
        });
    }

    copy() {
        return tf.tidy(() => {
            const modelCopy = this.createModel();
            const weights = this.model.getWeights();
            const weightsCopy = [];
            for (let i = 0; i < weights.length; i++) {
                weightsCopy[i] = weights[i].clone();
            }
            modelCopy.setWeights(weightsCopy);
            return new NeuralNetwork(modelCopy, this.input_nodes, this.hidden_nodes, this.output_nodes);
        });
    }

    mutate() {
        tf.tidy(() => {
            const weights = this.model.getWeights();
            const mutatedWeights = [];
            for (let i = 0; i < weights.length; i++) {
                let tensor = weights[i];
                let shape = weights[i].shape;
                let values = tensor.dataSync().slice();
                for (let j = 0; j < values.length; j++) {
                    let w = values[j];
                    if (random() < 0.1) {
                        values[j] = w + randomGaussian(0, 1);
                    }
                }
                let newTensor = tf.tensor(values, shape);
                mutatedWeights[i] = newTensor;
            }
            this.model.setWeights(mutatedWeights);
        });
    }
}