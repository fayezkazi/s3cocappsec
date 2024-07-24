require("dotenv").config();
const multer = require("multer");
const BUCKET_NAME = process.env.BUCKET_NAME;
const express = require("express");
const { s3upload2, getAWS } = require("./s3aws");

const { JWTStrategy } = require("@sap/xssec");
const xsenv = require("@sap/xsenv");
const passport = require("passport");
const app = express();

xsenv.loadEnv();
passport.use(new JWTStrategy(xsenv.getServices({ uaa: { tag: 'xsuaa' } }).uaa));
app.use(passport.initialize());
app.use(passport.authenticate('JWT', { session: false }));

app.use(express.json()); 

var fs = require('fs'); 

const fileFilter = (req,file,cb) => {
    if (file.mimetype.split("/")[1] === 'pdf') {
        cb(null,true)
    } else {
        cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE') , false)
    }
}

const port = process.env.PORT || 5000;
app.listen(port, function () {
	console.info(`App is listening on port http://localhost:${port}`);
});

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    fileFilter
});

// app.use(express.static('app/s3cocapp/webapp'));

app.post("/upload", upload.single("file"), async (req, res) => {
    const result = await s3upload2(req.file);
    // res.setHeader("Content-Type", "application/json");
    // res.status(200);
    return res.send('200'); //.send("File Upload successful");
    console.log("File Upload Started");
});

app.get("/list", async (req, res) => {

    const s3 = await getAWS();
    let r = await s3.listObjectsV2({ Bucket: BUCKET_NAME }).promise();
    let x = r.Contents.map(item => item.Key);
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(x);
});

app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
       if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        // res.setHeader("Content-Type", "application/json");
        // res.sendStatus(200);
        // return res.send('Choose only PDF Files')
        // res.status(200).send('Choose only PDF Files.'); 
        res.send('401');
        return res;       
       } 
    }
});

// function checkScope(req,res,next) {
//     if (req.authIno.checkLocalScope("Viewer")) {
//         next();
//     } else {
//         res.status(403).end("Forbidden");
//     }
// };