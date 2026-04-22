const { exec } = require('child_process');

function downloadVideo(url) {
  return new Promise((resolve, reject) => {

    if (!url) {
      return reject(new Error('No URL provided'));
    }

    const command = `./yt-dlp -f best -o output.mp4 "${url}"`;

    exec(command, (error, stdout, stderr) => {

      if (error) {
        console.error('YT-DLP ERROR:', error);
        console.error('STDERR:', stderr);
        return reject(new Error(stderr || error.message));
      }

      console.log('YT-DLP SUCCESS:', stdout);

      resolve({
        success: true,
        message: 'Download completed',
        videoUrl: 'TEMP_LOCAL_FILE'
      });

    });

  });
}

module.exports = downloadVideo;
