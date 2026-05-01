import { redirect } from "next/navigation";


function page() {
  redirect('/home/dashboard');
  return null;
}

export default page