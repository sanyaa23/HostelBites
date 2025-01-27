import { User } from "../models/user.model.js";
// import bcrypt from "bcryptjs"
import crypto from "crypto"
// import jwt from "jsonwebtoken"
import { registrationTemplate } from "../templates/registration.template.js";
import { resetPasswordSuccessTemplate } from "../templates/resetPasswordSuccess.template.js";
import { Otp } from "../models/otp.model.js";
import { Hostel } from "../models/hostel.model.js";
import { OtherDetails } from "../models/otherDetails.model.js"
import otpGenerator from "otp-generator"
import { updatePasswordTemplate } from "../templates/updatePassword.template.js";
import { resetPasswordTokenTemplate } from "../templates/resetPasswordToken.template.js";
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/AsyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { mailHandler } from "../utils/mailHandler.js";
// import dotenv from "dotenv"

// dotenv.config({
//     path: '../.env',
// });

const sendOtp = asyncHandler(async (req, res) => {
    /*
        1. fetch email from req.body
        2. email Validation
        3. create OTP
        4. create Entry in DB
        5. return response
  */
    //1. fetch email from req.body
    const { email } = req.body;

    // 2. check whether user is registered or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(401, "User Already Registered")
    }
    // 3. create OTP
    let otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    });
    console.log("OTP is : ", otp);
    //check whether it is unique or not

    let result = await Otp.findOne({ otp: otp });
    while (result) {
        otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        result = await Otp.findOne({ otp: otp });
    }

    // 4. create Entry in DB
    const otpDocument = await Otp.create(
        {
            email,
            otp
        }
    );

    const createdOtpDocument = await Otp.findById(otpDocument._id).select("-otp")

    console.log("OTP Saved in DB", otpDocument);
    // 5. return response
    return res
        .status(200)
        .json(
            new ApiResponse(200, createdOtpDocument, "otp sent successfully")
        );
});

const signUp = asyncHandler(async (req, res) => {
    /*
      1. Fetch data from req.body
      2. Perform Validation -> all fields filled
      3. check password and confirm password matches?
      4. Check user Already Exit?
      5 . find most recent otp from the database
      6. Validate OTP
      7. hash the password
      8. create user and additionalDetails entry in db
      //insertUserId to hostel.students
      9. send registration success mail
      10. return response
  
    */

    // 1. Fetch data from req.body
    const {
        firstName,
        lastName,
        registrationNumber,
        email,
        hostelName,
        password,
        confirmPassword,
        otp
    } = req.body;
    // 2. Perform Validation -> all fields filled
    if (
        (!firstName ||
            !lastName ||
            !registrationNumber ||
            !email ||
            !hostelName ||
            !password ||
            !confirmPassword ||
            !otp)
    ) {
        throw new ApiError(403, "All Fields Required")
    }
    // 3. check password and confirm password matches?
    if (password !== confirmPassword) {
        throw new ApiError(400, "Password and Confirm Passoword didn't match")
    }
    // 4. Check user Already Exit?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, "User Already Registered")
    }
    // 5 . find most recent otp from the database
    const latestOtp = await Otp.findOne({ email })
        .sort({ createdAt: -1 })
        .limit(1);
    console.log("Fetched otp form db is : ", latestOtp);
    // // 6. Validate OTP
    if (latestOtp == null || latestOtp.length === 0) {
        throw new ApiError(400, "Otp Not Found")
    }
    else if (otp != latestOtp.otp) {
        throw new ApiError(400, "Wrong Otp")
    }
    // 7. hash the password
    // let hashedPassword;
    // try {
    //     hashedPassword = await bcrypt.hash(password, 10);
    // } catch (err) {
    //     throw new ApiError(500, "Error inn hashing Password")
    // }

    // for student to be of some hostel hostelName should be
    //present in our database
    const newHostelName = hostelName.toUpperCase()
    let hostel = await Hostel.findOne({ hostelName: newHostelName });
    if (!hostel) {
        throw new ApiError(400, "Hostel does not exist")
    }

    //creating addtionalDetails with null
    const otherDetails = await OtherDetails.create({
        gender: null,
        DOB: null,
        about: null,
        AccountNo: null,
        IFSC: null,
        roomNo: null,
        contactNo: null,
        branch: null,
    });
    // 8. create user and otherDetails entry in db
    const user = await User.create({
        firstName,
        lastName,
        email,
        password: password,
        registrationNumber,
        hostel: hostel?._id,
        otherDetails: otherDetails._id,
        img: null,
        // img: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    const hosteldetail = await Hostel.findByIdAndUpdate(user.hostel, {
        $push: { students: user._id },
    }, { new: true }); // The `new: true` option will return the updated document
    


const createdUser = await User.findById(user._id).select(
    "-password -token -resetPasswordExpires"
)
// hostel.students.push(user._id);
// await hostel.save();

//9. send registration success mail
await mailHandler(
    createdUser.email,
    "Successful Registration at HostelBites",
    registrationTemplate(createdUser.firstName, createdUser.lastName)
)

// 10. return response
return res
    .status(200)
    .json(
        // new ApiResponse(200, createdUser, "User is Registered Successfully")
        new ApiResponse(200, hosteldetail, "User is Registered Successfully")
    );

});

