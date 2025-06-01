import React from 'react';
import GoogleMapReact from 'google-map-react';
import { StyleSheet, View } from 'react-native';
import { ParkingSpot } from '@/data/parkingSpots';
import ParkingMarker from './ParkingMarker';

interface WebMapViewProps {
  region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  onRegionChange: (region: any) => void;
  parkingSpots: ParkingSpot[];
  onMarkerPress?: (spot: ParkingSpot) => void;
  userLocation: { latitude: number; longitude: number; } | null;
}

const WebMapView: React.FC<WebMapViewProps> = ({
  region,
  onRegionChange,
  parkingSpots,
  onMarkerPress,
  userLocation,
}) => {
  const handleBoundsChange = (bounds: any) => {
    const center = {
      latitude: bounds.center.lat,
      longitude: bounds.center.lng,
      latitudeDelta: region.latitudeDelta,
      longitudeDelta: region.longitudeDelta,
    };
    onRegionChange(center);
  };

  return (
    <View style={styles.container}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: '' }} // Add your Google Maps API key here
        defaultCenter={{
          lat: region.latitude,
          lng: region.longitude,
        }}
        defaultZoom={15}
        onChange={handleBoundsChange}
        options={{
          fullscreenControl: false,
        }}
      >
        {parkingSpots.map((spot) => (
          <ParkingMarker
            key={spot.id}
            lat={spot.latitude}
            lng={spot.longitude}
            spot={spot}
            onPress={() => onMarkerPress?.(spot)}
          />
        ))}
        {userLocation && (
          <div
            lat={userLocation.latitude}
            lng={userLocation.longitude}
            style={styles.userLocation}
          />
        )}
      </GoogleMapReact>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
  },
  userLocation: {
    width: 16,
    height: 16,
    backgroundColor: '#4285F4',
    borderRadius: 50,
    border: '2px solid white',
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.3)',
  },
});

export default WebMapView;