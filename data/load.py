import csv
import os
import sqlite3

fields = {
    'agency': [
        'agency_id', 'agency_name', 'agency_url', 'agency_timezone', 'agency_lang', 'agency_phone', 'agency_fare_url',
        'agency_email'
    ],
    'calendar_dates': [
        'service_id', 'date', 'exception_type'
    ],
    'feed_info': [
        'feed_publisher_name', 'feed_publisher_url', 'feed_lang', 'default_lang', 'feed_start_date', 'feed_end_date',
        'feed_version', 'feed_contact_email', 'feed_contact_url'
    ],
    'routes': [
        'route_id', 'agency_id', 'route_short_name', 'route_long_name', 'route_desc', 'route_type', 'route_url',
        'route_color', 'route_text_color', 'route_sort_order', 'continuous_pickup', 'continuous_drop_off', 'network_id'
    ],
    'shapes': [
        'shape_id', 'shape_pt_lat', 'shape_pt_lon', 'shape_pt_sequence', 'shape_dist_traveled'
    ],
    'stop_times': [
        'trip_id', 'arrival_time', 'departure_time', 'stop_id', 'location_group_id', 'location_id', 'stop_sequence',
        'stop_headsign', 'start_pickup_drop_off_window', 'end_pickup_drop_off_window', 'pickup_type', 'drop_off_type',
        'continuous_pickup', 'continuous_drop_off', 'shape_dist_traveled', 'timepoint', 'pickup_booking_rule_id',
        'drop_off_booking_rule_id'
    ],
    'stops': [
        'stop_id', 'stop_code', 'stop_name', 'tts_stop_name', 'stop_desc', 'stop_lat', 'stop_lon', 'zone_id',
        'stop_url', 'location_type', 'parent_station', 'stop_timezone', 'wheelchair_boarding', 'level_id',
        'platform_code'
    ],
    'trips': [
        'route_id', 'service_id', 'trip_id', 'trip_headsign', 'trip_short_name', 'direction_id', 'block_id',
        'shape_id', 'wheelchair_accessible', 'bikes_allowed'
    ],
}


STATIC_DATA_DIRECTORY = 'victoria/static_data'
connection = sqlite3.connect('transit.db')
cursor = connection.cursor()


for filename in os.listdir(STATIC_DATA_DIRECTORY):
    tablename = os.path.splitext(filename)[0]
    filepath = os.path.join(STATIC_DATA_DIRECTORY, filename)
    print(tablename)
    with open(filepath, encoding='utf-8-sig') as f:
        reader = csv.reader(f, delimiter=',')
        header = next(reader)
        missing_fields = set(fields[tablename]) - set(header)

        if len(header) + len(missing_fields) != len(fields[tablename]):
            raise Exception('Unexpected field name in `{}`'.format(tablename))

        print(header)
        print(missing_fields)
        sql = "INSERT INTO {} ({}) VALUES ({})".format(tablename, ','.join(header), ','.join(['?'] * len(header)))
        print(sql)
        cursor.executemany(sql, reader)
        connection.commit()

        # for row in reader:
        #     print(row)
        #     break
        print('---------')

