import { Outlet } from "react-router-dom";

export default function MasterLayout() {
  return (
    <>
      xin chao
      {/* <Navbar /> */}
      <Outlet /> {/* children render ở đây */}
      {/* <Footer /> */}
    </>
  );
}
