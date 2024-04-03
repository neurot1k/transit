import os
import sqlite3


def create_database(filename):
    connection = sqlite3.connect(filename)
    cursor = connection.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS agency (
            agency_id TEXT PRIMARY KEY,
            agency_name TEXT NOT NULL,
            agency_url TEXT NOT NULL,
            agency_timezone TEXT NOT NULL,
            agency_lang TEXT,
            agency_phone TEXT,
            agency_fare_url TEXT,
            agency_email TEXT
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS calendar_dates (
            service_id TEXT NOT NULL,
            date TEXT NOT NULL,
            exception_type TEXT NOT NULL
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS feed_info (
            feed_publisher_name TEXT NOT NULL,
            feed_publisher_url TEXT NOT NULL,
            feed_lang TEXT NOT NULL,
            default_lang TEXT,
            feed_start_date TEXT,
            feed_end_date TEXT,
            feed_version TEXT,
            feed_contact_email TEXT,
            feed_contact_url TEXT
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS routes (
            route_id TEXT PRIMARY KEY,
            agency_id TEXT,
            route_short_name TEXT,
            route_long_name TEXT,
            route_desc TEXT,
            route_type TEXT,
            route_url TEXT,
            route_color TEXT,
            route_text_color TEXT,
            route_sort_order TEXT,
            continuous_pickup TEXT,
            continuous_drop_off TEXT,
            network_id TEXT,
            FOREIGN KEY (agency_id) REFERENCES agency (agency_id)
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS shapes (
            shape_id TEXT NOT NULL,
            shape_pt_lat TEXT NOT NULL,
            shape_pt_lon TEXT NOT NULL,
            shape_pt_sequence INTEGER NOT NULL,
            shape_dist_traveled REAL
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS stops (
            stop_id TEXT NOT NULL,
            stop_code TEXT,
            stop_name TEXT,
            tts_stop_name TEXT,
            stop_desc TEXT,
            stop_lat TEXT,
            stop_lon TEXT,
            zone_id TEXT,
            stop_url TEXT,
            location_type TEXT,
            parent_station TEXT,
            stop_timezone TEXT,
            wheelchair_boarding TEXT,
            level_id TEXT,
            platform_code TEXT
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS trips (
            route_id TEXT,
            service_id TEXT,
            trip_id TEXT PRIMARY KEY,
            trip_headsign TEXT,
            trip_short_name TEXT,
            direction_id TEXT,
            block_id TEXT,
            shape_id TEXT,
            wheelchair_accessible TEXT,
            bikes_allowed TEXT,
            FOREIGN KEY (route_id) REFERENCES routes (route_id),
            FOREIGN KEY (service_id) REFERENCES calendar_dates (service_id),
            FOREIGN KEY (shape_id) REFERENCES shapes (shape_id)
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS stop_times (
            trip_id TEXT NOT NULL,
            arrival_time TEXT,
            departure_time TEXT,
            stop_id TEXT,
            location_group_id TEXT,
            location_id TEXT,
            stop_sequence INTEGER NOT NULL,
            stop_headsign TEXT,
            start_pickup_drop_off_window TEXT,
            end_pickup_drop_off_window TEXT,
            pickup_type TEXT,
            drop_off_type TEXT,
            continuous_pickup TEXT,
            continuous_drop_off TEXT,
            shape_dist_traveled REAL,
            timepoint TEXT,
            pickup_booking_rule_id TEXT,
            drop_off_booking_rule_id TEXT,
            FOREIGN KEY (trip_id) REFERENCES trips (trip_id),
            FOREIGN KEY (stop_id) REFERENCES stops (stop_id)
        );
    """)


if __name__ == '__main__':
    filename = 'transit.db'
    if os.path.exists(filename):
        os.remove(filename)
    create_database(filename)