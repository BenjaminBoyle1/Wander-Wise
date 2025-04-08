import { includeHTML } from './include.js';

includeHTML("/partials/header.html", "header");
includeHTML("/partials/footer.html", "footer");

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const locationInput = document.getElementById("weather-location");
const getBtn = document.getElementById("get-weather-btn");
const useLocationBtn = document.getElementById("use-my-location");
const resultsContainer = document.getElementById("weather-results");
const suggestions = document.getElementById("suggestions");
const recentContainer = document.getElementById("recent-searches");

let selectedCity = '';

getBtn.addEventListener("click", () => {
  if (locationInput.value.trim()) fetchWeather(locationInput.value.trim());
});

locationInput.addEventListener("input", async (e) => {
  const query = e.target.value.trim();
  if (!query) {
    suggestions.innerHTML = '';
    return;
  }

  const res = await fetch(`https://api.openweathermap.org/data/2.5/find?q=${query}&type=like&sort=population&cnt=5&appid=${API_KEY}`);
  const data = await res.json();
  suggestions.innerHTML = '';

  data.list.forEach(city => {
    const li = document.createElement("li");
    li.textContent = `${city.name}, ${city.sys.country}`;
    li.addEventListener("click", () => {
      locationInput.value = li.textContent;
      suggestions.innerHTML = '';
      fetchWeather(li.textContent);
    });
    suggestions.appendChild(li);
  });
});

useLocationBtn.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;
    fetchWeatherByCoords(latitude, longitude);
  });
});

function saveRecentSearch(city) {
  let recent = JSON.parse(localStorage.getItem("recentSearches")) || [];
  recent = recent.filter(c => c !== city);
  recent.unshift(city);
  if (recent.length > 5) recent.pop();
  localStorage.setItem("recentSearches", JSON.stringify(recent));
  renderRecentSearches();
}

function renderRecentSearches() {
  const recent = JSON.parse(localStorage.getItem("recentSearches")) || [];
  recentContainer.innerHTML = '';
  recent.forEach(city => {
    const btn = document.createElement("button");
    btn.className = "btn btn-sm";
    btn.textContent = city;
    btn.addEventListener("click", () => fetchWeather(city));
    recentContainer.appendChild(btn);
  });
}

async function fetchWeather(city) {
  selectedCity = city;
  saveRecentSearch(city);
  resultsContainer.innerHTML = "Loading...";

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
  );
  const data = await res.json();
  if (data.cod !== "200") {
    resultsContainer.innerHTML = `<p class="error">⚠️ City not found</p>`;
    return;
  }

  displayForecast(data.list);
}

async function fetchWeatherByCoords(lat, lon) {
  resultsContainer.innerHTML = "Loading...";
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );
  const data = await res.json();
  if (data.cod !== "200") {
    resultsContainer.innerHTML = `<p class="error">⚠️ Could not retrieve weather</p>`;
    return;
  }

  displayForecast(data.list);
}

function displayForecast(list) {
  const grouped = groupByDay(list).slice(0, 3);
  resultsContainer.innerHTML = '';

  grouped.forEach(([date, items]) => {
    const section = document.createElement("div");
    section.className = "forecast-card";
    section.innerHTML = `<h3>${formatDate(date)}</h3>`;

    const periods = {
      Morning: null,
      Afternoon: null,
      Evening: null
    };

    items.forEach(item => {
      const hour = new Date(item.dt_txt).getHours();
      if (hour >= 6 && hour < 12 && !periods.Morning) periods.Morning = item;
      else if (hour >= 12 && hour < 18 && !periods.Afternoon) periods.Afternoon = item;
      else if (hour >= 18 && hour < 24 && !periods.Evening) periods.Evening = item;
    });

    Object.entries(periods).forEach(([label, item]) => {
      if (item) {
        const tempC = Math.round(item.main.temp);
        const tempF = Math.round(tempC * 9 / 5 + 32);
        const icon = item.weather[0].icon;
        const desc = item.weather[0].description;

        section.innerHTML += `
          <div class="sub-forecast">
            <strong>${label}</strong><br/>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" />
            <p>${tempF}°F / ${tempC}°C</p>
            <small>${desc}</small>
          </div>
        `;
      }
    });

    resultsContainer.appendChild(section);
  });
}


function groupByDay(list) {
  const days = {};
  list.forEach(item => {
    const date = item.dt_txt.split(" ")[0];
    if (!days[date]) days[date] = [];
    days[date].push(item);
  });
  return Object.entries(days);
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

function getTimeLabel(hour) {
  if (hour >= 6 && hour < 12) return "Morning";
  if (hour >= 12 && hour < 18) return "Afternoon";
  if (hour >= 18 && hour < 24) return "Evening";
  return "Overnight";
}

renderRecentSearches();
