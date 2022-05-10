const jwt = require ('jsonwebtoken')

const User =require('../Models/Users.js')

const Auth = async (req, res, next) =>{

   
   try {

      const token = req.header('Authorization').replace('Bearer ','')

     const decoded = jwt.verify(token, 'MyNameIsAni')

     const user = await User.findOne({ _id: decoded._id, 'tokens.token': token})

   //   console.log(user)
   // console.log(decoded)

   if (!user) {

      throw new Error ()
   }

   req.token = token
   req.user = user
      next()

   } catch (e) {



      res.send(e)
      // console.log(e)
      next()
   }
}

module.exports = Auth