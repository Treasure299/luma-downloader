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
      console.log("FILE EXISTS:", fs.existsSync(filePath));

      // 🔥 FORCE WAIT BEFORE UPLOAD (important on Render)
      setTimeout(async () => {
        try {
          console.log("STARTING R2 UPLOAD NOW...");

          const uploadResult = await uploadToR2(filePath, fileName);

          console.log("UPLOAD DONE");

          resolve({
            success: true,
            message: "Download + Upload completed",
            videoUrl: uploadResult.url
          });

        } catch (err) {
          console.log("UPLOAD ERROR:", err);
          reject(err);
        }

      }, 2000);

    });

  });
}

module.exports = downloadVideo;
