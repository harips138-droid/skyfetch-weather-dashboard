const apiKey = 'YOUR_API_KEY_HERE'; // Replace with your API key
const city = 'London'; // Hardcoded for Part 1
const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

axios.get(url)
    .then(response => {
        const data = response.data;
        displayWeather(data);
    })
    .catch(error => console.error('Error fetching weather data:', error));

function displayWeather(data) {
    document.getElementById('city').textContent = data.name;
    document.getElementById('temp').textContent = `${data.main.temp} °C`;
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}