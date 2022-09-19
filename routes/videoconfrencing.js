const express = require('express');
const router = express.Router();
const { v4: uuid4 } = require("uuid");



router.post("/create-online-meeting", (req, res) => {
    console.log(req.body);

    res.redirect("/get-meeting-url/" + uuid4())
});
router.get("/get-meeting-url/:id", (req, res) => {
    const meetingid = req.params.id;
    console.log(`i am id ${meetingid}`);
    res.send({
        success: true,
        meetingid: meetingid,
    })
})






module.exports = router;