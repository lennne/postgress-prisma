### Working of Prometheus

Prometheus follows a **pull-based** architecture, which is quite different from most monitoring tools that require the application to "push" data out, Prometheus actively "scrapes" data from designated endpoints.

#### 1. Data Scraping (The Pull Mechanism)

Prometheus retrieves metrics from instrumented jobs at specific intervals (defined in `prometheus.yml` as the `scrape_interval`).

* **Target Discovery:** It identifies "targets" (your microservices) via static configuration or service discovery.
* **Metric Exporters:** Your applications expose a `/metrics` endpoint using a client library (like `prom-client` in Node.js). Prometheus sends an HTTP request to this endpoint to pull the current state of all defined counters, gauges, and histograms.

#### 2. Time-Series Data Storage

Once the data is retrieved, it is stored in a **Time-Series Database (TSDB)**.

* **Storage Format:** Data is stored as a sequence of timestamped values belonging to the same metric and the same set of labeled dimensions.
* **Efficiency:** The TSDB is highly optimized for high-volume ingestion and fast querying over time ranges, using a custom storage format on local disk.

#### 3. Data Querying and Expositon

Prometheus provides a powerful functional query language called **PromQL** (Prometheus Query Language).

* **HTTP API:** It exposes an HTTP API endpoint (usually on port `9090`) that allows external tools like **Grafana** to fetch the stored time-series data for visualization.
* **Real-time Monitoring:** Because data is stored in time-series format, users can query not just the "current" value, but the rate of change or trends over any historical window.


## 🚀 Prometheus Setup Workflow

Monitoring this architecture involves three main steps: **Instrumentation** (in Node.js), **Configuration** (in YAML), and **Orchestration** (in Docker).

### 1. Application Instrumentation

The `prom-client` library is used to expose internal metrics.

**Metric Initialization (`src/server.js`):**

```javascript
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

const httpRequestsCounter = new promClient.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ["method", 'route', 'status']
});
register.registerMetric(httpRequestsCounter);

```

**Tracking Middleware (`src/server.js`):**
The middleware is used to increment the counter every time a response is finished.

```javascript
app.use((req, res, next) => {
    res.on('finish', () => {
        httpRequestsCounter.inc({
            method: req.method,
            route: req.path,
            status: res.statusCode
        });
    });
    next();
});

```

**Metrics Endpoint (`src/server.js`):**

```javascript
app.get('/metrics', async(req, res) => {
     res.set('Content-type', register.contentType);
     res.end(await register.metrics());
});

```

### 2. Prometheus Configuration (`prometheus.yml`)

The config file tells Prometheus where to pull (scrape) the data from. We point it to our API service name defined in Docker Compose.

```yaml
global:
  scrape_interval: 5s # Pull data every 5 seconds

scrape_configs:
  - job_name: express_api
    static_configs:
      - targets: ["express_api:3000"]

```

### 3. Docker Orchestration (`docker-compose.yml`)

Next, add Prometheus as a service and mount our local configuration file into the container.

```yaml
prometheus:
  image: prom/prometheus:latest
  container_name: prometheus
  restart: always
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml
  ports:
    - "9090:9090" 
  command:
    - --config.file=/etc/prometheus/prometheus.yml

```

### 4. Verification Steps

Once the containers are running (`docker-compose up`), verify the connection:

1. **Metric Exposure:** Visit `http://localhost:3000/metrics` to see the raw text metrics.
2. **Target Health:** Visit `http://localhost:9090/targets` in your browser. The `express_api` status should be **UP**.
3. **Visualization:** Use the Prometheus Graph tab to query `http_requests_total` and see your API traffic data in real-time.

---

### Why is this effective:

By using **labels** (method, route, status), we don't just see "traffic" — we see specific insights. For example, you can query exactly how many `POST` requests to `/api/book` resulted in a `500` error.