import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from '@/lib/theme';
import { AuthProvider } from '@/contexts/AuthContext';

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ThemeProvider>
);
