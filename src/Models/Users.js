const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const { del } = require("express/lib/application");
const Task = require("./Task");
// const res = require('express/lib/response')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  Age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be a postive number");
      }
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    tolowercase: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Not a valid email!");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
  },
  tokens: [
    {
      token: {
        type: String,
      }
    }
  ],
  avatar: {

    type: Buffer
  }
},

{
  timestamps:true
})


UserSchema.virtual('tasks', {
	ref: 'Task',
	localField: '_id',
	foreignField: 'Owner',
});

UserSchema.methods.toJSON = function () {


  const user =this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar
  // console.log(userObject)

  return userObject

}
UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.Token_key);

  user.tokens = user.tokens.concat({ token });

  await user.save();

  // console.log(token)
  return token;
};

UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!User) {
    throw new Error("Unable To Find User");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Password didn't Match");
  }
  return user;
};

UserSchema.pre("save", async function (next) {
  const User = this;

  if (User.isModified("password")) {
    User.password = await bcrypt.hash(User.password, 8);
  }

  next();
});



UserSchema.pre("remove", async function (next) {


  const user = this


  Task.deleteMany( {Owner : user._id})



  next()
})

const User = mongoose.model("User", UserSchema);

module.exports = User;
