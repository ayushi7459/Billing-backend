import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


const userSchema = new Schema({

    username:{
        type: String,
        required : true,
        unique : true,
        trim:true,
        index:true
    },
    email:{
        type : String,
        required :true,
        unique : true,
        lowercase:true,
        trim:true,
    },
    mobile_number:{
        type : Number,
        default: 0,
        unique: [true, "Phone number is already in use."],
        validate: {
            validator: function(v) {
              return v.toString().length === 10;  // Replace 10 with your desired length
            },
            message: props => `${props.value} is not a valid phone number!`
          }
    },
    password:{
        type:String,
        required:[true, "password ids required"]
    },
    refreshToken:{
        type:String,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],  // Only admin or user roles allowed
        default: 'user'
    },
    isDeleted: {
        type: Number,
        default: 0 // 0 for active, 1 for deleted
    }
},{timestamps:true})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,10)
    next();
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken = async function(){
    return await jwt.sign(
        {
            _id:this._id,
            emial:this.email,
            username:this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = async function(){
    return await jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFERESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFERESH_TOKEN_EXPIRY
        }
    )
}


export const userModel = mongoose.model("user",userSchema)