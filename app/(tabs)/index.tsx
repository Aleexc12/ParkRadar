import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapComponent from '@/components/MapView';
import SearchBar from '@/components/SearchBar';
import DrivingMode from '@/components/DrivingMode';
import SpotDetails from '@/components/SpotDetails';
import { fetchParkingSpots, ParkingSpot, calculateDistance, DEFAULT_REGION } from '@/data/parkingSpots';
import Colors from '@/constants/Colors';
import { Car } from 'lucide-react-native';
import * as Location from 'expo-location';
import { supabase } from '@/lib/supabase';

export default function MapScreen() {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [isDrivingMode, setIsDrivingMode] = useState(false);
  const [nearbySpots, setNearbySpots] = useState<ParkingSpot[]>([]);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [mapRegion, setMapRegion] = useState(DEFAULT_REGION);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadParkingSpots();
    setupLocationTracking();
  }, []);

  const loadParkingSpots = async () => {
    try {
      setIsLoading(true);
      const spots = await fetchParkingSpots();
      setParkingSpots(spots);
    } catch (err) {
      setError('Failed to load parking spots');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const setupLocationTracking = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const userCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setUserLocation(userCoords);
      setMapRegion({
        ...userCoords,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    } catch (err) {
      setError('Failed to get location');
      console.error(err);
    }
  };

  const handleSearch = async (query: string, coordinates?: { lat: number; lng: number }) => {
    try {
      // Log search query
      await supabase
        .from('search_logs')
        .insert({ query_text: query });

      if (coordinates) {
        const newRegion = {
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        };
        setMapRegion(newRegion);

        // Find parking spots within 5km radius
        const nearbySpots = parkingSpots.filter(spot => 
          calculateDistance(
            coordinates.lat,
            coordinates.lng,
            spot.latitude,
            spot.longitude
          ) <= 5
        );
        
        setNearbySpots(nearbySpots);
      }
    } catch (err) {
      console.error('Error logging search:', err);
    }
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

  const toggleDrivingMode = () => {
    setIsDrivingMode(prevMode => !prevMode);
    if (selectedSpot) {
      setSelectedSpot(null);
    }
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <MapComponent
        parkingSpots={parkingSpots}
        onMarkerPress={handleMarkerPress}
        initialRegion={mapRegion}
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.white,
  },
  errorText: {
    color: Colors.error[600],
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
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