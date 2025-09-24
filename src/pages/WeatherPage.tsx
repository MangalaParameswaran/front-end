import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { getAuth } from "../utils/storage";
import { getweather, saveWeather, getSavedWeather, deleteSavedWeather, } from "../api/weather";
import { Spin } from "antd";
import { FaStar } from "react-icons/fa";
import { toast } from 'react-toastify';
import { createWeather, getUserWeather, deleteWeather } from '../interfaces/weather'

const WeatherPage = ({ setIsAuthenticated }: any) => {
  const { userId } = getAuth();
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<any[]>([]);

  const fetchSaved = async () => {
    try {
      setLoading(true);
      if (!userId) return;
      const res = await getSavedWeather(userId);
      const savedItems = res.data.map((w: getUserWeather) => ({ ...w, isSaved: true }));
      console.log('------d', savedItems);

      setWeatherData(savedItems);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Search weather
  const handleSearch = async () => {
    try {
      setLoading(true);
      if (!country) return;
      const exists = weatherData.find((w) => (w.name).toLowerCase() === (country).toLowerCase());
      if (exists) {
        return toast.error(`Weather for country ${exists.name} already exist`);
      } else {
        const res = await getweather(country);
        console.log('exist------', !!exists, exists);
        // Prevent duplicate items
        const newItem = {
          idWeather: res.cca3,
          name: res.name.common,
          temperature: res.temperature,
          windSpeed: res.windspeed,
          time: res.time,
          flags: res.flags,
          capital: res.capital?.[0] || "",
          latitude: res.latlng?.[0] || "",
          longitude: res.latlng?.[1] || "",
          population: res.population,
          isSaved: false
        };
        setWeatherData((prev) => [...prev, newItem]);
      }

      setCountry("");
    } catch (err) {
      console.error(err);
      toast.error("Country not found.");
    } finally {
      setLoading(false);
    }
  };

  // save / remove
  const toggleSave = async (weather: any) => {
    try {
      setLoading(true);
      if (!userId) {
        toast.error("User ID not exist");
        return;
      }
      const plan_price = Number(sessionStorage.getItem('plan_price'));
      const savedCount = await weatherData.filter((w) => w.isSaved).length;

      console.log('prixe------', plan_price, savedCount, weather.isSaved, plan_price === 2 && savedCount >= 2 && !weather.isSaved, savedCount >= 2);

      if (plan_price === 2 && savedCount >= 2 && !weather.isSaved) {
        return toast.error("Save up to 2 weather items for the monthly subscription");
      }
      if (weather.isSaved) {
        const data: deleteWeather = { userId, countryId: weather.id };
        const result = await deleteSavedWeather(data);
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
        let data: createWeather = {
          userId: userId,
          name: weather.name,
          latitude: weather.latitude,
          longitude: weather.longitude,
          flags: weather.flags,
          capital: weather.capital,
          population: Number(weather.population)
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
      toast.error("Failed to update saved weather.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, [userId]);

  return (
    <div>
      <Navbar setIsAuthenticated={setIsAuthenticated} />
      <div className="container mt-4">
        {/* Search */}
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by country..."
            value={country}
            disabled={loading} 
            onChange={(e) => setCountry(e.target.value)}
          />
          <button className="btn btn-primary" style={{cursor:"pointer"}} onClick={handleSearch} disabled={loading || !country} >
            Search
          </button>
        </div>

        {/* Weather cards */}
        {
          loading ? (
            <div style={{ textAlign: "center", marginTop: "10em" , zIndex: -1}}>
              <Spin size="large" tip="Loading weather data..." />
            </div>
          ) : (
            <div className="row mt-4" >
              {weatherData.map((w) => (
                <div className="col-md-4 mb-3" key={w.idWeather}>
                  <div className="card text-center shadow-sm shadow-lg weather-card" style={{ display: "flex", alignItems: 'center', cursor: "pointer", height: "auto" }}>
                    <img src={w.flags.png} className="card-img-top" alt={`${w.flags.alt} flag`} style={{ width: "20vw", height: "30vh", padding: "1em 0", borderRadius: "1.3em"  }} />
                    <div className="card-header">
                      <h5 className="card-title">
                        {w.name} <FaStar size={25} color={w.isSaved ? "gold" : "gray"} style={{ cursor: "pointer", margin: "0em 0em 5px 0em" }} onClick={() => toggleSave(w)} />
                      </h5>
                    </div>
                    <div className="card-body">
                      <p style={{ display: "flex"}}><span style={{justifyItems: "flext-start", fontWeight: "bold"}}>🌡 Temp:</span> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {w.temperature}°C</p>
                      <p style={{ display: "flex"}}><span style={{justifyItems: "flext-start", fontWeight: "bold"}}>💨 Wind: </span> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;{w.windSpeed} km/h</p>
                      <p style={{ display: "flex"}}><span style={{justifyItems: "flext-start", fontWeight: "bold"}}>⏰ Time:</span> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {w.time}</p>
                      <p style={{ display: "flex"}}><span style={{justifyItems: "flext-start", fontWeight: "bold"}}>🏙 Capital: </span> &nbsp; &nbsp; &nbsp; &nbsp;{w.capital}</p>
                      <p style={{ display: "flex"}}><span style={{justifyItems: "flext-start", fontWeight: "bold"}}>👨‍👩‍👧‍👦 Population:</span> &nbsp; {w.population}</p>
                      <p style={{ display: "flex"}}><span style={{justifyItems: "flext-start", fontWeight: "bold"}}>📍 Lat:</span> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  {w.latitude}, Lng: {w.longitude}</p>
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
