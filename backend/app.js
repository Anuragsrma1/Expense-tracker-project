const express = require('express');
const cors = require('cors');
// const compression = require('compression')
// const morgan = require('morgan')
// const path = require('path');
// const fs = require('fs');
// const https = require('https')

const app = express();

require('dotenv').config()

const sequelize = require('./util/db') 

const userRoutes = require('./routes/user')

const User = require('./models/user')

app.use(cors())
app.use(express.json())
// app.use(helmet())
// app.use(compression())


// const accessLogStream = fs.createWriteStream(path.join(__dirname , 'access.log'),{flags : 'a'})


// app.use(morgan('combined',{ stream :accessLogStream}))


app.use('/user',userRoutes)



// app.use(express.static(path.join(__dirname , '../frontend' , 'signup.html')))
sequelize.sync()
 .then((result) => {
    app.listen(5501)
 }).catch(e => console.log(e));