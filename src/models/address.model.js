import mongoose from "mongoose";

// Define addressSchema 
const addressSchema = new mongoose.Schema({
    houseNo: String,
    street: String,
    landmark: String,
    city: String,
    state: String,
    pincode: String,
});

// Define and export Address model
const Address = mongoose.model("Address",addressSchema);
export default Address;