const express = require('express')
require('./src/DB/mongoose')
require("dotenv").config();
const UserRouter = require('./src/Routers/UserRouter')
const TasksRouter = require('./src/Routers/TasksRouter')
const User = require('./src/Models/Users')
const app = express()

const port = process.env.PORT 
app.use(express.json()) 
app.use(UserRouter)
app.use(TasksRouter)
app.listen(port, () => {
    console.log(`port has been up at ${port}`);
})
