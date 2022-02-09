import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <input
          type="date"
          onChange={(e) => {
            const date = e.target.value;
            const tzString = date + "T00:00:00Z";
          }}
        />
      </header>
    </div>
  );
}

export default App;
