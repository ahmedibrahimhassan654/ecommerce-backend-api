const express = require( 'express' )
const dotenv = require( "dotenv" )
const morgan = require( 'morgan' )
const errorHandler=require('./middleware/error')
const colors = require( 'colors' )
const cookieParser=require('cookie-parser')

const connectDB=require('./config/db')




//load env vars
dotenv.config( { path: './config/config.env' } ) 



//connect to database
connectDB()




//route files
const companies=require('./routes/companies')

const branches = require( './routes/branches' )

const auth=require('./routes/auth')



const app = express()


//body parser
app.use( express.json() );

//cookie parser
app.use(cookieParser())

//dev logging middleware
if ( process.env.NODE_ENV === 'development' )
{
    app.use(morgan('dev'))
}



//mount routers
app.use( '/api/v1/companies', companies )
app.use( '/api/v1/branches', branches )
app.use( '/api/v1/auth', auth )

app.use(errorHandler);




const PORT = process.env.PORT || 5000;
const server = app.listen(
    PORT,
    console.log( `server running in ${ process.env.NODE_ENV } mode on port ${ PORT }`.yellow.bold ) );

//Handel unhandeled promise rejections

process.on( 'unhandeledRejection', ( err, promise ) =>
{
    console.log( `Error:${ err.message }`.red );
    //close server & exite process
    server.close(()=>process.exit(1)) 
    })