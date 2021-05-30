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
router.get("/deleteComment", async function(req,res) {

    const commentID = req.query.commentID;
    console.log("deleting comment");
    await commentDao.deleteCommentByUser(commentID);
    res.json()
    //res.redirect("/single-article");
})

router.get("/replyComment", async function(req,res) {
    const commentParentID = req.query.parentCommentID;
    const replyContent = req.query.replyContent;
    const articleID = req.query.articleID;
    const authToken = req.cookies.authToken;    
    //console.log("parent commentID is: " + commentParentID);
    const parentComment = await commentDao.retrieveCommentbyParentCommentID(commentParentID);
    //console.log("parent comment is:");

    //console.log(parentComment);
    const parentCommentLevel = parentComment[0].commentLevel;
    //console.log(parentCommentLevel);
    const commentLevel = (parentCommentLevel +1) ;
    //console.log(commentLevel);

    const reply = {
        commentDate: '2020-02-02', 
        commentText: replyContent, 
        commentLevel: commentLevel, 
        commentParent: commentParentID, 
        commentAuthorID: authToken, 
        commentArticleID: articleID
    };
    
    //console.log(reply);
    await commentDao.createComment(reply);
    res.json(reply);
});


module.exports = router;