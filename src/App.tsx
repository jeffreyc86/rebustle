import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GameScreen } from './pages/GameScreen';
import { GMScreen } from './pages/GMScreen';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GameScreen />} />
        <Route path="/gm" element={<GMScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
