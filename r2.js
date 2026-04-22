const fs = require('fs');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
accessKeyId: process.env.R2_ACCESS_KEY_ID,
secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
signatureVersion: 'v4',
});

const uploadToR2 = async (filePath) => {
const fileContent = fs.readFileSync(filePath);

const params = {
Bucket: process.env.R2_BUCKET_NAME,
Key: `videos/${Date.now()}.mp4`,
Body: fileContent,
ContentType: 'video/mp4',
};

await s3.putObject(params).promise();

return `${process.env.R2_PUBLIC_URL}/${params.Key}`;
};

module.exports = { uploadToR2 };
