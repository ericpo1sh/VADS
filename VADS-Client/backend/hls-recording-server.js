const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const cors = require('cors');
const mime = require('mime');
const fs = require('fs');

const app = express();
const port = 3001;

let recordingProcess = null;
app.use(cors());
app.use(express.json());

app.post('/start-recording', (req, res) => {
  if (recordingProcess) {
    return res.status(400).send('Recording already in progress.');
  }

  const today = new Date(Date.now());
  const formattedDate = `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()}`;

  const outputFilePath = path.join(__dirname, 'recordings', `recording_${formattedDate}.mp4`);

  recordingProcess = spawn('ffmpeg', [
    '-i', 'http://10.8.203.1:8888/stream/index.m3u8',
    '-c', 'copy',
    '-f', 'mp4',
    '-movflags', 'frag_keyframe+empty_moov',
    '-t', '00:10:00',
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

  recordingProcess.kill('SIGTERM');
  recordingProcess = null;
  res.send({ message: 'Recording stopped' });
});

app.get('/recordings', (req, res) => {
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

app.get('/recordings/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'recordings', req.params.filename);
  const mimeType = mime.lookup(filePath);
  res.setHeader('Content-Type', mimeType);
  res.sendFile(filePath);
});

app.delete('/recordings/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'recordings', req.params.filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Failed to delete file', err);
      return res.status(500).send('Failed to delete recording');
    }

    res.send({ message: 'Recording deleted successfully' });
  });
});

app.get('/ping', (req, res) => {
  res.send('Server is active');
});

app.use('/recordings', express.static(path.join(__dirname, 'recordings')));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
