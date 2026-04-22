const { exec } = require("child_process");

function downloadVideo(url) {
  return new Promise((resolve, reject) => {

    if (!url) return reject(new Error("No URL provided"));

    const fileName = `output-${Date.now()}.mp4`;

    const command = `./yt-dlp -f best -o "${fileName}" "${url}"`;

    exec(command, async (error, stdout, stderr) => {

      if (error) {
        console.error("YT-DLP ERROR:", error);
        return reject(new Error(stderr || error.message));
      }

      console.log("DOWNLOAD COMPLETE");

      // IMPORTANT:
      // This assumes your R2 upload already works in your existing code
      // and returns a public URL.

      const r2Url = `YOUR_R2_PUBLIC_URL/${fileName}`;

      resolve({
        success: true,
        videoUrl: r2Url,
        title: "Video Title (optional upgrade later)",
        thumbnailUrl: null
      });

    });
  });
}

module.exports = downloadVideo;
