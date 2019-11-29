let express = require('express');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Post = require('../../models/Post');
const Comments = require('../../models/Comment');
const mongoose = require('mongoose');


let router = express.Router();

//@POST   post route api/post/
//@desc   post some info
//@access Private
router.post("/", [auth, [
    check('text', 'Input text is required').not().isEmpty()
]], async (req, res) => {


    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json(error);
        }
        if (req.body)
            req.body.user = req.user.id;
        const post = await Post.create(req.body);
        res.json(post);

    } catch (error) {
        console.log(error);
        res.status(500).json([{ msg: "Server Error happened" }]);
    }


});


//@PUT   post route api/post/update/:id
//@desc  Update post info
//@access Private
router.put("/update/:id", [auth, [
    check('text', 'Input text is required').not().isEmpty()
]], async (req, res) => {


    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json(error);
        }
        if (req.body)
            req.body.user = req.user.id;
        let post = await Post.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });

        if (!post) {
            return res.status(400).json([{ "msg": "No Post found" }]);
        }

        res.json(post);

    } catch (error) {

        if (error.kind === "ObjectId") {
            return res.status(400).json([{ "msg": "No Post found" }]);
        }
        console.log(error);
        res.status(500).json([{ msg: "Server Error happened" }]);
    }


});


//@DELETE   post route api/post/delete/:id
//@desc  delete post info
//@access Private
router.delete("/delete/:id", auth, async (req, res) => {


    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json(error);
        }

        const temp = await Post.findByIdAndDelete(req.params.id);
        if (!temp) {
            return res.status(400).json([{ "msg": "No Post found" }]);
        }
        await Comments.deleteMany({ post: mongoose.Types.ObjectId(req.params.id) });

        res.json([{ "msg": "Post is successfully deleted" }]);

    } catch (error) {

        if (error.kind === "ObjectId") {
            return res.status(400).json([{ "msg": "No Post found" }]);
        }
        console.log(error);
        res.status(500).json([{ msg: "Server Error happened" }]);
    }


});


//@PUT   post route api/post/like/:id
//@desc  Like the post info
//@access Private
router.put("/like/:id", auth, async (req, res) => {


    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json(error);
        }
        let post = await Post.findByIdAndUpdate(req.params.id);

        if (!post) {
            return res.status(400).json([{ "msg": "No Post found" }]);
        }

        let index = post.likes.indexOf(req.user.id);
        console.log("index ", index, req.user.id);
        if (index === -1)
            post.likes.push(req.user.id);

        else {

            post.likes[index] = post.likes[post.likes.length - 1];
            post.likes.pop();
        }
        post.save();
        res.json(post);

    } catch (error) {

        if (error.kind === "ObjectId") {
            return res.status(400).json([{ "msg": "No Post found" }]);
        }
        console.log(error);
        res.status(500).json([{ msg: "Server Error happened" }]);
    }


});



//@POST   post route api/post/comment/:id
//@desc   reply to the post (adding comment)
//@access Private
router.post("/comment/:postId", [auth, [
    check('text', 'Input text is required').not().isEmpty()
]], async (req, res) => {


    try {
        const error = validationResult(req);
        //console.log("error occour", error);
        if (!error.isEmpty()) {
            return res.status(400).json(error);
        }
        if (req.body) {

            req.body.user = req.user.id;
            console.log("ok ", req.body);
            req.body.post = mongoose.Types.ObjectId(req.params.postId);
        }
        const postComment = await Comments.create(req.body);
        res.json(postComment);

    } catch (error) {

        if (error.kind === "ObjectId") {
            return res.status(400).json([{ "msg": "No Post found" }]);
        }
        console.log(error);
        res.status(500).json([{ msg: "Server Error happened" }]);
    }


});


//@PUT   post route api/post/comment/like/:id
//@desc  Like the comment info
//@access Private
router.put("/comment/like/:id", auth, async (req, res) => {


    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json(error);
        }
        let post = await Comments.findByIdAndUpdate(req.params.id);

        if (!post) {
            return res.status(400).json([{ "msg": "No Post found" }]);
        }

        let index = post.likes.indexOf(req.user.id);
        console.log("index ", index, req.user.id);
        if (index === -1)
            post.likes.push(req.user.id);

        else {

            post.likes[index] = post.likes[post.likes.length - 1];
            post.likes.pop();
        }
        post.save();
        res.json(post);

    } catch (error) {

        if (error.kind === "ObjectId") {
            return res.status(400).json([{ "msg": "No Post found" }]);
        }
        console.log(error);
        res.status(500).json([{ msg: "Server Error happened" }]);
    }


});




//@PUT   post route api/post/comment/:postid/:commentId
//@desc   Editing reply to the post (Updating comment)
//@access Private
router.put("/comment/:postId/:commentId", [auth, [
    check('text', 'Input text is required').not().isEmpty()
]], async (req, res) => {


    try {
        const error = validationResult(req);
        //console.log("error occour", error);
        if (!error.isEmpty()) {
            return res.status(400).json(error);
        }
        if (req.body) {

            req.body.user = req.user.id;
            console.log("ok ", req.body);
            req.body.post = mongoose.Types.ObjectId(req.params.postId);
        }
        const postComment = await Comments.findOneAndUpdate({
            $and: [
                { _id: mongoose.Types.ObjectId(req.params.commentId) },
                { post: mongoose.Types.ObjectId(req.params.postId) }
            ]
        }, { $set: req.body }, { new: true });

        if (!postComment) {
            return res.status(400).json([{ "msg": "No Post found" }]);
        }

        res.json(postComment);

    } catch (error) {

        if (error.kind === "ObjectId") {
            return res.status(400).json([{ "msg": "No Post found" }]);
        }
        console.log(error);
        res.status(500).json([{ msg: "Server Error happened" }]);
    }


});


