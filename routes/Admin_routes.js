const router = require("express").Router();
const {
  regsiterController,
  loginController,
  addUrl,
} = require("../controller/admin_controller");

router.post("/register", regsiterController);
router.post("/login", loginController);
router.post("/add-url/:id/:role", addUrl);
module.exports = router;
