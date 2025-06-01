import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import { ParkingSpot, DEFAULT_REGION } from '@/data/parkingSpots';
import ParkingMarker from './ParkingMarker';
import Colors from '@/constants/Colors';
import * as Location from 'expo-location';

// Import different map components based on platform
const MapComponent = Platform.select({
  web: () => require('./WebMapView').default,
  default: () => require('./NativeMapView').default,
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
});

export default MapView;