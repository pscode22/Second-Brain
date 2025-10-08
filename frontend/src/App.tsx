import ContextsProvider from './contexts';
import RoutesOutlet from './routes';
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <ContextsProvider>
      <RoutesOutlet />
      <Toaster position="bottom-right" toastOptions={{ duration: 4000 }} />
    </ContextsProvider>
  );
}

export default App;
