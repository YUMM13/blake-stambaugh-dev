import Link from "next/link";

export default function Home() {
  return (
    <p className="bg-blue-500 text-white h-1">Welcome to the home page, click here to go to the <Link href="/river-report/">river report</Link></p>
  )
}
