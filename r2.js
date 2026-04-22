const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");

const accountId = process.env.R2_ACCOUNT_ID;
const bucket = process.env.R2_BUCKET_NAME;

console.log("R2 INIT → bucket:", bucket);
console.log("R2 INIT → accountId:", accountId);

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

  if (!bucket) {
    throw new Error("R2_BUCKET_NAME is missing in environment variables");
  }

  const fileStream = fs.createReadStream(filePath);

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: fileName,
    Body: fileStream,
    ContentType: "video/mp4",
  });

  await s3.send(command);

  console.log("R2 UPLOAD SUCCESS");

  // ✅ THIS is the correct PUBLIC URL format (your working r2.dev domain)
  return {
    url: `https://pub-5e5fc7bf63f54f2ca5560ab1efb76479.r2.dev/${fileName}`
  };
}

module.exports = uploadToR2;
