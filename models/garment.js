const mongoose = require('mongoose');
const {Product} = require('./product');

const garmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Nama tidak boleh kosong']
    },
    location: {
        type: String,
        required: true
    },
    contact : {
        type: String,
        required: [true, 'Contact tidak boleh kosong']
    },
    product: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    }]
})

garmentSchema.post('findOneAndDelete', async (garment) => {
    if(garment.product.length > 0) {
        await Product.deleteMany({
            _id: {
                $in: garment.product
            }
        })
    }
});


//############# ENV ##########/
const dotenv = require('dotenv');
dotenv.config();
const {SERVER_HOST, SERVER_PORT, DB_HOST, DB_NAME} = process.env;
//############# ENV ##########/

mongoose.connect(`mongodb://${DB_HOST}/${DB_NAME}`).then(() => {
    console.log("connected");
}).catch(err => {
    console.log(err);
});

const Garment = mongoose.model('garment', garmentSchema);
module.exports = Garment