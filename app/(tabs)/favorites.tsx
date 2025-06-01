import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ParkingSpot, PARKING_SPOTS } from '@/data/parkingSpots';
import Colors from '@/constants/Colors';
import { Heart, MapPin } from 'lucide-react-native';

export default function FavoritesScreen() {
  const [favoriteSpots, setFavoriteSpots] = useState<ParkingSpot[]>(
    PARKING_SPOTS.filter(spot => spot.isFavorite)
  );

  const removeFavorite = (spotId: string) => {
    setFavoriteSpots(spots => spots.filter(spot => spot.id !== spotId));
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={{ uri: 'https://images.pexels.com/photos/10769588/pexels-photo-10769588.jpeg?auto=compress&cs=tinysrgb&w=600' }}
        style={styles.emptyImage}
      />
      <Text style={styles.emptyTitle}>No favorites yet</Text>
      <Text style={styles.emptyText}>
        Save your favorite parking spots for quick access
      </Text>
    </View>
  );

  const renderSpotItem = ({ item }: { item: ParkingSpot }) => (
    <View style={styles.spotCard}>
      <View style={styles.spotInfo}>
        <Text style={styles.spotName}>{item.name}</Text>
        <Text style={styles.spotDescription}>{item.description}</Text>
        
        <View style={styles.spotDetails}>
          <View style={styles.availabilityContainer}>
            <Text style={styles.availabilityLabel}>Available:</Text>
            <Text style={styles.availabilityValue}>
              {item.availableSpots} / {item.totalSpots}
            </Text>
          </View>
          
          {item.price && (
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Price:</Text>
              <Text style={styles.priceValue}>
                ${item.price.amount}/{item.price.period}
              </Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <MapPin size={20} color={Colors.primary[600]} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => removeFavorite(item.id)}
        >
          <Heart size={20} color={Colors.error[500]} fill={Colors.error[500]} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Parking Spots</Text>
      </View>
      
      <FlatList
        data={favoriteSpots}
        renderItem={renderSpotItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  header: {
    backgroundColor: Colors.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.neutral[800],
    fontFamily: 'Inter-Bold',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
  spotCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  spotInfo: {
    flex: 1,
  },
  spotName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[800],
    marginBottom: 4,
    fontFamily: 'Inter-SemiBold',
  },
  spotDescription: {
    fontSize: 14,
    color: Colors.neutral[600],
    marginBottom: 12,
    fontFamily: 'Inter-Regular',
  },
  spotDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  availabilityContainer: {
    marginRight: 16,
  },
  availabilityLabel: {
    fontSize: 12,
    color: Colors.neutral[500],
    marginBottom: 2,
    fontFamily: 'Inter-Regular',
  },
  availabilityValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[800],
    fontFamily: 'Inter-Medium',
  },
  priceContainer: {},
  priceLabel: {
    fontSize: 12,
    color: Colors.neutral[500],
    marginBottom: 2,
    fontFamily: 'Inter-Regular',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[800],
    fontFamily: 'Inter-Medium',
  },
  actions: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  actionButton: {
    padding: 8,
    marginBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.neutral[800],
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.neutral[600],
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Inter-Regular',
  },
});