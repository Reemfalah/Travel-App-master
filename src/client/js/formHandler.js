const fetchgeoNames = async (zip = "11230") => {
  const url = `http://localhost:8081/geoNames?zip=${zip}`;
  return await fetch(url).then((response) => response.json());
};

const handleNames = async () => {
  const prospectiveLocation = document.getElementById("Destination");

  return await fetchgeoNames(prospectiveLocation.value).then((response) => {
      document.getElementById("latitude").textContent += response.lat;
      document.getElementById("longitude").textContent += response.lng;
      document.getElementById("country").textContent += response.countryCode;
      document.getElementById("placeName").textContent += response.placeName;
  });
};

const fetchSky = async (lat, long, date) => {
  const TempDate = new Date(date);
  var days = ("0" + TempDate.getDate()).slice(-2);
  var month = ("0" + (TempDate.getMonth() + 1)).slice(-2);
  var year = TempDate.getFullYear();
  const start_date = year + "-" + month + "-" + days;
  TempDate.setDate(TempDate.getDate() + 1);
  days = ("0" + TempDate.getDate()).slice(-2);
  const end_date = year + "-" + month + "-" + days;
  const url2 = `http://localhost:8081/darkSky?latitude=${lat}&longitude=${long}&start_date=${start_date}&end_date=${end_date}`;
  return await fetch(url2).then((response) => {
      return response.json();
  });
};

const handleSky = () => {
  const lat = document.getElementById("latitude").textContent;
  const lng = document.getElementById("longitude").textContent;
  const date = document.getElementById("date").value;
  fetchSky(lat, lng, date).then((response) => {
      const sunset = JSON.stringify(response.data[0].sunset);
      const weather_desc = JSON.stringify(response.data[0].weather.description);
      const snow = JSON.stringify(response.data[0].weather.snow);
      document.getElementById("weather").innerHTML = "weather description: " + weather_desc + " sunset: " + sunset + " Snow: ";
      document.getElementById("tripDate").innerHTML += JSON.stringify(response.data[0].ob_time);
      document.getElementById("weather").innerHTML += JSON.stringify(response.data[0].snow);
  });
};

//Pixabay API fetch request
const _fetchPixabay = async (image) => {
  const url3 = `http://localhost:8081/pixabay?image=${image}`;
  return await fetch(url3).then((response) => {
      return response.json();
  });
};

const formHandler = (event) => {
  handleNames().then((response) => {
      handleSky();
      const placeName = document.getElementById("placeName").textContent;
      _fetchPixabay(placeName).then((response) => {
          const image = document.createElement("img");
          image.src = response;
          document.getElementById("image").appendChild(image);
      });
  });
};

export default formHandler;
