import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Patterns from './pages/Patterns';
import ProblemView from './pages/ProblemView';
import AnkiReview from './pages/AnkiReview';
import ImportProblem from './pages/ImportProblem';
import Login from './pages/Login';

function App() {
  const { user, isGuest, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-700 border-t-blue-400" />
      </div>
    );
  }

  if (!user && !isGuest) {
    return <Login />;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="patterns" element={<Patterns />} />
        <Route path="problem/:id" element={<ProblemView />} />
        <Route path="anki" element={<AnkiReview />} />
        <Route path="import" element={<ImportProblem />} />
      </Route>
    </Routes>
  );
}

export default App;
