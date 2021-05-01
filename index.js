const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient
const port = 4000
require('dotenv').config()
// mongodb database connection
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.DB_PASSWORD}@cluster0.vihvh.mongodb.net/${process.env.DATA_BASE}?retryWrites=true&w=majority`;
// package connection
const app = express()
app.use(bodyParser.json())
app.use(cors())

// api data query
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const products = client.db(`${process.env.DATA_BASE}`).collection("products");

  // product create
  app.post('/product/store',(req,res) => {
    const productData = req.body;

    products.insertMany(productData)
    .then(result => {
        console.log(result.insertedCount);
        res.send(result.insertedCount);
    })
  })
  
  // product show 
  app.get('/products',(req,res) => {
    products.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  // product details show
  app.get('/product/details/:key',(req,res) => {
    const productKey = req.params.key;
    products.findOne({key : productKey})
    .then(result => {
      res.send(result);
    })
  })

  // product key show product review
  app.post('/productKeys', (req,res) => {
    const productkeys = req.body;
    products.find({key : {$in : productkeys}})
    .toArray( (err, documents) => {
      res.send(documents);
    })
  })
});

app.get('/',(req,res) => {
    res.send('your code is running!');
})

app.listen(port)