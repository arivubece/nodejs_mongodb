const mongodb = require('mongodb');
const mongoclient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectId;

let database;

async function getDataBase() {
    const client = await mongoclient.connect("mongodb://127.0.0.1:27017");
    database = client.db('user');
    if(!database) {
        console.log("Error ON Connect DB");
    }
    return database;
}

module.exports = {
    getDataBase, ObjectID
}