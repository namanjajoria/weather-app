let city = "chandigarh";
let cityName = document.querySelector("#cityName");
let textField = document.querySelector(".input");
let actualDate = document.querySelector("#date");
let sunrise = document.querySelector("#sunrise");
let sunset = document.querySelector("#sunset");
let max = document.querySelector(".max");
let min = document.querySelector(".min");
let temperature = document.querySelector("#temperature");
let actualStatus = document.querySelector("#status");
let humidity = document.querySelector("#humidity");
let actualWind = document.querySelector("#wind");
let pressure = document.querySelector("#pressure");
let feelsLike = document.querySelector("#feelslike");
let actualVisibility = document.querySelector("#visibility");
let AQ = document.querySelector("#AQ");
let rightPanel = document.querySelector(".right-panel");
let displayBox = document.querySelector(".wow");
let errorStatement = document.querySelector(".h4");

const formatTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDate = (timestamp) => {
  return new Date(timestamp * 1000).toDateString();
};

textField.addEventListener("change", (event) => {
  handleReceive(event.target.value);
});

const handleReceive = (value) => {
  city = value.trim();
};

document.querySelector(".search").addEventListener("click", () => {
  handleSearch();
  textField.value = "";
});

const getWeatherdetails = async () => {
  try {
    displayBox.style.display = "none";
    errorStatement.style.display = "block";
    errorStatement.innerHTML = `Loading <div class="spinner-border text-danger" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                            </div>`;

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=4c8e0bf743203706fb1673fb8e1c7d7b&units=metric`,
    );

    // console.log(response);

    // ERROR HANDLING
    if (!response.ok) {
      errorStatement.innerHTML = "Please Enter Valid City Name!";
      return;
    } else {
      displayBox.style.display = "flex";
      errorStatement.style.display = "none";
    }

    const apiData = await response.json();
    // console.log(apiData);

    const { name, main, sys, weather, wind, visibility, dt, coord } = apiData;

    let lat = coord.lat;
    let lon = coord.lon;

    const secondResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=4c8e0bf743203706fb1673fb8e1c7d7b`,
    );

    const aqData = await secondResponse.json();
    // console.log(aqData);

    // WORKING TO GET AIR QUALITY 
    const { list } = aqData;
    let airQuality = "",
      color = "";
    if (list[0].main.aqi == 1) {
      airQuality = "Good";
      color = "#00e400";
    } else if (list[0].main.aqi == 2) {
      airQuality = "Fair";
      color = "#9cff00";
    } else if (list[0].main.aqi == 3) {
      airQuality = "Moderate";
      color = "#ffff00";
    } else if (list[0].main.aqi == 4) {
      airQuality = "Poor";
      color = "#ff7e00";
    } else {
      airQuality = "Very Poor";
      color = "#ff0000";
    }

    AQ.innerHTML = airQuality;
    AQ.style.color = color;

    const day = dt > sys.sunrise && dt < sys.sunset;
    const weatherCondition = weather[0].main;

    let image = "",
      icon = "";
    if (weatherCondition === "Clear") {
      image = day ? "./images/clear-day.webp" : "./images/clear-night.jpg";
      icon = day
        ? `<i class="fa-solid fa-sun moon-icon"></i>`
        : `<i class="fa-regular fa-moon moon-icon"></i>`;
    } else if (weatherCondition === "Clouds") {
      image = day ? "./images/cloudy-day.avif" : "./images/cloudy-night.jpg";
      icon = day
        ? `<i class="fa-solid fa-cloud-sun moon-icon"></i>`
        : `<i class="fa-solid fa-cloud-moon moon-icon"></i>`;
    } else if (weatherCondition === "Rain") {
      image = day ? "./images/rainy-day.webp" : "./images/rainy-night.webp";
      icon = `<i class="fa-solid fa-cloud-showers-heavy moon-icon"></i>`;
    } else if (weatherCondition === "Snow") {
      image = day ? "./images/snow-day.webp" : "./images/snow-night.jpg";
      icon = `<i class="fa-solid fa-snowflake moon-icon"></i>`;
    } else {
      image = day ? "./images/fog-day.jpg" : "./images/fog-night.jpg";
      icon = `<i class="fa-solid fa-smog"></i>`;
    }
    let leftWeathercard = document.querySelector(".leftWeathercard");
    leftWeathercard.style.backgroundImage = `url(${image})`;

    const getCountryCode = (code) => {
      const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
      return regionNames.of(code);
    };


    // [DISPLAY FORMAT]
    // ================== 5 DAY FORECAST ==================
    // RIGHT PANEL DISPLAY

    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=4c8e0bf743203706fb1673fb8e1c7d7b&units=metric`,
    );

    const forecastData = await forecastResponse.json();
    console.log(forecastData);

    const { list: forecastList } = forecastData;

    const forecastNoon = forecastList.filter((items) => {
      return items.dt_txt.includes("12:00:00");
    });

    console.log(forecastNoon);

    rightPanel.innerHTML = "";

    forecastNoon.forEach((item) => {
      const dayName = new Date(item.dt * 1000).toLocaleDateString("en-US", {
        weekday: "long",
      });

      const condition = item.weather[0].main;

      let fIcon = "";
      let fImage = "";

      if (condition === "Clear") {
        fIcon = `<i class="fa-solid fa-sun"></i>`;
        fImage = "images/clear-day.webp";
      } else if (condition === "Clouds") {
        fIcon = `<i class="fa-solid fa-cloud"></i>`;
        fImage = "images/cloudy-day.avif";
      } else if (condition === "Rain") {
        fIcon = `<i class="fa-solid fa-cloud-showers-heavy"></i>`;
        fImage = "images/rainy-day.webp";
      } else if (condition === "Snow") {
        fIcon = `<i class="fa-solid fa-snowflake"></i>`;
        fImage = "images/snow-day.webp";
      } else {
        fIcon = `<i class="fa-solid fa-smog"></i>`;
        fImage = "images/fog-day.jpg";
      }

      rightPanel.innerHTML += `
                        <div class="row mb-2">
                            <div class="col-11 col-md-11 forecast-col pt-3 pb-3"
                                style="background:url(${fImage});  background-size:cover; border-radius:12px;">

                                <div class="left-box fs-5">
                                    <h5 class="day-heading">${dayName}</h5>
                                    <span class="font-icon">${fIcon}</span>
                                    <h6 class="text-style">${item.weather[0].description}</h6>
                                </div>

                                <div class="right-box">
                                    <span>${Math.trunc(item.main.temp_max)}° / ${Math.trunc(item.main.temp_min)}°</span>
                                </div>

                            </div>
                        </div>`;
    });

    const country = getCountryCode(sys.country);

    // LEFT PANEL DISPLAY
    cityName.innerHTML = `${name}, ${country}`;
    const date = formatDate(dt);
    actualDate.innerHTML = date;
    actualStatus.innerHTML = `${icon} ${weather[0].main}`;
    sunrise.innerHTML = formatTime(sys.sunrise);
    sunset.innerHTML = formatTime(sys.sunset);
    humidity.innerHTML = `${main.humidity}%`;
    actualWind.innerHTML = `${wind.speed} m/s`;
    temperature.innerHTML = `${Math.trunc(main.temp)}&deg;`;
    max.innerHTML = `High: ${Math.trunc(main.temp_max)}&deg;`;
    min.innerHTML = `Low: ${Math.trunc(main.temp_min)}&deg;`;
    feelsLike.innerHTML = `${Math.trunc(main.feels_like)}&deg;`;
    actualVisibility.innerHTML = Math.trunc(visibility / 1000) + " km";
    pressure.innerHTML = `${main.pressure} hPa`;
  } catch (error) {
    console.log(error);
  }
};

function showToast() {
  const toastEl = document.getElementById("liveToast");
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}

const handleSearch = () => {
  console.log(city);
  if (textField.value.trim() === "") {
    showToast();
    return;
  } else {
    getWeatherdetails();
  }
};

window.addEventListener("load", () => {
  getWeatherdetails();
});
