let express = require('express');
let auth = require('../../middleware/auth');
let Profile = require('../../models/Profile');
let User = require('../../models/User');
let router = express.Router();
const { check, validationResult } = require('express-validator');
const request = require('request');
const config = require('config');
const mongoose = require('mongoose');



//@get    Route api/profile/me
//@desc   Getting current logged in user profile
router.get("/me", auth, async (req, res) => {

    try {
        let userDetails = await User.findById(req.user.id).select("-password");
        let profile = await Profile.findOne({ user: req.user.id }).populate('users', ['name', 'gravtar']);
        console.log("user", userDetails);

        if (!profile) {
            return res.status(400).json([{ "msg": "Profile for this user does not exist" }]);
        }
        res.json({ profile, userDetails });
    } catch (error) {

        console.log(error);
        return res.status(500).json([{ "msg": "Internal Server Error" }]);
    }

});

//@POST   Route api/profile
//@Desc   Creation or updation of profile

router.post("/",
    [auth, [
        check('status', 'Status is required').not().isEmpty(),
        check('skills', 'Skills is required').not().isEmpty()
    ]
    ], async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body;

        console.log("skilss", skills);
        //building profilebio
        const profileFields = {};

        profileFields.user = req.user.id;

        if (website) profileFields.website = website;
        if (company) profileFields.company = company;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;

        //removing unnecessary space from skills
        if (skills) profileFields.skills = skills.split(",").map(skill => skill.trim());

        profileFields.social = {};

        if (youtube) profileFields.social.youtube = youtube;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;


        try {
            console.log("before profile is ");

            let profile = await Profile.findOne({ user: req.user.id });
            console.log("profile is ", profile);
            if (profile) {

                //profile is found 
                profile = await Profile.findOneAndUpdate({ user: req.user.id },
                    { $set: profileFields }, { new: true });

                return res.json(profile);

            }

            //else create the profile
            console.log("else me hai");
            profile = new Profile(profileFields);
            console.log(profile);
            //saving in database
            await profile.save();

            res.json(profile);




        } catch (error) {

            console.log(error);
            res.status(500).json([{ msg: "Internal Server Error" }]);
        }

    });


//@get    Route api/profile/all
//@desc   Getting all developer profiles
//@Public

router.get("/all", async (req, res) => {

    try {

        const profiles = await Profile.find({}).populate('users', ['name', 'avatar']);
        if (!profiles) {
            return res.status(200).json([{ msg: "No Profile Found" }]);
        }

        res.json(profiles);


    } catch (error) {

        console.log(error);
        if (error.kind === 'ObjectId') {
            return res.status(200).json([{ msg: "No Profile Found" }]);

        }
        res.status(500).json([{ msg: "Internal Server Error" }]);
    }


})


//@get    Route api/profile/user/:id
//@desc   Getting all developer profiles
//@Public

router.get("/user/:id", async (req, res) => {

    try {

        const profile = await Profile.findOne({ user: req.params.id })
        if (!profile) {
            return res.status(200).json([{ msg: "No Profile Found" }]);
        }

        res.json(profile);


    } catch (error) {

        //  console.log(error);
        if (error.kind === 'ObjectId') {
            return res.status(200).json([{ msg: "No Profile Found" }]);

        }
        res.status(500).json([{ msg: "Internal Server Error" }]);
    }


})



//@DELETE    Route api/profile/delete
//@desc      Deleting current logged in user profile
//@Private

router.delete("/delete", auth, async (req, res) => {

    try {
        console.log("user id", req.user.id);
        await Profile.findOneAndDelete({ user: req.user.id });

        res.json([{ msg: "Profile is deleted successfully" }])

    } catch (error) {
        console.log("error is");
        console.log(error);
        res.status(500).json([{ msg: "Internal Server Error" }]);
    }


});

//@PUT    Route api/profile/update
//@desc   Adding experience current logged in user profile
//@Private

router.put("/update", [auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company Name is required').not().isEmpty(),
    check('from', 'Statrting date is required').not().isEmpty()
]], async (req, res) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const profile = await Profile.findOneAndUpdate({ user: req.user.id });

        if (!profile) {

            return res.json([{ msg: "No profile exist for this user please create profile" }]);
        }

        profile.experience.unshift(req.body);
        profile.save();

        res.json(profile);


    } catch (error) {

        if (error.kind = "ObjectId")
            return res.json([{ msg: "No profile exist for this user please create profile" }]);
        res.status(500).json([{ msg: "Server Error" }]);
    }


});

//@DELETE   Route api/profile/experience/:id
//@desc   deleting experience current logged in user profile
//@Private

