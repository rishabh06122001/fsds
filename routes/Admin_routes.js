const router = require("express").Router();
const {
  regsiterController,
  loginController,
  addUrl,
  getFSDSResponse,
  addTrainOrCoach,
  getCoachesByTrainNumber,
} = require("../controller/admin_controller");

router.post("/register", regsiterController);
router.post("/login", loginController);
router.post("/add-url/:id/:role", addUrl);
router.get("/url-response", getFSDSResponse);
router.post("/add-train-data", addTrainOrCoach);
router.post("/get-train-coaches", getCoachesByTrainNumber);
module.exports = router;
