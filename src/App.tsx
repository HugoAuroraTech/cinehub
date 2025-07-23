import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Details } from './pages/Details';
import { SearchResults } from './pages/SearchResults';
import { Favorites } from './pages/Favorites';
import { Discover } from './pages/Discover';
import { Layout } from './components/Layout';
import { AppProvider } from './lib/context';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/movie/:id" element={<Details />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/favorites" element={<Favorites />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
