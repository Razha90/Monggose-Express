const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const Server = {
    host: '127.0.0.1',
    port: 3000,
    database: 'store'
}


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

mongoose.connect(`mongodb://127.0.0.1/${Server.database}`).then(() => {
    console.log("connected");
}).catch(err => {
    console.log(err);
});

app.get('/', (req, res) => {
    res.send('index');
})

app.listen(Server.port, () => {
    console.log("server running on port http://" + Server.host + ":" + Server.port);
})