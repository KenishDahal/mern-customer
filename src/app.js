const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config();

const Customer = require('./models/customer');
const cors = require('cors');



const app = express();
mongoose.set('strictQuery', false);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if(process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const PORT = process.env.PORT || 8000;
const CONNECTION = process.env.CONNECTION;

const customers = [
	{
		"name": "Caleb",
		"industry": "music"	
	},
	{
		"name": "John",
		"industry": "networking"	
	},
	{
		"name": "Sal",
		"industry": "sports medicine"	
	}
];

const customer = new Customer({
	name: 'John',
	industry: 'marketing'	
});

app.get('/', (req, res) => {
	res.send("welcome!");	
});

app.get('/api/customers', async (req, res) => {
	try{
		const result = await Customer.find();
		res.json({"customers": result});
	} catch(e){
		res.status(500).json({error: e.message});
	}
});

app.get('/api/customers/:id', async(req, res) => {
	console.log({
		requestParams: req.params,
		requestQuery: req.query
	});
	try{
		const {id: customerId} = req.params;
		console.log(customerId);
		const customer = await Customer.findById(customerId);
		console.log(customer);
		if(!customer){
			res.status(404).json({error: 'User not found'});
		} else {
			res.json({customer});
		}
	} catch(e){
		res.status(500).json({error: 'something went wrong'});
	}
});

app.put('/api/customers/:id', async(req, res) => {
	try {
		const customerId = req.params.id;
		const customer = await Customer.findOneAndReplace({_id: customerId}, req.body, {new: true});
		console.log(customer);
		res.json({customer});
	} catch (e) {
		console.log(e.message);
		res.status(500).json({error: 'something went wrong'});
	}
});

app.patch('/api/customers/:id', async(req, res) => {
	try {
		const customerId = req.params.id;
		const customer = await Customer.findOneAndUpdate({_id: customerId}, req.body, {new: true});
		console.log(customer);
		res.json({customer});
	} catch (e) {
		console.log(e.message);
		res.status(500).json({error: 'something went wrong'});
	}	
});

app.delete('/api/customers/:id', async(req, res) => {
	try {
		const customerId = req.params.id;
		const result = await Customer.deleteOne({_id: customerId});
		res.json({deletedCount: result.deletedCount});
	} catch(e){
		res.status(500).json({error: "Something went wrong"});
	}
});

app.post('/api/customers', async (req, res) => {
	console.log(req.body);
	const customer = new Customer(req.body);
	try{
		await customer.save();
		res.status(201).json({customer}); 
	} catch(e) {
		res.status(400).json({error: e.message});
	}
});

app.post('/', (req, res) => {
	res.send('This is a post request!');	
});

const start = async() => {
	try{
		await mongoose.connect(CONNECTION);
			
		app.listen(PORT, () => {
			console.log('App listening on port ' + PORT);
		});
	} catch(e) {
		console.log(e.message)
	}
};

start();