import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { ParkingSpot, DEFAULT_REGION } from '@/data/parkingSpots';
import Colors from '@/constants/Colors';
import * as Location from 'expo-location';

// Use type imports to avoid bundling implementation
import type { ComponentType } from 'react';

interface MapComponentProps {
  parkingSpots: ParkingSpot[];
  onMarkerPress?: (spot: ParkingSpot) => void;
  initialRegion?: typeof DEFAULT_REGION;
}

// Dynamically import the correct map implementation
let MapImplementation: ComponentType<MapComponentProps>;

if (Platform.OS === 'web') {
  MapImplementation = require('./WebMapView').default;
} else {
  MapImplementation = require('./NativeMapView').default;
}

const MapComponent: React.FC<MapComponentProps> = ({
  parkingSpots,
  onMarkerPress,
  initialRegion = DEFAULT_REGION,
}) => {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapImplementation
        parkingSpots={parkingSpots}
        onMarkerPress={onMarkerPress}
        initialRegion={initialRegion}
        userLocation={userLocation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});

export default MapComponent;