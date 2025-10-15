import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { FaGithub } from "react-icons/fa"

interface Project {
  id: number
  title: string
  description: string
  image: string
  githubUrl: string
  technologies: string[]
}

const projects: Project[] = [
  {
    id: 1,
    title: "Cat Finder",
    description:
      "An image processing system that automatically finds any cats in the image built using the cloud.",
    image: "./Cat Finder.drawio.png",
    githubUrl: "https://github.com/YUMM13/cat-finder",
    technologies: ["AWS", "Python", "JavaScript", "Data Pipeline", "Image Recognition"],
  },
  {
    id: 2,
    title: "Portfolio Website",
    description:
      "A modern, responsive portfolio website showcasing projects and skills (what you are looking at right now!).",
    image: "./personal site.png",
    githubUrl: "https://github.com/YUMM13/blake-stambaugh-dev",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel's v0"],
  },
  {
    id: 3,
    title: "The River Report",
    description:
      "A dashboard that displays key river information like flow rate, weather forecast, and historic data for customers at Outdoor Adventures.",
    image: "./river report.png",
    githubUrl: "https://yumm13.github.io/blake-stambaugh-dev/river-report",
    technologies: ["React", "Next.js", "OpenMeteo API", "USGS API", "TypeScript", "TailwindCSS"],
  },
  {
    id: 4,
    title: "Ruby Webscraper",
    description:
      "A webscraper powered by Ruby that pulls repository information for a specific GitHub organization.",
    image: "./ruby scraper.png",
    githubUrl: "https://github.com/YUMM13/ruby-scraper-and-sql",
    technologies: ["Ruby", "Webscrapting", "GitHub API", "SQLite", "ETL Pipelines"],
  },
  {
    id: 5,
    title: "ResearchFlow",
    description:
      "A mobile app that enables researchers at the University of Utah's Land-Atmosphere Interactions Research (LAIR) group to upload data to the cloud from field sites.",
    image: "./research flow.png",
    githubUrl: "https://github.com/YUMM13/Researchflow",
    technologies: ["React Native", "TypeScript", "APIs", "GitHub Authentication", "CI/CD Pipeline"],
  },
  {
    id: 6,
    title: "Learning Management Website",
    description:
      "A Learning Management Website similar to Canvas I built as a Fullstack Engineer",
    image: "./lms website.png",
    githubUrl: "https://github.com/University-of-Utah-CS3550/a2-css-layouts-YUMM13",
    technologies: ["Python", "Django", "JavaScript", "HTML/CSS", "AWS"],
  },
]

export function ProjectsSection() {
  return (
    <section className="min-h-screen bg-background py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            My <span className="text-primary">Projects</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Here are some of the projects I&apos;ve worked on. Each one represents a unique challenge and learning experience
            in my development journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="block relative">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={`${project.title} screenshot`}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      width={100}
                      height={48}
                    />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-primary text-primary-foreground p-2 rounded-full">
                        <FaGithub className="w-6 h-6" />
                      </div>
                    </div>
                  </a>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{project.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{project.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-green-100  text-xs rounded-md font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
