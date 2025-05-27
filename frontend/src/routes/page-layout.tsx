import { Outlet } from "react-router-dom";
import Header from "../components/ui/Header";

export default function PageLayout() {
  return (
    <>
      <Header setModalOpen={setModelOpen} />
      <main className="mt-7 flex flex-wrap gap-3 border-1">
        <Outlet />
      </main>
    </>
  );
}
