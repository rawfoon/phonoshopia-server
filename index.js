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
        app.get('/categories')

    }
    finally{

    }

}
run().catch(err => console.log(err))




app.get('/', async(req, res)=>{
    res.send('PhonoShopia server is running')
})
app.listen(port, ()=> console.log(`PhonoShopia running on port  ${port}`))