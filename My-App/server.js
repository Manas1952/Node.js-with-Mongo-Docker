// dependencies
const express = require('express')
const path = require('path')
const fs = require('fs')
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')

const app = express()

// middlewares
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));

// routes
app.get('/', function (req, res) {
    console.log(1);
    res.sendFile(path.join(__dirname, "public", "index.html"))
    console.log(2);
})

app.get('/profile-picture', (req, res) => {
    const image = fs.readFileSync(path.join(__dirname, "public/images/The-Dark-Knight.jpg"))
    res.writeHead(200, { 'Content-Type': 'image/jpg' })
    res.end(image, 'binary')
})

const MONGO_URL_LOCAL = "mongodb://admin:password@localhost:27017"
const MONGO_URL_DOCKER = "mongodb://mongo:27017"

app.post('/update-profile', async (req, res) => {
    const userObj = req.body

    console.log('handled /update-profile');

    try {
        const mongoClient = new MongoClient(MONGO_URL_DOCKER)
        await mongoClient.connect()
        console.log('update-profile connected mongo');

        const db = mongoClient.db('user-account')
        userObj['userid'] = 1

        await db.collection('users').updateOne({ userid: 1 }, { $set: userObj }, { upsert: true })

        res.send(userObj)
    } catch(error) {
        console.log(error);
    }
})

app.get('/get-profile', async function (req, res) {
    try {
        const mongoClient = new MongoClient(MONGO_URL_DOCKER)
        await mongoClient.connect()
        console.log('connected');

        const db = mongoClient.db('user-account');
        const collection = db.collection('users');

        const docs = await collection.findOne({ userid: 1 })
        console.log("docs:", docs);

        res.send(docs ? docs : {});

    } catch (error) {
        console.log('caught error:', error);
    }
});

app.listen(3000, () => {
    console.log('Server is up on the port: 3000!');
})