import nodeCron from 'node-cron';
import ProductModel from '../models/productModel.js';

const cron = async () => {
  console.log('CRON Job enabled');
  nodeCron.schedule('0 4 * * *', async () => {
    const products = await ProductModel.find({ status: 'Active' });

    for (const product of products) {
      const latestWeatherDate =
        product.weatherData[product.weatherData.length - 1].datetime;
      const lat = product.location.coordinates[1];
      const lon = product.location.coordinates[0];
      const start_date = latestWeatherDate
        .toLocaleDateString('en-ZA')
        .toString()
        .replaceAll('/', '-');

      const end_date = new Date()
        .toLocaleDateString('en-ZA')
        .toString()
        .replaceAll('/', '-');

      if (new Date().getDate() > latestWeatherDate.getDate()) {
        // checks if the existing date is less than current date
        const URL = `https://api.weatherbit.io/v2.0/history/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&start_date=${start_date}&end_date=${end_date}`;
        const response = await fetch(URL);
        const data = await response.json();

        if (data.data.some((e) => e.datetime === end_date)) {
          // checks if the API response has the current date data
          const latestWeatherData = data.data[data.data.length - 1];

          product.weatherData.push({
            datetime: latestWeatherData.datetime,
            ghi: latestWeatherData.ghi,
            t_ghi: latestWeatherData.t_ghi,
            max_uv: latestWeatherData.max_uv,
            clouds: latestWeatherData.clouds,
            temp: latestWeatherData.temp,
          });

          product.save();
        }
      }
    }

    console.log('Values updated @ ', new Date().toLocaleString('en-DE'));
  });
};

export default cron;
