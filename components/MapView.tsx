import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region, Marker } from 'react-native-maps';
import { ParkingSpot, DEFAULT_REGION } from '@/data/parkingSpots';
import ParkingMarker from './ParkingMarker';
import Colors from '@/constants/Colors';
import * as Location from 'expo-location';

interface MapComponentProps {
  parkingSpots: ParkingSpot[];
  onMarkerPress?: (spot: ParkingSpot) => void;
  initialRegion?: Region;
}

const MapComponent: React.FC<MapComponentProps> = ({
  parkingSpots,
  onMarkerPress,
  initialRegion = DEFAULT_REGION,
}) => {
  const [region, setRegion] = useState<Region>(initialRegion);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const mapRef = useRef<MapView>(null);

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

      // Center map on user's location
      if (mapRef.current) {
        setRegion({
          ...userCoords,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        mapRef.current.animateToRegion({
          ...userCoords,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    })();
  }, []);

  const handleMarkerPress = (spot: ParkingSpot) => {
    if (onMarkerPress) {
      onMarkerPress(spot);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        showsTraffic={false}
      >
        {parkingSpots.map((spot) => (
          <ParkingMarker
            key={spot.id}
            spot={spot}
            onPress={() => handleMarkerPress(spot)}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default MapComponent;