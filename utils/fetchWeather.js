const subtractDays = (date, days) => {
  date.setDate(date.getDate() - 31);
  return date;
};

const fetchWeather = async (lat, lon) => {
  try {
    let currentDate = new Date();
    let start_date = subtractDays(currentDate, 5)
      .toLocaleDateString('en-ZA')
      .toString()
      .replaceAll('/', '-');
    let end_date = new Date()
      .toLocaleDateString('en-ZA')
      .toString()
      .replaceAll('/', '-');

    const URL = `https://api.weatherbit.io/v2.0/history/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&start_date=${start_date}&end_date=${end_date}`;
    const response = await fetch(URL);
    const data = await response.json();

    return data.data;
  } catch (error) {
    console.log(error);
  }
};

export default fetchWeather;
