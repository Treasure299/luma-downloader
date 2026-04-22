const { exec } = require('child_process');
const path = require('path');
const { uploadToR2 } = require('./r2');

function downloadAndUpload(url) {
return new Promise((resolve, reject) => {
const filePath = path.join(__dirname, 'output.mp4');

```
const command =
  './yt-dlp -f best -o "' + filePath + '" "' + url + '"';

exec(command, async (error, stdout, stderr) => {
  if (error) {
    console.error('YT-DLP ERROR:', error);
    console.error(stderr);
    return reject(new Error('Download failed'));
  }

  try {
    const fileUrl = await uploadToR2(filePath);

    resolve({
      success: true,
      videoUrl: fileUrl,
    });
  } catch (uploadError) {
    console.error(uploadError);
    reject(new Error('Upload to R2 failed'));
  }
});
```

});
}

module.exports = { downloadAndUpload };
