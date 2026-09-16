import React, { createContext, useContext, useState, useEffect } from "react";
import { BROKERS, type Broker } from "@/data/broker-directory-data";

export type ViewportMode = "desktop" | "tablet" | "mobile" | "fluid";

interface ComparisonContextType {
  selectedBrokerIds: string[];
  addBroker: (id: string) => boolean;
  removeBroker: (id: string) => void;
  clearBrokers: () => void;
  isBrokerSelected: (id: string) => boolean;
  selectedBrokers: Broker[];
  viewportMode: ViewportMode;
  setViewportMode: (mode: ViewportMode) => void;
  showAnnotations: boolean;
  setShowAnnotations: (show: boolean) => void;
  toggleAnnotations: () => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [selectedBrokerIds, setSelectedBrokerIds] = useState<string[]>(["pepperstone", "ic-markets"]);
  const [viewportMode, setViewportMode] = useState<ViewportMode>("fluid");
  const [showAnnotations, setShowAnnotations] = useState<boolean>(false);

  const addBroker = (id: string): boolean => {
    if (selectedBrokerIds.includes(id)) return true;
    if (selectedBrokerIds.length >= 4) {
      alert("Maximum 4 brokers can be compared simultaneously.");
      return false;
    }
    setSelectedBrokerIds((prev) => [...prev, id]);
    return true;
  };

  const removeBroker = (id: string) => {
    setSelectedBrokerIds((prev) => prev.filter((bId) => bId !== id));
  };

  const clearBrokers = () => {
    setSelectedBrokerIds([]);
  };

  const isBrokerSelected = (id: string) => selectedBrokerIds.includes(id);

  const selectedBrokers = selectedBrokerIds
    .map((id) => BROKERS.find((b) => b.id === id))
    .filter((b): b is Broker => Boolean(b));

  return (
    <ComparisonContext.Provider
      value={{
        selectedBrokerIds,
        addBroker,
        removeBroker,
        clearBrokers,
        isBrokerSelected,
        selectedBrokers,
        viewportMode,
        setViewportMode,
        showAnnotations,
        setShowAnnotations,
        toggleAnnotations: () => setShowAnnotations((prev) => !prev),
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error("useComparison must be used within a ComparisonProvider");
  }
  return context;
}
