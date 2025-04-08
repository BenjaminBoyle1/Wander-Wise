# 🧭 WanderWise – Smart Travel Planner

**WanderWise** is a full-featured travel planning web app that helps users build trips, manage itineraries, track expenses, and check weather forecasts — all from a clean, modern dashboard.

---

## 🚀 Features

- 🗺️ Interactive Map Interface (Google Maps)
- 📍 Save & manage trips based on real locations
- 📅 Itinerary Builder with day-by-day planning
- 💸 Expense Tracker with total calculator
- 🌦 3-Day Weather Forecasts by city or geolocation
- 🔄 Fahrenheit / Celsius (displayed together)
- 📌 Auto-suggest cities as you type
- 📍 Use My Location to pull weather instantly
- 🕓 Group forecasts into Morning / Afternoon / Evening
- 📦 Recent search memory
- 🔐 Authentication-ready structure (Firebase-compatible)

---

## 📂 Project Structure

```
wanderwise/
├── index.html              # Main dashboard
├── pages/
│   ├── itinerary.html
│   ├── weather.html
│   ├── login.html
│   └── expenses.html
├── public/
│   ├── partials/           # header.html / footer.html
│   ├── images/
│   └── json/
├── src/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── dashboard.js
│       ├── itinerary.js
│       ├── weather.js
│       ├── auth.js
│       └── include.js
├── .env
├── vite.config.js
└── README.md
```

---

## 🔧 Tech Stack

- **Vite** – Lightning-fast dev server & bundler  
- **JavaScript Modules** – Fully separated concerns  
- **Google Maps API** – Location search + pin drop  
- **OpenWeatherMap API** – 3-day forecast  
- **localStorage** – Save trips, itineraries, and searches  
- **Netlify** – Hosting & automatic builds

---

## 📦 Environment Variables

Create a `.env` file in your project root:

```
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_OPENWEATHER_API_KEY=your_openweathermap_api_key
```

> ✅ Make sure to restart your dev server after editing `.env`.

---

## 🧪 Local Development

```
npm install
npm run dev
```

Visit `http://localhost:5173`

---

## 🌐 Deployment

We recommend [Netlify](https://netlify.com) for instant deployment:

1. Connect your GitHub repo  
2. Set build command: `vite build`  
3. Set publish directory: `dist/`  
4. Add your environment variables in **Netlify > Site Settings > Environment**  

Done! 🚀

---

## 🙌 Credits

- UI Design: Custom + [Coolors.co](https://coolors.co/) palette  
- Fonts: [Roboto](https://fonts.google.com/specimen/Roboto), [Open Sans](https://fonts.google.com/specimen/Open+Sans)  
- Icons: Unicode emojis and [OpenWeatherMap](https://openweathermap.org/)

---

## 📝 License

MIT License – free to modify and deploy!
