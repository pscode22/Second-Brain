import { AuthProvider } from './contexts/auth/provider';
import RoutesOutlet from './routes';

function App() {
  return (
    <AuthProvider>
      <RoutesOutlet />
    </AuthProvider>
  );
}

export default App;
