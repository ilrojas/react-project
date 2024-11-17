import { useState } from "react"

export const WeatherInput = ({changeCountry}) => {
    const [country, setCountry] = useState('')
    const upadateCountryData = (e) => {
        const value = e.target.value
        if(value != ''){
            setCountry(value)
        }
        
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        changeCountry(country)
    }
  return (
    <form onSubmit={handleSubmit}>
        <a href="https://www.weatherapi.com/" title="Free Weather API"><img src='https://cdn.weatherapi.com/v4/images/weatherapi_logo.png' alt="Weather data by WeatherAPI.com" border="0"/></a>
        
                <span>Filter </span><input type="text" id="country_weather" onChange={upadateCountryData} placeholder="Type a country"/>
            
    </form>
    
  )
}
