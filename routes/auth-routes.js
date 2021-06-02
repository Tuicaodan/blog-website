const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");

// The DAO that handles CRUD operations for users.
const userDao = require("../modules/user-dao.js");
const passwordSec = require("../modules/passwordSec.js");
const { getUserPassword } = require("../modules/user-dao.js");
//const { createUser } = require("../modules/test-dao.js");
//const { addUserToLocals } = require("../middleware/auth-middleware.js");
//const messagesDao = require("../modules/messages-dao.js");

router.get("/newAccount", function(req, res) {
    res.locals.message = req.query.message;

    //return the images filenames to handlebars
    let avatarImgNames = fs.readdirSync("public/images/Avatars");

    const allowedFileTypes = [".png"];
    avatarImgNames = avatarImgNames.filter(function(fileName) {
        const extension = fileName.toLowerCase().substring(fileName.lastIndexOf("."));
        return allowedFileTypes.includes(extension);
    });
    //console.log(avatarImgNames)
    res.locals.avatarImgNames = avatarImgNames;
    console.log(res.locals.avatarImages)
    res.render("new-account");
});

router.post("/newAccount", async function(req, res) {
    const user = {
        username: req.body.new_account_username,
        password: await passwordSec.newHashPassword(req.body.password1),
        fname: req.body.fname,
        lname: req.body.lname,
        birthday: req.body.birthday,
        introduction: req.body.introduction,
        avatarImage: req.body.avatars
    };
    console.log(user)

    try {
        await userDao.createUser(user);
        res.redirect("/login?message=Account creation successful. Please login using your new credentials.");
    }
    catch (err) {
        //console.log(err)
        res.redirect("/newAccount?message=That username was already taken!");
    }
});

router.get("/login", function(req, res) {
    res.locals.message = req.query.message;
    res.render("login");
});

//used uuid as authToken
router.post("/login", async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    const passwordCorrect = await passwordSec.checkHashPassword(username, password); 
    
    if (passwordCorrect) {
        //Auth success - give that user an authToken, save the token in a cookie, and redirect to the homepage.
        
        const user = await userDao.retrieveUserByUsername(username); 
        // console.log("Before updating with authToken");
        //console.log(user);
        
        const authToken = uuid();
        user.authToken = authToken;

        // console.log("Give authToken to this user.");
        // console.log(user);

        await userDao.updateUser(user);
        // console.log("After updating with authToken, call the same user const");
        // console.log(user);

        const checkuser = await userDao.retrieveUserByUsername(username);
        
        // console.log("After updating with authToken, call the same user with ANOTHER const");
        // console.log(checkuser);

        res.cookie("authToken", authToken);

        res.locals.user = user;
        res.redirect("/?message=Welcome Back!");
    } else {
        res.locals.user = null;
        res.redirect("./login?message=Authentication failed!");
    }
});

router.get("/checkUsername", async function (req, res) {
    const input_username = req.query.input_username;
    const username_availability = await userDao.retrieveUserByUsername(input_username);
    
    if (username_availability) {
        const response = {
            username_availability: false
        }
        res.json(response);

    } else {
        //console.log("This username is good to go!");
        const response = {
            username_availability: true
        }
        res.json(response);
    }
});

//checking whether user type in correct password in order to change user profile
router.get("/checkUserPassword", verifyAuthenticated, async function (req, res) {
    const user = res.locals.user;
    const input_password = req.query.input_password;

    const passwordCorrect = await passwordSec.checkHashPassword(user.username, input_password);     
    if (passwordCorrect) {
        const response = {
            result: true
        }
        res.json(response);

    } else {
        //console.log("This username is good to go!");
        const response = {
            result: false
        }
        res.json(response);
    }
});

router.get("/checkAuthToken", async function (req, res) {
    const authToken = req.query.authToken;
    const user = await userDao.retrieveUserWithAuthToken(authToken);

    const usernameAndID = {
        username: user.username,
        userID: user.userID
    }
    res.json(usernameAndID)    
    
});

//route to login page
router.get("/login", async function(req, res) {

    res.render("login");
});

module.exports = router;