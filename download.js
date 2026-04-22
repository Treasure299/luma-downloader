const { exec } = require("child_process");
const fs = require("fs");
const uploadToR2 = require("./r2");

function downloadVideo(url) {
  return new Promise((resolve, reject) => {

    const fileName = `video-${Date.now()}.mp4`;
    const filePath = fileName;

    console.log("DOWNLOADING VIDEO...");

    const command = `./yt-dlp -f best -o "${filePath}" "${url}"`;

    exec(command, async (error, stdout, stderr) => {

      if (error) {
        console.log("YT-DLP ERROR:", stderr);
        return reject(error);
      }

      console.log("DOWNLOAD COMPLETE");

      // 🔍 check file exists before upload
      if (!fs.existsSync(filePath)) {
        return reject(new Error("File was not created on server"));
      }

      try {
        console.log("STARTING R2 UPLOAD NOW...");

        const uploadResult = await uploadToR2(filePath, fileName);

        console.log("UPLOAD DONE");

        // 🧹 CLEANUP STEP (IMPORTANT)
        try {
          fs.unlinkSync(filePath);
          console.log("LOCAL FILE DELETED (CLEANUP SUCCESS)");
        } catch (cleanupErr) {
          console.log("CLEANUP FAILED (non-blocking):", cleanupErr.message);
        }

        resolve({
          success: true,
          message: "Download + Upload completed",
          videoUrl: uploadResult.url
        });

      } catch (err) {
        console.log("UPLOAD ERROR:", err);
        reject(err);
      }
    });

  });
}

module.exports = downloadVideo;
