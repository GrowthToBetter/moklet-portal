
import NAVBAR from "./comp-nav";

export const NAV_ITEMS = [
  {
    label: "Home",
    child:[{
      label: "Home",
      href: "/",
    },{
      label:"Pengembang",
      href:"/pengembang",
    }]
  },
  {
    label: "ajukan",
    href: "https://moklet-port.vercel.app/product",
  }
];
export default async function Navbar(){
  return (
    <NAVBAR />
  )
}