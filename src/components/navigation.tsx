"use client"
import { Button } from "@/components/ui/button"

interface NavigationProps {
  activeSection: "about" | "projects"
  onSectionChange: (section: "about" | "projects") => void
}

export function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  return (
    <nav className="sticky top-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary-foreground">Blake Stambaugh&apos;s Developer Portfolio</h1>
          <div className="flex gap-2">
            <Button
              variant={activeSection === "about" ? "secondary" : "ghost"}
              onClick={() => onSectionChange("about")}
              className={
                activeSection === "about"
                  ? ""
                  : "text-primary-foreground hover:text-primary-foreground hover:bg-primary-foreground/10"
              }
            >
              About Me
            </Button>
            <Button
              variant={activeSection === "projects" ? "secondary" : "ghost"}
              onClick={() => onSectionChange("projects")}
              className={
                activeSection === "projects"
                  ? ""
                  : "text-primary-foreground hover:text-primary-foreground hover:bg-primary-foreground/10"
              }
            >
              Projects
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
