import { SingtonClass } from "./SingtonClass";

type timeouthandler = (any) => any;

export class timer {
    time: number; //秒
    countertime: number;
    callback: timeouthandler;
    listenerObj: any;
    repeat: number;
    param: any;
    active: boolean;
}

/**计时控制器 */
export class TimeManager extends SingtonClass {
    m_timelist: Array<timer> = new Array<timer>();
    public update(deltaTime: number) {
        for (let i = this.m_timelist.length - 1; i >= 0; --i) {
            var timer = this.m_timelist[i];
            if (timer.active) {
                if (timer.time > 0) {
                    timer.time -= deltaTime;
                }
                if (timer.time <= 0) {
                    if(timer.callback) {
                        if(timer.listenerObj) {
                            timer.callback.call(timer.listenerObj, timer.param);
                        } else {
                            timer.callback(timer.param);
                        }
                    }
                    
                    if (timer.active) {
                        if (timer.repeat == -1) {
                            timer.time = timer.countertime;
                        }
                        else if (timer.repeat > 0) {
                            timer.time = timer.countertime;
                            timer.repeat--;
                        }
                        else if (timer.repeat == 0) {
                            timer.active = false;
                            this.m_timelist.splice(i, 1);
                        }
                    }
                }
            }

        }
    }

    public async waitAsync(delay: number, listenerObj?: any): Promise<void> {
        return new Promise((resolve, error) => {
            this.scheduleOnce(delay, () => { resolve() }, listenerObj);
        });
    }

    public schedule(interval: number, startdelay: number, repeat: number, cb: timeouthandler, listenerObj?: any, ...param: any[]): timer {
        let newtimer = new timer();
        newtimer.time = startdelay > 0 ? startdelay : interval;
        newtimer.callback = cb;
        newtimer.listenerObj = listenerObj;
        newtimer.repeat = repeat;
        newtimer.countertime = interval;
        newtimer.active = true;
        newtimer.param = param;

        this.m_timelist.push(newtimer);
        return newtimer;
    }

    public scheduleOnce(delay: number, cb: timeouthandler, listenerObj?: any, ...param: any[]) {
        return this.schedule(delay, 0, 0, cb, listenerObj);
    }

    public unSchedule(untimer: timer) {
        if(untimer == null)
            return;
        
        for (let i = this.m_timelist.length - 1; i >= 0; --i) {
            if (this.m_timelist[i] == untimer) {
                untimer.active = false;
                this.m_timelist.splice(i, 1);
                break;
            }
        }
    }
}