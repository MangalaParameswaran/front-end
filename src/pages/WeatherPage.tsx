import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { getAuth } from "../utils/storage";
import { getweather, saveWeather, getSavedWeather, deleteSavedWeather, } from "../api/weather";
import { message, Spin } from "antd";
import { FaStar } from "react-icons/fa";

interface WeatherItem {
  id: string;
  name: string;
  lat: number;
  lng: number;
  time: string;
  isSaved: boolean;
}

const WeatherPage = ({setIsAuthenticated}: any) => {
  const { userId } = getAuth();
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<any[]>([]);

  const fetchSaved = async () => {
    try {
      setLoading(true);
      if (!userId) return;
      const res = await getSavedWeather(userId);
      const savedItems = res.data.map((w: any) => ({ ...w, isSaved: true }));
      console.log('------d', savedItems);

      setWeatherData(savedItems);
    } catch (err) {
      console.error(err);
      // message.error("Failed to load saved weather.");
    } finally {
      setLoading(false);
    }
  };

  // Search weather
  const handleSearch = async () => {
    try {
      setLoading(true);
      if (!country) return;
      const res = await getweather(country);
      // Prevent duplicate items
      const newItem = {
        idWeather: res.cca3,
        name: res.name.common,
        temperature: res.temperature,
        windSpeed: res.windspeed,
        time: res.time,
        flags: res.flags,
        capital: res.capital?.[0] || "",
        region: res.region,
        latitude: res.latlng?.[0] || "",
        longitude: res.latlng?.[1] || "",
        population: res.population,
        isSaved: false
      };

      const exists = weatherData.find((w) => w.id === newItem.idWeather);
      if (!exists) {
        setWeatherData((prev) => [...prev, newItem]);
      }

      setCountry("");
    } catch (err) {
      console.error(err);
      message.error("Country not found.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle save / remove
  const toggleSave = async (weather: any) => {
    try {
      setLoading(true);
      if (!userId) {
        message.error("User ID not exist");
        return;
      }
      const plan_price = Number(sessionStorage.getItem('plan_price'));
      const savedCount = await weatherData.filter((w) => w.isSaved).length;

      console.log('prixe------', plan_price, savedCount, weather.isSaved, plan_price === 2 && savedCount >= 2 && !weather.isSaved, savedCount >= 2);

      if (plan_price === 2 && savedCount >= 2 && !weather.isSaved) {
        return message.error("Save up to 2 weather items for the monthly subscription");
      }
      if (weather.isSaved) {
        const result = await deleteSavedWeather({ userId, countryId: weather.id });
        // let weatherDataUpdated = weatherData.
        if (result.success) {
          setWeatherData((prev) =>
            prev.map((w) => {
              return w.name == weather.name ? { ...w, isSaved: false } : w;
            })
          )
          console.log('resul--del', weatherData);
          // fetchSaved();
        }
      } else {
        let data = {
          userId: userId,
          name: weather.name,
          latitude: weather.latitude,
          longitude: weather.longitude,
          flags: weather.flags
        }
        console.log('data---', data);

        const res = await saveWeather(data);
        console.log('res-------save', res);
        if (res.success) {
          setWeatherData((prev) =>
            prev.map((w) =>
              w.id === weather.id ? { ...w, isSaved: true, id: res.data.id } : w
            )
          );
        }
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to update saved weather.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, [userId]);

  return (
    <div>
      <Navbar  setIsAuthenticated = {setIsAuthenticated}/>
      <div className="container mt-4">
        {/* Search */}
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by country..."
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>

        {/* Weather cards */}
        {
          loading ? (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Spin size="large" tip="Loading weather data..." />
            </div>
          ) : (
            <div className="row" >
              {weatherData.map((w) => (
                <div className="col-md-4 mb-3" key={w.idWeather}>
                  <div className="card text-center shadow-sm shadow-lg weather-card" style={{ display: "flex", alignItems: 'center', cursor: "pointer", height:"auto" }}>
                    <img src={w.flags.png} className="card-img-top" alt={`${w.flags.alt} flag`} style={{ width: "20vw", height: "40vh", padding: "1em 0" }} />
                    <div className="card-header">
                      <h5 className="card-title">
                        {w.name} <FaStar size={25} color={w.isSaved ? "gold" : "gray"} style={{ cursor: "pointer", margin: "0em 0em 5px 0em" }} onClick={() => toggleSave(w)} />
                      </h5>
                    </div>
                    <div className="card-body">
                      <p>🌡 Temp: {w.temperature}°C</p>
                      <p>💨 Wind: {w.windSpeed} km/h</p>
                      <p>⏰ Time: {w.time}</p>
                      <p>🏙 Capital: {w.capital}</p>
                      <p>🌍 Region: {w.region}</p>
                      <p>👨‍👩‍👧‍👦 Population: {w.population}</p>
                      <p>📍 Lat: {w.latitude}, Lng: {w.longitude}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  );
};

export default WeatherPage;
