import { listRoutes, findShapes } from '../services/static-data';


export async function getRoutes(req, res) {
  const routes = await listRoutes();
  res.send({ routes });
}

export async function getShapes(req, res) {
  const { routeId } = req.params;
  console.log({ routeId })
  const shapes = await findShapes(routeId);
  res.send(shapes);
}

