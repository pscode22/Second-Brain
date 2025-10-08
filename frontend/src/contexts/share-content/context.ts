import { createContext } from 'react';
import { ShareContContext } from '../../interfaces/generic';

export const ShareContentContext = createContext<ShareContContext>({
  shareContent: { isModalOpen: false, shareableLink : '' },
  setShareContent() {},
});
