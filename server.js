const express = require('express');
const app = express();
const connectDB = require('./config/db.js');
const Router = express.Router();

require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(express.json())
connectDB();

app.use("/api/v1", require('./routes/route.js'))

app.get('/', (req, res) => {    
    res.send('Hello World!');
});

app.get('/about', (req, res) => {
    res.send('About');
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})