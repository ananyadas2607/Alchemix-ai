import React from 'react';
import { checkBackendHealth } from '../utils/api';
import { useState, useEffect } from 'react';

export default function YourComponent() {
  const [isBackendAvailable, setIsBackendAvailable] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const isHealthy = await checkBackendHealth();
        setIsBackendAvailable(isHealthy);
        setError(null);
      } catch (err) {
        setIsBackendAvailable(false);
        setError(err instanceof Error ? err.message : 'Request timed out. Please try again later.');
      }
    };
    
    checkHealth();
  }, []);

  if (!isBackendAvailable) {
    return (
      <div className="error-message">
        {error || 'Backend service is currently unavailable. Please try again later.'}
      </div>
    );
  }

  return (
    <div>
      {/* Your normal component content */}
      <h1>Component Content</h1>
    </div>
  );
} 