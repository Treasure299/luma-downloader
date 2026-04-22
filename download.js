const { exec } = require("child_process");
const fs = require("fs");
const uploadToR2 = require("./r2");

/**
 * Get real metadata from yt-dlp
 */
function getMetadata(url) {
  return new Promise((resolve, reject) => {
    const command = `./yt-dlp -J "${url}"`;

    exec(command, (error, stdout) => {
      if (error) {
        return reject(new Error("Metadata extraction failed"));
      }

      try {
        const data = JSON.parse(stdout);

        resolve({
          title: data.title,
          thumbnail: data.thumbnail
        });

      } catch (err) {
        reject(new Error("Failed to parse metadata"));
      }
    });
  });
}

/**
 * MAIN DOWNLOAD FUNCTION (SYNC FLOW)
 */
function downloadVideo(url) {
  return new Promise(async (resolve, reject) => {

    const fileName = `video-${Date.now()}.mp4`;

    try {
      console.log("STEP 1: FETCH METADATA");

      const metadata = await getMetadata(url);

      console.log("STEP 2: DOWNLOADING VIDEO");

      const command = `./yt-dlp -f best -o "${fileName}" "${url}"`;

      exec(command, async (error) => {

        if (error) {
          console.error("DOWNLOAD ERROR:", error);
          return reject(new Error("Video download failed"));
        }

        console.log("STEP 3: UPLOADING TO R2");

        if (!fs.existsSync(fileName)) {
          return reject(new Error("File not found after download"));
        }

        const r2Url = await uploadToR2(fileName, fileName);

        // cleanup local file
        fs.unlinkSync(fileName);

        console.log("STEP 4: DONE");

        resolve({
          success: true,
          videoUrl: r2Url,
          title: metadata.title || "Unknown Title",
          thumbnailUrl: metadata.thumbnail || null
        });

      });

    } catch (err) {
      reject(err);
    }
  });
}

module.exports = downloadVideo;
