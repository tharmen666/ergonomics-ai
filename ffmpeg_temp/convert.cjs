const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');

ffmpeg.setFfmpegPath(ffmpegStatic);

console.log('Starting conversion...');

ffmpeg('C:\\Users\\Desigan Thermen\\.gemini\\antigravity\\brain\\911d34ef-a904-47f1-b71f-a5b16b5fb3e8\\technical_demo_final_1773979738786.webp')
    .outputOptions([
        '-c:v libx264',
        '-pix_fmt yuv420p',
        '-vf scale=trunc(iw/2)*2:trunc(ih/2)*2'
    ])
    .save('C:\\Users\\Desigan Thermen\\.gemini\\antigravity\\brain\\911d34ef-a904-47f1-b71f-a5b16b5fb3e8\\Technical_Demo_ErgoSafe_Reborn.mp4')
    .on('end', () => console.log('Conversion complete!'))
    .on('error', (err, stdout, stderr) => {
        console.error('Error during conversion:', err.message);
        console.error('FFMPEG Output:', stderr);
    });
