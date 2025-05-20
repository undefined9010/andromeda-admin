import "./App.css";
import ApprovalList from "./components/ApprovalsList/ApprovalsList.tsx";
import ClaimRequestsList from "./components/ClaimRequests/ClaimRequests.tsx";

function App() {
  return (
    <>
      <ApprovalList />
      <ClaimRequestsList />
    </>
  );
}

export default App;
