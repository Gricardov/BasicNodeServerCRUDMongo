const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: true
        });

        console.log('DB conectada');

    } catch (error) {
        console.log(error);
        throw new Error('Error al conectarr');
    }
}

module.exports = {
    dbConnection
}