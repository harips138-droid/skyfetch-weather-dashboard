const API_KEY = "YOUR_API_KEY"; // Replace with your OpenWeatherMap API key

function WeatherApp() {
  // DOM elements
  this.cityInput = document.getElementById("cityInput");
  this.searchBtn = document.getElementById("searchBtn");
  this.loadingEl = document.getElementById("loading");
  this.errorEl = document.getElementById("error");
  this.weatherEl = document.getElementById("weather");
  this.cityNameEl = document.getElementById("cityName");
  this.descriptionEl = document.getElementById("description");
  this.tempEl = document.getElementById("temp");
  this.iconEl = document.getElementById("icon");
  this.forecastEl = document.getElementById("forecast");
}

WeatherApp.prototype.init = function() {
  this.searchBtn.addEventListener("click", this.handleSearch.bind(this));
  this.showWelcome();
};

WeatherApp.prototype.showWelcome = function() {
  this.cityNameEl.textContent = "Welcome to SkyFetch!";
  this.descriptionEl.textContent = "Search for a city to see the weather.";
  this.weatherEl.classList.remove("hidden");
};

WeatherApp.prototype.handleSearch = function() {
  const city = this.cityInput.value.trim();
  if (city) {
    this.getWeather(city);
  }
};

WeatherApp.prototype.showLoading = function() {
  this.loadingEl.classList.remove("hidden");
  this.errorEl.classList.add("hidden");
  this.weatherEl.classList.add("hidden");
  this.forecastEl.classList.add("hidden");
};

WeatherApp.prototype.showError = function(msg) {
  this.loadingEl.classList.add("hidden");
  this.errorEl.textContent = msg;
  this.errorEl.classList.remove("hidden");
};

WeatherApp.prototype.getWeather = async function(city) {
  this.showLoading();
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

  try {
    const [weatherRes, forecastRes] = await Promise.all([
      fetch(weatherURL),
      fetch(forecastURL)
    ]);

    if (!weatherRes.ok) throw new Error("City not found");
    if (!forecastRes.ok) throw new Error("Forecast not found");

    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();

    this.displayWeather(weatherData);
    this.displayForecast(this.processForecastData(forecastData));

  } catch (err) {
    this.showError(err.message);
  }
};

WeatherApp.prototype.displayWeather = function(data) {
  this.loadingEl.classList.add("hidden");
  this.weatherEl.classList.remove("hidden");

  this.cityNameEl.textContent = data.name;
  this.descriptionEl.textContent = data.weather[0].description;
  this.tempEl.textContent = `${data.main.temp} °C`;
  this.iconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
};

WeatherApp.prototype.getForecast = async function(city) {
  // Already handled in getWeather via Promise.all
};

WeatherApp.prototype.processForecastData = function(data) {
  // Filter 40 points to 5 days at 12:00
  const daily = data.list.filter(item => item.dt_txt.includes("12:00:00"));
  return daily.slice(0, 5);
};

WeatherApp.prototype.displayForecast = function(forecastArr) {
  this.forecastEl.innerHTML = "";
  this.forecastEl.classList.remove("hidden");

  forecastArr.forEach(day => {
    const date = new Date(day.dt_txt);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

    const card = document.createElement("div");
    card.classList.add("forecast-card");
    card.innerHTML = `
      <h3>${dayName}</h3>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="icon">
      <p>${day.main.temp} °C</p>
      <p>${day.weather[0].description}</p>
    `;
    this.forecastEl.appendChild(card);
  });
};

// Create app instance
const app = new WeatherApp();
app.init();