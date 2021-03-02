function submitHandler(event) {
  document.getElementById("country").textContent = "";
  document.getElementById("longitude").textContent = "";
  document.getElementById("latitude").textContent = "";
  document.getElementById("placeName").textContent = "";
  document.getElementById("weather").textContent = "";
  document.getElementById("tripDate").textContent = "";
  document.getElementById("image").textContent = "";
  document.getElementById("date").value ="";
  document.getElementById("Destination").value = "";
}

export default submitHandler;
