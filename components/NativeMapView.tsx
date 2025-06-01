import React, { useRef, useEffect } from 'react';
import MapView, { PROVIDER_GOOGLE, Region, Marker } from 'react-native-maps';
import { StyleSheet, Dimensions } from 'react-native';
import { ParkingSpot } from '@/data/parkingSpots';
import ParkingMarker from './ParkingMarker';

interface NativeMapViewProps {
  region: Region;
  onRegionChange: (region: Region) => void;
  parkingSpots: ParkingSpot[];
  onMarkerPress?: (spot: ParkingSpot) => void;
  userLocation: { latitude: number; longitude: number; } | null;
}

const NativeMapView: React.FC<NativeMapViewProps> = ({
  region,
  onRegionChange,
  parkingSpots,
  onMarkerPress,
  userLocation,
}) => {
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(region, 1000);
    }
  }, [region]);

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      region={region}
      onRegionChangeComplete={onRegionChange}
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
          onPress={() => onMarkerPress?.(spot)}
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