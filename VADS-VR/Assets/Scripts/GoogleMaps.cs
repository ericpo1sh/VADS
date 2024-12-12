using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Networking;
using System;

public class GoogleMaps : MonoBehaviour
{
    private NewMonoBehaviourScript flightDataScript;

    public string apiKey;
    public float lat = -95.9928f;
    public float lon = 36.1540f;
    public int zoom = 16;

    public enum resolution { low = 1, high = 2 };
    public resolution mapRes = resolution.high;

    public enum type { roadMap, satellite, gybrid, terrain };
    public type mapType = type.roadMap;
    private string url = "";
    private int mapWidth = 1920;
    private int mapHeight = 1080;
    private bool mapLoading = false;
    private Rect rect;

    private string apiKeyLast;
    private float latLast = -95.9928f;
    private float lonLast = 36.1540f;
    private int zoomLast = 16;
    private resolution mapResLast = resolution.high;
    private type mapTypeLast = type.roadMap;
    private bool updateMap = true;

    void Start()
    {
        flightDataScript = GetComponent<NewMonoBehaviourScript>();
        flightDataScript.allData.latitude = lat;
        flightDataScript.allData.longitude = lon;
        StartCoroutine(GetGoogleMaps());
        rect = gameObject.GetComponent<RawImage>().rectTransform.rect;
        mapWidth = (int)Math.Round(rect.width);
        mapHeight = (int)Math.Round(rect.height);
    }

    void Update()
    {
        if (updateMap && (apiKeyLast != apiKey || !Mathf.Approximately(latLast, lat) || !Mathf.Approximately(lonLast, lon) || zoomLast != zoom || mapResLast != mapRes || mapTypeLast != mapType))
        {
            rect = gameObject.GetComponent<RawImage>().rectTransform.rect;
            mapWidth = (int)Math.Round(rect.width);
            mapHeight = (int)Math.Round(rect.height);

            StartCoroutine(GetGoogleMaps());
            updateMap = true;
        }
    }

    IEnumerator GetGoogleMaps()
    {
        url = "https://maps.googleapis.com/maps/api/staticmap?center=" + lat + "," + lon + "&zoom=" + zoom + "&size=" + mapWidth + "x" + mapHeight + "&scale=" + mapRes + "&maptype=" + mapType + "&key=" + apiKey;
        mapLoading = true;
        UnityWebRequest www = UnityWebRequestTexture.GetTexture(url);
        yield return www.SendWebRequest();
        if (www.result != UnityWebRequest.Result.Success)
        {
            Debug.Log("WWW Error: " + www.error);
        }
        else
        {
            mapLoading = false;
            gameObject.GetComponent<RawImage>().texture = ((DownloadHandlerTexture)www.downloadHandler).texture;

            apiKeyLast = apiKey;

            latLast = lat;
            //lat = flightDataScript.allData.latitude;

            lonLast = lon;
            //lon = flightDataScript.allData.longitude;

            zoomLast = zoom;
            mapResLast = mapRes;
            mapTypeLast = mapType;
            updateMap = true;
        }
    }
}
