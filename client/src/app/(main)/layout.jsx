import Footer from "@/layouts/Footer";
import Navbar from "@/layouts/Navbar";

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
