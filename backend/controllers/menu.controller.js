import { User } from "../models/user.model.js";
import { Hostel } from "../models/hostel.model.js";
import { Menu } from "../models/menu.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//add menu
const addMenu = asyncHandler(async (req, res) => {

    const userId = req.user?._id;
    const { hostelName, menu } = req.body;

    if (!hostelName) {
        throw new ApiError(404, "Provide Hostel and menu details")

    }
    // Find the hostel by its name
    // const capitalizedHostelName = hostelName.toUpperCase()

    const hostel = await Hostel.findOne({ hostelName: hostelName.toUpperCase() });

    if (!hostel) {
        throw new ApiError(404, "Hostel not found")
    }

    // Directly create the menu
    const newMenu = await Menu.create({
        hostel: hostel._id,
        ...menu, // Spread the menu object directly
        signedBy: userId,
    });
    console.log("newmenu:", newMenu)

    const hostelDetails = await Hostel.findByIdAndUpdate(hostel._id,
        {
            menu: newMenu._id
        },
        {
            new: true
        }
    )

    console.log("hostel details", hostelDetails)

    return res
        .status(200)
        .json(
            new ApiResponse(200, newMenu, "Mess Menu created successfully")
        );

});

//view menu
const viewMenu = asyncHandler(async (req, res) => {

    const userId = req.user?._id;

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "user not found")
    }

    console.log("user info", user)
    const hostel = await Hostel.findById(user.hostel);
    
    console.log("user hostel", user.hostel)
    const messMenu = await Menu.find({ hostel: hostel._id })
        .populate({
            path: "signedBy",
            select: "firstName lastName accountCategory email"
        });

    return res
        .status(200)
        .json(
            new ApiResponse(200, messMenu, "Menu fetched Sucessfully")
        );

});

// edit menu -> exactly same as add mess menu

const editMenu = asyncHandler(async (req, res) => {

    const { hostelName, menu } = req.body

    if (!hostelName || !menu) {
        throw new ApiError(404, "details required")
    }

    const userId = req.user?._id;
    console.log("req", req);

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "user not found")
    }
    console.log("userdetails in edit mess menu", user);

    const newHostelName = hostelName.toUpperCase();
    const hostel = await Hostel.findOne({ hostelName: newHostelName });

    if (!hostel) {
        throw new ApiError(404, "user not found")
    }

    console.log("hostel details:", hostel);

    const newMenu = await Menu.findByIdAndUpdate(
        hostel.menu,
        {
            ...menu,
            signedBy: userId
        },
        { new: true }
    );
    return res
        .status(200)
        .json(
            new ApiResponse(200, newMenu, "Mess Menu Updated Successfully")
        );

});



export { addMenu, viewMenu, editMenu }