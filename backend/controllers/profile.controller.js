import { OtherDetails } from "../models/otherDetails.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { Complaint } from "../models/complaint.model.js";
import { MessCommittee } from "../models/messCommittee.model.js";
import { Menu } from "../models/menu.model.js";

// imported the complaint,menu,messcommittee because its showing error/unregistered schema ??error/doubt


const updateProfile = asyncHandler(async (req, res) => {
    //getRequired Data
    //get userId
    //validation
    //find profile
    //update profile
    //return response
    //fetch details
    const { gender, DOB, AccountNo, IFSC, phoneNo, branch, roomNo, about } =
        req.body;
    //find profile by id
    if (!Object.keys(req.body).length) {
        throw new ApiError(400, "No user details provided");
    }

    const user = await User.findById(req.user?._id);

    if (!user) {
        throw new ApiError(401, "user not authorized")
    }

    console.log("Type of userDetails ", typeof user);
    console.log("UserDetails : ", user);

    if (!user.otherDetails) {
        throw new ApiError(400, "User profile details not found");
    }
    //edit changes
    const profile = await OtherDetails.findByIdAndUpdate(
        user.otherDetails,
        {
            $set: {
                gender,
                DOB,
                AccountNo,
                phoneNo,
                IFSC,
                branch,
                roomNo,
                about
            }
        },
        { new: true }
    );

    console.log("profile after updating : ", profile);
    return res
        .status(200)
        .json(
            new ApiResponse(200, profile, "Profile Updated Successfully")
        );

});

const getUserDetails = asyncHandler(async (req, res) => {

    console.log(req.user);
    // const { id } = req.body;

    console.log("Registered Models: ", mongoose.modelNames());

    const userDetails = await User.findById(req.user?._id)
        .populate({
            path: "hostel",
            populate: {
                path: "menu messCommittee",
                select: "-hostel",
                // populate: {
                //   path: "messManager",
                //   select: "-hostel"
                // }
            },
        })
        .populate("otherDetails complaints")
        .select("-password -token")

    return res
        .status(200)
        .json(
            new ApiResponse(200, { userDetails }, "User Details Fetched Successfully")
        );
});

const getUserByRegistrationNumber = asyncHandler(async (req, res) => {
    const { registrationNumber } = req.body;

    console.log("Registration Number : ", registrationNumber);

    if (!registrationNumber) {
        throw new ApiError(400, "Registration Number Required")
    }

    const user = await User.findById(req.user?._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // if (registrationNumber != user.registrationNumber) {
    //     throw new ApiError(404, "Enter your own Registration Number");
    // }
    //to ensure reg no is user's not anyone else's

    const userDetails = await User.find({
        registrationNumber,
        _id: user?._id
    }).populate(
        {
            path: "hostel otherDetails",
            select: "-menu -messCommittee -students",
        }
    ).select("-password -token")

    if (!userDetails || userDetails.length === 0) {
        throw new ApiError(404, "User not found");
    }
    //to ensure reg no is user's not anyone else's
    console.log("UserDetails: ", userDetails);
    return res
        .status(200)
        .json(
            new ApiResponse(200, userDetails, "User Details fetched Successfully")
        );
});



export { updateProfile, getUserDetails, getUserByRegistrationNumber } 