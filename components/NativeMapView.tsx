import React, { useRef, useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region, Marker } from 'react-native-maps';
import { ParkingSpot } from '@/data/parkingSpots';
import ParkingMarker from './ParkingMarker';
import Colors from '@/constants/Colors';

interface NativeMapViewProps {
  parkingSpots: ParkingSpot[];
  onMarkerPress?: (spot: ParkingSpot) => void;
  initialRegion: Region;
  userLocation?: {
    latitude: number;
    longitude: number;
  } | null;
}

const NativeMapView: React.FC<NativeMapViewProps> = ({
  parkingSpots,
  onMarkerPress,
  initialRegion,
  userLocation,
}) => {
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = React.useState<Region>(initialRegion);

  useEffect(() => {
    if (userLocation && mapRef.current) {
      const newRegion = {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);
      mapRef.current.animateToRegion(newRegion);
    }
  }, [userLocation]);

  const handleMarkerPress = (spot: ParkingSpot) => {
    if (onMarkerPress) {
      onMarkerPress(spot);
    }
  };

  return (
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
  );
};

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default NativeMapView;