import Sidebar from "./components/Sidebar";

export const metadata = {
  title: "Admin Panel",
  description: "Admin Dashboard Layout",
};

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100">{children}</div>
    </div>
  );
}
