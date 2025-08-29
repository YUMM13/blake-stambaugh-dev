"use client"
import { useEffect } from "react";
import { Button } from "./ui/button";
import { IoMail } from "react-icons/io5";

export default function ContactButton() {
  useEffect(() => {
    // Ensure reCAPTCHA script has loaded before binding
    const timer = setInterval(() => {
      // @ts-ignore
      if (window.grecaptcha && window.grecaptcha.render) {
        clearInterval(timer)
        // render invisible reCAPTCHA in background
        // @ts-ignore
        window.grecaptcha.render("recaptcha-container", {
          sitekey: "6LfHO7YrAAAAANhu21ibFjOR4MTJRcLN3Rmy_-1F",
          size: "invisible",
          callback: onCaptchaSuccess,
        })
      }
    }, 500)

    return () => clearInterval(timer)
  }, [])

  function handleClick() {
    // @ts-ignore
    if (window.grecaptcha) {
      // @ts-ignore
      window.grecaptcha.execute()
    }
  }

  function onCaptchaSuccess() {
    const email = "blakestambaugh1" + "@gmail.com"
    window.open(`mailto:${email}`, "_blank")
  }

  return (
    <>
        <Button 
            size="lg" 
            variant="outline" 
            className="flex items-center gap-2 bg-transparent"
            onClick={handleClick}>
            <IoMail className="w-5 h-5" />
            Contact
        </Button>
        {/* hidden container where reCAPTCHA mounts */}
        <div id="recaptcha-container"></div>
    </>
  );
}