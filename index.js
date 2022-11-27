const express = require('express');
const cors = require('cors');
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        app.get('/category/:name', async(req, res)=> {
            const name = req.params.name
            // console.log(name);
            const query = {category : name}
            const products = await productsCollection.find(query).toArray()
            res.send(products)
        })
        app.get('/products', async(req, res)=> {
            const email = req.query.email
            // console.log(email);
            const query = {seller: email}
            const products = await productsCollection.find(query).toArray()
            res.send(products)
        })
        app.get('/user', async(req, res)=> {
            const email = req.query.email
            // console.log(email);
            const query = {email}
            const user = await usersCollection.find(query).toArray()
            res.send(user)
        })
        app.get('/users', async(req, res)=> {
          
            const query = {}
            const users = await usersCollection.find(query).toArray()
            // console.log(users);
            res.send(users)
        })
        app.get('/user/admin', async(req, res)=> {
            const email = req.query.email
            // console.log(email);
            const query = {email}
            const user = await usersCollection.find(query).toArray()

           let admin
            if(user[0].role){
                 admin = user

            }
            res.send(admin)
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



       
        app.put('/users/:id', async(req, res)=>{
            const id = req.params.id
            const filter = {_id: ObjectId(id)}
            // console.log(filter);
            const options = { upsert: true}
            const updatedDoc = {
                        $set: {
                            role: 'admin'
                        }
                    }
                    const result = await usersCollection.updateOne(filter, updatedDoc, options);
                    // console.log(result);
                    res.send(result);
        })

        app.delete('/users/:id', async(req, res)=>{
            const id = req.params.id
            console.log(id);
            const query = {_id: ObjectId(id)}
            const result = await usersCollection.deleteOne(query)
            res.send(result)
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