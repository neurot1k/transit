import Fastify from 'fastify';
import * as stationsController from './controllers/stations.controller.js';


const app = Fastify({
  logger: true
})

// Declare a route
app.get('/api/delta/routes/', stationsController.findAllStations);

// Run the server!
try {
  await app.listen({ port: 3333 })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}