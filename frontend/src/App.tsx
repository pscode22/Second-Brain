import ContextsProvider from './contexts';
import RoutesOutlet from './routes';

function App() {
  return (
    <ContextsProvider>
      <RoutesOutlet />
    </ContextsProvider>
  );
}

export default App;
