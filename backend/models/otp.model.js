import mongoose, { Schema } from "mongoose";
import { mailHandler } from "../utils/mailHandler.js";
import { otpTemplate } from "../templates/otp.template.js";

const otpSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 10, // The document will be automatically deleted after 10 minutes of its creation time
    },
});


// Define a function to send emails

const sendVerificationEmail = async (email, otp) => {
    await mailHandler(
        email,
        "Verification Email from HostelBites",
        otpTemplate(otp)
    )
}
otpSchema.pre("save", async function (next) {
    console.log("new otp document added");
    // Only send an email when a new document is created
    if (this.isNew) {
        await sendVerificationEmail(this.email, this.otp);
        console.log("Email: ", this.email)
    }
    next();
});

// otpSchema.pre("save", async function (next) {
//     this.otp = await bcrypt.hash(this.otp, 10)
//     next()
// })

// otpSchema.methods.isOtpMatching = async function (otp) {
//     return await bcrypt.compare(otp, this.otp)
// }

export const Otp = mongoose.model("Otp", otpSchema);