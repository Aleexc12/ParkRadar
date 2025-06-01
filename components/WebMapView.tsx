import React from 'react';
import GoogleMapReact from 'google-map-react';
import { StyleSheet, View } from 'react-native';
import { ParkingSpot } from '@/data/parkingSpots';

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

interface MarkerProps {
  spot: ParkingSpot;
  lat: number;
  lng: number;
  onPress: () => void;
}

const Marker: React.FC<MarkerProps> = ({ spot, onPress }) => (
  <div
    onClick={onPress}
    style={{
      position: 'absolute',
      transform: 'translate(-50%, -50%)',
      width: 40,
      height: 40,
      backgroundColor: '#2c8aed',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      fontWeight: 'bold',
      cursor: 'pointer',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    }}
  >
    {spot.totalSpots}
  </div>
);

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
        bootstrapURLKeys={{ key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY || '' }}
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
          <Marker
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