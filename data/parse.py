import os
import csv
import json
import redis
import fiona
from fiona.model import to_dict
from redis import Redis


class Repository:
    def __init__(self):
        self.redis = Redis(host='localhost', port=6379, decode_responses=True)

    def set(self, key, value):
        self.redis.set(key, json.dumps(value))


def parse_static_datafile(datafile_path, on_row=None):
    data = []
    with open(datafile_path, encoding='utf-8-sig') as f:
        reader = csv.DictReader(f, delimiter=',')
        for row in reader:
            if callable(on_row):
                on_row(row)
            data.append(row)
    return data

def store_data(key, value):
    r.set(key, json.dumps(value))


def parse_routes(r):
    data = []
    with open('victoria/static_data/routes.txt', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f, delimiter=',')
        for row in reader:
            row['route_color'] = '#{}'.format(row['route_color'])
            row['route_text_color'] = '#{}'.format(row['route_text_color'])
            data.append(row)
    r.set('routes', json.dumps(data))




def parse_route_shapefiles(r):
    path = os.path.join('victoria', 'wkt_shapefile_routes', 'routes.shp')
    print(path)
    print(os.path.exists(path))
    with fiona.open(path) as shapefile:
        print(shapefile.meta)
        print(len(shapefile))

        for record in shapefile:
        # for i in range(6):
            # record = shapefile[i]
            print(to_dict(record['properties']))
        # for record in shapefile:
        #     print(record)
        #     print(to_dict(record))


if __name__ == '__main__':
    #r = redis.Redis(host='localhost', port=6379, decode_responses=True)
    r = None
    #parse_routes(r)
    #parse_route_shapefiles(r)
    STATIC_DATA = 'victoria/static_data'
    repo = Repository()

    # repo.set('agency', parse_static_datafile(os.path.join(STATIC_DATA, 'agency.txt')))
    # repo.set('calendar_dates', parse_static_datafile(os.path.join(STATIC_DATA, 'calendar_dates.txt')))
    # repo.set('feed_info', parse_static_datafile(os.path.join(STATIC_DATA, 'feed_info.txt')))
    # repo.set('routes', parse_static_datafile(os.path.join(STATIC_DATA, 'routes.txt')))
    # repo.set('shapes', parse_static_datafile(os.path.join(STATIC_DATA, 'shapes.txt')))
    repo.set('stop_times', parse_static_datafile(os.path.join(STATIC_DATA, 'stop_times.txt')))
    # repo.set('stops', parse_static_datafile(os.path.join(STATIC_DATA, 'stops.txt')))
    # repo.set('trips', parse_static_datafile(os.path.join(STATIC_DATA, 'trips.txt')))
