const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Function to connect to the database
async function main() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to DB");
    } catch (err) {
        console.error("Error connecting to the database:", err);
    }
}

// Function to initialize data in the database
const initDB = async () => {
    try {
        await Listing.deleteMany({});
        await Listing.insertMany(initdata.data);
        console.log("Data initialized");
    } catch (err) {
        console.error("Error initializing data:", err);
    }
}

// Wait for database connection before initializing data
main()
    .then(async () => {
        await initDB();  // Make sure the DB is connected before inserting
    })
    .catch((err) => {
        console.error(err);
    });

console.log(initdata.data); 