require('dotenv').config()
require('express-async-errors')

const connectDB=require("./db/connect")
const productsRouter=require("./routes/products")

const express = require('express')
const app=express()

const notFoundMiddleware=require(`./middleware/not-found`)
const errorMiddleware=require(`./middleware/error-handler`)
const Product = require('./models/product')
const jsonProducts=require('./products.json')

app.get(`/`,(req,res,next)=>{
    res.send(`<h1>Store API</h1><a href="/api/V1/products">products route</a>`)
})

app.use(`/api/V1/products`,productsRouter)

app.use(notFoundMiddleware)
app.use(errorMiddleware)

const start=async()=>{
    try {
     connectDB(process.env.MONGO_URI)
    await Product.deleteMany()
    await Product.create(jsonProducts) 
    } catch (error) {
        console.log(error);
    }
}
start()



const port = process.env.PORT ||3000

app.listen(port)