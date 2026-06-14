import { Outlet } from "react-router-dom";
import Footer from "~/components/Footer";
import Header from "~/components/Header";

export default function MasterLayout() {
  return (
    <>
      xin chao
      <Header />
      <Outlet /> {/* children render ở đây */}
      <Footer />
    </>
  );
}
