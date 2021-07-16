// core components
import './App.css';
import AppState from './AppState';
import TogglableSidebarLayout from './components/Layout/TogglableSidebarLayout';


const appState = new AppState();

function App() {
  return (
    <TogglableSidebarLayout appState={ appState } />
  );
}

export default App;
