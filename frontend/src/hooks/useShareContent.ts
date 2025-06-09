import { useContext } from "react";
import { ShareContentContext } from "../contexts/share-content/context";

export const useShareContent = () => {
  const context = useContext(ShareContentContext);

  if (context === undefined) {
    throw new Error('useShareContent must be used within an ShareContentProvider');
  }

  return context;
};