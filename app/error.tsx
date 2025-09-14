'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        fontFamily: 'system-ui',
        gap: 12,
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ margin: 0 }}>Oops! Something went wrong.</h1>
        <p style={{ opacity: 0.7, marginTop: 8 }}>
          Please try again. If the problem persists, contact support.
        </p>
      </div>
      <button
        onClick={() => reset()}
        style={{
          background: '#2563eb',
          color: '#fff',
          border: 'none',
          padding: '10px 16px',
          borderRadius: 8,
          cursor: 'pointer',
        }}
      >
        Try again
      </button>
    </main>
  );
}
