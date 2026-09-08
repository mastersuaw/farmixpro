import './App.css'
import { AppProviders } from '@/app/providers';
import { AppRouter } from '@/app/router';
import { ToastProvider } from '@/shared/ToastContext';

function App() {
  return (
    <AppProviders>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </AppProviders>
  );
}

export default App
