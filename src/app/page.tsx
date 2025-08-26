"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { AboutSection } from "@/components/about-section"
import { ProjectsSection } from "@/components/projects-section"

export default function Home() {
  const [activeSection, setActiveSection] = useState<"about" | "projects">("about")

  return (
    <main data-gramm="false" data-gramm_editor="false" data-enable-grammarly="false" className="min-h-screen">
      <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />

      {activeSection === "about" && <AboutSection />}
      {activeSection === "projects" && <ProjectsSection />}
    </main>
  )
}

// import Link from "next/link";

// export default function Home() {
//   return (
//     <p className="bg-blue-500 text-black h-1">Welcome to the home page, click here to go to the <Link href="/river-report/">river report</Link></p>
//   )
// }
