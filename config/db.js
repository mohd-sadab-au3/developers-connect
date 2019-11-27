let mongoose = require('mongoose');
let config = require('config');

let mongoUrl = config.get('mongodbURI');

const connect = async () => {

    try {

        await mongoose.connect(mongoUrl, {
            useNewUrlParser: true, useUnifiedTopology: true,
            useCreateIndex: true, useFindAndModify: false
        });
        console.log("mongodb started");

    } catch (err) {
        console.log(err);

        //ending the process with error;

        process.exit(1);
    }
}

module.exports = connect;