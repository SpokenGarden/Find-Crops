import { useEffect } from "react";

export function useOutsideClick(ref, onOutsideClick, active = true) {
  useEffect(() => {
    if (!active) return undefined;

    const handleClick = (event) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (ref.current && !ref.current.contains(target)) {
        onOutsideClick(event);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [active, onOutsideClick, ref]);
}
