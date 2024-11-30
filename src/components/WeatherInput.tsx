import { useState } from "react";

export const WeatherInput = ({ changeCountry }) => {
  const [country, setCountry] = useState("");
  const upadateCountryData = (e) => {
    const value = e.target.value;
    if (value != "") {
      setCountry(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    changeCountry(country);
  };
  return (
    <form onSubmit={handleSubmit}>
      <span>Filter </span>
      <input
        type="text"
        id="country_weather"
        onChange={upadateCountryData}
        placeholder="Type a country"
      />
    </form>
  );
};
