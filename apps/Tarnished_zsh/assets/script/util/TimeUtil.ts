/**时间工具 */
export class TimeUtil {
    /**当前时间戳 */
    public static get now(): number {
        return new Date().getTime()
    }

    /**当前秒 */
    public static get nowSeconds(): number {
        return Math.round(this.now / 1000);
    }

    // public static timeToClient(time: string): string {
    //     return new Date(parseInt(time)).toLocaleDateString()
    // }

    // public static settingToTimesStamp(time: string): number {
    //     return Date.parse(time)
    // }

    /**
     * 格式化时间戳
     * @param timestamp 时间戳
     * @param format 格式化格式   "YYYY-MM-DD hh:mm:ss"
     * @returns 
     */
    public static formatTimestamp(timestamp, format) {//transTimestamp
        var date = new Date(timestamp);
        // 年
        var Y = date.getFullYear();
        // 月
        var m = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
        // 日
        var d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        // 小时
        var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        // 分钟
        var i = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        // 秒
        var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        return format.replace(/YYYY/g, Y).replace(/MM/g, m).replace(/DD/g, d).replace(/hh/g, h).replace(/mm/g, i).replace(/ss/g, s);
    }

    /**
     * 格式化时间戳
     * @param timestamp 时间戳
     * @param format 格式化格式   "YYYY-MM-DD hh:mm:ss"
     * @returns 
     */
    public static formatUTCTimestamp(timestamp, format) {//transTimestamp
        var date = new Date(timestamp);
        // 年
        var Y = date.getUTCFullYear();
        // 月
        var m = (date.getUTCMonth() + 1) < 10 ? '0' + (date.getUTCMonth() + 1) : (date.getUTCMonth() + 1);
        // 日
        var d = date.getUTCDate() < 10 ? '0' + date.getUTCDate() : date.getUTCDate();
        // 小时
        var h = date.getUTCHours() < 10 ? '0' + date.getUTCHours() : date.getUTCHours();
        // 分钟
        var i = date.getUTCMinutes() < 10 ? '0' + date.getUTCMinutes() : date.getUTCMinutes();
        // 秒
        var s = date.getUTCSeconds() < 10 ? '0' + date.getUTCSeconds() : date.getUTCSeconds();
        return format.replace(/YYYY/g, Y).replace(/MM/g, m).replace(/DD/g, d).replace(/hh/g, h).replace(/mm/g, i).replace(/ss/g, s);
    }

    /**
     * 显示时间1小时内、1小时前、2小时前、X小时前、1天前、X天前
     * @param unixTime 时间戳
     * @returns 
     */
    static formatRoughlyTime(unixTime) {
        let second = unixTime / 1000
        if (second >= 86400) {
          //  return Math.floor(second / 86400) + GCodeStr("code_day_ago");
        }
        let hours = Math.floor(second / 3600)
        if (hours == 0) {
         //    return GCodeStr("code_hour_within");
        }
        // return hours + GCodeStr("code_hour_ago");
    }


    /**
     * 根据秒 算出时间 格式  xx天xx时xx分xx秒
     * @param sec 秒
     * @param showSecond 是否显示秒
     * @returns 1天10时20分15秒
     */
    static transSeconds1(sec: number, showSecond: boolean = true): string {
        let ShowStr: string = "";
        if (sec >= (86400)) {
           //  ShowStr += Math.floor((sec / 86400)) + GCodeStr("code_day");
            sec %= 86400;
        }

        if (sec >= 3600) {
          //   ShowStr += Math.floor((sec / 3600)) + GCodeStr("code_hour");
            sec %= 3600;
        }

        if (sec >= 60) {
          //   ShowStr += Math.floor((sec / 60)) + GCodeStr("code_minute");
            sec %= 60;
        }

        if (sec >= 0 && showSecond == true) {
           //  ShowStr += sec + GCodeStr("code_second");
        }

        return ShowStr
    }

    /**根据秒数 0-9填充"0"**/
    static secondFill(orgStr: any, len: number = 2, fillStr: string = "0"): string {
        orgStr = String(orgStr);
        let rs: string = orgStr;
        while (rs.length < len) {
            rs = fillStr + rs;
        }
        return rs
    }

