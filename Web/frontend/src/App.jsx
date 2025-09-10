import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, useTheme } from './components/ThemeProvider';
import Navbar from './includes/Navbar';
import Footer from './includes/Footer';

/* Pages */
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Listing from './pages/Listing';
import ServiceDetails from './pages/ServiceDetails';
import FAQPage from './pages/FAQ';

function AppContent() {
  const { theme, resolvedTheme, toggleTheme } = useTheme();

  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar theme={theme} resolvedTheme={resolvedTheme} toggleTheme={toggleTheme} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/listing" element={<Listing />} />
            <Route path="/service/:id" element={<ServiceDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;