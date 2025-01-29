// const MessCommittee = require('../models/messCommitteSchema');
// const User = require('../models/userSchema');
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { Committee } from "../models/messCommittee.model.js";
import { Hostel } from "../models/hostel.model.js";

//tempory things
const addToCommittee = asyncHandler(async (req, res) => {

    //get userDetails
    //change its role
    //add to messCommitte collections

    const { email, registrationNumber } = req.body;

    if (!email && !registrationNumber) {
        throw new ApiError(404, "Email or Regsitration Number is required")
    }

    const user = await User.findOne({
        $or: [{ registrationNumber }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "user not found")
    }

    const updatedUser = await User.findByIdAndUpdate(user._id,
        {
            accountCategory: "Mess-Committee-Member"
        },
        {
            new: true
        }
    )

    console.log("updated user: ", updatedUser)
    console.log("hostel id: ", user.hostel)

    const committee = await Committee.findOneAndUpdate({ hostel: user.hostel },
        {
            $addToSet: { members: user._id }
        },
        { new: true }
    );

    await Hostel.findByIdAndUpdate(committee.hostel,
        {
            committee: committee._id
        },
        {
            new: true
        }
    )

    console.log("committee details:", committee)
    return res
        .status(200)
        .json(
            new ApiResponse(200, committee, "Added To Committee")
        );

});

const removeFromCommittee = asyncHandler(async (req, res) => {

    const { email, registrationNumber } = req.body;

    if (!email && !registrationNumber) {
        throw new ApiError(404, "Email or Regsitration Number is required")
    }

    const user = await User.findOne({
        $or: [{ registrationNumber }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "user not found")
    }

    const updatedUser = await User.findByIdAndUpdate(user._id,
        {
            accountCategory: "Student"
        },
        {
            new: true
        }
    )

    console.log("updated user: ", updatedUser)
    console.log("hostel id: ", user.hostel)

    const committee = await Committee.findOneAndUpdate({ hostel: user.hostel },
        {
            $pull: { members: user._id }
        },
        { new: true }
    );

    console.log("committee details:", committee)
    return res
        .status(200)
        .json(
            new ApiResponse(200, committee, "Removed from Committee")
        );

});

const getCommitteInfo = asyncHandler(async (req, res) => {

    const userId = req.user?._id;
    const user = await User.findById(userId);
    // console.log("userDetails in get Committee: ", userDetails)

    const committee = await Committee.find({ hostel: user.hostel })
        .populate({
            path: "members",
            select: "firstName lastName email registrationNumber",
        });

    return res
        .status(200)
        .json(
            new ApiResponse(200, committee, "Committee details Fetched Successfully")
        )

});

export { addToCommittee, removeFromCommittee, getCommitteInfo }