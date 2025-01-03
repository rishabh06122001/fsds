const User = require("../Model/Admin_model");
const UrlData = require("../Model/URL_data_schema");
const Url_response = require("../Model/Url_response_model");
const axios = require("axios");
const puppeteer = require("puppeteer");
const Train = require("../Model/Train_Model");

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

// const getFSDSResponse = async () => {
//   const url =
//     "https://blynk.cloud/dashboard/358525/global/devices/1/organization/358525/devices/1386252/dashboard";
//   const authToken = "M7DERFwRz2XtwmhiQgNgsWTmwBlB0WFJ";

//   try {
//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();

//     // Set the Authorization header with the token
//     await page.setRequestInterception(true);
//     page.on("request", (request) => {
//       request.continue({
//         headers: {
//           ...request.headers(),
//           Authorization: authToken,
//         },
//       });
//     });

//     // Navigate to the page with the authentication token
//     await page.goto(url, { waitUntil: "networkidle2" });

//     // Wait for the switch element to appear
//     await page.waitForSelector('button[role="switch"]', { timeout: 10000 });

//     // Extract the switch status
//     const isSwitchOn = await page.evaluate(() => {
//       const switchElement = document.querySelector('button[role="switch"]');
//       return switchElement
//         ? switchElement.getAttribute("aria-checked") === "true"
//         : null;
//     });

//     // Close the browser
//     await browser.close();

//     // Log the switch status
//     if (isSwitchOn !== null) {
//       console.log(`Switch is ${isSwitchOn ? "ON" : "OFF"}`);
//     } else {
//       console.log("Switch element not found.");
//     }
//   } catch (error) {
//     console.error("Error fetching switch status:", error);
//   }
// };
// const axios = require('axios');

// Blynk credentials
const BLYNK_TEMPLATE_ID = "TMPL3HohwgKpu";
const BLYNK_TEMPLATE_NAME = "on off fsds";
const BLYNK_AUTH_TOKEN = "M7DERFwRz2XtwmhiQgNgsWTmwBlB0WFJ";

// Base URL for Blynk API
const BASE_URL = `https://cloud.blynk.cc/api/v1/${BLYNK_AUTH_TOKEN}/get`;

const getFSDSResponse = async () => {
  try {
    // Make a GET request to fetch data from the Blynk device
    const response = await axios.get(`${BASE_URL}/pins/D1`); // Replace 'D1' with your actual pin name/ID

    // If the response is successful
    if (response.data) {
      console.log("Switch Status Response:", response.data);
      return response.data;
    } else {
      console.log("No data returned from the Blynk API.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching switch status from Blynk:", error);
    return null;
  }
};

const addTrainOrCoach = async (req, res) => {
  const { train_number, coach_number } = req.body;

  // Validate input
  if (!train_number || !coach_number) {
    return res.status(400).json({
      error: "Both train_number and coach_number are required",
    });
  }

  try {
    // Check if the train already exists
    let train = await Train.findOne({ train_number });

    if (!train) {
      // If train doesn't exist, create it with the provided coach
      train = new Train({
        train_number,
        coaches: [coach_number],
      });
      await train.save();

      return res.status(201).json({
        message: "Train created and coach added successfully",
        data: train,
      });
    }

    // If train exists, check if the coach already exists
    if (train.coaches.includes(coach_number)) {
      return res.status(400).json({
        error: "Coach already exists for this train",
      });
    }

    // Add the coach to the existing train
    train.coaches.push(coach_number);
    await train.save();

    return res.status(200).json({
      message: "Coach added successfully to the existing train",
      data: train,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

const getCoachesByTrainNumber = async (req, res) => {
  const { train_number } = req.body;

  // Validate input
  if (!train_number) {
    return res.status(400).json({
      error: "Train number is required",
    });
  }

  try {
    // Find the train by train_number
    const train = await Train.findOne({ train_number });

    if (!train) {
      return res.status(200).json({
        error: "Train not found",
      });
    }

    // Return the list of coaches
    return res.status(200).json({
      message: `Coaches for train number ${train_number}`,
      data: train.coaches,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

module.exports = {
  regsiterController,
  loginController,
  addUrl,
  getFSDSResponse,
  addTrainOrCoach,
  getCoachesByTrainNumber,
};
