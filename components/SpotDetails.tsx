import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import { ParkingSpot } from '@/data/parkingSpots';
import Colors from '@/constants/Colors';
import { Heart, X } from 'lucide-react-native';

interface SpotDetailsProps {
  spot: ParkingSpot;
  onClose: () => void;
  onToggleFavorite: (spotId: string) => void;
}

const SpotDetails: React.FC<SpotDetailsProps> = ({
  spot,
  onClose,
  onToggleFavorite,
}) => {
  return (
    <Animated.View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{spot.name}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color={Colors.neutral[600]} />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.description}>{spot.description}</Text>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Estimated Capacity</Text>
          <Text style={styles.infoValue}>{spot.totalSpots}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Status</Text>
          <Text style={styles.statusText}>None</Text>
        </View>
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.favoriteButton]}
          onPress={() => onToggleFavorite(spot.id)}
        >
          <Heart
            size={20}
            color={spot.isFavorite ? Colors.error[500] : Colors.neutral[600]}
            fill={spot.isFavorite ? Colors.error[500] : 'none'}
          />
          <Text style={styles.actionButtonText}>
            {spot.isFavorite ? 'Saved' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.neutral[800],
    flex: 1,
    fontFamily: 'Inter-Bold',
  },
  closeButton: {
    padding: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.neutral[600],
    marginBottom: 20,
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.neutral[500],
    marginBottom: 4,
    fontFamily: 'Inter-Regular',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[800],
    fontFamily: 'Inter-SemiBold',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[400],
    fontFamily: 'Inter-SemiBold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
  },
  favoriteButton: {
    backgroundColor: Colors.neutral[100],
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[800],
    fontFamily: 'Inter-SemiBold',
  },
});

export default SpotDetails;