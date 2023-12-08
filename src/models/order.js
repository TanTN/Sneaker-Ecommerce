import mongoose from "mongoose"; // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    product:[{
        product: {
            type: mongoose.Types.ObjectId,
            ref:"Product"
        },
        size: { type: String },
        quantity: { type: String },
    }],
    total: { type: String },
    orderBy: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        enum: ["Finished", "In Progress", "Waiting"],
        default: "Finished"
    }
});

//Export the model
export default mongoose.model('Order', orderSchema);