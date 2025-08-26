import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { FaGithub, FaLinkedin } from "react-icons/fa"
import { IoMail } from "react-icons/io5"

export function AboutSection() {
  return (
    <section className="min-h-screen bg-background py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Profile Image */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              <Image
                src="/headshot.JPG"
                alt="Profile photo"
                className="rounded-2xl object-cover shadow-lg"
                width={300}
                height={80}
              />
              <div className="absolute inset-0 rounded-2xl bg-primary/10"></div>
            </div>
          </div>

          {/* About Content */}
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Hi, I'm <span className="text-primary">Blake Stambaugh</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Basic info about me
              </p>
            </div>

            {/* Skills */}
            <Card>
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
                <a href="https://github.com/YUMM13">
                  <FaGithub className="w-5 h-5" />
                  GitHub
                </a>
              </Button>
              <Button size="lg" variant="outline" className="flex items-center gap-2 bg-transparent" asChild>
                <a href="https://www.linkedin.com/in/blake-stambaugh">
                  <FaLinkedin className="w-5 h-5" />
                  LinkedIn
                </a>
              </Button>
              <Button size="lg" variant="outline" className="flex items-center gap-2 bg-transparent">
                <IoMail className="w-5 h-5" />
                Contact
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
