import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Patterns from './pages/Patterns';
import ProblemView from './pages/ProblemView';
import AnkiReview from './pages/AnkiReview';
import ImportProblem from './pages/ImportProblem';

function App() {
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
