import { ReadOnlyState } from '@rx-state-utils/js';
import { useEffect, useState } from 'react';

function useStateStream<T extends Record<string, unknown>>(
  state: ReadOnlyState<T>
) {
  const [_state, setState] = useState<T>(state.get());

  useEffect(() => {
    const subscription = state.asObservable().subscribe(setState);
    return () => subscription.unsubscribe();
  }, []);

  return _state;
}

export { useStateStream };
