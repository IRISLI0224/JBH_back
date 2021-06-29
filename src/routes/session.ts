// @ts-ignore
const express = require("express");

const {
  // @ts-ignore
  addSession,
  // @ts-ignore
  getSession,
  // @ts-ignore
  updateSession,
  // @ts-ignore
  deleteSession,
} = require("../controllers/session");

const authGuard = require("../middleware/authGuard");

// @ts-ignore
const router = express.Router();

router.post("/", addSession);
router.get("/:date/:time", getSession);
router.put("/:date/:time", updateSession);
router.delete("/:date/:time", deleteSession);

module.exports = router;