//LogIn
const login = asyncHandler(async (req, res) => {

    //Steps ->
    /*
      1. fetch data from req.body
      2. perform validation
      3. check user registered or not
      4. generate JWT tokens after password matching
      5. create Cookie and send Response
    */

    //1. fetch data from req.body
    const { email, password } = req.body;

    //2. Validate data
    if (!email || !password) {
        throw new ApiError(403, "All fields are neccessary")
    }

    //3. check user if AlreadyExist
    const user = await User.findOne({ email }).populate("otherDetails");

    if (!user) {
        throw new ApiError(401, "User not registered")
    }

    //4. generate JWT tokens after password matching
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password")
    }

    // const user = await User.findById(user._id)
    const token = await user.generateToken()
    if (!token) {
        throw new ApiError(500, "Something went wrong while generating token")
    }
    user.token = token
    // console.log(token);

    await user.save({ validateBeforeSave: false })

    const loggedInUser = await User.findById(user._id).select("-password -token")
    //5. create Cookie and send Response
    const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3days
        httpOnly: true,
    };

    return res
        .status(200)
        .cookie("token", token, options)
        .json(
            new ApiResponse(200, { loggedInUser, token }, "Logged in Successfully")
        );

});

//change password
const updatePassword = asyncHandler(async (req, res) => {
    //steps->>>
    //1.get data from req.body
    //2.get oldPassword , newpassword , confirmNewPassword
    //3. perfom validation
    //4. update password in DB
    //5. send Mail -> changed password
    //6. return response

    // Get user data from req.user
    const user = await User.findById(req.user._id);

    // Get old password, new password, and confirm new password from req.body
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    console.log(user);
    // Validate old password
    const isPasswordValid = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordValid) {
        // If old password does not match, return a 401 (Unauthorized) error
        throw new ApiError(401, "Incorrect password")
    }

    //Match new password and confirm new password
    if (newPassword !== confirmNewPassword) {
        // If new password and confirm new password do not match, return a 400 (Bad Request) error
        throw new ApiError(401, "password and confirm password do not match")
    }

    // Update password
    user.password = newPassword
    await user.save({ validateBeforeSave: false })
    // const encryptedPassword = await bcrypt.hash(newPassword, 10);
    // const updatedUserDetails = await User.findByIdAndUpdate(
    //     req.user.id,
    //     { password: encryptedPassword },
    //     { new: true }
    // );
    const updatedUser = await User.findById(user._id);
    console.log(updatedUser)
    // Send notification email
    await mailHandler(updatedUser.email,
        "Password Updated",
        updatePasswordTemplate(
            updatedUser.email,
            updatedUser.firstName,
            updatedUser.lastName
        ))


    // Return success response
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password updated successfully"))
});

//resetPasswordToken
const resetPasswordToken = asyncHandler(async (req, res) => {
    //get email from body
    //check user for this email , email validation
    //generate token
    //update user by adding token and expiration time
    //create url
    //send mail containing url
    //return response

    //get email from body
    const { email } = req.body;
    console.log(email);
    //check usr for this email , email validation

    const user = await User.findOne({ email });
    console.log(user);

    if (!user) {
        throw new ApiError(401, "User not registered")
    }
    //generate token -> this token will be inserted in DB and then using this token
    //we will get the user and then reset the password
    const token = crypto.randomBytes(20).toString("hex");
    //converts hexadecimal to string
    //for example "36b8f84d-df4e-4d49-b662-bcde71a8764f"
    const updatedUser = await User.findOneAndUpdate(
        { email: email },
        {
            token: token,
            resetPasswordExpires: Date.now() + 10 * 60 * 1000, //10 min
        },
        { new: true }
    ); //with this new:true -> updated data is returned

    // we are running our frontend on port 3000 so we use 3000 in url
    // const frontend = process.env.FRONTEND_LINK;
    console.log("DETAILS", updatedUser);
    //create url
    const url = `${process.env.FRONTEND}/update-password/${token}`;
    // const url = `http://localhost:4000/update-password/${token}`;

    //send mail containing url
    await mailHandler(email,
        "Forgotten Password Recovery",
        resetPasswordTokenTemplate(email, url)
    )

    //return response
    return res
        .status(200)
        .json(
            new ApiResponse(200, { token }, "Email sent successfully . Please check Email and Change password")
        );
});

// resetPassword
const resetPassword = asyncHandler(async (req, res) => {
    //fetch data
    //validation
    //get user details
    //if no entry -> invalid token
    //token time check
    //hash password
    //password update
    //return response

    //fetch data
    const { password, confirmPassword, token } = req.body; //token is inserted in body by frontend
    //validation
    if (password !== confirmPassword) {
        throw new ApiError(400, "Password and Confirm Password do not match")
    }
    console.log("token is : ", token);
    //get user details
    const user = await User.findOne({ token });
    //if no entry -> invalid token
    if (!user) {
        throw new ApiError(400, "Invalid Token")
    }
    //token time check
    if (user.resetPasswordExpires < Date.now()) {
        throw new ApiError(403, "Token Expired")
    }
    //hash password
    user.password = password
    user.token = null
    // user.token set to null after resetting the password 
    user.resetPasswordExpires = null
    // user.resetPasswordExpires set to null so that after resetting the password we have to expire it
    // user.token = token 
    await user.save({ validateBeforeSave: false })
    // const encryptedPassword = await bcrypt.hash(password, 10);
    // //password update
    // await User.findOneAndUpdate(
    //     { token: token },
    //     { password: encryptedPassword },
    //     { new: true }
    // ); //with this new:true -> updated data is returned

    //send reset password success mail
    await mailHandler(user.email,
        "Reset Password Successful",
        resetPasswordSuccessTemplate(user.email)
    )

    //return response
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password reset Successfully"));

});

export { signUp, login, sendOtp, updatePassword, resetPasswordToken, resetPassword }