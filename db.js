const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/';
let _db;
MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
    if (err) throw err
    _db = client.db('todoApp');
});

getDb = () => {
    return _db;
}

module.exports = { getDb };