import { useState, useEffect, useCallback, DependencyList } from 'react';

export type AsyncState<T> =
| {
  loading: true;
  error?: undefined;
  value?: undefined;
}
| {
  loading: false;
  error: Error;
  value?: undefined;
}
| {
  loading: false;
  error?: undefined;
  value: T;
};

const useAsync = <T>(fn: () => Promise<T>, deps: DependencyList) => {
  const [state, set] = useState<AsyncState<T>>({
    loading: true
  });
  const memoized = useCallback(fn, deps);

  useEffect(() => {
    let mounted = true;
    set({
      loading: true
    });
    const promise = memoized();

    promise.then(
      value => {
        if (mounted) {
          set({
            loading: false,
            value
          });
        }
      },
      error => {
        if (mounted) {
          set({
            loading: false,
            error
          });
        }
      }
    );

    return () => {
      mounted = false;
    };
  }, [memoized]);

  return state;
};

export default useAsync;
