import { fork } from "child_process";

export const CHILD_PROCESS_READY = "CHILD_PROCESS_READY";

export const forkSync = (...args: Parameters<typeof fork>) => {
  return new Promise((resolve, reject) => {
    const child = fork(...args);

    child.on("message", (data) => {
      if (data === CHILD_PROCESS_READY) {
        resolve(true);
      }
    });
  });
};