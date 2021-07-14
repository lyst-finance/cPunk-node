const tf = require('@tensorflow/tfjs-node')

let points;

    async function run () {
        
        //Import CSV
        const punkBoughtData = tf.data.csv("http://127.0.0.1:8080/bought-data.csv");

        //Extract x and y vals to plot
        const filteredData = punkBoughtData.filter(record => {
            if(record.priceInUSD < 200000 && record.priceInUSD > 100){
                 if(record.timestamp > 1609459200 && record.timestamp < 1624492800){ 
                    return record
                 }
            }
        });

        const pointsDataset = filteredData.map(record => ({
                x : record.timestamp,
                y : record.priceInUSD,
                class: record.count
            }))

        points = await pointsDataset.toArray();
        
        if(points.length % 2 !== 0) { // If odd number of elements
            points.pop(); // remove one element
        }
        
        tf.util.shuffle(points);

        //Extract Features (inputs)
        const featureValues = points.map(p => p.x)
        const featureTensor = tf.tensor2d(featureValues, [featureValues.length, 1]);

        // //Extract Labels outputs
        const labelValues = points.map(p => p.y);
        const labelTensor = tf.tensor2d(labelValues, [labelValues.length, 1]);

        //normalise features and labels
        function normalise (tensor) {
            const min = tensor.min(); //finds minimum value
            const max = tensor.max(); //finds max value
            const normalisedTensor = tensor.sub(min).div(max.sub(min))
            return {
                tensor : normalisedTensor,
                min,
                max
            }
        }

        //denormalise
        function denormalise(tensor, min, max) {
            const denormalisedTensor = tensor.mul(max.sub(min)).add(min);
            return denormalisedTensor    
        
        }

        function createModel() {
            const model = tf.sequential();
            
            //adding a layer
            model.add(tf.layers.dense({
                units: 5, //number of nodes in layer
                useBias: true, //adds a bias parameter 
                activation: 'sigmoid', //try switching to tanh for an interesting result
                inputDim: 1,
                weights: [ tf.randomNormal([1, 5], -10, 0),  tf.randomNormal([5], 0, 10)]
                
            }));

            //not an input layer so has no inputDim property
            model.add(tf.layers.dense({
                units: 50, 
                useBias: true, 
                activation: 'tanh', 
                weights: [ tf.randomNormal([5, 50], -20, 1),  tf.randomNormal([50], 0, 20)]
            }));

            model.add(tf.layers.dense({
                units: 50, 
                useBias: true,  
                activation: 'sigmoid', //activation function
                weights: [ tf.randomNormal([50, 50], 0, 3.2),  tf.randomUniform([50], -6, 1)]
                
            }));
            
            //output layer with one node
            model.add(tf.layers.dense({
                units: 1, //number of nodes in layer
                useBias: true, //adds a bias parameter 
                activation: 'tanh', //activation function
            }));

            const optimizer = tf.train.adamax(0.01); //parameter = learning rate
            
            model.compile({
                loss: 'meanSquaredError',
                optimizer
            })

            return model;
        }

         async function trainModel (model, trainingFeatureTensor, trainingLabelTensor){

            return model.fit(trainingFeatureTensor, trainingLabelTensor, {
                batchSize: 100,
                epochs: 500,
                validationSplit : 0.2,
                callbacks: {
                    //onEpochEnd,
                    onEpochBegin : async function () {
                        epochCount ++;
                        console.log(`Epoch Count :  ${epochCount}`)              
                    }
                }
            });
        }

        const normalisedFeature = normalise(featureTensor);
        const normalisedLabel = normalise(labelTensor);


        //split data into training and feature tensors
        const [trainingFeatureTensor, testingFeatureTensor] = tf.split(normalisedFeature.tensor, 2);
        const [trainingLabelTensor, testingLabelTensor] = tf.split(normalisedLabel.tensor, 2);
        
        let epochCount = 0;
        const model = createModel(); //initialise model with a function above    

        const result = await trainModel(model, trainingFeatureTensor, trainingLabelTensor);
        
        const trainingLoss = result.history.loss.pop();
        console.log(`Training set loss: ${trainingLoss}`);
        
        const validationLoss = result.history.val_loss.pop();
        console.log(`Validation set loss: ${validationLoss}`);

        const lossTensor = model.evaluate(testingFeatureTensor, testingLabelTensor);
        const loss = await lossTensor.dataSync();
        console.log(`Testing set loss: ${loss}`); 

    }

    run();