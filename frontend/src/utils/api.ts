const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-backend-url.vercel.app';

// Circuit breaker state
let failureCount = 0;
let lastFailureTime = 0;
const FAILURE_THRESHOLD = 3;
const RESET_TIMEOUT = 30000; // 30 seconds

export const checkBackendHealth = async () => {
  // Check if circuit is open (too many recent failures)
  if (failureCount >= FAILURE_THRESHOLD) {
    const timeSinceLastFailure = Date.now() - lastFailureTime;
    if (timeSinceLastFailure < RESET_TIMEOUT) {
      console.warn('Circuit breaker is open, skipping health check');
      return false;
    }
    // Reset circuit breaker after timeout
    failureCount = 0;
  }

  try {
    const response = await fetch('/api/health', {
      signal: AbortSignal.timeout(3000),
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    
    if (!response.ok) {
      handleFailure();
      return false;
    }
    
    // Reset failure count on success
    failureCount = 0;
    return true;
  } catch (error) {
    handleFailure();
    return false;
  }
};

function handleFailure() {
  failureCount++;
  lastFailureTime = Date.now();
  console.error(`Health check failed. Failure count: ${failureCount}`);
}

// Example usage in your components/pages
export async function someApiCall() {
  const isHealthy = await checkBackendHealth();
  if (!isHealthy) {
    throw new Error('Backend is not available');
    // or handle the error in your UI
    return;
  }
  
  // proceed with your API call
  const response = await fetch(`${API_URL}/your-endpoint`);
  // ... rest of your code
} 