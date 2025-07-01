import * as React from "react"

const MOBILE_MAX = 767
const TABLET_MIN = 768
const TABLET_MAX = 1023
const DESKTOP_MIN = 1024

type Breakpoint = "mobile" | "tablet" | "desktop"

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<Breakpoint>(() => {
    if (typeof window !== "undefined") {
      return getBreakpoint(window.innerWidth)
    }
    return "desktop" // fallback inicial
  })

  React.useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getBreakpoint(window.innerWidth))
    }

    window.addEventListener("resize", handleResize)
    handleResize() // chama na montagem

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const isMobile = breakpoint === "mobile"
  const isTablet = breakpoint === "tablet"
  const isDesktop = breakpoint === "desktop"

  return { breakpoint, isMobile, isTablet, isDesktop }
}

function getBreakpoint(width: number): Breakpoint {
  if (width <= MOBILE_MAX) return "mobile"
  if (width >= TABLET_MIN && width <= TABLET_MAX) return "tablet"
  return "desktop"
}
