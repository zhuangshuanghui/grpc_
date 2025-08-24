/**
 * 单例基类
 */
export class SingtonClass {
    /**
     * 获取一个单例
     * @returns {any}
     */
    public static getInstance<T = any>(this, ...param: any[]): T {
        let Class: any = this;
        if (!Class._inst) {
            Class._inst = new Class(...param);
        }
        return Class._inst;
    }
}

