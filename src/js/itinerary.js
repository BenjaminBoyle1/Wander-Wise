import { includeHTML } from './include.js';

includeHTML("/partials/header.html", "header");
includeHTML("/partials/footer.html", "footer");

const tripSelect = document.getElementById("trip-select");
const itineraryWrapper = document.getElementById("grouped-itinerary");
const addBtn = document.getElementById("add-itinerary-btn");
const dateInput = document.getElementById("itinerary-date");
const activityInput = document.getElementById("itinerary-activity");
const startTimeInput = document.getElementById("start-time");
const endTimeInput = document.getElementById("end-time");
const exportBtn = document.getElementById("export-btn");

const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;


let selectedTripIndex = null;

function loadTripsToDropdown() {
  const trips = JSON.parse(localStorage.getItem("trips")) || [];

  tripSelect.innerHTML = '<option value="">-- Choose a Trip --</option>';

  trips.forEach((trip, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = trip.name;
    tripSelect.appendChild(option);
  });
}

function groupByDate(itinerary) {
  return itinerary.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});
}

async function loadItinerary(index) {
  const trips = JSON.parse(localStorage.getItem("trips")) || [];
  const trip = trips[index];

  itineraryWrapper.innerHTML = "";

  if (!trip || !trip.itinerary) return;

  // Sort by date/time
  trip.itinerary.sort((a, b) => new Date(`${a.date} ${a.startTime}`) - new Date(`${b.date} ${b.startTime}`));

  const grouped = groupByDate(trip.itinerary);
  const weatherData = trip.weather || {};

  Object.entries(grouped).forEach(([date, activities], groupIndex) => {
    const section = document.createElement("section");
    section.classList.add("itinerary-day-group");

    const forecast = weatherData[date];
    const weatherLine = forecast ? `<small>🌤 ${forecast.description}, ${forecast.temp}°C</small>` : "";

    section.innerHTML = `
      <h3>📅 Day ${groupIndex + 1} — ${formatDate(date)} ${weatherLine}</h3>
      <ul class="itinerary-group-list"></ul>
    `;

    const ul = section.querySelector("ul");

    activities.forEach((item, i) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${item.startTime}–${item.endTime} → ${item.activity}</span>
        <button class="btn btn-sm danger" data-index="${i}" data-date="${date}">Remove</button>
      `;
      ul.appendChild(li);
    });

    itineraryWrapper.appendChild(section);
  });

  // 🗑️ Remove handler
  document.querySelectorAll("button[data-date]").forEach(button => {
    button.addEventListener("click", () => {
      const trips = JSON.parse(localStorage.getItem("trips")) || [];
      const trip = trips[selectedTripIndex];
      const { date, index } = button.dataset;

      trip.itinerary = trip.itinerary.filter(
        (item, i) => !(item.date === date && i === parseInt(index))
      );

      localStorage.setItem("trips", JSON.stringify(trips));
      loadItinerary(selectedTripIndex);
    });
  });
}

function addToItinerary() {
  const date = dateInput.value;
  const activity = activityInput.value.trim();
  const start = startTimeInput.value;
  const end = endTimeInput.value;

  if (!date || !activity || !start || !end || selectedTripIndex === null) return;

  const trips = JSON.parse(localStorage.getItem("trips")) || [];
  const trip = trips[selectedTripIndex];

  if (!trip.itinerary) trip.itinerary = [];

  trip.itinerary.push({ date, activity, startTime: start, endTime: end });
  localStorage.setItem("trips", JSON.stringify(trips));

  dateInput.value = "";
  activityInput.value = "";
  startTimeInput.value = "";
  endTimeInput.value = "";
  loadItinerary(selectedTripIndex);
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function exportItinerary() {
  const trips = JSON.parse(localStorage.getItem("trips")) || [];
  const trip = trips[selectedTripIndex];
  if (!trip || !trip.itinerary) return;

  let content = `📅 Itinerary for ${trip.name}\n\n`;
  const grouped = groupByDate(trip.itinerary);
  const sortedDates = Object.keys(grouped).sort();

  sortedDates.forEach((date, i) => {
    content += `\nDay ${i + 1} — ${formatDate(date)}\n`;
    grouped[date].forEach(item => {
      content += `• ${item.startTime}–${item.endTime} — ${item.activity}\n`;
    });
  });

  const newWindow = window.open("", "_blank");
  newWindow.document.write(`<pre>${content}</pre>`);
  newWindow.document.title = `Itinerary - ${trip.name}`;
}

// 🔥 Weather forecast (by day)
async function fetchWeatherForecast(coords) {
  const { lat, lng } = coords;
  const cacheKey = `weather-${lat.toFixed(2)}-${lng.toFixed(2)}`;
  const cached = localStorage.getItem(cacheKey);
  const now = Date.now();

  if (cached) {
    const parsed = JSON.parse(cached);
    if (now - parsed.timestamp < 3 * 60 * 60 * 1000) return parsed.data;
  }

  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=metric`;
  const res = await fetch(url);
  const json = await res.json();

  const daily = {};

  json.list.forEach(entry => {
    const date = entry.dt_txt.split(" ")[0];
    if (!daily[date]) {
      daily[date] = {
        temp: Math.round(entry.main.temp),
        description: entry.weather[0].description
      };
    }
  });

  localStorage.setItem(cacheKey, JSON.stringify({ timestamp: now, data: daily }));
  return daily;
}

tripSelect.addEventListener("change", (e) => {
  selectedTripIndex = parseInt(e.target.value);
  loadItinerary(selectedTripIndex);
});

addBtn.addEventListener("click", addToItinerary);
exportBtn.addEventListener("click", exportItinerary);

loadTripsToDropdown();
