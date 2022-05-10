const { Timestamp } = require('mongodb')
const mongoose = require('mongoose')
// const validator = require('validator')


const TaskSchema = new mongoose.Schema ({

    description: {

        type:String,
        required:true,
        trim:true,

    },
    Status: {
        type:Boolean,
        default:false,
    },

Owner: {

    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref: 'User'
}
},

{

   timestamps: true



}






)
const Task = mongoose.model('Task',TaskSchema)


module.exports = Task