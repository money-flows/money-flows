import { useMedia } from "react-use";

export function useIsMobile() {
  return useMedia("(max-width: 1023px)", false);
}
