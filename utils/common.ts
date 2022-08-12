export function getIsMobile(): boolean {
  if(typeof window !== "undefined") {
    if(typeof (window?.navigator as any)?.userAgentData?.mobile !== "undefined")
      return (window?.navigator as any)?.userAgentData?.mobile

    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
      return true
    }
    
    return false;
  }
  return false;
};