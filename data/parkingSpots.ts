import { Region } from 'react-native-maps';

export interface ParkingSpot {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  availableSpots: number;
  totalSpots: number;
  isFavorite?: boolean;
  price?: {
    amount: number;
    currency: string;
    period: string;
  };
}

// Default region for the map
export const DEFAULT_REGION: Region = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

// Mock parking spot data
export const PARKING_SPOTS: ParkingSpot[] = [
  {
    id: '1',
    name: 'Downtown Parking',
    description: 'Open-air parking in the downtown area',
    latitude: 37.78825,
    longitude: -122.4324,
    availableSpots: 15,
    totalSpots: 50,
    isFavorite: false,
    price: {
      amount: 2.5,
      currency: 'USD',
      period: 'hour',
    },
  },
  {
    id: '2',
    name: 'Market Street Parking',
    description: 'Convenient parking near Market Street',
    latitude: 37.7852,
    longitude: -122.4348,
    availableSpots: 7,
    totalSpots: 30,
    isFavorite: true,
    price: {
      amount: 3,
      currency: 'USD',
      period: 'hour',
    },
  },
  {
    id: '3',
    name: 'City Hall Parking',
    description: 'Public parking near City Hall',
    latitude: 37.7799,
    longitude: -122.4294,
    availableSpots: 22,
    totalSpots: 45,
    isFavorite: false,
    price: {
      amount: 2,
      currency: 'USD',
      period: 'hour',
    },
  },
  {
    id: '4',
    name: 'Bay Street Parking',
    description: 'Open-air parking with bay views',
    latitude: 37.7957,
    longitude: -122.4339,
    availableSpots: 3,
    totalSpots: 25,
    isFavorite: false,
    price: {
      amount: 4,
      currency: 'USD',
      period: 'hour',
    },
  },
  {
    id: '5',
    name: 'Park Avenue Parking',
    description: 'Spacious parking near the park',
    latitude: 37.7739,
    longitude: -122.4312,
    availableSpots: 18,
    totalSpots: 40,
    isFavorite: true,
    price: {
      amount: 2.5,
      currency: 'USD',
      period: 'hour',
    },
  },
];