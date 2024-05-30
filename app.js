const express = require("express")
const app = express()
const morgan = require("morgan")
const cors = require("cors")
const multer = require("multer")
const path = require('path')
const bodyParser = require('body-parser');
const util = require('util');
const Formidable = require('formidable');
const cloudinary = require("cloudinary");
require('dotenv').config()
const { Configuration, OpenAIApi, OpenAI } = require("openai");  
const { default: axios } = require("axios")
require("dotenv").config();
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const userRoutes = require("./api/routes/userRoute")
const swaggerDocs = require("./utils/swagger.docs");
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerAnnotation = require("./utils/swagger.annotation")


app.use(express.static("./public"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json())
app.use(morgan("dev"))
app.use(express.urlencoded({extended:true}))
app.use(cors())
// swaggerDocs(app)

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
        title: 'Electric Bike Rental',
        version: '1.0.0',
        description: 'Electric Bike Rental Documentation',
        },
        servers: [
        {
            url: true ? "/" : "/",
            description: 'Development server',
        },
        ],
        // paths: swaggerAnnotation,
        tags: [
            { name: 'Auth', description: 'Endpoints related to user authentication' },
            { name: 'Bikes', description: 'Endpoints related to Bike function' },
            { name: 'QRCode', description: 'Endpoints related to Bike QRcode scanner' },
        ]
    },
    apis: ["./app.js"],
};
const setup = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(setup));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    )

    if(req.method == "OPTIONS"){
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET")
    }
    next()
})

app.get("/", (req, res) => {
    res.status(200).json({
        message : "Welcome to Electric Bike Rental API",
        version : "1.0",
        author : "Nextech"
    })
})

app.use("/user", userRoutes)

app.use((req, res) => {
    res.status(404).json({
        message : "Endpoint not found"
    })
})
module.exports = app

/**
* @swagger
* /user/signup:
*   post:
*     tags: [Auth]
*     summary: Create a new user
*     description: |
*       This endpoint allows you to create a new user account.
*       To create a user, you must provide the following information:
*       
*       - email: The email address of the user. This field is required.
*       - password: The password for the user account. This field is required.
*       - name: The name for the user account. This field is required.
*       - phone: The phone number for the user account. This field is required.
*       
*       Upon successful creation, the endpoint returns a response with status code 201 (Created).
*     requestBody:
*       description: User object
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               firstname:
*                 type: string
*               lastname:
*                 type: string
*               email:
*                 type: string
*               password:
*                 type: string
*               phone:
*                 type: string
*             required:
*               - name
*               - email
*               - password
*               - phone
*     responses:
*       201:
*         description: User created successfully
*/



/**
 * @swagger
 * /user/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     description: |
 *       This endpoint allows users to log in to their accounts.
 *       To authenticate, users must provide their email and password.
 *       
 *       - email/phone: The email address of the user or phone number of the user. This field is required.
 *       - password: The password for the user account. This field is required.
 *       
 *       Upon successful authentication, the endpoint returns a response with status code 200 (OK) along with an authentication token.
 *       
 *     requestBody:
 *       description: User object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User logged in successfully
 */



/**
 * @swagger
 * /user/request-otp:
 *   post:
 *     tags: [Auth]
 *     summary: Request OTP
 *     description: |
 *       This endpoint allows users to request a one-time password (OTP) for authentication purposes.
 *       Users must provide their email address to receive the OTP.
 *       Upon successful request, the OTP is sent to the provided email address.
 *       
 *       - email/phone: The email address or phone number of the user. This field is required.
 *       
 *       Note: The OTP expires after a certain period and can only be used once for authentication.
 *     requestBody:
 *       description: OTP object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: OTP sent successfully
 */

/**
 * @swagger
 * /user:
 *   get:
 *     tags: [Auth]
 *     summary: Get all user
 *     description: |
 *       This endpoint allows to fetch all users on the platform.
 *       
 *       
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: User fetch successfully
 */

/**
 * @swagger
 * /bikes:
 *   get:
 *     tags: [Bikes]
 *     summary: Get all bikes
 *     description: |
 *       This endpoint allows to fetch all bikes on the platform.
 *       
 *       
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: User fetch successfully
 */

/**
 * @swagger
 * /qr-code:
 *   get:
 *     tags: [QRCode]
 *     summary: Get bike functions with QR code scanner
 *     description: |
 *       This endpoint allows to fetch bikes with qr code scanner on the platform.
 *       
 *       
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: User fetch successfully
 */


/**
 * @swagger
 * /user/confirm-otp:
 *   post:
 *     tags: [Auth]
 *     summary: Confirm OTP
 *     description: |
 *       This endpoint allows users to confirm the one-time password (OTP) they received for authentication purposes.
 *       Users must provide the OTP they received via email.
 *       
 *       Upon successful confirmation, the user's authentication is validated and they can proceed with their desired action.
 *       
 *       Note: The OTP expires after a certain period and can only be used once for authentication.
 *     requestBody:
 *       description: OTP object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               OTP:
 *                 type: string
 *               email:
 *                 type: string
 *             required:
 *               - email
 *               - OTP
 *     responses:
 *       200:
 *         description: OTP confirmed successfully
 */


/**
 * @swagger
 * /user/request-password-reset:
 *   patch:
 *     tags: [Auth]
 *     summary: Request password reset
 *     description: |
 *       This endpoint allows users to request a password reset by providing their email address.
 *       Upon successful request, a password reset OTP will be sent to the provided email address.
 *       
 *       Note: The password reset OTP is valid for a limited time period and can only be used once.
 *     requestBody:
 *       description: Password object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Password reset pin sent
 */



/**
 * @swagger
 * /user/confirm-password-reset:
 *   post:
 *     tags: [Auth]
 *     summary: Confirm request password
 *     description: |
 *       This endpoint allows users to confirm a password reset request by providing a new password and a token received via email.
 *       Upon successful confirmation, the user's password will be updated to the new password.
 *       
 *       Note: The password reset token expires after a certain period and can only be used once.
 *     requestBody:
 *       description: Password object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pin:
 *                 type: number
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - pin
 *               - password
 *     responses:
 *       200:
 *         description: Your password has been reset successfully
 */