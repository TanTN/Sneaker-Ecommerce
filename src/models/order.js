import mongoose from "mongoose"; // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    products:[{
        product: { type: mongoose.Types.ObjectId },
        title:{ type: String},
        size: { type: String },
        quantity: { type: String },
        images: [{
            type: String
        }],
        price: { type: String}

    }],
    total: { type: String },
    orderBy: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        enum: ["Canceled", "Processing", "Succeed"],
        default: "Processing"
    }
});

//Export the model
export default mongoose.model('Order', orderSchema);