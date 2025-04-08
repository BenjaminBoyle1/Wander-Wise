import { includeHTML } from './include.js';

includeHTML("/partials/header.html", "header");
includeHTML("/partials/footer.html", "footer");

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

let map;
let markers = [];
let selectedLatLng = null;
let geocoder;
let fullAddress = "";

// DOM refs
const tripList = document.getElementById("trip-list");
const form = document.getElementById("trip-form");
const tripInput = document.getElementById("trip-title");
const saveBtn = document.getElementById("save-trip-btn");
const floatingBtn = document.getElementById("floating-add-trip");

// 🧠 Load Google Maps dynamically using API key from .env
function loadGoogleMaps() {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) return resolve();

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=marker`;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;

    document.head.appendChild(script);
  });
}

// ✅ Main init
window.addEventListener("load", async () => {
  await loadGoogleMaps();
  initMap();
});

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 20.0, lng: 0.0 },
    zoom: 2
  });

  geocoder = new google.maps.Geocoder();

  map.addListener("click", (e) => {
    selectedLatLng = e.latLng;
    form.style.display = "block";
    tripInput.value = "Loading location name...";
    fullAddress = "";

    geocoder.geocode({ location: selectedLatLng }, (results, status) => {
      if (status === "OK" && results[0]) {
        const components = results[0].address_components;
        let city = "";
        let state = "";
        let country = "";

        components.forEach(comp => {
          if (comp.types.includes("locality")) city = comp.long_name;
          if (comp.types.includes("administrative_area_level_1")) state = comp.short_name;
          if (comp.types.includes("country")) country = comp.long_name;
        });

        const locationName = [city, state || country].filter(Boolean).join(", ");
        tripInput.value = locationName || results[0].formatted_address;
        fullAddress = results[0].formatted_address;
      } else {
        tripInput.value = "";
        fullAddress = "";
      }
    });
  });

  loadTrips();
}

// ➕ Floating Add Trip
floatingBtn.addEventListener("click", () => {
  selectedLatLng = null;
  tripInput.value = "";
  fullAddress = "";
  form.style.display = "block";
  tripInput.focus();
});

// 💾 Save trip to localStorage
saveBtn.addEventListener("click", () => {
  const name = tripInput.value.trim();
  if (!name) return;

  const coords = selectedLatLng
    ? { lat: selectedLatLng.lat(), lng: selectedLatLng.lng() }
    : { lat: 0, lng: 0 };

  const trips = JSON.parse(localStorage.getItem("trips")) || [];
  trips.push({ name, coords, fullAddress });
  localStorage.setItem("trips", JSON.stringify(trips));

  tripInput.value = "";
  fullAddress = "";
  form.style.display = "none";
  loadTrips();
});

// 📍 Marker with AdvancedMarkerElement
function addMarker(trip) {
  const { AdvancedMarkerElement } = google.maps.marker;

  const pin = document.createElement("div");
  pin.className = "advanced-marker";
  pin.textContent = trip.name;

  const marker = new AdvancedMarkerElement({
    map,
    position: trip.coords,
    content: pin
  });

  markers.push(marker);
}

function clearMarkers() {
  markers.forEach(marker => marker.map = null);
  markers = [];
}

// 🗂 Load trips from localStorage
function loadTrips() {
  const trips = JSON.parse(localStorage.getItem("trips")) || [];
  tripList.innerHTML = "";
  clearMarkers();

  trips.forEach((trip, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>📍 ${trip.name}</span>
      <button class="btn btn-sm danger" data-index="${index}">Remove</button>
    `;
    tripList.appendChild(li);
    addMarker(trip);
  });

  // 🗑 Remove trip
  tripList.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
      const index = parseInt(button.getAttribute("data-index"));
      const trips = JSON.parse(localStorage.getItem("trips")) || [];
      trips.splice(index, 1);
      localStorage.setItem("trips", JSON.stringify(trips));
      loadTrips();
    });
  });
}
