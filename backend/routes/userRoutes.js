const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/auth");

router.post("/signup", userController.signup);
router.post("/login", userController.login);

router.get("/", authMiddleware, userController.getAllUsers);

router.put("/:id/auth", authMiddleware, userController.updateUserAuth);

module.exports = router;
