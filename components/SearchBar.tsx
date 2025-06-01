import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, FlatList, Keyboard, ActivityIndicator } from 'react-native';
import { Search, X } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface SearchBarProps {
  onSearch: (query: string, coordinates?: { lat: number; lng: number }) => void;
  placeholder?: string;
}

interface Suggestion {
  place_id: string;
  description: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Buscar zona de aparcamiento...',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout>();

  const fetchSuggestions = async (input: string) => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      console.log('Fetching suggestions for:', input);
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          input
        )}&components=country:es&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY}`
      );
      const data = await response.json();
      console.log('Received suggestions:', data.predictions);
      setSuggestions(data.predictions || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlaceDetails = async (placeId: string) => {
    try {
      console.log('Fetching place details for:', placeId);
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY}`
      );
      const data = await response.json();
      console.log('Received place details:', data.result?.geometry?.location);
      return data.result?.geometry?.location;
    } catch (error) {
      console.error('Error fetching place details:', error);
      return null;
    }
  };

  const handleInputChange = (text: string) => {
    setSearchQuery(text);
    setIsLoading(true);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      fetchSuggestions(text);
    }, 300);
  };

  const handleSuggestionPress = async (suggestion: Suggestion) => {
    console.log('Suggestion selected:', suggestion);
    setSearchQuery(suggestion.description);
    setSuggestions([]);
    Keyboard.dismiss();

    const location = await getPlaceDetails(suggestion.place_id);
    console.log('Calling onSearch with:', suggestion.description, location);
    onSearch(suggestion.description, location);
  };

  const handleSubmit = async () => {
    if (suggestions.length > 0) {
      const firstSuggestion = suggestions[0];
      await handleSuggestionPress(firstSuggestion);
    } else if (searchQuery.trim()) {
      console.log('Direct search with query:', searchQuery);
      onSearch(searchQuery);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search size={20} color={Colors.neutral[500]} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={searchQuery}
          onChangeText={handleInputChange}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          placeholderTextColor={Colors.neutral[500]}
        />
        {isLoading ? (
          <ActivityIndicator size="small\" color={Colors.primary[600]} />
        ) : (
          searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <X size={18} color={Colors.neutral[500]} />
            </TouchableOpacity>
          )
        )}
      </View>

      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.place_id}
          style={styles.suggestionsList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={() => handleSuggestionPress(item)}
            >
              <Text style={styles.suggestionText}>{item.description}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.neutral[800],
    fontFamily: 'Inter-Regular',
  },
  clearButton: {
    padding: 5,
  },
  suggestionsList: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginTop: 8,
    maxHeight: 200,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  suggestionText: {
    fontSize: 14,
    color: Colors.neutral[800],
    fontFamily: 'Inter-Regular',
  },
});

export default SearchBar;