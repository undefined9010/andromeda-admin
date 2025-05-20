import ClaimRequestsList from "./components/ClaimRequests/ClaimRequests.tsx";
import ApprovalTable from "@/components/Approval/ApprovalTable.tsx";

function App() {
  return (
    <>
      <ApprovalTable />
      <ClaimRequestsList />
    </>
  );
}

export default App;
