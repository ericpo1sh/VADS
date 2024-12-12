# VADS

## Introduction
Virtual Aerial Drone Systems (VADS) is an open-source desktop application for real-time drone control, live video streaming, and immersive AR/VR experiences with a MEta Quest 2. VADS integrates seamlessly with custom drones powered by Raspberry Pi and Navio 2, providing an intuitive interface for controls and real-time data monitoring.

### How it Works
After launching the Backend and Frontend of the VADS application, make sure both the drone and the Meta Quest 2 are powered on. From there the drone will establish the video Feed and the flight data feed. It will send the filght data over a custom serial port to the VADS application, and a WebSocket to send the data to the Meta Quest 2. From there the VADS application will recieve the live video feed over HLS and the Meta Quest 2 will over WebRTC. The drone will receive the control data for movement from the Meta Quest 2 via WebSocket.

### Repo Files
| **File** | *__Description__* |
|----------|----------------:|
|VADS-Client| Directory for handling the Front and Back end of the Electron App|
|VADS-Onboard| Directory for code written for the Raspberry pi and Navio 2 Flight Controller|
|VADS-VR| Directory for handling Virtual Reality C# application, designed for a Meta Quest 2|

## Authors / Contact info
* **Sammy Ansari** **|** [Github](https://github.com/O-01) **|** [LinkedIn](https://linkedin.com/in/sammy-ansari) **|**
* **Eric Dzyk** **|** [Github](https://github.com/ericpo1sh) **|** [LinkedIn](https://www.linkedin.com/in/ericdzyk/) **|**
* **Logan Savage** **|** [Github](https://github.com/SavageLM) **|** [LinkedIn](https://www.linkedin.com/in/logan-m-savage/) **|**
* **Jagger Van Winkle** **|** [Github](https://github.com/JiggyJoggy) **|** [LinkedIn](https://www.linkedin.com/in/jaggervw/) **|**
