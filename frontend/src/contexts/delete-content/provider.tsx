import { ReactNode, useEffect, useMemo, useState } from 'react';
import { DeleteContentContext } from './context';
import { DeleteContentProps } from '../../interfaces/generic';

interface DeleteContentProviderProps {
  children: ReactNode;
}

// Provider component that wraps your app and makes auth object available to all child components
export const DeleteContentProvider: React.FC<DeleteContentProviderProps> = ({ children }) => {
  // Delete Content Modal
  const [delContent, setDelContent] = useState<DeleteContentProps>({ isModalOpen: false });

  //   Get StoredProps from session on initial-load.
  useEffect(() => {
    const props = sessionStorage.getItem('delContentProps');
    if (props) {
      setDelContent(JSON.parse(props));
    }
  }, []);

  //   Set props to session on every-change.
  useEffect(() => {
    sessionStorage.setItem('delContentProps', JSON.stringify(delContent));
  }, [delContent]);

  const value = useMemo(() => ({ delContent, setDelContent }), [delContent]);

  return <DeleteContentContext.Provider value={value}>{children}</DeleteContentContext.Provider>;
};
