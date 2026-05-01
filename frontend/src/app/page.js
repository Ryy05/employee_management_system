import { redirect } from "next/navigation";


function page() {
  redirect('/login');
  return null;
}

export default page