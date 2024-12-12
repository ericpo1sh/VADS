# VADS Client
## Overview
The Virtual Aerial Drone Systems (VADS) Client is a comprehensive application designed for real-time drone control, live video streaming, and immersive AR/VR experiences. It is developed as part of a collaborative project to integrate custom drone hardware (Raspberry Pi and Navio 2) with a modern application that provides seamless connectivity, advanced functionality, and intuitive user interfaces. The application supports:

- **Live Video Streaming**: Utilizes HLS for video streaming.
- **Video Recordings**: Allows users to record and save video streams for later playback or analysis.
- **Settings Management**: Adjustments for themes, camera settings, and more.
- **Immersive Experiences**: Compatibility with VR headsets for a first-person perspective.
- **User Accounts**: Enables user authentication and profile management.
- **Storing User Data**: Stores user data such as email, username, profile picture, and drone usage statistics in a MongoDB database.

## Repository Structure

### Front-End
- **Tech Stack**: React with TypeScript
- **Features**:
  - HLS integration for live streaming
  - Modular components for key UI elements (e.g., `VideoContainer`, `SettingsPanel`)
  - Context API for state management across components

### Back-End
- **Tech Stack**: Node.js with Express, MongoDB
- **Features**:
  - API endpoints for user data management (e.g., email, username, profile picture, drone stats)
  - Real-time communication with the drone via serial port connection
  - Secure authentication using Firebase

### Streaming Server
- **Tech Stack**: HLS, WebRTC, RTSP integration
- **Features**:
  - Low-latency video streaming from RTSP-compatible cameras
  - Adaptable to various video protocols (UDP, HLS, RTSP, WebRTC)

## How to Use

### Prerequisites
1. **Drone Setup**:
   - Raspberry Pi 4 Model B with Navio 2
   - Camera compatible with RTSP streaming
2. **Environment**:
   - Node.js installed on the server
   - MongoDB database for storing user and drone data
3. **VR Equipment** (Optional): Compatible headset for immersive experiences

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/ericpo1sh/VADS
   ```
2. Navigate to the back-end folder and install dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Start the back-end server:
   ```bash
   npm start
   ```
4. Start the back-end recording server:
   ```bash
   node hls-streaming-server.js
   ```
5. Start the back-end port reading server:
   ```bash
   node port_read.js
   ```
6. Navigate to the front-end folder and install dependencies:
   ```bash
   cd frontend
   npm install
   ```
7. Start the front-end application:
   ```bash
   npm start
   ```

### Development
- Use `Electron` to package the application as a standalone desktop app.
- Test components thoroughly using unit testing frameworks.

### Contributions
We welcome contributions! Please fork the repository and create a pull request with detailed descriptions of your changes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

---

This repository is a collaborative effort aimed at enhancing drone technology and user experiences. Your contributions and feedback are highly valued.

