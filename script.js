window.addEventListener('load', () => {
    function getElement(id) {
        return document.getElementById(id);
    }

    let humidity = getElement('current-humidity'),
        pressure = getElement('current-pressure'),
        temperature = getElement('current-temperature'),
        windSpeed = getElement('current-wind-speed'),
        getWeatherButton = getElement('getWeather'),
        currentLocation = getElement('current-location'),
        cityValue = getElement('city-value'),
        preloader = document.querySelector('.preloader'),
        micro = document.querySelector('#micro'),
        navi = document.querySelector('#navi'),
        main = document.querySelector('main');

    function getWeatherCoordinates() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                getWeatherData(position.coords.latitude, position.coords.longitude);
            })
        } else {
            alert('Could not get current location');
        }
    }
    getWeatherCoordinates()

    function showCurrentLocation() {
        getWeatherCoordinates();
        main.classList.toggle('main-unvisible');
        preloader.classList.toggle('preloader-unvisible');
        cityValue.value = '';
    }

    function getCityValue() {
        if (cityValue.value != '') {
            getWeatherDataByCity(cityValue.value);
            cityValue.style.borderColor = 'seagreen';
        } else {
            cityValue.style.borderColor = 'red';
            return false;
        }
    }

    function pressEnter(e) {
        if (e.keyCode === 13) {
            getCityValue();
        }
    }

    function getWeatherDataByCity(cityName) {
        preloader.classList.toggle('preloader-unvisible');
        main.classList.toggle('main-unvisible');
        returnedAPI(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=014875972702e245570e39f83fe6ab27`);
    }

    function getWeatherData(latitude, longitude) {
        returnedAPI('https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&appid=' + '08d1316ba8742c08076e7425c28c2614');
    }

    function returnedAPI(_api) {
        return fetch(_api)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                displayData(data);
                main.classList.toggle('main-unvisible');
                preloader.classList.toggle('preloader-unvisible');
            })
            .catch(function (error) {
                currentLocation.innerHTML = `'${cityValue.value}' is undefined`;
                cityValue.style.borderColor = 'red';
                main.classList.toggle('main-unvisible');
                preloader.classList.toggle('preloader-unvisible');
                humidity.innerHTML = 'Humidity: --';
                pressure.innerHTML = 'Pressure: --';
                temperature.innerHTML = 'Temperature: --';
                windSpeed.innerHTML = 'Wind speed: --';
                console.error(error);
            })
    }

    function convertTemp(data) {
        return Math.round(data.main.temp - 275.15) + '°C';
    }

    function convertPressure(data) {
        return Math.round(data.main.pressure * 0.75) + 'mm';
    }

    function displayData(data) {
        cityValue.value = '';
        humidity.innerHTML = 'Humidity: ' + data.main.humidity + '%';
        pressure.innerHTML = 'Pressure: ' + convertPressure(data);
        temperature.innerHTML = 'Temperature: ' + convertTemp(data);
        windSpeed.innerHTML = 'Wind speed: ' + data.wind.speed + 'Km/h';
        currentLocation.innerHTML = `Your location is ${data.name}`;
    }

    function speakAsisstant() {
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        let recognation = new SpeechRecognition();
        let result;

        micro.addEventListener('click', function (e) {
            preloader.classList.toggle('preloader-unvisible');
            main.classList.toggle('main-unvisible');
            recognation.start();
        })

        recognation.addEventListener('result', function (e) {
            result = e.results[0][0].transcript;
            cityValue.value = result;
            preloader.classList.toggle('preloader-unvisible');
            main.classList.toggle('main-unvisible');
            getCityValue();
        })
    }
    speakAsisstant();

    document.body.addEventListener('keyup', pressEnter);
    getWeatherButton.addEventListener('click', getCityValue);
    navi.addEventListener('click', showCurrentLocation)
})