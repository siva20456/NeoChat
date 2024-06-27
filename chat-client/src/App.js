
import './App.css';
import Login from './components/Login';
import Chat from './components/chat';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Chat />} />
      </Routes>
      </Router>
    </div>
  );
}

export default App;
