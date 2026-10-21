"use client";

import { useEffect } from "react";

export function AnchorScroll() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest("a");
      if (!anchor || anchor.target === "_blank") return;
      const raw = anchor.getAttribute("href");
      if (!raw || raw.startsWith("mailto:") || raw.startsWith("tel:")) return;

      let url: URL;
      try {
        url = new URL(anchor.href, location.href);
      } catch {
        return;
      }
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.hash.length < 2) return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;

      // preventDefault だけにする。ここで伝播を止めると、メニューを閉じる onClick まで届かない。
      event.preventDefault();
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      history.replaceState(history.state, "", `${url.pathname}${url.search}${url.hash}`);
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
