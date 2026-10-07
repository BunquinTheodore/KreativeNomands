/**
 * One shared animation frame for many independent measure-then-write jobs. Each job reads layout in
 * `read()` and mutates the DOM in `write()`; every read of the frame runs before any write, so N jobs
 * cost one layout flush instead of N (interleaving getBoundingClientRect with style writes thrashes).
 */
export interface FrameJob {
  read(): void;
  write(): void;
}

const queued = new Set<FrameJob>();
let frame = 0;

function run(): void {
  frame = 0;
  const jobs = Array.from(queued);
  queued.clear();
  for (const job of jobs) job.read();
  for (const job of jobs) job.write();
}

export function scheduleJob(job: FrameJob): void {
  queued.add(job);
  if (!frame) frame = window.requestAnimationFrame(run);
}

export function cancelJob(job: FrameJob): void {
  queued.delete(job);
}
