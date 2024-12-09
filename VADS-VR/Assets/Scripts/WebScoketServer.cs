using System.Net;
using WebSocketSharp.Server;
using UnityEngine;

public class WebScoketServer : MonoBehaviour
{
    private WebSocketServer _server;

    void Start()
    {
        string localIPAddress = GetLocalIPAddress();

        if (string.IsNullOrEmpty(localIPAddress))
        {
            Debug.LogError("Local IP address not found");
            return;
        }

        _server = new WebSocketServer($"ws://{localIPAddress}");
        _server.AddWebSocketService<MessageBehavior>("/");
        _server.Start();

        Debug.Log($"WebSocket hosted at: ws://{localIPAddress}");
    }

    void OnApplicationQuit()
    {
        if (_server != null && _server.IsListening)
        {
            _server.Stop();
            _server = null;
        }
    }

    public class MessageBehavior : WebSocketBehavior
    {
        protected override void OnMessage(WebSocketSharp.MessageEventArgs e)
        {
            Debug.Log("Message received: " + e.Data);
        }
    }

    private string GetLocalIPAddress()
    {
        try
        {
            foreach (var ip in Dns.GetHostAddresses(Dns.GetHostName()))
            {
                if (ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
                {
                    return ip.ToString();
                }
            }
        }
        catch (System.Exception ex)
        {
            Debug.LogError($"Error getting local IP address: {ex.Message}");
        }
        return null;
    }
}
