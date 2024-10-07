async function fetchWeatherData() {
    const city = document.getElementById("cityInput").value.trim();

    if (city === "") {
        document.getElementById("weatherResult").innerHTML = `<p>Please enter a city name</p>`;
        return;
    }

    document.getElementById("weatherResult").innerHTML = `<div class="loader"></div>`;
    document.getElementById("weatherImage").innerHTML = "";
    document.getElementById("forecastData").innerHTML = "";

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_key}&units=metric`;

    try {
     
        const weatherResponse = await fetch(weatherUrl);
        if (!weatherResponse.ok) {
            throw new Error(`City not found: ${weatherResponse.status}`);
        }

        const weatherData = await weatherResponse.json();
        const temperature = weatherData.main.temp;
        const weatherDescription = weatherData.weather[0].description;
        const humidity = weatherData.main.humidity;
        const pressure = weatherData.main.pressure;
        const windSpeed = weatherData.wind.speed;
        const windDirection = weatherData.wind.deg;
        const country = weatherData.sys.country;

      
        document.getElementById("weatherResult").innerHTML = `
            <h2>Weather in ${city}, ${country}</h2>
            <p>Temperature: ${temperature} °C</p>
            <p>Weather: ${weatherDescription}</p>
            <p>Humidity: ${humidity}%</p>
            <p>Pressure: ${pressure} hPa</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
            <p>Wind Direction: ${windDirection}°</p>
        `;

     
        fetchPexelsImage(city);

      
        const forecastResponse = await fetch(forecastUrl);
        if (!forecastResponse.ok) {
            throw new Error(`Forecast data not found: ${forecastResponse.status}`);
        }
        const forecastData = await forecastResponse.json();
        displayForecast(forecastData);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById("weatherResult").innerHTML = `<p>Error: ${error.message}</p>`;
    }
}


const searchBtn = document.getElementById("getWeatherBtn");
searchBtn.addEventListener("click", fetchWeatherData);

async function fetchPexelsImage(city) {
    const pixelUrl = `https://api.pexels.com/v1/search?query=${city}&per_page=1`;
   

    try {
        const response = await fetch(pixelUrl, {
            headers: {
                Authorization: pixelsApi_key,
            },
        });
        if (!response.ok) {
            throw new Error(`Image not found: ${response.status}`);
        }
        const imageData = await response.json();
        if (imageData.photos && imageData.photos.length > 0) {
            const imageUrl = imageData.photos[0].src.original;
            const imgElement = document.createElement("img");
            imgElement.src = imageUrl;
            imgElement.alt = city;
            imgElement.style.display = "block";
            imgElement.style.margin = "0 auto";
            imgElement.style.maxWidth = "100%";
            imgElement.style.height = "auto";
            document.getElementById("weatherImage").appendChild(imgElement);
        } else {
            document.getElementById("weatherImage").innerHTML = `<p>No image available for "${city}"</p>`;
        }
    } catch (error) {
        console.error(`Error fetching image: ${error.message}`);
    }
}

function displayForecast(forecastData) {
    let forecastHTML = "<div>";
    const forecastList = forecastData.list;
    for (let i = 0; i < forecastList.length; i += 8) { 
        const forecast = forecastList[i];
        const dateTime = new Date(forecast.dt * 1000);
        const temp = forecast.main.temp;
        const desc = forecast.weather[0].description;
        forecastHTML += `<p>${dateTime.toLocaleDateString()} - ${temp} °C, ${desc}</p>`;
    }
    forecastHTML += "</div>";
    document.getElementById("forecastData").innerHTML = forecastHTML;
}
