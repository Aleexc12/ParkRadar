import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { ParkingSpot, DEFAULT_REGION } from '@/data/parkingSpots';
import Colors from '@/constants/Colors';
import * as Location from 'expo-location';

// Import map components based on platform
const WebMapView = Platform.select({
  web: () => require('./WebMapView').default,
  default: () => null,
})();

const NativeMapView = Platform.select({
  ios: () => require('./NativeMapView').default,
  android: () => require('./NativeMapView').default,
  default: () => null,
})();

interface MapComponentProps {
  parkingSpots: ParkingSpot[];
  onMarkerPress?: (spot: ParkingSpot) => void;
  initialRegion?: typeof DEFAULT_REGION;
}

const MapView: React.FC<MapComponentProps> = ({
  parkingSpots,
  onMarkerPress,
  initialRegion = DEFAULT_REGION,
}) => {
  const [region, setRegion] = useState(initialRegion);
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
      const userCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setUserLocation(userCoords);
      setRegion({
        ...userCoords,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  // Render the appropriate map component based on platform
  const MapComponent = Platform.OS === 'web' ? WebMapView : NativeMapView;

  if (!MapComponent) {
    return (
      <View style={styles.container}>
        <View style={styles.fallback}>
          <Text>Map is not supported on this platform</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapComponent
        region={region}
        onRegionChange={setRegion}
        parkingSpots={parkingSpots}
        onMarkerPress={onMarkerPress}
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
  fallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapView;