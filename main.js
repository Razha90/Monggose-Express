const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const {Product, connectDB, disconnectDB} = require('./models/product.js');
const methodOverride = require('method-override');
const ErrorHandler = require('./utils/ErrorHandler')
const Garment = require('./models/garment.js');
const session = require('express-session');
const flash = require('connect-flash');

connectDB();
// disconnectDB();
//############# ENV ##########/
const dotenv = require('dotenv');
dotenv.config();
const {SERVER_HOST, SERVER_PORT, DB_HOST, DB_NAME} = process.env;
//############# ENV ##########/

app.use(session({
    secret: 'keyboard-cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false
    }
}));
app.use(flash());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// Global Variable
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    next();
})

function wrapAsync(fn) {
    return function(req, res, next) {
        fn(req, res, next).catch(err => next(err));
    }
}

app.get('/', (req, res) => {
    res.send('index');
});

app.get('/garment',  wrapAsync(async (req, res, next) => {
    const garments = await Garment.find({});
    res.render('garment/index', {garments});
}));

app.post('/garment',  wrapAsync(async (req, res, next) => {
    const garment = new Garment(req.body);
    await garment.save();
    req.flash('success', 'Data Berhasil Ditambahkan');
    res.redirect(`/garment`);
}));

app.get('/garment/create', (req, res) => {
    res.render('garment/create');
});

app.get('/garment/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const garment = await Garment.findById(id).populate('product');
        res.render('garment/show', {garment});
    } catch (error) {
        next(new ErrorHandler(error, 404))
    }
});

app.delete('/garment/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Garment.findOneAndDelete(id);
    res.redirect('/garment');
}));

app.get('/product/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate('garment');
        res.render('product/show', {product});
        // res.send(product);
    } catch (error) {
        next(new ErrorHandler('<h1>Gak Jumpa Bang Produknya</h1>', 404))
    }
});

app.get('/garment/:garment_id/product/create', wrapAsync( async (req, res) => {
        const { garment_id } = req.params;
        res.render('product/create', {garment_id});
}));


app.post('/garment/:garment_id/product',wrapAsync( async (req, res) => {
    const { garment_id } = req.params;
    const garment = await Garment.findById(garment_id);
    const product = new Product(req.body);
    console.log(product);
    garment.product.push(product);
    product.garment = garment;
    await garment.save();
    await product.save()
    res.redirect(`/garment/${garment._id}`);
}));

app.use((err, req, res, next) => {
    const {statusCode = 500, message = "ADa Problem Dikit"} = err;
    res.status(statusCode).send(message);
});

app.listen(SERVER_PORT, () => {
    console.log("server running on port http://" + SERVER_HOST + ":" + SERVER_PORT);
})
