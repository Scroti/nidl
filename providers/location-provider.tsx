import { createContext, PropsWithChildren, useContext, useState } from 'react';

type LocationData = {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  formattedAddress?: string;
  latitude?: number;
  longitude?: number;
};

type LocationContextType = {
  selectedLocation: LocationData | null;
  setSelectedLocation: (location: LocationData | null) => void;
};

const LocationContext = createContext<LocationContextType>({
  selectedLocation: null,
  setSelectedLocation: () => {},
});

export function LocationProvider({ children }: PropsWithChildren) {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);

  return (
    <LocationContext.Provider value={{ selectedLocation, setSelectedLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}

