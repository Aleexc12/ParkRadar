import { Region } from 'react-native-maps';

export interface ParkingSpot {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  totalSpots: number;
  isFavorite?: boolean;
  zone: string;
}

// Default region centered on Madrid
export const DEFAULT_REGION: Region = {
  latitude: 40.4168,
  longitude: -3.7038,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

// Mock parking spot data for Madrid
export const PARKING_SPOTS: ParkingSpot[] = [
  {
    id: '1',
    name: 'Plaza Mayor',
    description: 'Parking cerca de Plaza Mayor',
    latitude: 40.4155,
    longitude: -3.7074,
    totalSpots: 120,
    zone: 'Centro',
  },
  {
    id: '2',
    name: 'Malasaña',
    description: 'Zona de estacionamiento en Malasaña',
    latitude: 40.4279,
    longitude: -3.7032,
    totalSpots: 80,
    zone: 'Malasaña',
  },
  {
    id: '3',
    name: 'Lavapiés',
    description: 'Parking público en Lavapiés',
    latitude: 40.4098,
    longitude: -3.7038,
    totalSpots: 60,
    zone: 'Lavapiés',
  },
  {
    id: '4',
    name: 'Barrio Salamanca',
    description: 'Estacionamiento en Salamanca',
    latitude: 40.4241,
    longitude: -3.6823,
    totalSpots: 150,
    zone: 'Salamanca',
  },
  {
    id: '5',
    name: 'Chueca',
    description: 'Parking zona Chueca',
    latitude: 40.4231,
    longitude: -3.6977,
    totalSpots: 90,
    zone: 'Chueca',
  },
];

// Function to calculate distance between two points in km
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}