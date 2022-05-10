const express = require('express')
const Task = require('../Models/Task')
const Auth = require('../middleware/Auth')
const { query } = require('express')

const Trouter = new express.Router()


Trouter.get('/tasks', Auth, async (req, res)=>{


    const match = {}
    const sort = {}
if ( req.query.Status){

    match.Status = req.query.Status === 'true'


}

if (req.query.sortBy){


    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1:1
}

    try {

    //    const ReadallTasks =  await Task.find({Owner: req.user.id})

     await req.user.populate({
        path : 'tasks',
        // match: {
        //     completed:false
        // }
        match,
        options: {

            limit : parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort
        }
       
    })
        res.status(201).send(req.user.tasks)

    }catch (e) {

        res.status(500).send(e)
    }

    
})



Trouter.get('/tasks/:id', Auth,  async (req, res) =>{
   
   const _id = req.params.id
   

   try {


    // const ReadTaskbyId = await Task.findById(_id)

    const task = await Task.findOne({_id, Owner: req.user._id})

    res.status(201).send(task)
   }catch (e) {

    res.status(500).send()
   }
  
})



Trouter.post('/tasks', Auth, (req, res) => {
    // const task = new Task(req.body)

    const task = new Task ( {

        ...req.body,
        Owner: req.user._id
    })


    task.save().then( ()=> {

        res.status(201).send(task)
    }).catch( (e) => {
        res.status(400).send(e)

        })
})

Trouter.patch('/tasks/:id', Auth, async (req, res) =>{

    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'Status']
    const isValidOperation = updates.every( (update) => allowedUpdates.includes(update))

    if (!isValidOperation) {

        return res.status(400).send({error: 'Invalid Updates!'})
    }

    try{
        const task = await Task.findOne( {_id: req.params.id, Owner: req.user._id})

        if (!task) {

            return res.status(404).send()
        }
        updates.forEach( (update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    }catch (e) {{
        res.status(400).send(e)
    }}
})


    
   


Trouter.delete('/tasks/:id', Auth,  async (req, res) => {



    const DltTaskbyid = await Task.findByIdAndDelete({_id: req.params.id, Owner: req.user._id})

    






    try{

        if (!DltTaskbyid){

            res.status(404).send({error: "Not a valid Task"})
        }
    
        res.status(200).send(DltTaskbyid)
    }catch(e){

        res.status(500).send(e)
    }
})




module.exports = Trouter