# PV System Server

This is the server for the PV System Output Estimator project.

## Run Locally

A WeatherBit API is required for the application. You can find more about the API [here](https://www.weatherbit.io/). Along with that there are some more environment variables required.

`MONGO_URI`

`JWT_SECRET`

`WEATHER_API_KEY`

`NODEMAILER_USERNAME`

`NODEMAILER_PASSWORD`

Go to the project directory

```bash
  cd dbw-server
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

## Dependencies

- [ExpressJS](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [MongoDB](https://www.mongodb.com/)
- [JWT](https://jwt.io/)
- [Node CRON](https://www.npmjs.com/package/node-cron)
- [Nodemailer](https://nodemailer.com/about/)
