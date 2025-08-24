
/* 字符串工具类*/
export class StringUtil {
    //字符串格式化工具
    //     const result = YourClass.format("Hello {0}, your score is {1}!", "Alice", 95);
    // console.log(result); // 输出: "Hello Alice, your score is 95!"
    public static format(str: string, ...args: any[]) {
        let re = /{\d}/g;
        let zhanwei = str.match(re);
        for (let i = 0; i < zhanwei.length; i++) {
            str = str.replace(zhanwei[i], args[i])
        }
        return str
    }

    /**
 * 判断一个字符串是否为空或Null
 */
    static isNullOrEmpty(str: string) {
        return str == null || str == "" || str == undefined || str.length == 0;
    }
}