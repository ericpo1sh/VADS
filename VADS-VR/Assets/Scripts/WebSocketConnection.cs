using System;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.XR;
using TMPro;
using Newtonsoft.Json;
using System.Globalization;

[RequireComponent(typeof(InputData))]
public class NewMonoBehaviourScript : MonoBehaviour
{
    private ClientWebSocket clientWebSocket;
    private InputData _inputData;
    private string clientMessage = "";

    private bool prevLeftGripState = false;
    private bool prevRightTriggerState = false;
    private bool prevLeftTriggerState = false;
    private bool prevRightGripState = false;
    private float velocity = 0;
    private byte clientMessageInt = 0;
    /*
     * 0000 = All buttons off
     * 0001 = Right trigger ON, everything else off
     * 0011 = Right trigger AND Right grip ON, everything else off
     * 0101 = Left grip ON AND Right trigger ON, everything else off
     * etc.
     * [L_Trigger] [L_Grip] [R_Grip] [R_Trigger]
     * 
     * CONTROLS:
     * 
     * Right Trigger = UP
     * Left Trigger = DOWN
     * Left Grip = LEFT
     * Right Grip = RIGHT
     */

    public TextMeshProUGUI speedText;
    //public TextMeshProUGUI altitudeText;
    public TextMeshProUGUI tempText;
    public TextMeshProUGUI stempText;
    public TextMeshProUGUI pressureText;
    public TextMeshProUGUI pitchText;
    public TextMeshProUGUI rollText;
    public TextMeshProUGUI yawText;

    public TextMeshProUGUI latText;
    public TextMeshProUGUI lonText;
    async void Start()
    {
        // Getting VR raw data
        _inputData = GetComponent<InputData>();

        clientWebSocket = new ClientWebSocket();
        try
        {
            await clientWebSocket.ConnectAsync(new System.Uri("ws://"), CancellationToken.None);
            Debug.Log("WebSocket connected!");
            clientMessage = "Connection made.";
            await SendMessage();
            ReceiveMessages();
        }
        catch (Exception e)
        {
            Debug.LogError($"WebSocket error: {e}");
        }
        
    }

    async void LateUpdate()
    {
        if (clientWebSocket.State == WebSocketState.Open)
        {
            // Left Trigger (Bit 3)
            if (_inputData._leftController.TryGetFeatureValue(CommonUsages.triggerButton, out bool leftTriggerPressed))
            {
                if (leftTriggerPressed != prevLeftTriggerState)
                {
                    //clientMessage = leftTriggerPressed ? "LeftTrigger_ON" : "LeftTrigger_OFF";

                    clientMessageInt = leftTriggerPressed ? (byte)(clientMessageInt | (1 << 3)) : (byte)(clientMessageInt & ~(1 << 3));
                    Debug.Log(clientMessageInt);
                    await SendControlInputs();
                    prevLeftTriggerState = leftTriggerPressed;
                }
            }

            // Left Grip (Bit 2)
            if (_inputData._leftController.TryGetFeatureValue(CommonUsages.gripButton, out bool leftGripPressed))
            {
                if (leftGripPressed != prevLeftGripState)
                {
                    //clientMessage = leftGripPressed ? "LeftGrip_ON" : "LeftGrip_OFF";

                    clientMessageInt = leftGripPressed ? (byte)(clientMessageInt | (1 << 2)) : (byte)(clientMessageInt & ~(1 << 2));
                    Debug.Log(clientMessageInt);
                    await SendControlInputs();
                    prevLeftGripState = leftGripPressed;
                }
            }

            // Right Grip (Bit 1)
            if (_inputData._rightController.TryGetFeatureValue(CommonUsages.gripButton, out bool rightGripPressed))
            {
                if (rightGripPressed != prevRightGripState)
                {
                    //clientMessage = rightGripPressed ? "RightGrip_ON" : "RightGrip_OFF";

                    clientMessageInt = rightGripPressed ? (byte)(clientMessageInt | (1 << 1)) : (byte)(clientMessageInt & ~(1 << 1));
                    Debug.Log(clientMessageInt);
                    await SendControlInputs();
                    prevRightGripState = rightGripPressed;
                }
            }

            // Right Trigger (Bit 0)
            if (_inputData._rightController.TryGetFeatureValue(CommonUsages.triggerButton, out bool rightTriggerPressed))
            {
                if (rightTriggerPressed != prevRightTriggerState)
                {
                    //clientMessage = rightTriggerPressed ? "RightTrigger_ON" : "RightTrigger_OFF";

                    clientMessageInt = rightTriggerPressed ? (byte)(clientMessageInt | (1 << 0)) : (byte)(clientMessageInt & ~(1 << 0));
                    Debug.Log(clientMessageInt);
                    await SendControlInputs();
                    prevRightTriggerState = rightTriggerPressed;
                }
            }

            if (Input.GetKeyDown(KeyCode.Space))
            {
                clientMessage = "Spacebar being pressed";
                Debug.Log(clientMessage);
                await SendMessage();
            }
        }
    }
    async Task SendMessage()
    {
        byte[] data = Encoding.UTF8.GetBytes(clientMessage);
        await clientWebSocket.SendAsync(new ArraySegment<byte>(data), WebSocketMessageType.Text, true, CancellationToken.None);
    }

