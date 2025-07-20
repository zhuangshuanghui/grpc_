import { fork } from "child_process";
import { CHILD_PROCESS_READY } from "../scene/base/Scene";

export const forkSync = (...args: Parameters<typeof fork>) => {
  return new Promise<void>((resolve, reject) => {
    const child = fork(...args);

    child.on("message", (data) => {
      if (data === CHILD_PROCESS_READY) {
        resolve();
      }
    });
  });
};
