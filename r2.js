const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");

const accountId = process.env.R2_ACCOUNT_ID;

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

async function uploadToR2(filePath, fileName) {
  console.log("R2 UPLOAD STARTING...");

  const fileStream = fs.createReadStream(filePath);

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: fileName,
    Body: fileStream,
    ContentType: "video/mp4",
  });

  await s3.send(command);

  console.log("R2 UPLOAD SUCCESS");

  return {
    url: `https://pub-${accountId}.r2.dev/${fileName}`
  };
}

module.exports = uploadToR2;
