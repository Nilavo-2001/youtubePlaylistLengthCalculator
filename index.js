const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

//CONFIG
const app = express();
app.use(express.json());
app.use(cors());
app.use('/', require('./routes'));
require('./config/mongoose');



//server listening
const port = 3001 || 6001;
app.listen(port, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(`Server running on ${port}`);
    }
})


