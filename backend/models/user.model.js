import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    registrationNumber: {
        type: String,
        unique: true
    },
    hostel: {
        type: Schema.Types.ObjectId,
        ref: "Hostel",
    },
    accountCategory: {
        type: String,
        enum: ["Student", "Chief-Warden", "Mess-Committee-Member", "Accountant"],
        required: true,
        default: "Student",
    },
    otherDetails: {
        type: Schema.Types.ObjectId,
        ref: "OtherDetails"
    },
    complaints: [
        {
            type: Schema.Types.ObjectId,
            ref: "Complaint"
        }
    ],
    avatar: {
        type: String,//url of image
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    token: {
        type: String
    },
    resetPasswordExpires: {
        type: Date,//used during password reset token
    }
},
    {
        timestamps: true
    },
    {
        strictPopulate: false
    });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            accountCategory: this.accountCategory
        },
        process.env.TOKEN_SECRET,
        {
            expiresIn: process.env.TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);