    /**
     * 根据秒 算出时间 格式  00:00:00
     * @param sec 秒
     * @param showHour 是否显示时
     * @param showSecs 是否显示秒
     * @returns 00:00:00
     */
    static transSeconds2(sec: number, showHour: boolean = true, showSecs: boolean = true): string {
        sec = sec < 0 ? 0 : sec;
        let hour: number = Math.floor(sec / 3600);
        let min: number = Math.floor(sec / 60) % 60;
        let secs: number = Math.floor(sec % 60);
        if (showHour == true || hour > 0) {
            return this.secondFill(hour) + ":" + this.secondFill(min) + (showSecs ? (":" + this.secondFill(secs)) : "")
        }
        return this.secondFill(min) + (showSecs ? (":" + this.secondFill(secs)) : "")
    };

    /**
     * 根据秒 算出时间 大于1天显示：x天， 大于1小时显示：x小时 ,不足一小时显示：x分钟 ，不足1分钟显示：x秒
     * @param second 秒数
     * @returns x天 => x小时 => x分钟 => x秒
     */
    static transSeconds3(second) {
        let d = Math.floor(second / 86400);
        if (d > 1) {
          //   return d + GCodeStr("code_day");
        } else {
            let h = Math.floor(second / 3600);
            if (h > 0) {
            //     return h + GCodeStr("code_time_h");
            } else {
                let m = Math.floor(second / 60);
                if (m > 0) {
              //       return m + GCodeStr("code_time_m");
                } else {
                //     return Math.floor(second) + GCodeStr("code_time_s");
                }
            }
        }
    }
    /** 判断时间戳是否在两个时间点[[19,30],[20,0]]的区间内*/
    static isTimeInRange(time:number,timeRange:number[][]){
        let currentTime  = new Date(time);
        const startTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), timeRange[0][0], timeRange[0][1]);
        const endTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), timeRange[1][0], timeRange[1][1]);
        return currentTime >= startTime && currentTime <= endTime;
    }

    /**
     * 根据秒 算出时间 x天 00:00:00
     * @param second 秒数
     * @returns 1天 10:00:00
     */
    static transSeconds4(second) {
        let d = Math.floor(second / 86400);
        if (d >= 1) {
       //      return d + GCodeStr("code_day") + this.transSeconds2(second - d * 86400);
        } else {
            return this.transSeconds2(second);
        }

    }
    /** 判断两个时间戳之间的差距是否达到x小时 */
    static isTimeGap(time1:number,time2:number,gap:number):boolean{
        // 计算两个时间戳的差值
        const difference = Math.abs(time1 - time2);
        // 将毫秒转换为小时
        const hoursDifference = difference / (1000 * 60 * 60);
        // 检查差值是否等于或超过6小时
        return hoursDifference >= gap;
    }
    /**
     * 根据秒 算出时间 x天 00:00:00
     * @param second 秒数
     * @returns  大于1天返回天数 小于1天返回 00:00:00
     */
    static transSeconds5(second) {
        let d = Math.floor(second / 86400);
        if (d >= 1) {
        //     return d + GCodeStr("code_day")
        } else {
            return this.transSeconds2(second);
        }
    }

    /**
     * 根据秒 算出时间 x天x小时
     * @param second 秒数
     * @returns  大于1天返回天数小时 小于1天返回小时
     */
    static  transSeconds6(seconds: number): string {
        const days = Math.floor(seconds / (3600 * 24));
        const remainingSeconds = seconds % (3600 * 24);
        const hours = Math.floor(remainingSeconds / 3600);
    
        if (days > 0) {
        //     return GCodeStrFormat("code_shop_timeDay",days,hours)
            // return `${days}天${hours}小时`;
        } else {
            // return GCodeStrFormat("code_shop_timeDayHour",hours)
         //    return GCodeStrFormat("code_shop_timeMin",this.transSeconds5(seconds))
            // return `${hours}小时`; code_shop_timeMin
        }

        return "ceshi"
    }
    /**
     * 根据秒 算出时间 x天,不足一天按照一天
    */
    static transSeconds7(seconds: number):number{
        const days:number = Math.ceil(seconds / (3600 * 24));
        return days
    }
}