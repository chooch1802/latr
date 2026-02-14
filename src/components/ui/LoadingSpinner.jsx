export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <img
        src="/latr-logo.png"
        alt="Loading"
        className="h-16 animate-pulse"
      />
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  )
}
