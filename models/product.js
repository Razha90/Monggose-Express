const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    size: {
        type: String,
        enum: [
            'S',
            'M',
            'L',
            'XL'
        ],
        default: 'S',
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    garment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'garment'
    }
});

//############# ENV ##########/
const dotenv = require('dotenv');
dotenv.config();
const {SERVER_HOST, SERVER_PORT, DB_HOST, DB_NAME} = process.env;
//############# ENV ##########/

const connectDB = async () => {
    await mongoose.connect(`mongodb://${DB_HOST}/${DB_NAME}`).then(() => {
        console.log("connected");
    }).catch(err => {
        console.log(err);
    });
}

const disconnectDB = async () => {
    await mongoose.disconnect().then(() => {
        console.log("disconnected");
    }).catch(err => {
        console.log(err);
    });
}

const Product = mongoose.model('product', productSchema);
module.exports = {
    Product,
    connectDB,
    disconnectDB
};