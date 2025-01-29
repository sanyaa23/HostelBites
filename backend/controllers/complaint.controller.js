

import { asyncHandler } from "../utils/AsyncHandler.js";
import { Hostel } from "../models/hostel.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { BlockedProfile } from "../models/blockedProfile.model.js";
import { Complaint } from "../models/complaint.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//function to create new complaint
const createComplaint = asyncHandler(async (req, res) => {
    
     // fetch user id from req.user.id
     // check whether it is blocked or not
     // fetch complaint details from req.body
     // fetch complaint image from request files.
     // perform vailidation on input data.
     // create complaint entry in database.
     // push complaint id in user's complaint.
     // return response.
     // fetch user id from req.user.id
     
    const userId = req.user?._id;
    const user = await User.findById(userId);

    const hostel = await Hostel.findById(user.hostel);
    //finding hostelname
    const hostelName = hostel.hostelName;
    // fetch complaint details from req.body
    const { subject, description } = req.body;

    // perform vailidation on input data.
    if (!subject || !description) {
        throw new ApiError(404, "Fill all required details")
    }

    const isBlocked = await BlockedProfile.findOne({ email: user.email });

    if (isBlocked) {
        console.log(isBlocked)
        throw new ApiError(403, "Blocked users cannot add complaints")
    }


    // create complaint entry in database.
    const complaint = await Complaint.create({
        subject,
        description,
        hostelName,
        complaintBy: userId,
        image: null,
    });

    //push complaint id in user's complaint.
    const userDetails = await User.findByIdAndUpdate(
        { _id: userId },
        {
            $push: {
                complaints: complaint._id,
            },
        },
        { new: true }
    ).select("-password -token");

    //return response
    return res
        .status(200)
        .json(
            new ApiResponse(200, { complaint, userDetails }, "Complaint creation successful")
        );
});

// get all complaint -> hostelWise
const getAllComplaints = asyncHandler(async (req, res) => {
    // const { hostelName } = req.body;

    const userId = req.user?._id;
    const user = await User.findById(userId);

    const hostel = await Hostel.findById(user.hostel);

    const complaintList = await Complaint.find({ hostelName: hostel.hostelName })
        .populate({
            path: "complaintBy",
            select: "firstName lastName registrationNumber email",
            populate: [
                {
                    path: "otherDetails",
                    select: "roomNo"
                },
                // {
                //     path: "hostel", 
                //     select: "hostelName"
                // }
            ]
        }).select("-hostelName");

    return res
        .status(200)
        .json(
            new ApiResponse(200, complaintList, "All Complaints Fetched Successfully")
        );

});

