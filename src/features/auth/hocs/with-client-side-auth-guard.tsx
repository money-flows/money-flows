import "client-only";

import { useUser } from "@clerk/nextjs";

export function withClientSideAuthGuard<TProps extends object>(
  WrappedComponent: React.ComponentType<TProps>,
  fallback?: React.ReactNode,
) {
  return function ComponentWithTheme(props: TProps) {
    const user = useUser();

    if (!user.isLoaded) {
      return fallback ?? null;
    }

    return <WrappedComponent {...(props as TProps)} />;
  };
}
