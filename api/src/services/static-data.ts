//import { db } from '../db.js';
import { db, redis } from './repository';


export async function listRoutes() {
  //return JSON.parse(await redis.get('routes'));
  return await db.all('SELECT * FROM routes');
}


export async function findShapes(routeId: string) {
  const statement = await db.prepare(`
    WITH my_trips AS (
      SELECT *
      FROM trips
      WHERE route_id = ?
      GROUP BY shape_id
    )
    SELECT
      shapes.shape_id,
      group_concat(shapes.shape_pt_lat) as shape_pt_lat,
      group_concat(shapes.shape_pt_lon) as shape_pt_lon,
      group_concat(shapes.shape_dist_traveled) as shape_dist_traveled
    FROM my_trips
    JOIN shapes ON shapes.shape_id = my_trips.shape_id
    GROUP BY shapes.shape_id
    ORDER BY service_id ASC, shape_pt_sequence ASC
  `);
  const shapes = await statement.all([routeId]);

  return shapes.map(shape => {
    const shape_pt_lon = shape.shape_pt_lon.split(',');
    const shape_pt_lat = shape.shape_pt_lat.split(',');
    return ({
      type: 'Feature',
      id: shape.shape_id,
      geometry: {
        type: 'LineString',
        coordinates: shape_pt_lon.map((lon, i) => [Number(lon), Number(shape_pt_lat[i])]),
      },
      properties: {
        shape_dist_traveled: shape.shape_dist_traveled.split(',').map(dist => Number(dist)),
      }
    });
  })
}
