const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherDisplay = document.getElementById('weatherDisplay');
const loading = document.getElementById('loading');
const errorDiv = document.getElementById('error');

const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your OpenWeatherMap API key

// Show/hide loading
function showLoading(show) {
  loading.classList.toggle('hidden', !show);
}

// Show error message
function showError(msg) {
  errorDiv.textContent = msg;
  errorDiv.classList.remove('hidden');
}

// Display weather data
function displayWeather(data) {
  errorDiv.classList.add('hidden'); // hide error
  weatherDisplay.innerHTML = `
    <h2>${data.name}</h2>
    <p>${data.main.temp} °C</p>
    <p>${data.weather[0].description}</p>
    <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="icon"/>
  `;
}

// Fetch weather with async/await
async function getWeather(city) {
  if (!city) {
    showError('Please enter a city name!');
    return;
  }

  showLoading(true);
  searchBtn.disabled = true;

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const response = await axios.get(url);
    displayWeather(response.data);
  } catch (err) {
    showError('City not found! Try again.');
    weatherDisplay.innerHTML = '';
  } finally {
    showLoading(false);
    searchBtn.disabled = false;
  }
}

// Event listeners
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  getWeather(city);
  cityInput.value = '';
});

cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchBtn.click();
  }
});

// Initial load (Part 1 feature)
getWeather('London');