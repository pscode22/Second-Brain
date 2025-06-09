import { ReactNode, useEffect, useMemo, useState } from 'react';
import { ShareContentContext } from './context';
import { ShareContentProps } from '../../interfaces/generic';

interface ShareContentProviderProps {
  children: ReactNode;
}

// Provider component that wraps your app and makes auth object available to all child components
export const ShareContentProvider: React.FC<ShareContentProviderProps> = ({ children }) => {
  // Delete Content Modal
  const [shareContent, setShareContent] = useState<ShareContentProps>({ isModalOpen: false });

  //   Get StoredProps from session on initial-load.
  useEffect(() => {
    const props = sessionStorage.getItem('shareContentProps');
    if (props) {
      setShareContent(JSON.parse(props));
    }
  }, []);

  //   Set props to session on every-change.
  useEffect(() => {
    sessionStorage.setItem('shareContentProps', JSON.stringify(shareContent));
  }, [shareContent]);

  const value = useMemo(() => ({ shareContent, setShareContent }), [shareContent]);

  return <ShareContentContext.Provider value={value}>{children}</ShareContentContext.Provider>;
};
