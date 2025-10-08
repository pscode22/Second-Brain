import { createContext } from 'react';
import { DeleteContContext } from '../../interfaces/generic';

export const DeleteContentContext = createContext<DeleteContContext>({
  delContent: { isModalOpen: false },
  setDelContent() {},
});
