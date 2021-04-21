const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID
const app = express()
const cors = require('cors')
const { config } = require('dotenv')
require('dotenv').config()
console.log(process.env.DB_USER)
const port = process.env.PORT || 5002;

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fhmdf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('error', err)
  const serviceCollection = client.db("fixIt").collection("service");
  const orderCollection = client.db("fixIt").collection("order");
  // perform actions on the collection object
  console.log('database connected successfully')

  app.get('/service', (req, res) => {
    serviceCollection.find()
      .toArray((err, items) => {
        res.send(items)
        // console.log('from database', items)
      })
  })

  app.post('/addService', (req, res) => {
    const addService = req.body;
    console.log('adding new event:', addService)
    serviceCollection.insertOne(addService)
      .then(result => {
        console.log('inserted count', result.insertedCount)
        res.send(result.insertedCount > 0)
      })
  })

  app.post('/addOrder', (req, res) => {
    const order = req.body;
    // console.log('adding new event:',newEvent)
    orderCollection.insertOne(order)
      .then(result => {
        console.log('inserted count', result.insertedCount)
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/orderDetails', (req, res) => {
    orderCollection.find()
      .toArray((err, documents) => {
        res.send(documents)
      })
  })
//   //   client.close();
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})