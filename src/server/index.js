const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const postRequest = "./handle";
const GeoNames = "api.geonames.org/postalCodeSearchJSON?";
const darkSky = "api.weatherbit.io/v2.0/current?";
const pixabayAPI = "pixabay.com/api";
const axios = require("axios");
const skyKey = "d7d24ce980754402bd7fef825e612aa2";

app.use(bodyParser.json());
app.use(cors());
app.use(express.static("dist"));
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

// listen port
app.listen(8081, () => {
    console.log("Travel app listening on port 8081!");
});

const fetchgeoNames = async (username, zipOrCity = "11230") => {
    const cityOrPostal = getCityOrPostalCode(zipOrCity);
    const url = `http://${GeoNames}${cityOrPostal}&maxRows=10&username=${username}`;
    return axios.get(url).then((response) => {
        return response.data.postalCodes[0];
    });
};

const getCityOrPostalCode = (zipOrCity) => {
    if (/\d/.test(zipOrCity.value)) {
        return "postalcode=" + zipOrCity;
    } else {
        return "placename=" + zipOrCity;
    }
};

// geoNamesRoute
app.get("/geoNames", (req, res) => {
    const zip = req.query.zip;
    fetchgeoNames(process.env.username, zip).then((response) => {
        res.end(JSON.stringify(response));
    });
});

const _darkSky = async (lat, long, start_date, end_date) => {
    // Check if the date is gone and call the appropriate endpoint.
    try {
        const url = `https://${darkSky}lat=${lat}&lon=${long}&start_date=${start_date}&end_date=${end_date}&key=${skyKey}`;
        return await axios.get(url).then((response) => {
            return response.data;
        });
    } catch (error) {
        console.log(error.response.data.error);
    }
};

// darkSky Route
app.get("/darkSky", (req, res) => {
    // const time = req.query.time;
    const lat = req.query.latitude;
    const long = req.query.longitude;
    const start_date = req.query.start_date;
    const end_date = req.query.end_date;

    _darkSky(lat, long, start_date, end_date).then((response) => {
        res.end(JSON.stringify(response));
    });
});

//Pixabay API
const _pixabay = async (pixabaykey, image) => {
    // data necessary for doing the fetch operation from pixabay api
    const url = `https://${pixabayAPI}/?key=${pixabaykey}&q=${image}`;

    return await axios.get(url).then((response) => {
        if (response.data.totalHits != 0) {
            return response.data.hits[0].largeImageURL;
        } else {
            return { error: "no results" };
        }
    });
};

// Pixabay Route
app.get("/pixabay", (req, res) => {
    const picture = req.query.image;

    _pixabay(process.env.pixabaykey, picture).then((response) => {
        res.end(JSON.stringify(response));
    });
});

module.exports = app;
