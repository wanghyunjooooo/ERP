const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/auth");

router.post("/add", authMiddleware, userController.addUser);
router.post("/login", userController.login);

router.get("/", authMiddleware, userController.getAllUsers);
router.get("/:id", authMiddleware, userController.getUserById);

router.put("/:id/auth", authMiddleware, userController.updateUserAuth);

module.exports = router;
