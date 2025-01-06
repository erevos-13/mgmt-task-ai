import { Route, Routes } from 'react-router-dom';
import Nav from './components/nav';
import Home from './pages/home/home';
import Profile from './pages/profile/profile';
import Settings from './pages/settings/settings';

export function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

export default App;
