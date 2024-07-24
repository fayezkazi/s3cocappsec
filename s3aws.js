const aws = require("aws-sdk");

aws.config.update({
    secretAccessKey: process.env.SECRET_KEY,
    accessKeyId: process.env.ACCESS_KEY,
    region: process.env.REGION,
});

const s3 = new aws.S3();
exports.s3upload2 = async (file) => {


    const param = {
        Bucket : process.env.BUCKET_NAME,
        Key : `ValidationDocs/${file.originalname}`,
        Body : file.buffer
    };
    const result = await s3.upload(param).promise();
    return result;

};

exports.getAWS = async ()=>{
    return s3;
};