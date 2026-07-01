import ThreadList from "./components/ThreadList.jsx";

// App is already wired. Your work happens in ThreadItem.jsx (edit + delete mutations).
export default function App() {
  return (
    <div className="wrap">
      <h1>Threadbase</h1>
      <p className="muted">Edit or delete a thread — then watch the right caches refresh.</p>
      <ThreadList />
    </div>
  );
}
