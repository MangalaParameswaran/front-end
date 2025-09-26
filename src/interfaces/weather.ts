export interface deleteWeather {
    userId: string,
    countryId: string
}

export interface createWeather {
    userId: string,
    name: string,
    latitude: number,
    longitude: number,
    flags: Flag,
    capital: string,
    population: Number,
    windSpeed: number
}

export interface getUserWeather extends createWeather {
    temperature: number,
    windspeed: string,
    is_day: number,
    time: string,
    id: string
}

interface Flag {
    svg: string,
    png: string,
    alt: string
}