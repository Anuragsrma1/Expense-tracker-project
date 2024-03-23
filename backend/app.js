const express = require(express);
const cors = require(cors);

const app = express();

const sequelize = require('./util/db') 

const userRoutes = require('./routes/user')

const User = require('./models/user')

app.use(cors())
app.use(express.json())

app.use('/user',userRoutes)

sequelize.sync()
 .then((result) => {
    app.listen(4000)
 }).catch(e => console.log(e));