// // get complaint by id
const getComplaintById = asyncHandler(async (req, res) => {

    const { complaintId } = req.params; // Extract complaint ID from URL parameters

    if (!complaintId) {
        throw new ApiError(404, "complaintId missing")
    }
    console.log(complaintId);

    const complaint = await Complaint.findById(complaintId)
        .populate({
            path: "complaintBy resolvedBy",
            select: "firstName lastName",
        })

    console.log(complaint);

    if (!complaint) {
        throw new ApiError(404, "Complaint not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, complaint, "Complaint Fetched Successfully")
        );

});

//get unresolved complaint
const getUnresolvedComplaints = asyncHandler(async (req, res) => {
    // const { hostelName } = req.body;
    const user = await User.findById(req.user?._id);

    const hostel = await Hostel.findById(user.hostel);

    const unresolvedComplaintList = await Complaint.find({
        isResolved: false,
        hostelName: hostel.hostelName,
    })
        .populate({
            path: "complaintBy",
            select: "firstName lastName registrationNumber email",
            populate: [
                {
                    path: "otherDetails",
                    select: "roomNo"
                },
                // {
                //     path: "hostel", 
                //     select: "hostelName"
                // }
            ]
        }).select("-hostelName");

    return res
        .status(200)
        .json(
            new ApiResponse(200, unresolvedComplaintList, "All Unresolved Complaints Fetched Successfully")
        );

});

//get resolved complaints
const getResolvedComplaints = asyncHandler(async (req, res) => {
    // const { hostelName } = req.body;
    const user = await User.findById(req.user?._id);

    const hostel = await Hostel.findById(user.hostel);

    const unresolvedComplaintList = await Complaint.find({
        isResolved: true,
        hostelName: hostel.hostelName,
    })
        .populate({
            path: "complaintBy",
            select: "firstName lastName registrationNumber email",
            populate: [
                {
                    path: "otherDetails",
                    select: "roomNo"
                },
                // {
                //     path: "hostel", 
                //     select: "hostelName"
                // }
            ]
        }).select("-hostelName");

    return res
        .status(200)
        .json(
            new ApiResponse(200, unresolvedComplaintList, "All Unresolved Complaints Fetched Successfully")
        );

});


//get myComplaint
const myComplaints = asyncHandler(async (req, res) => {

    const userId = req.user?._id;
    const complaint = await Complaint.find({ complaintBy: userId })
    // .populate({
    //     path: "author",
    //     populate: {
    //         path: "additionalDetails hostel",
    //     },
    // })

    return res
        .status(200)
        .json(
            new ApiResponse(200, complaint, "My Complaints Fetched Successfully")
        );

});

//delete complaint
const deleteComplaints = asyncHandler(async (req, res) => {
    //fetch complaintId
    //fetch userid
    //delete complaints from user's complaint
    //delete entry from db
    //return response

    const { complaintId } = req.params;
    const userId = req.user?._id;

    //delete complaints from user's complaint
    const user = await User.findByIdAndUpdate(
        userId,
        {
            $pull:
            {
                complaints: complaintId
            }
        },
        {
            new: true
        }
    );

    //delete entry from db
    const deletedComplaint = await Complaint.findByIdAndDelete(complaintId,
        {
            new: true
        }
    );

    // if (!deletedComplaint) {
    //     throw new ApiError(404, "No complaint to delete")
    // }

    //return response
    return res
        .status(200)
        .json(
            new ApiResponse(200, { deletedComplaint }, "complaint is successfully deleted")
        );
});

// like complaint

const upvoteComplaint = asyncHandler(async (req, res) => {

    console.log("Inside like controller");
    const { complaintId } = req.params;
    // console.log(req);

    const email = req.user?.email;
    // console.log(complaintId, email);

    const modifiedComplaint = await Complaint.findByIdAndUpdate(
        complaintId,
        {
            $addToSet: { upVotedBy: email },
            $pull: { downVotedBy: email },
        },
        { new: true }
    );

    console.log(modifiedComplaint);

    return res
        .status(200)
        .json(
            new ApiResponse(200, modifiedComplaint, "Complaint has been upvoted")
        );

});

const downvoteComplaint = asyncHandler(async (req, res) => {
    console.log("Inside like controller");
    const { complaintId } = req.params;
    // console.log(req);

    const email = req.user?.email;
    // console.log(complaintId, email);

    const modifiedComplaint = await Complaint.findByIdAndUpdate(
        complaintId,
        {
            $addToSet: { downVotedBy: email },
            $pull: { upVotedBy: email },
        },
        { new: true }
    );

    console.log(modifiedComplaint);

    return res
        .status(200)
        .json(
            new ApiResponse(200, modifiedComplaint, "Complaint has been downvoted")
        );


});

const resolveComplaint = asyncHandler(async (req, res) => {
    //get user who is resolving the complaint
    //get complaint id from req.body
    //make changes in complaint and save in db
    //return response

    const userId = req.user?._id;
    const { complaintId } = req.params;

    const complaint = await Complaint.findByIdAndUpdate(
        complaintId,
        {
            isResolved: true,
            resolvedBy: userId,
        },
        {
            new: true
        }
    ).populate("resolvedBy")
        .select("firstName lastName email");

    return res
        .status(200)
        .json(
            new ApiResponse(200, complaint, "Complaint is resolved")
        );

});

const getComplaintByMostUpvotes = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user?._id);
    const hostel = await Hostel.findById(user.hostel);

    const complaint = await Complaint.aggregate([
        {
            $match: { hostelName: hostel.hostelName },
        },
        {
            $lookup: {
                from: "users",
                localField: "resolvedBy",
                foreignField: "_id",
                as: "resolvedByDetails",
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "complaintBy",
                foreignField: "_id",
                as: "complaintByDetails",
            },
        },
        {
            $unwind: { path: "$resolvedBy", preserveNullAndEmptyArrays: true },
        },
        {
            $project: {
                _id: 1,
                subject: 1,
                description: 1,
                hostelName: 1,
                complaintBy: {
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                },
                img: 1,
                upVotedBy: 1,
                downVotedBy: 1,
                isResolved: 1,
                complaintByDetails: {
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                },
                resolvedByDetails: {
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                },
                voteCount: {
                    $subtract: [{ $size: "$upVotedBy" }, { $size: "$downVotedBy" }],
                },
            },
        },
        {
            $sort: {
                voteCount: -1, // Sort based on the vote count in descending order
            },
        },
        // {
        //     $limit: 1
        // }
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(200, complaint, "Complaints with most upvotes fetched successfully")
        );
});
const getMostRecentComplaints = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user?._id);
    const hostel = await Hostel.findById(user.hostel);

    const complaint = await Complaint.aggregate([
        {
            $match: { hostelName: hostel.hostelName },
        },
        {
            $lookup: {
                from: "users",
                localField: "resolvedBy",
                foreignField: "_id",
                as: "resolvedByDetails",
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "complaintBy",
                foreignField: "_id",
                as: "complaintByDetails",
            },
        },
        {
            $unwind: { path: "$resolvedBy", preserveNullAndEmptyArrays: true },
        },
        {
            $project: {
                _id: 1,
                subject: 1,
                description: 1,
                hostelName: 1,
                complaintBy: {
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                },
                img: 1,
                upVotedBy: 1,
                downVotedBy: 1,
                isResolved: 1,
                complaintByDetails: {
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                },
                resolvedByDetails: {
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                },
                createdAt: 1,
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        // {
        //     $limit: 1
        // }
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(200, complaint, "Most recent complaints fetched successfully")
        );
});

export { createComplaint, getAllComplaints, getComplaintById, getUnresolvedComplaints, getResolvedComplaints, myComplaints, deleteComplaints, upvoteComplaint, downvoteComplaint, resolveComplaint, getComplaintByMostUpvotes, getMostRecentComplaints }