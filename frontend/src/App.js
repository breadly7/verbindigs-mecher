import Differences from './pages/Differences';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4">
        <div className="container mx-auto">
          <h1 className="text-white text-2xl">Verbindigs Mecher</h1>
        </div>
      </nav>
      <div className="container mx-auto py-4">
        <Differences />
      </div>
    </div>
  );
}

export default App;
