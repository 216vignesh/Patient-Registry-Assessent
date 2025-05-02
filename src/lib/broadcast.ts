const bc = new BroadcastChannel('patients-db-sync');

type Handler = () => void;
const listeners = new Set<Handler>();

export function notifyMutation() {
  bc.postMessage('db-mutated');
}


export function onMutations(cb: Handler) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

bc.addEventListener('message', () => {
  listeners.forEach(fn => fn());
});
