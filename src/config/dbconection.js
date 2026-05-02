const mongoose = require('mongoose');

const dbConnect = async () => {
    try {
        const connect = await mongoose.connect(process.env.DATABASE_URL);
        console.log(`DataBase conecction : ${connect.connection.host} : ${connect.connection.port}`)
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

module.exports = dbConnect;