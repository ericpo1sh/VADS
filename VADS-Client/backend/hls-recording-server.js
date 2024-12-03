// server.js
const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const app = express();
const port = 3001;
const cors = require('cors');


let recordingProcess = null;
app.use(cors())
app.use(express.json());

app.post('/start-recording', (req, res) => {
  if (recordingProcess) {
    return res.status(400).send('Recording already in progress.');
  }

  const outputFilePath = path.join(__dirname, 'recordings', `recording_${Date.now()}.mp4`);

  recordingProcess = spawn('ffmpeg', [
    '-i', 'http://10.8.202.84:8888/stream/index.m3u8',
    '-c', 'copy',
    '-t', '00:10:00', // Optional: set a max recording time
    outputFilePath
  ]);

  recordingProcess.on('close', (code) => {
    console.log(`FFmpeg process exited with code ${code}`);
    recordingProcess = null;
  });

  res.send({ message: 'Recording started' });
});

app.post('/stop-recording', (req, res) => {
  if (!recordingProcess) {
    return res.status(400).send('No recording in progress.');
  }

  recordingProcess.kill('SIGINT');
  recordingProcess = null;
  res.send({ message: 'Recording stopped' });
});

app.get('/recordings', (req, res) => {
  const fs = require('fs');
  const recordingsDir = path.join(__dirname, 'recordings');

  fs.readdir(recordingsDir, (err, files) => {
    if (err) {
      return res.status(500).send('Unable to list recordings.');
    }

    const recordings = files.map(file => ({
      name: file,
      path: `/recordings/${file}`
    }));

    res.send(recordings);
  });
});

app.use('/recordings', express.static(path.join(__dirname, 'recordings')));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
