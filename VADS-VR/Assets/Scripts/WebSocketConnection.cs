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

[RequireComponent(typeof(InputData))]
public class NewMonoBehaviourScript : MonoBehaviour
{
    private ClientWebSocket clientWebSocket;
    private InputData _inputData;
    private string clientMessage = "";

    private bool prevLeftGripState = false;
    private bool prevRightTriggerState = false;

    private float velocity = 0;

    public TextMeshProUGUI speedText;
    public TextMeshProUGUI altitudeText;
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

    async void Update()
    {
        if (clientWebSocket.State == WebSocketState.Open)
        {
            if (_inputData._leftController.TryGetFeatureValue(CommonUsages.gripButton, out bool leftGripPressed))
            {
                if (leftGripPressed != prevLeftGripState)
                {
                    clientMessage = leftGripPressed ? "LeftGrip_ON" : "LeftGrip_OFF";
                    await SendMessage();
                    prevLeftGripState = leftGripPressed;
                }
            }

            if (_inputData._rightController.TryGetFeatureValue(CommonUsages.triggerButton, out bool rightTriggerPressed))
            {
                if (rightTriggerPressed != prevRightTriggerState)
                {
                    clientMessage = rightTriggerPressed ? "RightTrigger_ON" : "RightTrigger_OFF";
                    await SendMessage();
                    prevRightTriggerState = rightTriggerPressed;
                }
            }
        }
    }
    async Task SendMessage()
    {
        byte[] data = Encoding.UTF8.GetBytes(clientMessage);
        await clientWebSocket.SendAsync(new ArraySegment<byte>(data), WebSocketMessageType.Text, true, CancellationToken.None);
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

                // Calculating drone speed
                var acV = Math.Sqrt(Math.Pow(flightData.ax, 2) + Math.Pow(flightData.ay, 2));
                var newVel = Math.Abs(velocity + (acV * 2));
                var droneSpeed = Math.Round(newVel, 0, MidpointRounding.AwayFromZero);

                // Testing JSON data
                //Debug.Log($"Acc X: {flightData.ax}, Acc Y: {flightData.ay}");
                Debug.Log($"Drone Speed: {droneSpeed}");
                speedText.text = droneSpeed.ToString();

                Debug.Log($"Temp: {flightData.temperature}");
                Debug.Log($"Current IP: {flightData.currentIP}");
            }
            catch (Exception e)
            {
                Debug.LogError($"Error message: {e}");
            }
        }
    }

    [Serializable]
    public class FlightData
    {
        public float ax; // Acc on x-axis
        public float ay; // Acc on y-axis
        public float temperature; // Outside temp
        public string currentIP; // Current R-4B Pi Address
    }
}