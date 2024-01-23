const mongoose = require('mongoose');
const {Product} = require('./models/product.js');

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

const dataProducts = [
	{
		"name": "Kemeja Flanel",
		"brand": "Hollister",
		"price": 750000,
		"color": "biru muda",
		"size": "S",
		"stock": 25,
	},
	{
		"name": "Celana Chino",
		"brand": "Levi's",
		"price": 900000,
		"color": "krem",
		"size": "M",
		"stock": 15,
	},
	{
		"name": "Sweater",
		"brand": "Gap",
		"price": 650000,
		"color": "merah muda",
		"size": "L",
		"stock": 20,
	},
	{
		"name": "Sepatu Sneakers",
		"brand": "Nike",
		"price": 1200000,
		"color": "putih",
		"size": "M",
		"stock": 10,
	},
	{
		"name": "Tas Ransel",
		"brand": "Herschel",
		"price": 1500000,
		"color": "biru",
		"size": "L",
		"stock": 5,
	}
]

Product.insertMany(dataProducts).then(products => {
    console.log(products);
	process.exit(0);
}).catch(err => {
    console.log(err);
});
