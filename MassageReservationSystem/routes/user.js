const {register ,login , getMe , logout, changePassword, updateUser} = require("../controllers/userController");
const { protect ,authorize} = require("../middlewares/auth");

const router = require("express").Router();

router.put("/change-info",protect,authorize('admin','user'),updateUser)
router.post("/register",register);
router.post("/login",login)
router.patch("/change-password",changePassword);
router.get("/me",protect,getMe);
router.get("/logout",logout)

module.exports = router;