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
  return (
    <Marker
      coordinate={{
        latitude: spot.latitude,
        longitude: spot.longitude,
      }}
      onPress={onPress}
    >
      <View style={styles.markerContainer}>
        <Text style={styles.markerText}>{spot.totalSpots}</Text>
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    backgroundColor: Colors.primary[600],
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  markerText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
});

export default ParkingMarker;