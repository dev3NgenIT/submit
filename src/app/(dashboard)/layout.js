import Footer from "@/components/shared/Footer/Footer";
import Header from "@/components/shared/Header/Header";

export default function DashboardLayout({ children }) {
  // ← Add { children } here
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
