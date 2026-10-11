import React, { useEffect, useRef } from "react";

interface LandingViewProps {
  /** Called when the intro page's "Login Now" / "Login" button is pressed. */
  onLogin: () => void;
}

/**
 * The interactive Blue Lock merch intro (public/intro.html), shown full screen
 * to guests before the login / sign-up page. The page tells us when its login
 * button is pressed through postMessage.
 */
export const LandingView: React.FC<LandingViewProps> = ({ onLogin }) => {
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.source !== frame.current?.contentWindow) return;
      if (e.data?.type === "footverse:login") onLogin();
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onLogin]);

  return (
    <div className="fixed inset-0 bg-[#1b4295]">
      <iframe ref={frame} src="/intro.html" title="FootVerse Blue Lock merch intro" className="w-full h-full border-0" />
    </div>
  );
};
