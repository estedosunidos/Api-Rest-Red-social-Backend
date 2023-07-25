const {connection} = require('./Database/conextion')
const express = require('express')
const cors = require('cors')

console.log('Api Node for Red social connection	')

connection()

const app = express()
const port = 3900

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const user_router=require('./routes/user')
const publication_router=require('./routes/publication')
const follow_router=require('./routes/follow')

app.use("/api/user",user_router)
app.use("/api/publication",publication_router)
app.use("/api/follow",follow_router)


app.listen(port,()=>{
    console.log('Server listening on port')
})