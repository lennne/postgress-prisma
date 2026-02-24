require('dotenv').config()

const express = require('express');
const app = express();
const promClient = require('prom-client')

const authorRoutes = require('./routes/authorRoutes')
const bookRoutes = require('./routes/bookRoutes')

const PORT = process.env.PORT || 3000;

app.use(express.json())

//intialize prometheus client for monitoring
const register = new promClient.Registry();
promClient.collectDefaultMetrics({register})

//now you can create as many metrics as you desire
const httpRequestsCounter = new promClient.Counter({
    name : 'http_requests_total',
    help : 'Total number of HTTP requests',
    labelNames : ["method", 'route', 'status']
})

//now that the metric has been created we register it
register.registerMetric(httpRequestsCounter); // metric registration on prometheus client

app.use((req, res, next) => {
    res.on('finish', () => {
        httpRequestsCounter.inc({
            method: req.method,
            route: req.path,
            status: res.statusCode
        });
    });

    next();
})

//Expose the /metrics end point for prometheus
app.get('/metrics', async(req, res) => {
     res.set('Content-type', register.contentType);
     res.end(await register.metrics())
})

app.use('/api/author',authorRoutes)
app.use('/api/book',bookRoutes)


app.listen(PORT, () => {
    console.log(`Server is now runnnig on port ${PORT}`)
})