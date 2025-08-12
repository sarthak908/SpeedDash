const express=require("express")
const router=express.Router();
const { runQueryAndFormat } = require('../controllers/queryController');
router.post('/', runQueryAndFormat);
module.exports = router;