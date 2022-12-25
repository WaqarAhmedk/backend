const express = require("express");
const { v4: uuid4 } = require("uuid");

const router = express.Router();


router.post("/create-online-meeting", (req, res) => {

    const VideoRoomlink = "/meeting/" + uuid4();

    res.send({
        link: VideoRoomlink
    });

});





module.exports = router;