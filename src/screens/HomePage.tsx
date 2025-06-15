import React from "react";
import ClaimRequests from "../components/ClaimRequests/ClaimRequests";
import { useAuthStore } from "../store/authStore";
import ApprovalTable from "@/components/Approval/ApprovalTable.tsx"; // Используем Zustand

const HomePage: React.FC = () => {
  const isLoadingAuth = useAuthStore((state) => state.isLoadingAuth);

  if (isLoadingAuth) {
    return <div>Загрузка пользовательских данных...</div>;
  }

  return (
    <div className="flex w-full flex-col h-screen gap-8 px-8">
      <ApprovalTable />
      <ClaimRequests />
    </div>
  );
};

export default HomePage;