router.delete("/experience/:id", auth, async (req, res) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const profile = await Profile.findOneAndUpdate({ user: req.user.id });

        if (!profile) {

            return res.json([{ msg: "No profile exist for this user please create profile" }]);
        }

        profile.experience = profile.experience.filter(info => {
            return (info._id.toString() !== req.params.id)
        });
        profile.save();

        res.json(profile);


    } catch (error) {

        if (error.kind = "ObjectId")
            return res.json([{ msg: "No profile exist for this user please create profile" }]);
        res.status(500).json([{ msg: "Server Error" }]);
    }


});


//@UPDATE   Route api/profile/experience/:id
//@desc     Updataing experience current logged in user profile
//@Private

router.put("/experience/:id", [auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company Name is required').not().isEmpty(),
    check('from', 'Statrting date is required').not().isEmpty()
]], async (req, res) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const profile = await Profile.findOneAndUpdate({ user: req.user.id });

        if (!profile) {

            return res.json([{ msg: "No profile exist for this user please create profile" }]);
        }

        profile.experience = profile.experience.map(info => {
            if (info._id.toString() === req.params.id) {

                req.body._id = info._id;
                return req.body;
            }
            return info;
        });
        profile.save();

        res.json(profile);


    } catch (error) {

        if (error.kind = "ObjectId")
            return res.json([{ msg: "No profile exist for this user please create profile" }]);
        res.status(500).json([{ msg: "Server Error" }]);
    }


});


//@PUT    Route api/profile/education/update
//@desc   Adding Education current logged in user profile
//@Private

router.put("/education/update", [auth, [
    check('school', 'Name Of School is required').not().isEmpty(),
    check('degree', 'Name Of Degree is required').not().isEmpty(),
    check('from', 'Statrting date is required').not().isEmpty(),
    check('fieldofstudy', 'Field of study is required').not().isEmpty()
]], async (req, res) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const profile = await Profile.findOneAndUpdate({ user: req.user.id });

        if (!profile) {

            return res.json([{ msg: "No profile exist for this user please create profile" }]);
        }

        profile.education.unshift(req.body);
        profile.save();

        res.json(profile);


    } catch (error) {

        if (error.kind = "ObjectId")
            return res.json([{ msg: "No profile exist for this user please create profile" }]);
        res.status(500).json([{ msg: "Server Error" }]);
    }


});

//@DELETE   Route api/profile/education/:id
//@desc   deleting education information current logged in user profile
//@Private

router.delete("/education/:id", auth, async (req, res) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const profile = await Profile.findOneAndUpdate({ user: req.user.id });

        if (!profile) {

            return res.json([{ msg: "No profile exist for this user please create profile" }]);
        }

        profile.education = profile.education.filter(info => {
            return (info._id.toString() !== req.params.id)
        });
        profile.save();

        res.json(profile);


    } catch (error) {

        if (error.kind = "ObjectId")
            return res.json([{ msg: "No profile exist for this user please create profile" }]);
        res.status(500).json([{ msg: "Server Error" }]);
    }


});


//@UPDATE   Route api/profile/education/update/:id
//@desc     Updataing experience current logged in user profile
//@Private

router.put("/education/update/:id", [auth, [
    check('school', 'Name Of School is required').not().isEmpty(),
    check('degree', 'Name Of Degree is required').not().isEmpty(),
    check('from', 'Statrting date is required').not().isEmpty(),
    check('fieldofstudy', 'Field of study is required').not().isEmpty()
]], async (req, res) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const profile = await Profile.findOneAndUpdate({ user: req.user.id });

        if (!profile) {
            return res.json([{ msg: "No profile exist for this user please create profile" }]);
        }

        profile.education = profile.education.map(info => {
            if (info._id.toString() === req.params.id) {
                req.body._id = info._id;
                return req.body;
            }
            return info;
        });
        profile.save();

        res.json(profile);


    } catch (error) {

        if (error.kind = "ObjectId")
            return res.json([{ msg: "No profile exist for this user please create profile" }]);
        res.status(500).json([{ msg: "Server Error" }]);
    }
});


//@GRT   Route api/profile/github/:username
//@desc  Getting Github repo of users
//@Public

router.get("/github/:username", async (req, res) => {

    try {

        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?
            per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}
            &client_secret=${config.get('githubClientSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
        }

        request(options, (error, response, body) => {

            if (error)
                console.log(error);
            //console.log("body", body);
            //console.log("status", response.statusCode);
            if (response.statusCode !== 200) {
                return res.status(404).json([{ msg: "No Github profile found" }]);
            }

            res.json(JSON.parse(body));

        })

    } catch (error) {

        console.log(error);

        res.status(500).json([{ msg: "Server Error" }]);
    }

});




module.exports = router;