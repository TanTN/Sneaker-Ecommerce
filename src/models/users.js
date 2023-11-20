import mongoose from "mongoose"; // Erase if already required
import Bcrypt from "bcrypt"; // Erase if already required
import crypto from "crypto"; // Erase if already required
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    avatar: {
        path: {
            type: String,
            default:"https://th.bing.com/th/id/OIP.T5DKycaaS4zk2hul0woRWQHaHa?rs=1&pid=ImgDetMain"
        },
        filename: {
            type: String
        }
        
    },
    role: {
        type: String,
        default: "User"
    },
    cart: [{
        product: {
            type: mongoose.Types.ObjectId,
            ref: "Product"
        },
        quantity: {
            type: Number,
        },
        size: {
            type: Number,
        },
        color: {
            type: String,
            enum: ["Blue", "Green", "Yellow"],
            default: "Yellow"
        }
    }],
    address: {
        type: String
    },
    isBlocked: {
        type: Boolean,
        default:false
    },
    refreshToken: {
        type: String
    },
    passwordChangeAt: {
        type: String
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: {
        type: String
    }

}, {
    timestamps: true
}
);
userSchema.pre('save', async function (next) {
    console.log(this.isModified('password'))
    if (!this.isModified('password')) { 
        next();
    }
    const salt = await Bcrypt.genSaltSync(10)
    const password = await Bcrypt.hash(this.password, salt)
    this.password = password
})

userSchema.methods = {
    isCorrectPassword: async function (password) {
        return await Bcrypt.compare(password,this.password) 
    },
    generatePasswordResetToken: async function () {
        const token = await crypto.randomBytes(32).toString("hex")
        const passwordResetToken = await crypto.createHash('sha256').update(token).digest("hex")
        this.passwordResetToken = passwordResetToken
        this.passwordResetExpires = Date.now() + 5 * 60 * 1000
        return token
    }
}

//Export the model
export default mongoose.model('User', userSchema);