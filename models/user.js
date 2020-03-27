const mongoose = require( 'mongoose' )

const bcrypt = require( 'bcryptjs' )
const jwt=require('jsonwebtoken')


const UserSchema = new mongoose.Schema( {
    name: {
        type: String,
        trim: true,
        required: [true,'please add name'],
       maxlength:32
    },
    email: {
        type: String,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email'
        ],
        unique: true,
        required:[true,'please add  valid email']
    },
    password: {
        type: String,
        required: [true, 'please add password at least six digits'],
        minlength: 6,
        select:false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
          // This only works on CREATE and SAVE!!!
          validator: function(el) {
            return el === this.password;
          },
          message: 'Passwords are not the same!'
        }
      },
    salt: String,
    role: {
        type: String,
        enum: ['user', 'owner'],
        default:'user'
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default:Date.now
    }

} )
//Encrypt password using bcrypt
UserSchema.pre( 'save', async function ( next )
{
  const salt = await bcrypt.genSalt( 10 );
  this.password = await bcrypt.hash( this.password, salt );
  this.passwordConfirm=await bcrypt.hash(this.passwordConfirm,salt)
})

//sign jwt and return
UserSchema.methods.getSignedJwtToken = function ()
{
  return jwt.sign( { id: this._id }, process.env.JWT_SECRET, {
    expiresIn:process.env.JWT_EXPIRE
  })
}


//Match the password to hashe password in database
UserSchema.methods.matchPassword = async function ( enteredPassword )
{
   return await bcrypt.compare(enteredPassword,this.password)
 }


module.exports=mongoose.model('User',UserSchema)