const ErrorResponse = require( './../utils/errorRespnse' )   
const asyncHandler = require( '../middleware/async' ) 
const User = require( '../models/user' )


//@desc  Register user
//@route post /api/v1/auth/register
//@route public


exports.register = asyncHandler( async ( req, res, next ) =>
{
    const { name, email, password, passwordConfirm,role } = req.body

    //creat token
    sendTokenresponse(user,200,res)
} )

//@desc  login user
//@route post /api/v1/auth/login
//@route public


exports.login = asyncHandler( async ( req, res, next ) =>
{
    const { email, password} = req.body
 
    //validate email & password
    if ( !email || !password )
    {
        return next( new ErrorResponse( 'please provide an email and password', 400 ) )    
    }
    //check for user
    const user = await User.findOne( { email } ).select( '+password' );
    if ( !user )
    {
        return next( new ErrorResponse( 'the user doesnt exist', 401 ) ) 
    }
    //check if password matches
    const isMatch=await user.matchPassword(password)
    
    if ( !isMatch )
    {
        return next( new ErrorResponse( 'the user doesnt exist', 401 ) )

    }
    //creat token
  sendTokenresponse(user,200,res)
} )

//get token from model,create cookie and send response
const sendTokenresponse = ( user, statusCode, res ) =>
{
    //creat token
    const token = user.getSignedJwtToken()
    
    const options = {
        expires: new Date( Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000 ),
        httpOnly: true
    };
    if ( process.env.Node_ENV === 'production' )
    {
        options.secure = true;
    }


    res
        .status( statusCode )
        .cookie( 'token', token, options )
        .json( {
            sucess: true,
            token
        })

}
