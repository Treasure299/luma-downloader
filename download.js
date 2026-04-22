const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const downloadVideo = (url) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, 'output.mp4');

    const command = `./yt-dlp -f best -o "${filePath}" "${url}"`;

    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error('YT-DLP ERROR:', err);
        console.error('STDERR:', stderr);
        return reject(new Error(stderr || err.message));
      }

      console.log('YT-DLP OUTPUT:', stdout);

      resolve({
        success: true,
        message: 'Download completed',
        videoUrl: 'TEMP_LOCAL_FILE', // we will replace this with R2 next
      });
    });
  });
};

module.exports = downloadVideo;
