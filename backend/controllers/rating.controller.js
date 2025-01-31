import { asyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/user.model.js";
import { Rating } from "../models/rating.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const createRating = asyncHandler(async (req, res) => {

    const userId = req.user?._id;
    const user = await User.findById(userId);
    let { rating, day, mealType } = req.body;

    if (!rating || !day || !mealType) {
        throw new ApiError(404, "Enter all details")
    }
    //check whether user has already rated or not
    const isAlreadyRated = await Rating.findOne({
        ratedBy: userId,
        day,
        mealType,
    });

    if (isAlreadyRated) {
        throw new ApiError(403, "Already rated")
    }

    const ratingInfo = await Rating.create({
        ratedBy: userId,
        rating,
        day,
        mealType,
        hostel: user.hostel,
    });

    return res
        .status(200)
        .json(
            new ApiResponse(200, ratingInfo, "Rating Created Successfully")
        );
});

//find average breakfast/lunch/snack/dinner rating
const calculateAvgRating = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id);
    const result = await Rating.aggregate([
        {
            $match: {
                hostel: user.hostel
            }
        },
        {
            $group: {
                _id: "$mealType",
                averageRating: { $avg: "$rating" }
            },
        },
    ]);

    if (result.length == 0) {
        throw new ApiError(200, "No Rating Exist!")
    }

    console.log("result", result);

    let totalRating = 0;

    for (let i = 0; i < result.length; i++) {
        totalRating += result[i].averageRating;
    }

    console.log("totalRating", totalRating);
    const totalAvgRating = totalRating / (result.length);
    return res
        .status(200)
        .json(
            new ApiResponse(200, { result, totalAvgRating }, "Rating Fetched Successfully")
        );
});

export { createRating, calculateAvgRating }


