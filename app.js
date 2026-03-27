const API_KEY = "YOUR_API_KEY_HERE"; // Replace with your OpenWeatherMap API key

// WeatherApp Constructor
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

// Initialize app
WeatherApp.prototype.init = function() {
  this.searchBtn.addEventListener("click", this.handleSearch.bind(this));
  this.showWelcome();
};

// Welcome message
WeatherApp.prototype.showWelcome = function() {
  this.cityNameEl.textContent = "Welcome to SkyFetch!";
  this.descriptionEl.textContent = "Search for a city to see the weather.";
  this.weatherEl.classList.remove("hidden");
};

// Handle search
WeatherApp.prototype.handleSearch = function() {
  const city = this.cityInput.value.trim();
  if (city) {
    this.getWeather(city);
  }
};

// Show loading
WeatherApp.prototype.showLoading = function() {
  this.loadingEl.classList.remove("hidden");
  this.errorEl.classList.add("hidden");
  this.weatherEl.classList.add("hidden");
  this.forecastEl.classList.add("hidden");
};

// Show error
WeatherApp.prototype.showError = function(msg) {
  this.loadingEl.classList.add("hidden");
  this.errorEl.textContent = msg;
  this.errorEl.classList.remove("hidden");
};

// Fetch weather and forecast
WeatherApp.prototype.getWeather = async function(city) {
  this.showLoading();

  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

  try {
    // Use Axios for API calls
    const [weatherRes, forecastRes] = await Promise.all([
      axios.get(weatherURL),
      axios.get(forecastURL)
    ]);

    this.displayWeather(weatherRes.data);
    this.displayForecast(this.processForecastData(forecastRes.data));

  } catch (err) {
    this.showError(err.response?.data?.message || "City not found");
  }
};

// Display current weather
WeatherApp.prototype.displayWeather = function(data) {
  this.loadingEl.classList.add("hidden");
  this.weatherEl.classList.remove("hidden");

  this.cityNameEl.textContent = data.name;
  this.descriptionEl.textContent = data.weather[0].description;
  this.tempEl.textContent = `${data.main.temp} °C`;
  this.iconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
};

// Process forecast (5 days)
WeatherApp.prototype.processForecastData = function(data) {
  const daily = data.list.filter(item => item.dt_txt.includes("12:00:00"));
  return daily.slice(0, 5);
};

// Display forecast cards
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