import { ReactNode } from "react"
import { useBreakpoint } from "@/hooks/useBreakpoint"

type Props = {
  children: ReactNode
}

export function OnlyMobile({ children }: Props) {
  const { isMobile } = useBreakpoint()
  return isMobile ? <>{children}</> : null
}

export function OnlyTablet({ children }: Props) {
  const { isTablet } = useBreakpoint()
  return isTablet ? <>{children}</> : null
}

export function OnlyDesktop({ children }: Props) {
  const { isDesktop } = useBreakpoint()
  return isDesktop ? <>{children}</> : null
}
