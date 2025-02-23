let weatherChart = null;

// Function to fetch weather data
async function fetchWeatherData(location = "London") {
    try {
        const currentWeatherResponse = await axios.get(
            `${config.baseUrl}/weather`,
            {
                params: {
                    q: location,
                    appid: config.apiKey,
                    units: config.units,
                },
            }
        );

        const forecastResponse = await axios.get(`${config.baseUrl}/forecast`, {
            params: {
                q: location,
                appid: config.apiKey,
                units: config.units,
            },
        });

        return {
            current: currentWeatherResponse.data,
            forecast: forecastResponse.data,
        };
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
}

// Function to update the weather chart
function updateWeatherChart(forecastData) {
    const ctx = document.getElementById("weatherChart").getContext("2d");

    // Extract data for the chart
    const labels = forecastData.list.slice(0, 8).map((item) => {
        return new Date(item.dt * 1000).toLocaleTimeString("en-US", {
            hour: "numeric",
        });
    });

    const temperatures = forecastData.list
        .slice(0, 8)
        .map((item) => item.main.temp);

    // Destroy existing chart if it exists
    if (weatherChart) {
        weatherChart.destroy();
    }

    // Create new chart
    weatherChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Temperature (°C)",
                    data: temperatures,
                    borderColor: "rgb(59, 130, 246)",
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    tension: 0.4,
                    fill: true,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: "top",
                },
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        display: true,
                        color: "rgba(0, 0, 0, 0.1)",
                    },
                },
                x: {
                    grid: {
                        display: false,
                    },
                },
            },
        },
    });
}

// Function to update current weather display
function updateCurrentWeather(weatherData) {
    document.getElementById("location-name").textContent = weatherData.name;
    document.getElementById("current-temp").textContent = `${Math.round(
        weatherData.main.temp
    )}°C`;
    document.getElementById("weather-desc").textContent =
        weatherData.weather[0].description;
    document.getElementById(
        "humidity"
    ).textContent = `${weatherData.main.humidity}%`;
    document.getElementById(
        "wind-speed"
    ).textContent = `${weatherData.wind.speed} m/s`;
    document.getElementById(
        "pressure"
    ).textContent = `${weatherData.main.pressure} hPa`;

    // Update weather icon
    const iconCode = weatherData.weather[0].icon;
    document.getElementById(
        "weather-icon"
    ).src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

// Function to handle location search
window.searchLocation = async function () {
    const locationInput = document.getElementById("location-input");
    const location = locationInput.value.trim();

    if (location) {
        const weatherData = await fetchWeatherData(location);
        if (weatherData) {
            updateCurrentWeather(weatherData.current);
            updateWeatherChart(weatherData.forecast);
        }
    }
};

// Initial load
document.addEventListener("DOMContentLoaded", async () => {
    const weatherData = await fetchWeatherData();
    if (weatherData) {
        updateCurrentWeather(weatherData.current);
        updateWeatherChart(weatherData.forecast);
    }
});
