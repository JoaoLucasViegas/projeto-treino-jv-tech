import React from 'react';
import { useState } from 'react';
import Navbar from './components/Navbar';
import CatalogPage from './pages/CatalogPage';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'mylist'>('catalog');
  
  return (
    <>
    <Navbar
    activeTab={activeTab}
    setActiveTab={setActiveTab}
    favoritesCount={0}
    />
    
    <CatalogPage onOpenReview={(m) => console.log(m.title)} favoriteMovieIds={[]} />
    
    
  </>);
};
