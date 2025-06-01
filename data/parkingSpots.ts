import { Region } from 'react-native-maps';
import { supabase, type ParkingSpot as SupabaseParkingSpot } from '@/lib/supabase';

// Extended ParkingSpot type with UI-specific properties
export interface ParkingSpot extends Omit<SupabaseParkingSpot, 'total_spots'> {
  totalSpots: number;
  availableSpots?: number;
  description?: string;
  isFavorite?: boolean;
  zone?: string;
  price?: {
    amount: number;
    period: string;
  };
}

// Default region centered on Madrid
export const DEFAULT_REGION: Region = {
  latitude: 40.4168,
  longitude: -3.7038,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

// Function to transform Supabase parking spot to UI parking spot
export function transformParkingSpot(spot: SupabaseParkingSpot): ParkingSpot {
  return {
    ...spot,
    totalSpots: spot.total_spots,
    availableSpots: spot.total_spots, // For now, assume all spots are available
    description: `${spot.type.charAt(0).toUpperCase() + spot.type.slice(1)} parking near ${spot.name}`,
    zone: spot.name.split(' ')[0], // Use first word of name as zone
  };
}

// Function to fetch parking spots from Supabase
export async function fetchParkingSpots(): Promise<ParkingSpot[]> {
  const { data, error } = await supabase
    .from('parkings')
    .select('*')
    .returns<SupabaseParkingSpot[]>();

  if (error) {
    console.error('Error fetching parking spots:', error);
    return [];
  }

  return data.map(transformParkingSpot);
}

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