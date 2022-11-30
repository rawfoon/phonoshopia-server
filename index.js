const express = require('express');
const cors = require('cors');
const app = express()
const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port  = process.env.PORT || 5000

require('dotenv').config()

//  middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3i8mx1l.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


function verifyJWT(req, res, next){
    const authHeader = req.headers.authorization
    if(!authHeader){
        return res.status(401).send({message: 'unauthorized access'})

    }
    const token = authHeader.split(' ')[1]

    jwt.verify(token, process.env.ACCESS_TOKEN_SECTET, function(err, decoded){
        if(err){
            return res.status(403).send({message: 'forbidden'})
        }
        req.decoded =decoded
        next()
    })
}



async function run(){
    try{

        const categoriesCollection = client.db('phonoShopia').collection('categories')
        const usersCollection = client.db('phonoShopia').collection('users')
        const productsCollection = client.db('phonoShopia').collection('products')

        app.post('/jwt', (req, res)=>{
            const user = req.body
            // console.log(user);
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECTET, {expiresIn : '1h'} )
            res.send({token})
        })

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
        app.get('/allproducts', async(req, res)=> {
            
            const reported = req.query.reported
            const boosted = req.query.boosted
            const buyer = req.query.buyer

            // console.log(reported);
            
            let query = {}
            if(reported){
                query = {reported : "true"}
            }
            if(boosted){
                query = { boosted: "boosted"}
            }
            if(buyer){
                query= { buyer: buyer}
            }
            
            const products = await (await productsCollection.find(query).toArray()).reverse()
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
        app.get('/user/admin', verifyJWT, async(req, res)=> {
           
            const decoded = req.decoded
            // console.log('inside decoded',decoded);
            const email = req.params.email
            if(decoded.email !== email){
                res.status(403).send('unauthorized access')
            }
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
        app.put('/users/verify/:id', async(req, res)=>{
            const id = req.params.id
            const filter = {_id: ObjectId(id)}
            // console.log(filter);
            const options = { upsert: true}
            const updatedDoc = {
                        $set: {
                            verified: 'verified'
                        }
                    }
                    const result = await usersCollection.updateOne(filter, updatedDoc, options);
                    // console.log(result);
                    res.send(result);
        })
        app.put('/report/:id', async(req, res)=>{
            const id = req.params.id
            const filter = {_id: ObjectId(id)}
            // console.log(filter);
            const options = { upsert: true}
            const updatedDoc = {
                        $set: {
                            reported: 'true'
                        }
                    }
                    const result = await usersCollection.updateOne(filter, updatedDoc, options);
                    // console.log(result);
                    res.send(result);
        })

        app.put('/book/:id', async(req, res)=>{
            const id = req.params.id
            // const 
            const filter = {_id: ObjectId(id)}
            const bookedData = req.body
            // console.log(filter);
            const options = { upsert: true}
            const updatedDoc = {
                        $set: {
                            booked : true,
                            buyerPhone: bookedData.buyerPhone,
                            meetLocation: bookedData.meetLocation,
                            buyer: bookedData.buyer


                        }
                    }
                    const result = await productsCollection.updateOne(filter, updatedDoc, options);
                    // console.log(result);
                    res.send(result);
        })

        app.put('/boost/:id', async(req, res)=>{
            const id = req.params.id
            const filter = {_id: ObjectId(id)}
            // console.log(filter);
            const options = { upsert: true}
            const updatedDoc = {
                        $set: {
                            boosted: "boosted"
                        }
                    }
                    const result = await productsCollection.updateOne(filter, updatedDoc, options);
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
        app.delete('/products/:id', async(req, res)=>{
            const id = req.params.id
            console.log(id);
            const query = {_id: ObjectId(id)}
            console.log(query);
            const result = await productsCollection.deleteOne(query)
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