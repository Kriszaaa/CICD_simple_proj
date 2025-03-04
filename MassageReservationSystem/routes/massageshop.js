const { createMassageshop, getMassageshops, updateMassageshop, deleteMassageshop , getMassageshop } = require("../controllers/massageshopController");
const { protect , authorize} = require("../middlewares/auth");

const router = require("express").Router();

router.post("/",protect,authorize('admin',),createMassageshop).get("/",protect,getMassageshops);
router.route("/:id").get(protect,authorize('admin','user'),getMassageshop).put(protect,authorize('admin'),updateMassageshop).delete(protect,authorize('admin'),deleteMassageshop)

module.exports = router;