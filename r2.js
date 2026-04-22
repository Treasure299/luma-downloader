const fs = require('fs');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
endpoint: 'https://' + process.env.R2_ACCOUNT_ID + '.r2.cloudflarestorage.com',
accessKeyId: process.env.R2_ACCESS_KEY_ID,
secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
signatureVersion: 'v4',
});

async function uploadToR2(filePath) {
if (!process.env.R2_BUCKET_NAME) {
throw new Error('R2_BUCKET_NAME missing');
}

const fileContent = fs.readFileSync(filePath);

const key = 'videos/' + Date.now() + '.mp4';

const params = {
Bucket: process.env.R2_BUCKET_NAME,
Key: key,
Body: fileContent,
ContentType: 'video/mp4',
};

await s3.putObject(params).promise();

return process.env.R2_PUBLIC_URL + '/' + key;
}

module.exports = {
uploadToR2: uploadToR2,
};
