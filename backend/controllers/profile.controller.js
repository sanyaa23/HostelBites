import { OtherDetails } from "../models/otherDetails.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { Complaint } from "../models/complaint.model.js";
import { Committee } from "../models/messCommittee.model.js";
import { Menu } from "../models/menu.model.js";
import { Hostel } from "../models/hostel.model.js";
import { mailHandler } from "../utils/mailHandler.js";
import { accountDeletionTemplate } from "../templates/accountDeletion.template.js";
import { BlockedProfile } from "../models/blockedProfile.model.js";

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

    // console.log("Registered Models: ", mongoose.modelNames());

    const userDetails = await User.findById(req.user?._id)
        .populate({
            path: "hostel",
            populate: {
                path: "menu committee",
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

const blockUserProfile = asyncHandler(async (req, res) => {

    //1. fetch userDetails 
    //check is already blocked -> otherwise multiple entry will be created
    //2. block userBy its emailId
    // console.log(req.body);

    const { email } = req.body;

    if (!email) {
        throw new ApiError(404, "Email Required")
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User not found")
    }
    console.log("user details", user)
    //check whether already blocked
    const isBlocked = await BlockedProfile.findOne({ email });
    console.log(159)
    console.log(isBlocked)
    console.log(161)
    if (isBlocked) {
        throw new ApiError(403, "User Is already Blocked")
    }
    console.log(165)

    const blockedUserDetails = await BlockedProfile.create({ email });

    return res
        .status(200)
        .json(
            new ApiResponse(200, blockedUserDetails, "User blocked")
        )
});

const unblockUserProfile = asyncHandler(async (req, res) => {

    const { email } = req.body;

    if (!email) {
        throw new ApiError(404, "Email Required")
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    console.log("user: ", user)

    const isBlocked = await BlockedProfile.findOne({ email });

    if (!isBlocked) {
        throw new ApiError(403, "User Is already unblocked")
    }

    console.log("isblocked :", isBlocked)

    const unblockedUserDetails = await BlockedProfile.findOneAndDelete({ email });
    return res
        .status(200)
        .json(
            new ApiResponse(200, { unblockedUserDetails }, "User Unblocked Successfully")
        );
});

//delete account
const deleteUserAccount = asyncHandler(async (req, res) => {

    //fetch userid
    //delete entry from OtherDetails
    //delete entry from Hostel
    //delete entry from User
    //send deletion mail

    const userId = req.user?._id

    const user = await User.findById(userId);
    // console.log(user);
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    await OtherDetails.findByIdAndDelete(user.otherDetails);

    const hostelDetails = await Hostel.findByIdAndUpdate(
        user.hostel,
        { $pull: { students: userId } },
        { new: true }
    );


    console.log("hostel info: ", hostelDetails)

    const deletedUser = await User.findByIdAndDelete(userId,
        {
            new: true
        }
    );

    console.log(deletedUser)

    await mailHandler(
        deletedUser.email,
        "Account deletion Confirmation",
        accountDeletionTemplate(deletedUser.email)
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, deletedUser, "User Account Deleted Successfully")
        )
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

const markFeeStatusAsTrue = asyncHandler(async (req, res) => {

    const { registrationNumber } = req.body;

    if (!registrationNumber) {
        throw new ApiError(404, "Registration Number Required")
    }

    const user = await User.findOne({ registrationNumber });

    console.log("UserDetails : ", user);

    if (!user) {
        throw new ApiError(404, "User not found, Invalid Registration Number")
    }

    const details = await OtherDetails.findByIdAndUpdate(
        user.otherDetails,
        {
            isMessFeePaid: true,
        },
        {
            new: true
        }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(200, details, "Fee marked as Paid")
        );

});
const markFeeStatusAsFalse = asyncHandler(async (req, res) => {

    const { registrationNumber } = req.body;

    if (!registrationNumber) {
        throw new ApiError(404, "Registration Number Required")
    }

    const user = await User.findOne({ registrationNumber });

    console.log("UserDetails : ", user);

    if (!user) {
        throw new ApiError(404, "User not found, Invalid Registration Number")
    }

    const details = await OtherDetails.findByIdAndUpdate(
        user.otherDetails,
        {
            isMessFeePaid: false,
        },
        {
            new: true
        }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(200, details, "Fee marked as unpaid")
        );

});


export { updateProfile, getUserDetails, getUserByRegistrationNumber, deleteUserAccount, blockUserProfile, unblockUserProfile, markFeeStatusAsTrue, markFeeStatusAsFalse }