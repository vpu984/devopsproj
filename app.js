const express = require('express');
const promClient = require('prom-client');

const app = express();
const port = process.env.PORT || 3000;

// Prometheus metrics
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics();

const counter = new promClient.Counter({
  name: 'hello_requests_total',
  help: 'Total hello requests'
});

app.get('/hello', (req, res) => {
  counter.inc();
  res.json({ msg: 'Hello from microservice', time: new Date().toISOString() });
});

// Prometheus scrape endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

app.listen(port, () => console.log(`App listening on ${port}`));
