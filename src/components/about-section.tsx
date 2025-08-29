import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { FaGithub, FaLinkedin } from "react-icons/fa"
import ContactButton from "./contact-button"

export function AboutSection() {
  return (
    <section className="min-h-screen bg-background py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-screen justify-between gap-12">
          {/* Profile Image */}
          <div className="flex justify-center align-middle lg:justify-start flex-grow">
            <div className="relative">
              <Image
                src="/headshot.JPG"
                alt="Profile photo"
                className="rounded-2xl object-cover shadow-lg w-full min-w-[150px]"
                height={250}
                width={200}
              />
            </div>
          </div>

          {/* About Content */}
          <div className="flex gap-6 flex-col flex-grow">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Hi, I'm <span className="text-primary">Blake Stambaugh</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                I graduated from the University of Utah with a Bachelor's degree in Computer Science and I am actively pursuing a career in
                software development. Throughout my time in college, I worked on a variety of different projects from websites to dashboards.

                My most recent project is The River Report, an online dashboard that displays important river information for customers 
                at Outdoor Adventures. I like to build projects that solve real world problems and actually help people, rather than projects
                that will collect dust on a resume forever.

                In the future, I hope to be creating more amazing projects that will help others strive. I hope that I can create solutions for 
                people's problems and help their business to succeed.
              </p>
            </div>

            {/* Skills */}
            <Card className="bg-gray-100">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Key Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {["Python", "SQL", "TypeScript", "Django", "React", "Next.js", "Cloud Tools", "Tailwind CSS"].map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-green-100 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <div className="flex gap-4">
              <Button size="lg" className="flex items-center gap-2" asChild>
                <a href="https://github.com/YUMM13" target="_blank">
                  <FaGithub className="w-5 h-5" />
                  GitHub
                </a>
              </Button>
              <Button size="lg" variant="outline" className="flex items-center gap-2 bg-transparent" asChild>
                <a href="https://www.linkedin.com/in/blake-stambaugh" target="_blank">
                  <FaLinkedin className="w-5 h-5" />
                  LinkedIn
                </a>
              </Button>
              {/* contact me button */}
              <ContactButton/>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