//@DELETE   post route api/post/comment/delete/:id
//@desc  delete comment
//@access Private
router.delete("/comment/delete/:commentId", auth, async (req, res) => {


    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json(error);
        }

        const temp = await Comments.findOneAndDelete({ _id: mongoose.Types.ObjectId(req.params.commentId) });

        if (!temp) {
            return res.status(400).json([{ "msg": "No Post found" }]);
        }
        res.json([{ "msg": "Post is successfully deleted" }]);

    } catch (error) {

        if (error.kind === "ObjectId") {
            return res.status(400).json([{ "msg": "No Post found" }]);
        }
        console.log(error);
        res.status(500).json([{ msg: "Server Error happened" }]);
    }


});







//@PUT  post route api/post/comment/reply/:postid/:commentid
//@desc   reply to the post
//@access Private
router.put("/comment/reply/:postId/:commentId", [auth, [
    check('text', 'Input text is required').not().isEmpty()
]], async (req, res) => {


    try {
        const error = validationResult(req);
        //console.log("error occour", error);
        if (!error.isEmpty()) {
            return res.status(400).json(error);
        }
        if (req.body) {

            req.body.user = req.user.id;
            req.body.comment = mongoose.Types.ObjectId(req.params.commentId);
        }
        console.log("ok ", req.body);

        const postReply = await Comments.findByIdAndUpdate(req.params.commentId);
        if (!postReply) {
            return res.status(400).json([{ "msg": "No Post found" }]);
        }
        postReply.reply.unshift(req.body);
        postReply.save();
        res.json(postReply);

    } catch (error) {

        if (error.kind === "ObjectId") {
            return res.status(400).json([{ "msg": "No Post found" }]);
        }
        console.log(error);
        res.status(500).json([{ msg: "Server Error happened" }]);
    }


});


//@PUT  post route api/post/comment/reply/update/:commentid/:replyId
//@desc update reply for comment
//@access Private
router.put("/comment/reply/update/:commentId/:replyId", [auth, [
    check('text', 'Input text is required').not().isEmpty()
]], async (req, res) => {


    try {
        const error = validationResult(req);
        //console.log("error occour", error);
        if (!error.isEmpty()) {
            return res.status(400).json(error);
        }


        const postReply = await Comments.findByIdAndUpdate(req.params.commentId);
        if (!postReply) {
            return res.status(400).json([{ "msg": "No Post found" }]);
        }
        postReply.reply = postReply.reply.map(reply => {
            if (reply._id.toString() === req.params.replyId) {
                reply.text = req.body.text;
            }
            return reply;
        })
        postReply.save();
        res.json(postReply);

    } catch (error) {

        if (error.kind === "ObjectId") {
            return res.status(400).json([{ "msg": "No Post found" }]);
        }
        console.log(error);
        res.status(500).json([{ msg: "Server Error happened" }]);
    }


});

//@DELETE  post route api/post/comment/reply/delete/:commentid/:replyId
//@desc delete reply for comment
//@access Private
router.delete("/comment/reply/delete/:commentId/:replyId", auth, async (req, res) => {


    try {
        const error = validationResult(req);
        //console.log("error occour", error);
        if (!error.isEmpty()) {
            return res.status(400).json(error);
        }


        const postReply = await Comments.findByIdAndUpdate(req.params.commentId);
        if (!postReply) {
            return res.status(400).json([{ "msg": "No Post found" }]);
        }
        postReply.reply = postReply.reply.filter(reply => {
            return (reply._id.toString() !== req.params.replyId)
        })
        postReply.save();
        res.json(postReply);

    } catch (error) {

        if (error.kind === "ObjectId") {
            return res.status(400).json([{ "msg": "No Post found" }]);
        }
        console.log(error);
        res.status(500).json([{ msg: "Server Error happened" }]);
    }


});


//@PUT   post route api/post/reply/like/:id
//@desc  Like the comment info
//@access Private
router.put("/reply/like/:commentId/:replyId", auth, async (req, res) => {


    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json(error);
        }
        let post = await Comments.findByIdAndUpdate(req.params.commentId);

        if (!post) {
            return res.status(400).json([{ "msg": "No Post found" }]);
        }

        let reply;
        for (let i = 0; i < post.reply.length; i++) {
            if (post.reply[i]._id.toString() === req.params.replyId) {
                reply = post.reply[i];
                break;
            }
        }

        let index = reply.likes.indexOf(req.user.id);
        console.log("index ", index, req.user.id);
        if (index === -1)
            reply.likes.push(req.user.id);

        else {

            reply.likes[index] = reply.likes[reply.likes.length - 1];
            reply.likes.pop();
        }
        post.save();
        res.json(post);

    } catch (error) {

        if (error.kind === "ObjectId") {
            return res.status(400).json([{ "msg": "No Post found" }]);
        }
        console.log(error);
        res.status(500).json([{ msg: "Server Error happened" }]);
    }


});





//@GET     api/post/:id
//@desc   GET perticular POST WITH all comments and replyreply to the post
//@access public

router.get('/:id', async (req, res) => {

    try {

        let postDetails = {};

        postDetails.post = await Post.findById(req.params.id);
        if (!postDetails.post) {
            return res.status(400).json([{ "msg": "No Post found" }]);
        }
        postDetails.comments = await Comments.find({ post: mongoose.Types.ObjectId(req.params.id) });

        console.log(postDetails);

        res.json(postDetails);
    } catch (error) {

        if (error.kind === "ObjectId") {
            return res.status(400).json([{ "msg": "No Post found" }]);
        }
        console.log(error);
        res.status(500).json([{ "msg": "Server Error" }]);
    }

})


module.exports = router;