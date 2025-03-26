// app/lib/services/addressService.ts
import { useEffect, useState, useRef } from 'react';

// Add type definitions for Google Maps
declare global {
  interface Window {
    google: {
      maps: {
        places: {
          Autocomplete: new (
            inputElement: HTMLInputElement,
            options?: google.maps.places.AutocompleteOptions
          ) => google.maps.places.Autocomplete;
        };
      };
    };
  }
}

export interface PlaceData {
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  county: string | null;
  postalCode: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  planningAuthority: string | null;
}

// Helper to load the Google Maps API script
export const loadGoogleMapsScript = (apiKey: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === 'undefined') {
      // Do nothing on the server
      resolve();
      return;
    }

    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps API'));

    document.head.appendChild(script);
  });
};

// Type definitions for Google Maps API
namespace google.maps.places {
  export interface PlaceResult {
    address_components?: AddressComponent[];
    formatted_address?: string;
    geometry?: {
      location?: {
        lat(): number;
        lng(): number;
      };
    };
    place_id?: string;
  }

  export interface AddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
  }

  export interface AutocompleteOptions {
    componentRestrictions?: {
      country: string | string[];
    };
    fields?: string[];
    types?: string[];
  }

  export interface Autocomplete {
    addListener(eventName: string, handler: () => void): void;
    getPlace(): PlaceResult;
  }
}

// Hook to use Google Places Autocomplete
export const usePlacesAutocomplete = (apiKey: string) => {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const initialize = async () => {
      try {
        setLoading(true);
        await loadGoogleMapsScript(apiKey);
        setInitialized(true);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    initialize();
  }, [apiKey]);

  const initAutocomplete = (inputElement: HTMLInputElement, options?: google.maps.places.AutocompleteOptions) => {
    if (!initialized || !window.google || !window.google.maps || !window.google.maps.places) {
      return null;
    }

    const defaultOptions: google.maps.places.AutocompleteOptions = {
      componentRestrictions: { country: 'gb' },
      fields: ['address_components', 'geometry', 'formatted_address', 'place_id'],
      ...options
    };

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputElement, defaultOptions);
    return autocompleteRef.current;
  };

  const getPlaceDataFromResult = (place: google.maps.places.PlaceResult): PlaceData => {
    let addressLine1 = '';
    let addressLine2 = null;
    let city = '';
    let county = null;
    let postalCode = '';
    let country = 'United Kingdom';
    let planningAuthority = null;

    if (place.address_components) {
      // Parse address components
      for (const component of place.address_components) {
        const componentType = component.types[0];

        switch (componentType) {
          case 'street_number':
            addressLine1 = `${component.long_name} ${addressLine1}`;
            break;
          case 'route':
            addressLine1 += component.long_name;
            break;
          case 'postal_town':
          case 'locality':
            city = component.long_name;
            break;
          case 'administrative_area_level_2':
            county = component.long_name;
            break;
          case 'administrative_area_level_1':
            // In the UK, this is often the country within the UK (England, Scotland, etc.)
            // We can use this to help determine the planning authority
            planningAuthority = component.long_name;
            break;
          case 'postal_code':
            postalCode = component.long_name;
            break;
          case 'country':
            country = component.long_name;
            break;
        }
      }
    }

    // Get coordinates
    const latitude = place.geometry?.location?.lat() || null;
    const longitude = place.geometry?.location?.lng() || null;

    return {
      addressLine1,
      addressLine2,
      city,
      county,
      postalCode,
      country,
      latitude,
      longitude,
      planningAuthority
    };
  };

  // Function to simulate looking up a planning authority based on the address
  // In a real implementation, this might call an API or use geospatial data
  const getPlanningAuthorityFromAddress = (address: PlaceData): string => {
    // This is a placeholder. In a real implementation, you would:
    // 1. Use the latitude/longitude to query a geospatial database
    // 2. Or use the postal code to look up the local authority
    
    // For now, we'll derive it based on the city or county
    if (address.city) {
      // For London, use the borough system
      if (address.city.toLowerCase().includes('london')) {
        // Attempt to derive the London borough from the postal code
        const postCodePrefix = address.postalCode.split(' ')[0];
        
        // Very simplified mapping - would need a complete mapping in production
        switch (postCodePrefix) {
          case 'E1':
          case 'E2':
            return 'Tower Hamlets Council';
          case 'SW1':
          case 'SW3':
            return 'Westminster City Council';
          case 'N1':
          case 'N2':
            return 'Islington Council';
          default:
            return 'Greater London Authority';
        }
      }
      
      // For other cities, use the city name + "Council"
      return `${address.city} Council`;
    }
    
    // Fall back to county if city isn't available
    if (address.county) {
      return `${address.county} Council`;
    }
    
    return 'Unknown Planning Authority';
  };

  return {
    initialized,
    loading,
    error,
    initAutocomplete,
    getPlaceDataFromResult,
    getPlanningAuthorityFromAddress
  };
};