    async Task SendControlInputs()
    {
        byte[] controlInputs = new[] { clientMessageInt };
        await clientWebSocket.SendAsync(new ArraySegment<byte>(controlInputs), WebSocketMessageType.Binary, true, CancellationToken.None);
    }

    async void ReceiveMessages()
    {   
        byte[] buffer = new byte[1024];

        while (clientWebSocket.State == WebSocketState.Open)
        {
            try
            {
                // Getting data from WebSocket
                var flightDataResults = await clientWebSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                string flightDataMessage = Encoding.UTF8.GetString(buffer, 0, flightDataResults.Count);

                // Reading JSON file
                Debug.Log($"Received flight data: {flightDataMessage}");
                var flightData = JsonUtility.FromJson<FlightData>(flightDataMessage);

                //Testing to see if it's JSON format
                //Debug.Log(flightData);
                /*
                 Debug.Log($"Temp in string: {flightData.temperature}");
                 Debug.Log($"STemp in string: {flightData.stemp}");
                 Debug.Log($"Pressure in string: {flightData.pressure}");

                 Debug.Log($"Pitch in string: {flightData.pitch}");
                 Debug.Log($"Roll in string: {flightData.roll}");
                 Debug.Log($"Yaw in string: {flightData.yaw}");

                 Debug.Log($"Lat in string: {flightData.latitude}");
                 Debug.Log($"Lon in string: {flightData.longitude}");
                */

                flightData.temperature = (int)flightData.temperature;

                // Outside measurements
                tempText.text = flightData.temperature.ToString();
                stempText.text = flightData.stemp.ToString("0.0");
                pressureText.text = flightData.pressure.ToString();

                // Drone's rotation
                pitchText.text = flightData.pitch.ToString("0.00");
                rollText.text = flightData.roll.ToString("0.00");
                yawText.text = flightData.yaw.ToString("0.00");

                // Coords
                latText.text = flightData.latitude.ToString();
                lonText.text = flightData.longitude.ToString();

                // Calculating drone speed to display
                var acV = Math.Sqrt(Math.Pow(flightData.accel.x, 2) + Math.Pow(flightData.accel.y, 2));
                var newVel = Math.Abs(velocity + (acV * 2));
                var droneSpeed = Math.Round(newVel, 0, MidpointRounding.AwayFromZero);
                speedText.text = droneSpeed.ToString();
            }
            catch (Exception e)
            {
                Debug.LogError($"Error message: {e}");
            }
        }
    }

    async void OnApplicationQuit()
    {
        await clientWebSocket.CloseOutputAsync(WebSocketCloseStatus.NormalClosure, "WebSocket closed normally.", CancellationToken.None);
    }

    [Serializable]
    public class FlightData
    {
       public AccelData accel; // Acc, do accl.x and accl.y for both axis
       public float temperature; // Outside temp
       public float stemp; // System temp
       public float pressure; // Outside baro
       public float latitude; // Drone's lat
       public float longitude; // Drone's lon
       public float pitch;
       public float yaw;
       public float roll;
    }

    public FlightData allData = new FlightData();

    [Serializable]
    public class AccelData
    {
        public float x;
        public float y;
    }
}