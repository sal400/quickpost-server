const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.rkpusfk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();
    // Users code start from here:

    const database = client.db('quickpost_DB')
    const posts = database.collection('posts')
    

    /* START CRUD OPERATIONS FOR POSTS */
    //Posts >> create
    app.post('/posts', async(req, res)=>{
      const createPost = req.body

      const result = await posts.insertOne(createPost)
      res.send(result)
    })

    //Posts >> read
    app.get('/posts', async(req, res)=>{
      const result = await posts.find().toArray()
      res.send(result)
    })
    //Posts >> read one
    app.get('/posts/:id', async(req, res)=>{
      const id = req.params.id

      const filter = { _id: new ObjectId(id) }
      const result = await posts.findOne(filter)
      res.send(result)
    })

    //Posts >> delete
    app.delete('/posts/:id', async(req, res)=>{
      const id = req.params.id

      const filter = { _id: new ObjectId(id) }
      const result = await posts.deleteOne(filter)
      res.send(result)
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Welcome to server')
})

app.listen(port, () => {
  console.log(`Server is running on ${port}`)
})