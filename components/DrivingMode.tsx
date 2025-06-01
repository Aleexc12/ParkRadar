import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ParkingSpot } from '@/data/parkingSpots';
import Colors from '@/constants/Colors';
import { Navigation } from 'lucide-react-native';

interface DrivingModeProps {
  nearbySpots: ParkingSpot[];
  onSpotPress: (spot: ParkingSpot) => void;
  onClose: () => void;
}

const DrivingMode: React.FC<DrivingModeProps> = ({
  nearbySpots,
  onSpotPress,
  onClose,
}) => {
  // Only show spots with available spaces
  const availableSpots = nearbySpots.filter(spot => spot.availableSpots > 0);

  if (availableSpots.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noSpotsText}>No available parking spots nearby</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Exit Driving Mode</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nearby Parking</Text>
      
      <View style={styles.spotsContainer}>
        {availableSpots.slice(0, 3).map((spot) => (
          <TouchableOpacity
            key={spot.id}
            style={styles.spotItem}
            onPress={() => onSpotPress(spot)}
          >
            <View style={styles.directionContainer}>
              <Navigation size={24} color={Colors.primary[600]} style={styles.navigationIcon} />
              <Text style={styles.availableSpotsText}>{spot.availableSpots} spots</Text>
            </View>
            <Text style={styles.spotName}>{spot.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Exit Driving Mode</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.neutral[800],
    marginBottom: 15,
    fontFamily: 'Inter-Bold',
  },
  spotsContainer: {
    marginBottom: 15,
  },
  spotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  directionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navigationIcon: {
    marginRight: 8,
  },
  availableSpotsText: {
    fontSize: 16,
    color: Colors.primary[600],
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  spotName: {
    fontSize: 14,
    color: Colors.neutral[700],
    fontFamily: 'Inter-Regular',
  },
  closeButton: {
    backgroundColor: Colors.neutral[800],
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  noSpotsText: {
    fontSize: 16,
    color: Colors.neutral[600],
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: 'Inter-Regular',
  },
});

export default DrivingMode;