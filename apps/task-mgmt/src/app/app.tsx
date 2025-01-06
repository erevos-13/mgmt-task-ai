import { Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './context/auth-context';
import { queryClient } from './lib/react-query';
import { ProtectedRoute } from './components/protected-route';
import Nav from './components/nav';
import Home from './pages/home/home';
import Profile from './pages/profile/profile';
import Settings from './pages/settings/settings';
import Login from './pages/auth/login';
import Register from './pages/auth/register';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <>
                    <Nav />
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route
                        path="/settings"
                        element={
                          <ProtectedRoute requiredRole="ADMIN">
                            <Settings />
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
