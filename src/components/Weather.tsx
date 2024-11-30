import { useState, useEffect } from "react";
import { WeatherInput } from "./WeatherInput";
import type { WeatherResults, WeatherError } from "../types";
import { PiWarningCircleDuotone } from "react-icons/pi";

/*Forecast API
Forecast weather API method returns, depending upon your price plan level, upto next 14 day weather forecast and weather alert as json or xml. The data is returned as a Forecast Object.


Forecast object contains astronomy data, day weather forecast and hourly interval weather information for a given city.


forecastday: Parent element


forecastday -> day: 'day' element inside forecastday contains max/min temperature, average temperature


forecastday -> astro
forecastday -> hour:


Forecastday	Parent element
forecastday -> day: 'day' element inside forecastday contains max/min temperature, average temperature


forecastday -> astro
forecastday -> hour:


Forecastday	Parent element
forecastday -> day	day element contains:
Max, min and average temperature
Max wind speed
Total precipitation
Day weather condition
forecastday -> astro	astro element contains sunrise, sunset, moonrise, moonphase and moonset data
forecastday -> hour	hour element contains hour by hour weather forecast information
forecastday
Field	Data Type	Description
date	string	Forecast date
date_epoch	int	Forecast date as unix time.
day	element	See day element
astro	element	See astro element
air_quality	element	See aqi element
hour	element	See hour element
day Element
Field	Data Type	Description
maxtemp_c	decimal	Maximum temperature in celsius for the day.
maxtemp_f	decimal	Maximum temperature in fahrenheit for the day
mintemp_c	decimal	Minimum temperature in celsius for the day
mintemp_f	decimal	Minimum temperature in fahrenheit for the day
avgtemp_c	decimal	Average temperature in celsius for the day
avgtemp_f	decimal	Average temperature in fahrenheit for the day
maxwind_mph	decimal	Maximum wind speed in miles per hour
maxwind_kph	decimal	Maximum wind speed in kilometer per hour
totalprecip_mm	decimal	Total precipitation in milimeter
totalprecip_in	decimal	Total precipitation in inches
totalsnow_cm	decimal	Total snowfall in centimeters
avgvis_km	decimal	Average visibility in kilometer
avgvis_miles	decimal	Average visibility in miles
avghumidity	int	Average humidity as percentage
condition:text	string	Weather condition text
condition:icon	string	Weather condition icon
condition:code	int	Weather condition code
uv	decimal	UV Index
daily_will_it_rain	int	1 = Yes 0 = No
Will it will rain or not
daily_will_it_snow	int	1 = Yes 0 = No
Will it snow or not
daily_chance_of_rain	int	Chance of rain as percentage
daily_chance_of_snow	int	Chance of snow as percentage
astro Element
Field	Data Type	Description
sunrise	string	Sunrise time
sunset	string	Sunset time
moonrise	string	Moonrise time
moonset	string	Moonset time
moon_phase	string	Moon phases. Value returned:
New Moon
Waxing Crescent
First Quarter
Waxing Gibbous
Full Moon
Waning Gibbous
Last Quarter
Waning Crescent
moon_illumination	decimal	Moon illumination as %
is_moon_up	int	1 = Yes or 0 =No
Determine if the moon is currently up, based on moon set and moon rise time at the provided location and date.
is_sun_up	int	1 = Yes or 0 =No
Determine if the sun is currently up, based on sunset and sunrise time at the provided location and date.
hour Element
Field	Data Type	Description
time_epoch	int	Time as epoch
time	string	Date and time
temp_c	decimal	Temperature in celsius
temp_f	decimal	Temperature in fahrenheit
condition:text	string	Weather condition text
condition:icon	string	Weather condition icon
condition:code	int	Weather condition code
wind_mph	decimal	Maximum wind speed in miles per hour
wind_kph	decimal	Maximum wind speed in kilometer per hour
wind_degree	int	Wind direction in degrees
wind_dir	string	Wind direction as 16 point compass. e.g.: NSW
pressure_mb	decimal	Pressure in millibars
pressure_in	decimal	Pressure in inches
precip_mm	decimal	Precipitation amount in millimeters
precip_in	decimal	Precipitation amount in inches
snow_cm	decimal	Snowfall in centimeters
humidity	int	Humidity as percentage
cloud	int	Cloud cover as percentage
feelslike_c	decimal	Feels like temperature as celcius
feelslike_f	decimal	Feels like temperature as fahrenheit
windchill_c	decimal	Windchill temperature in celcius
windchill_f	decimal	Windchill temperature in fahrenheit
heatindex_c	decimal	Heat index in celcius
heatindex_f	decimal	Heat index in fahrenheit
dewpoint_c	decimal	Dew point in celcius
dewpoint_f	decimal	Dew point in fahrenheit
will_it_rain	int	1 = Yes 0 = No
Will it will rain or not
will_it_snow	int	1 = Yes 0 = No
Will it snow or not
is_day	int	1 = Yes 0 = No
Whether to show day condition icon or night icon
vis_km	decimal	Visibility in kilometer
vis_miles	decimal	Visibility in miles
chance_of_rain	int	Chance of rain as percentage
chance_of_snow	int	Chance of snow as percentage
gust_mph	decimal	Wind gust in miles per hour
gust_kph	decimal	Wind gust in kilometer per hour
uv	decimal	UV Index
short_rad	decimal	Shortwave solar radiation or Global horizontal irradiation (GHI) W/m²
diff_rad	decimal	Diffuse Horizontal Irradiation (DHI) W/m²
air_quality	element	See aqi element*/

