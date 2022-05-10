const express = require('express')
const router = new express.Router()
const Auth = require('../middleware/Auth')
const multer = require('multer')
const sharp = require('sharp')
// const sendWelcomeMail = require('../emails/email')
// const sendCancelMail = require('../emails/email')

const User = require('../Models/Users')



router.post('/users',  async (req, res) => {  


    const  user = new User(req.body)


    try {
        await user.save()

        // sendWelcomeMail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    }
    catch (e){
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {

    try {

        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.send({user, token})

         
    }catch (e) {
             res.status(400).send(e)
    }
})
const upload = multer ({
    limits: {

        fileSize:1000000
    },
    fileFilter(req, file, cb){


        if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){


            return cb(new Error('Plesae upload a valid img extnsn'))
        }
        cb (undefined, true)
    }
})

router.post('/users/me/avatar',Auth,  upload.single('avatar'), async(req, res) =>{
    const buffer = await sharp(req.file.buffer).resize({width: 230, height: 230}).png().toBuffer()

    req.user.avatar = buffer

    await req.user.save()
    res.send()
},
(error, req, res, next)=>{
res.status(400).send({error: error.message} )

})




router.get('/users/:id/avatar', async(req, res) =>{


  try {

  const user = await User.findById(req.params.id)

  if(!user || !user.avatar){

    throw new Error()
  }

  res.set('Content-Type','image/png')
  res.send(user.avatar)

  }catch (e){

    res.status(400).send(e)

  }

})




router.delete('/users/me/avatar', Auth,  async (req, res) => {
    try{

        req.user.avatar = undefined
     await req.user.save()
    
        res.status(200).send(req.user)

    }catch(e){

        res.status(500).send(e)
    }
})


router.post('/users/logout',Auth, async (req, res) =>{

    try {

        req.user.tokens = req.user.tokens.filter( (token) =>{

            return token.token !== req.token

        })


        await req.user.save()
        res.send()



    }catch (e) {

        res.status(500).send()
    }
 })
 router.post('/users/logoutall', Auth, async (req, res)=>{

    try {


        req.user.tokens = []
         await req.user.save()
        res.send('Logout from all the devices succesfully')

    }catch (e){

        res.status(500).send(e)
    }
 })

router.patch('/users/me', Auth,  async (req, res) => {

    const updates = Object.keys(req.body)

    const allowedUpdates = ['name', 'Age', 'email', 'password']

    const isvalidUpdate = updates.every((update)=> {
        return allowedUpdates.includes(update)
    })
    if (!isvalidUpdate) {
        res.status(400).send({Error: 'Not a valid Update'})
    }
    try {
        updates.forEach( (update) =>  req.user[update] = req.body[update])
        await  req.user.save()
        res.send(req.user)

    }
    catch (e) {

        res.status(400).send(e)
    }
})



router.get('/users/me',Auth, async (req, res) =>{


    res.send(req.user)
})


router.delete('/users/me', Auth,  async (req, res) => {
    try{

       await req.user.remove()
    //    sendCancelMail(user.email, user.name)

    
        res.status(200).send(req.user)


    }catch(e){

        res.status(500).send(e)
    }
})









module.exports = router