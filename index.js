const express = require('express')
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vh4xj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json())
app.use(cors());
const port = 5000;
app.get('/', (req, res) =>{
    res.send('it,s working')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("product");
  const ordersCollection = client.db("emaJohnStore").collection("orders");

  
  app.post("/addProduct",(req, res) =>{
      const product = req.body;
      
      productsCollection.insertOne(product)
      .then(result=>{
          console.log(result.insertedCount);
          res.send(result.insertedCount)
      })
  })
  app.get("/products",(req, res) =>{
    productsCollection.find({})
    .toArray((err,documents)=>{
        res.send(documents)
    })
  })

  app.get("/product/:key",(req, res) =>{
    productsCollection.find({key:req.params.key})
    .toArray((err,documents)=>{
        res.send(documents[0])
    })
  })
  app.post("/productsByKeys",(req, res) =>{
      const productKeys =req.body;
      productsCollection.find({key:{$in:productKeys}})
      .toArray((err,documents)=>{
          res.send(documents)
      })


  })
  app.post("/addOrder",(req, res) =>{
    const order = req.body;
    
    ordersCollection.insertOne(order)
    .then(result=>{
        res.send(result.insertedCount > 0)
    })
})


});
app.listen( process.env.PORT || port)