import { useContext } from "react";
import { DeleteContentContext } from "../contexts/delete-content/context";

export const useDeleteContent = () => {
  const context = useContext(DeleteContentContext);

  if (context === undefined) {
    throw new Error('useDelete must be used within an DeleteContentProvider');
  }

  return context;
};