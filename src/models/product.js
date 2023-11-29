import mongoose from 'mongoose'; // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
    },
    price:{
        type:String,
    },
    priceDel:{
        type:String,
    },
    benefit: {
        title: { type: String },
        contents: [{type: String}]
    },
    slug:{
        type:String,
        required:true,
        unique: true,
        lowercase:true
    },
    sold: {
        type: Number,
        default: 0
    },
    brand: {
        type: String,
        required:true,
    },
    code: {
        type: String,
    },
    category: {
        type: String,
    },
    description:{
        type:String,
    },
    onSale:{
        type:String,
    },
    ribbonSale:{
        type:String,
    },
    images: [{
        path: {
            type:String,
            default:"https://www.bing.com/th?id=OIP.JgT4rUe-Q6_uIV1Cz20V8wHaHa&w=174&h=185&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2",
        },
        filename: {
            type: String
        }
        
    }],
    sizes: [{
        size: {
            type: String,
            enum:["35","36","37","38","39","40","41","42","43","44","45","46","47"]
        },
        quantity:{ type: Number,default: 10 },
    }]
}, {
    timestamps: true
});

//Export the model
export default mongoose.model('Product', productSchema);