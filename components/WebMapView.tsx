import React from 'react';
import GoogleMapReact from 'google-map-react';
import { StyleSheet, View, Text } from 'react-native';
import { ParkingSpot } from '@/data/parkingSpots';
import Colors from '@/constants/Colors';

interface WebMapViewProps {
  parkingSpots: ParkingSpot[];
  onMarkerPress?: (spot: ParkingSpot) => void;
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  userLocation?: {
    latitude: number;
    longitude: number;
  } | null;
}

interface MarkerProps {
  spot: ParkingSpot;
  onPress: () => void;
  lat: number;
  lng: number;
}

const Marker: React.FC<MarkerProps> = ({ spot, onPress }) => {
  // Calculate color based on availability
  const getMarkerColor = () => {
    const availabilityPercentage = (spot.availableSpots / spot.totalSpots) * 100;
    if (availabilityPercentage >= 50) return Colors.success[500];
    if (availabilityPercentage >= 20) return Colors.warning[500];
    return Colors.error[500];
  };

  return (
    <View style={[styles.marker, { backgroundColor: getMarkerColor() }]} onClick={onPress}>
      <Text style={styles.markerText}>{spot.availableSpots}</Text>
    </View>
  );
};

const WebMapView: React.FC<WebMapViewProps> = ({
  parkingSpots,
  onMarkerPress,
  initialRegion,
  userLocation,
}) => {
  const defaultProps = {
    center: {
      lat: initialRegion.latitude,
      lng: initialRegion.longitude,
    },
    zoom: 14,
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY || '' }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        yesIWantToUseGoogleMapApiInternals
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
    </div>
  );
};

const styles = StyleSheet.create({
  marker: {
    borderRadius: 20,
    padding: 8,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
  markerText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  userLocation: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary[600],
    borderWidth: 3,
    borderColor: Colors.white,
    transform: [{ translateX: -8 }, { translateY: -8 }],
  },
});

export default WebMapView;