export const Weather = () => {
  const API_KEY = import.meta.env.VITE_API_KEY_WEATHER;
  const URL = import.meta.env.VITE_API_URL_WEATHER;

  const [data, setData] = useState<WeatherResults>(null);
  const [error, setError] = useState<WeatherError>(null);
  const [loading, setLoading] = useState(true);
  const [newcity, setNewCity] = useState("london");

  const classTemp =
    data?.current.temp_c > 20 ? "temp tempHot" : "temp tempCold";

  //const LoadData = (city = 'London') => {
  useEffect(() => {
    if (!newcity) return;
    const abortController = new AbortController();
    setLoading(true);
    fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=b59bc03c02784ce1837231527241511&q=${newcity}&days=7&aqi=no&alerts=no`,
      { signal: abortController.signal }
    ) // Pasar la señal al fetch
      //fetch(`http://api.weatherapi.com/v1/forecast.json?days=7&aqi=no&alerts=no&key=b59bc03c02784ce1837231527241511&q=${newcity}`, { signal: abortController.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
          setError(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          throw new Error(data.error.message);
          setError(data.error.message); // Lanza el mensaje de error dentro de `data`
        }
        setData(data); // Guarda los datos si no hay errores
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => setLoading(false));

    //return () => abortController.abort(); // Abortar la solicitud si el componente se desmonta
  }, [newcity, error]);
  //}

  const changeCountry = (city: string) => {
    setData(null);
    setNewCity(city);
    //LoadData(city)
  };

  return (
    <>
      <h1>Weather</h1>
      {/* {data == null && error && <><h3 className="warnFetch"><PiWarningCircleDuotone />Upsss, we have a problem fetching the data. Refresh de page please.</h3><button onClick={() => setError(null)}>Retry</button></>} */}
      {error && (
        <>
          <h3 className="warnFetch">
            <PiWarningCircleDuotone />
            {error}. Please try again.
          </h3>
          <button
            onClick={() => {
              setError(null);
              setNewCity("london");
            }}
          >
            Retry
          </button>
        </>
      )}

      {loading && (
        <div className="loader">
          <section>
            <span className="item"></span>
            <span className="item"></span>
            <span className="item"></span>
            <span className="item"></span>
            <span className="item"></span>
          </section>
        </div>
      )}
      {/* {data != null  && data.error && <span>{data.error.error.message}</span>} */}
      {data && (
        <>
          {/* {data.error && <span>{data.error.error.message}</span>} */}

          <section className="headerT">
            <div className="filterInput">
              <WeatherInput changeCountry={changeCountry} />
            </div>
            <div>
              <a href="https://www.weatherapi.com/" title="Free Weather API">
                <img
                  src="https://cdn.weatherapi.com/v4/images/weatherapi_logo.png"
                  alt="Weather data by WeatherAPI.com"
                  border="0"
                />
              </a>
            </div>
          </section>
          <section>
            <div className="countryCurrentData">
              <div className="countryInfo">
                <div>{data?.location.name}</div>
                <div>{data?.location.country}</div>
                <div>{data?.location.localtime.split(" ")[1]}</div>
              </div>
              <div>
                <div>
                  <img
                    src={`http:${data?.current.condition.icon}`}
                    width="128px"
                    alt={`${data?.current.condition.text}`}
                  />{" "}
                </div>
                <div>
                  <span>{data?.current.condition.text}</span>
                </div>
                <div className={classTemp}>{data?.current.temp_c}°</div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};
