import User from "../models/user.model.js";

// =========================
// GET MY PROFILE
// =========================
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =========================
// UPDATE MY PROFILE
// =========================
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { name, age, gender, city, emergencyContact, profilePicture } =
      req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update only provided fields
    // user.name = name;
    // user.age = age;
    // user.gender = gender;
    // user.city = city;
    // user.emergencyContact = emergencyContact;
    // user.profilePicture = profilePicture;

    // 1. Put the incoming data into an object
    const updates = { name, age, gender, city, emergencyContact, profilePicture };

    // 2. Loop through and only update fields that are not undefined or null
    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined && updates[key] !== null) {
        user[key] = updates[key];
      }
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        city: user.city,
        emergencyContact: user.emergencyContact,
        profilePicture: user.profilePicture,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
