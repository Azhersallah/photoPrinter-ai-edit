import React from 'react';
import { usePhotos } from '../../context/PhotoContext';
import EmptyState from './EmptyState';
import PageView from './PageView';

const MainContent: React.FC = () => {
  const { photos } = usePhotos();

  return (
    <main className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 overflow-y-auto min-h-0">
      {photos.length === 0 && (
        <EmptyState />
      )}
      <div className="flex-1 min-h-0">
        <PageView />
      </div>
    </main>
  );
};

export default MainContent;
