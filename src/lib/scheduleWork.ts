/** Small, serialized background jobs leave input and scrolling room to run. */
const queue: Array<() => Promise<void>> = [];
let pending = false;

function scheduleNext() {
  if (pending || !queue.length) return;
  pending = true;
  const run = () => {
    const job = queue.shift();
    if (!job) { pending = false; return; }
    job().finally(() => { pending = false; scheduleNext(); });
  };
  if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(run, { timeout: 1000 });
  else window.setTimeout(run, 32);
}

export function scheduleWork<T>(work: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    queue.push(async () => { try { resolve(await work()); } catch (error) { reject(error); } });
    scheduleNext();
  });
}

export function yieldToBrowser(): Promise<void> {
  const scheduler = (globalThis as typeof globalThis & { scheduler?: { yield: () => Promise<void> } }).scheduler;
  return scheduler?.yield() ?? new Promise(resolve => window.setTimeout(resolve, 0));
}
