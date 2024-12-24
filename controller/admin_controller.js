const User = require("../Model/Admin_model");
const UrlData = require("../Model/URL_data_schema");
const Url_response = require("../Model/Url_response_model");

const regsiterController = async (req, res) => {
  const { phoneNumber, password, role } = req.body;
  try {
    if (!password || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Please enter all fields",
      });
    }
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Phone Number is already in use" });
    }
    const newUser = new User({
      role,
      password,
      phoneNumber,
    });
    await newUser.save();
    return res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Error - " + error });
  }
};

const loginController = async (req, res) => {
  const { phoneNumber, password } = req.body;

  try {
    const user = await User.findOne({ phoneNumber }).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    return res.status(200).json({
      success: true,
      message: "User Logged in Successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error - " + error,
    });
  }
};

const addUrl = async (req, res) => {
  const { urldata, trainId, coachId } = req.body;
  const userId = req.params.id;
  const role = req.params.role;
  if (!urldata || !trainId || !coachId) {
    return res.status(400).json({
      success: false,
      message: "Please provide a URL, trainId, and coachId",
    });
  }
  try {
    const newUrl = new UrlData({
      urldata,
      trainId,
      coachId,
      userId,
    });

    const savedUrl = await newUrl.save();

    return res.status(200).json({
      success: true,
      message: "URL added successfully",
      data: savedUrl,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while saving URL",
      error,
    });
  }
};

module.exports = {
  regsiterController,
  loginController,
  addUrl,
};
