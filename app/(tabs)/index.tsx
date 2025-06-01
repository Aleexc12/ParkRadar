import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapComponent from '@/components/MapView';
import SearchBar from '@/components/SearchBar';
import DrivingMode from '@/components/DrivingMode';
import SpotDetails from '@/components/SpotDetails';
import { PARKING_SPOTS, ParkingSpot, calculateDistance, DEFAULT_REGION } from '@/data/parkingSpots';
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
  const [mapRegion, setMapRegion] = useState(DEFAULT_REGION);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const userCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setUserLocation(userCoords);
    })();
  }, []);

  const handleSearch = (query: string, coordinates?: { lat: number; lng: number }) => {
    if (coordinates) {
      // Center map on the selected location
      const newRegion = {
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };
      setMapRegion(newRegion);

      // Find parking spots within 5km radius
      const nearbySpots = PARKING_SPOTS.filter(spot => 
        calculateDistance(
          coordinates.lat,
          coordinates.lng,
          spot.latitude,
          spot.longitude
        ) <= 5
      );
      
      setParkingSpots(nearbySpots);
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