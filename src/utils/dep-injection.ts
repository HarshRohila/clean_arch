import { DependencyIds, dependencyInjectionMap } from "@/config/main";
import { useRef } from "react";
import { SingletonContainer } from "singleton-injection";

function newInstance(key: DependencyIds) {
  return dependencyInjectionMap[key]();
}

function useComponentScoped<T>(key: DependencyIds) {
  const instanceRef = useRef<T>(null);

  if (instanceRef.current === null) {
    instanceRef.current = newInstance(key) as T;
  }

  return instanceRef.current;
}

const container = new SingletonContainer(dependencyInjectionMap);

export { useComponentScoped, container };
