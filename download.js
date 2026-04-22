const { exec } = require("child_process");
const fs = require("fs");
const uploadToR2 = require("./r2");

/**
 * Get metadata
 */
function getMetadata(url) {
  return new Promise((resolve, reject) => {
    exec(`./yt-dlp -J "${url}"`, (error, stdout) => {
      if (error) return reject(new Error("Metadata failed"));

      try {
        const data = JSON.parse(stdout);

        resolve({
          title: data.title || "Unknown Title",
          thumbnail: data.thumbnail || null
        });

      } catch {
        reject(new Error("Metadata parse failed"));
      }
    });
  });
}

/**
 * MAIN DOWNLOAD FLOW
 */
function downloadVideo(url) {
  return new Promise(async (resolve, reject) => {

    const fileName = `video-${Date.now()}.mp4`;

    try {
      const metadata = await getMetadata(url);

      exec(`./yt-dlp -f best -o "${fileName}" "${url}"`, async (error) => {

        if (error) return reject(new Error("Download failed"));

        if (!fs.existsSync(fileName)) {
          return reject(new Error("File missing after download"));
        }

        const r2Result = await uploadToR2(fileName, fileName);

        fs.unlinkSync(fileName);

        /**
         * 🔥 FORCE STRING OUTPUT (CRITICAL FIX)
         */
        const videoUrl =
          typeof r2Result === "string"
            ? r2Result
            : r2Result?.url || r2Result?.Location || r2Result?.location || "";

        if (!videoUrl || typeof videoUrl !== "string") {
          return reject(new Error("Invalid R2 URL returned"));
        }

        resolve({
          success: true,
          videoUrl: videoUrl.trim(),
          title: metadata.title,
          thumbnailUrl: metadata.thumbnail
        });
      });

    } catch (err) {
      reject(err);
    }
  });
}

module.exports = downloadVideo;
