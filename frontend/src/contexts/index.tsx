import React from 'react';
import { AuthProvider } from './auth/provider';
import { DeleteContentProvider } from './delete-content/provider';
import { ShareContentProvider } from './share-content/provider';

export default function ContextsProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DeleteContentProvider>
        <ShareContentProvider>{children}</ShareContentProvider>
      </DeleteContentProvider>
    </AuthProvider>
  );
}
