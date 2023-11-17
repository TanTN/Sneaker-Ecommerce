import mongoose from "mongoose"; // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    products:[{
        product: { type: mongoose.Types.ObjectId },
        title:{ type: String},
        size: { type: Number },
        quantity: { type: Number },
        images: [{
            type: String
        }],

    }],
    total: { type: Number },
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