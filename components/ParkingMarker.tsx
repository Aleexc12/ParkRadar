import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Marker } from 'react-native-maps';
import { ParkingSpot } from '@/data/parkingSpots';
import Colors from '@/constants/Colors';

interface ParkingMarkerProps {
  spot: ParkingSpot;
  onPress: () => void;
}

const ParkingMarker: React.FC<ParkingMarkerProps> = ({ spot, onPress }) => {
  // Determine marker color based on available spots
  const getMarkerColor = () => {
    const availabilityPercentage = (spot.availableSpots / spot.totalSpots) * 100;
    if (availabilityPercentage >= 50) return Colors.success[500]; // Plenty of spots
    if (availabilityPercentage >= 20) return Colors.warning[500]; // Limited spots
    return Colors.error[500]; // Very few spots
  };

  return (
    <Marker
      coordinate={{
        latitude: spot.latitude,
        longitude: spot.longitude,
      }}
      onPress={onPress}
    >
      <View style={[styles.markerContainer, { backgroundColor: getMarkerColor() }]}>
        <Text style={styles.markerText}>{spot.availableSpots}</Text>
      </View>
      <View style={[styles.markerTriangle, { borderTopColor: getMarkerColor() }]} />
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    borderRadius: 20,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    minWidth: 40,
  },
  markerText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  markerTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    alignSelf: 'center',
    marginTop: -2,
  },
});

export default ParkingMarker;