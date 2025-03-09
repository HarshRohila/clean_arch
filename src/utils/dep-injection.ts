import { DependencyIds, newInstance } from "@/config/main";
import { useRef } from "react";

function useComponentScoped<T>(key: DependencyIds) {
  const instanceRef = useRef<T>(null);

  if (instanceRef.current === null) {
    instanceRef.current = newInstance(key) as T;
  }

  return instanceRef.current;
}

export { useComponentScoped };
