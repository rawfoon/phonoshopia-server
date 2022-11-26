const express = require('express');
const cors = require('cors');
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port  = process.env.PORT || 5000

require('dotenv').config()

//  middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3i8mx1l.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{

        const categoriesCollection = client.db('phonoShopia').collection('categories')
        const usersCollection = client.db('phonoShopia').collection('users')
        const productsCollection = client.db('phonoShopia').collection('products')


        app.get('/categories', async(req, res)=> {
            const query = {}
            const categories = await categoriesCollection.find(query).toArray()
            res.send(categories)
        })
        app.get('/products', async(req, res)=> {
            const email = req.query.email
            // console.log(email);
            const query = {seller: email}
            const products = await productsCollection.find(query).toArray()
            res.send(products)
        })
        app.get('/category/:name', async(req, res)=> {
            const name = req.params.name
            console.log(name);
            const query = {category : name}
            const products = await productsCollection.find(query).toArray()
            res.send(products)
        })


        app.post('/users', async(req, res)=>{
            const user = req.body;
            // console.log(user);
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })
        app.post('/product', async(req, res)=>{
            const product = req.body;
            // console.log(product);
            const result = await productsCollection.insertOne(product);
            res.send(result);
        })

    }
    finally{

    }

}
run().catch(err => console.log(err))




app.get('/', async(req, res)=>{
    res.send('PhonoShopia server is running')
})
app.listen(port, ()=> console.log(`PhonoShopia running on port  ${port}`))