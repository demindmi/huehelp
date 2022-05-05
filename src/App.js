import ControlsHub from "./components/Logic/ControlsHub";
import LampProvider from "./components/Store/LampProvider";

function App() {
  return (
    <LampProvider>
      <ControlsHub />
    </LampProvider>
  );
}

export default App;
