const axios = require('axios');
require('dotenv').config();
const geolib = require('geolib');
const mapbox = require('@mapbox/mapbox-sdk/services/directions');

// Replace with your Mapbox access token
const mapboxApiKey = process.env.MAPBOX_API_KEY ?? "n/a";
const accessToken = mapboxApiKey;

// Set up directions client
const directionsClient = mapbox({ accessToken });


const getMap = ('/map', async (req, res) => {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
        return res.status(400).send('Latitude and Longitude are required');
    }
    
    try { 
        const mapboxApiKey = process.env.MAPBOX_API_KEY ?? "n/a";
        const url = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${lat},${lon},14,0/500x500?access_token=${mapboxApiKey}`;
        var response = await axios.get(url, { responseType: 'arraybuffer' });
        response = Buffer.from(response.data, 'binary').toString('base64');
        
        res.send(`<img src="data:image/png;base64,${response}" />`);
    } catch (error) {
        res.status(500).send('Error fetching map' + error);
    }
});


const getRoute = ('/route', async (req, res) => {
    const { start, end } = req.query;
    
    if (!start || !end) {
        return res.status(400).send('Start and End coordinates are required');
    }
    
    try {
        const mapboxApiKey = process.env.MAPBOX_API_KEY ?? "n/a";
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start};${end}?access_token=${mapboxApiKey}&geometries=geojson`;
        var response = await axios.get(url);
        response = response.data.routes[0]
        res.json(response);
    } catch (error) {
        res.status(500).send('Error fetching route ' + error);
    }
});

const navigationAssistant = async (req, res) => {
    const _origin = "6.5244,3.3792";
    var _destination = "9.0765,7.3986"
    const { origin, destination } = req.query;

    const parseCoordinates = (coord) => {
        const [lat, lng] = coord.split(',').map(parseFloat);
        if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
          throw new Error('Invalid coordinates');
        }
        return [lng, lat]; // Mapbox SDK requires [longitude, latitude] format
    };
  
    try {
      const response = await directionsClient.getDirections({
          waypoints: [
            { coordinates: parseCoordinates(origin ?? _origin) },
            { coordinates: parseCoordinates(destination ?? _destination) }
          ],
        profile: 'driving',
        geometries: 'geojson',
      }).send();
      res.json(response.body);
    } catch (err) {
      console.error('Error fetching directions:', err.message);
      res.status(500).json({ error: 'Failed to fetch directions ' + err.message });
    }
};

module.exports = {
    getRoute,
    getMap,
    navigationAssistant,
}