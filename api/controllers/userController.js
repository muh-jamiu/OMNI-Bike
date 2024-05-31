const userSchema = require("../model/userSchema")
const CodeSchema = require("../model/codeSchema")
const reviewSchema = require("../model/reviewSchema")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
var nodemailer = require('nodemailer');

const sendEmailverify = (to, name, code) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'swift.secure.deliver@gmail.com',
            pass: 'vnmv onnd lfjx ybmo',
        }
    });

    var mailOptions = {
        to: to,
        subject: 'Account Verification',
        html: `
            <a href="" class="logo d-flex" style="text-align: center; margin-bottom:.5em">
                <h2 class="fw-bold mx-2 text-white">FarmPay </h2>
            </a>
            <h3 style="text-align: center; margin-top:0">Account Verification</h3>
        
            <hr>
            <h3 style="margin-top:2em">Dear ${name},</h3>
            <p style="line-height: 28px">Thank you for registering with Farmpay. Please verify your email address to complete the signup process</p>
            <h4>Please verify with</h4> <h1>${code}</h1>
            <p>Verification Code will expire in 15 minutes</p>
            <p>If you did not sign up for this account, please ignore this email.</p>
            <h3 style="margin-bottom: .3em">Thank you,</h3>
            <h3>Admyrer Team</h3>
            <p>If you have any questions or need assistance, feel free to contact our support team at info@farmpay.com</p>
        
            <p>Best regards</p>
            <p style="margin-bottom: 1em; pst-style-type:none"><a href="tel:+2348091810342"> +2349138650286</a></p>
            <p style="margin-bottom: 1em; pst-style-type:none"><a href="">info@farmpay.com</a></p>
            <p style="margin-bottom: 1em; pst-style-type:none"><a href=""> FarmPay</a></p>

        `,
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error)
        }else{
            console.log(info.response)
        }
    });


}

const generateCode = () => {
    return Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('');
}

const createUser = (req, res) => {
    userSchema.find({email : req.body.email})
    .then(result => {
       if(result.length >= 1){
            res.status(400).json({
                message : "user already exist"
            })
       }else{
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(hash){
                    const user = new userSchema({
                        firstname : req.body.firstname,
                        lastname : req.body.lastname,
                        password : hash,
                        email : req.body.email,
                        phone : req.body.phone,
                        username : req.body.username,
                    })
                
                    user.save()
                    .then(data => {
                        const token = jwt.sign({ 
                            firstname : req.body.firstname,
                            lastname : req.body.lastname,
                            email : req.body.email,}, "secret", {expiresIn : "12h"}
                        )
                        var code = generateCode()
                        var saveCode = new CodeSchema({
                            code: code,
                            userId: data._id
                        })
                        saveCode.save()

                        sendEmailverify(req.body.email, req.body.firstname, code)

                        res.status(200).json({
                            message : "user created successfully",
                            user,
                            "access-token" : token
                        })
                    })
                    .catch( err => {
                        res.status(500).json({
                            message: err
                        })
                    })
                }else{
                    res.status(500).json({
                        message: "Something went wrong"
                    })
                }
            })
       }
    })
    .catch(err => {
        res.status(500).json({
            message : err
        })
    })

   
}

const loginUser = (req, res) => {
    userSchema.find({email : req.body.email})
    .then(user => {
       if(user.length >= 1){
            bcrypt.compare(req.body.password, user[0].password, (err , bol) => {
                if(bol){
                   const token = jwt.sign({
                        email : user[0].email, 
                        firstname : user[0].firstname,
                        lastname : user[0].lastname,}, "secret", {expiresIn : "12h"}
                    )
                    res.status(200).json({
                        message : "user logged  in",
                        user: user[0],
                        "access-token" : token
                    })
                }else{
                    res.status(403).json({
                        message : "incorrect credentials"
                    })
                }
            })
       }
       else{
        res.status(404).json({
            message : "User does not exist"
        })
       }
    })
    .catch(err => {
        res.status(500).json({
            error : err
        })
    })

}

const getAllUser = (req, res) => {
   userSchema.find()
   .sort({"createdAt" : "desc"})
   .then(data => {
        res.status(200).json({
            message : "users fetched successfully",
            users : data
        })
   })
   .catch(err => {
    res.status(500).json({
        error : err
    })
   })
}

const getUserByEmail = (req, res) => {
    if(req.body.email){
        userSchema.find({"email" : req.body.email})
        .then(data => {
            res.status(200).json({
                message : "users fetched successfully",
                users : data
            })
        })
        .catch(err => {
            res.status(500).json({
                error : err
            })
        })  
    }else{
        res.status(404).json({
            message : "user not found"
        })
    }
}

const UpdateUser = (req, res) => {
    const {firstname, lastname, email, id, phone, address, username} = req.body
    userSchema.findOneAndUpdate({_id : id}, {firstname:firstname, lastname: lastname, email:email, phone:phone, address:address, username:username })
    .then(result => {
        if(!result){
            return res.status(400).json({
                message: "User does not exist"
            })
        }
        res.status(200).json({
            message: "User has been updated succesfully"
        })
    })
    .catch(err => {
        res.status(500).json({
            message : err
        })
    })

   
}

const verifyCode = (req, res) => {
    CodeSchema.find({"code" : req.body.code})
    .then(data => {
        if(data.length == 0){
            return res.status(400).json({
                message : "Invalid code",
            })
        }

        if( req.body.userId != data[0].userId){
            return res.status(400).json({
                message : "Invalid code",
            })
        }

        userSchema.findOneAndUpdate({_id : req.body.userId}, {isverified: true})
        .then(() => {
            CodeSchema.findOneAndDelete({"code" : req.body.code})
            .then( codeRes => {
                return res.status(200).json({
                    message : "Account Verified Successfully"
                })
            })
       })
    })
    .catch(err => {
        res.status(500).json({
            message : err
        })
    })
}


const createReview = (req, res) => {
    const {user, bike, title, comment, rating} = req.body
    userSchema.find({_id : user})
    .then(users => {
        if(users.length == 0){
            return res.status(400).json({
                message : "User does not exist",
            })
        }

        const review = new reviewSchema({
            user,
            bike,
            title,
            comment,
            rating
        })
    
        review.save()
        .then(data => {
                res.status(200).json({
                    message : "review created successfully",
                    data,
                })
        })
        .catch( err => {
            res.status(500).json({
                message: err
            })
        })
    }) 
    .catch( err => {
        res.status(500).json({
            message: err
        })
    })
   
}

const getallReviews = (req, res) => {
    reviewSchema.find()
    .populate("user")
    .populate("bike")
    .then(reviews => {
        if(reviews.length == 0){
            return res.status(400).json({
                message : "there are no reviews",
            })
        }

        return res.status(400).json({
            message : "reviews fetch successfully",
            reviews
        })
    }) 
    .catch( err => {
        res.status(500).json({
            message: err
        })
    })
   
}

const getbikesReviews = (req, res) => {
    const {bikeId} = req.body
    reviewSchema.find({bike: bikeId})
    .populate("user")
    .populate("bike")
    .then(reviews => {
        if(reviews.length == 0){
            return res.status(400).json({
                message : "there are no reviews for this bike",
            })
        }

        return res.status(400).json({
            message : "reviews fetch for this bike successfully",
            reviews
        })
    }) 
    .catch( err => {
        res.status(500).json({
            message: err
        })
    })
   
}


module.exports = {
    createUser, 
    getAllUser,
    loginUser,
    getUserByEmail,
    verifyCode,
    UpdateUser,
    createReview,
    getallReviews,
    getbikesReviews,
}