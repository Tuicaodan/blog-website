const express = require("express");
const router = express.Router();

// The DAO that handles CRUD operations for users.
const userDao = require("../modules/user-dao.js");
const commentDao = require("../modules/comment-dao.js");
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");
const { createComment } = require("../modules/comment-dao.js");

// const io = require('socket.io')();
// io.on('connection', client => { ... });
// io.listen(3000);



//Hardcode user details
router.post("/newComment", async function(req,res) {

    const comment = {
        commentDate: '2020-02-01',
        commentText: req.body.commentText,
        commentLevel: 0,
        commentParent: 0,
        commentAuthorID: 1,
        commentArticleID: 1
    }

    console.log("making comment");
    console.log(comment);

    await commentDao.createComment(comment);

    res.redirect("/single-article");
})


//Hardcode comment details
//must check if user authToken matches to be able to delete. 
router.post("/deleteComment", async function(req,res) {

    const commentID = 1;
    console.log("deleting comment");
    await commentDao.deleteComment(commentID);

    res.redirect("/single-article");
})


module.exports = router;