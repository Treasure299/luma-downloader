const { exec } = require('child_process');
const path = require('path');

const downloadVideo = (url) => {
  return new Promise((resolve, reject) => {
    // Path to cookies.txt
    const cookiesPath = path.join(__dirname, 'cookies.txt');

    // yt-dlp command to download the video with cookies and sleep interval to avoid rate limits
    const command = `./yt-dlp --sleep-interval 1 --max-sleep-interval 5 --cookies ${cookiesPath} -f best -o output.mp4 "${url}"`;

    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error('YT-DLP ERROR:', err);
        console.error('STDERR:', stderr);
        return reject({
          error: err.message || err.toString(),
          details: stderr || 'No stderr output',
        });
      }

      // Now that the download is complete, parse the stdout to get metadata
      // For example, capture title from yt-dlp's stdout, you can adjust this parsing to your needs
      const videoData = {
        success: true,
        videoUrl: 'https://your-cloudflare-r2-bucket-url/output.mp4', // Replace with actual R2 storage URL
        title: "Extracted Title Here",  // Extract title from yt-dlp or use default title
        platform: "Instagram", // Hardcoded or extracted based on the platform
        originalUrl: url,  // Use the original URL
        status: 'completed',
      };

      // Log and return the result to Luma
      console.log('YT-DLP OUTPUT:', stdout);
      return resolve(videoData); // Return parsed data
    });
  });
};
