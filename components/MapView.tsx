import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import { ParkingSpot, DEFAULT_REGION } from '@/data/parkingSpots';
import Colors from '@/constants/Colors';
import * as Location from 'expo-location';

// Import platform-specific components
const NativeMapView = Platform.select({
  native: () => require('./NativeMapView').default,
  default: () => require('./WebMapView').default,
})();

interface MapComponentProps {
  parkingSpots: ParkingSpot[];
  onMarkerPress?: (spot: ParkingSpot) => void;
  initialRegion?: typeof DEFAULT_REGION;
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
      <NativeMapView
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