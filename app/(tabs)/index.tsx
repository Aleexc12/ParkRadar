import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapComponent from '@/components/MapView';
import SearchBar from '@/components/SearchBar';
import DrivingMode from '@/components/DrivingMode';
import SpotDetails from '@/components/SpotDetails';
import { PARKING_SPOTS, ParkingSpot } from '@/data/parkingSpots';
import Colors from '@/constants/Colors';
import { Car } from 'lucide-react-native';
import * as Location from 'expo-location';

export default function MapScreen() {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>(PARKING_SPOTS);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [isDrivingMode, setIsDrivingMode] = useState(false);
  const [nearbySpots, setNearbySpots] = useState<ParkingSpot[]>([]);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    // Get user location
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  useEffect(() => {
    // If in driving mode and we have user location, find nearby spots
    if (isDrivingMode && userLocation) {
      const spotsWithDistance = parkingSpots.map(spot => {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          spot.latitude,
          spot.longitude
        );
        return { ...spot, distance };
      });
      
      // Sort by distance and take nearest spots
      const sorted = spotsWithDistance.sort((a: any, b: any) => a.distance - b.distance);
      setNearbySpots(sorted.slice(0, 5));
    }
  }, [isDrivingMode, userLocation, parkingSpots]);

  // Calculate distance between two coordinates in km
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  const handleSearch = (query: string) => {
    // In a real app, this would geocode the search and center the map
    console.log('Search for:', query);
  };

  const handleMarkerPress = (spot: ParkingSpot) => {
    setSelectedSpot(spot);
  };

  const handleCloseDetails = () => {
    setSelectedSpot(null);
  };

  const handleToggleFavorite = (spotId: string) => {
    setParkingSpots(spots =>
      spots.map(spot =>
        spot.id === spotId
          ? { ...spot, isFavorite: !spot.isFavorite }
          : spot
      )
    );
    
    if (selectedSpot && selectedSpot.id === spotId) {
      setSelectedSpot({
        ...selectedSpot,
        isFavorite: !selectedSpot.isFavorite,
      });
    }
  };

  const handleNavigate = (spot: ParkingSpot) => {
    // In a real app, this would start navigation to the spot
    console.log('Navigate to:', spot.name);
    setSelectedSpot(null);
    setIsDrivingMode(true);
  };

  const toggleDrivingMode = () => {
    setIsDrivingMode(prevMode => !prevMode);
    if (selectedSpot) {
      setSelectedSpot(null);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <MapComponent
        parkingSpots={parkingSpots}
        onMarkerPress={handleMarkerPress}
      />
      
      <SearchBar onSearch={handleSearch} />
      
      <TouchableOpacity
        style={[
          styles.drivingModeButton,
          isDrivingMode && styles.drivingModeButtonActive,
        ]}
        onPress={toggleDrivingMode}
      >
        <Car
          size={24}
          color={isDrivingMode ? Colors.white : Colors.primary[600]}
        />
        <Text
          style={[
            styles.drivingModeText,
            isDrivingMode && styles.drivingModeTextActive,
          ]}
        >
          {isDrivingMode ? 'Exit Driving Mode' : 'Driving Mode'}
        </Text>
      </TouchableOpacity>
      
      {isDrivingMode && (
        <DrivingMode
          nearbySpots={nearbySpots}
          onSpotPress={handleMarkerPress}
          onClose={() => setIsDrivingMode(false)}
        />
      )}
      
      {selectedSpot && !isDrivingMode && (
        <SpotDetails
          spot={selectedSpot}
          onClose={handleCloseDetails}
          onToggleFavorite={handleToggleFavorite}
          onNavigate={handleNavigate}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  drivingModeButton: {
    position: 'absolute',
    right: 20,
    bottom: Platform.OS === 'ios' ? 120 : 100,
    backgroundColor: Colors.white,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  drivingModeButtonActive: {
    backgroundColor: Colors.primary[600],
  },
  drivingModeText: {
    marginLeft: 8,
    fontWeight: '600',
    color: Colors.primary[600],
    fontFamily: 'Inter-SemiBold',
  },
  drivingModeTextActive: {
    color: Colors.white,
  },
});