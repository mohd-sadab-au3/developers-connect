var express = require('express');
const connect = require('./config/db');
const cors = require('cors');
let app = express();
app.use(cors());

const PORT = 5001;
connect();

//adding middleware 
app.use(express.json({ extended: false }));
app.use('/api/user', require('./routes/api/user'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/post', require('./routes/api/post'));

app.get('/', (req, res) => {

    res.status(200).send("API WORKING");
})

app.listen(PORT);

