/**
 * 数组接口扩展
 */
export class ArrayUtil {
    static indexOf(arr: any[], keyName: string, keyValue) {
        for (let i = 0, len = arr.length; i < len; ++i) {
            if (arr[i][keyName] == keyValue)
                return i
        }
        return -1
    }

    /**
     * 通过元素内某字段获取指定元素
     * @param keyName 字段名
     * @param keyValue 要查找的元素指定字段名对应的值
     * @param remove 是否删除
     */
    static getValue(arr: Array<any>, keyName: string, keyValue, remove: boolean = false) {
        let item
        for (let i = 0, len = arr.length; i < len; ++i) {
            item = arr[i]
            if (item && item[keyName] == keyValue) {
                if (remove)
                    arr.splice(i, 1)
                return item
            }
        }
        return null
    }

    /**
     * 获取列表内容的索引
     * @param arr 
     * @param item 
     */
    public static findIndex(arr: Array<any>, item) {
        return arr.findIndex((value) => value == item);
    }

    /**
     * 添加指定元素(元素唯一)
     */
    public static add(arr: Array<any>, item) {
        if (arr.indexOf(item) == -1)
            arr.push(item)
    }

    /**
     * 删除指定元素
     */
    public static remove(arr: Array<any>, item): boolean {
        let idx = arr.indexOf(item)
        if (idx != -1)
            arr.splice(idx, 1);
        return idx != -1
    }
    /**
    * 删除指定位置元素
    */
    public static removeAt(arr: Array<any>, index: number) {
        arr.splice(index, 1)
    }
    /**
     * 遍历操作
     * @param arr
     * @param func
     */
    public static forEach(arr: Array<any>, func: Function, funcObj: any): void {
        for (var i: number = 0, len: number = arr.length; i < len; i++) {
            func.apply(funcObj, [arr[i]]);
        }
    }

    /**
     * 数组元素统一执行一个函数
     */
    public static dealFunc(arr: Array<any>, dealFuncName: string): void {
        for (let i = arr.length - 1; i >= 0; i--) {
            arr[i][dealFuncName]();
        }
    }

    /**
     * 复制列表
     * @param sourceArr 复制的对象列表
     * @param sIdx 列表索引
     * @param destArr 目标列表
     * @param dIdx 列表索引
     * @param len 复制长度
     * @returns 
     */
    public static copy(sourceArr, sIdx: number, destArr, dIdx: number, len: number) {
        console.assert(sourceArr && destArr, "array miss")
        console.assert(sourceArr.length > sIdx && sourceArr.length > sIdx + len - 1, "source array out of range")
        console.assert(destArr.length > dIdx && destArr.length > dIdx + len - 1, "dest array out of range")

        for (let i = 0; i < len; i++) {
            destArr[dIdx + i] = sourceArr[sIdx + i]
        }

        return destArr
    }


    /**
     * 列表任意位置放入对象
     * @param array 
     * @param item 
     * @param index 
     * @returns 
     */
    public static addAt(array: Array<any>, item: any, index: number = 0) {
        console.assert(index <= array.length, "index out of range")
        let list = []
        for (let i = 0; i < index; i++) {
            list.push(array[i])
        }
        list.push(item)
        for (let i = index; i < array.length; i++) {
            list.push(array[i])
        }
        return list
    }

    /**
     * 列表排序
     * @param array 列表
     * @param isUp 是否升序
     * @param key 要比较的字段
     */
    public static sort(array: Array<any>, isUp = true, key?: string) {
        array = array.sort((a, b) => {
            if (isUp) {
                if (key) {
                    return a[key] - b[key]
                }
                else {
                    return a - b
                }
            } else {
                if (key) {
                    return b[key] - a[key]
                }
                else {
                    return b - a;
                }
            }
        })

        return array
    }


    /**
     * 列表对比
     */
    public static equals(a, a2): boolean {
        if (a == a2)    //如果两个数组的指向的地址一样, 则肯定相等
            return true;
        if (a == null || a2 == null) //如果两个数组中有一个为null, 则返回false
            return false;

        let length = a.length;
        if (a2.length != length)  //如果两个数组的长度不相等, 则返回false
            return false;

        for (let i = 0; i < length; i++)  //最后才是遍历数组, 比较数组中的每一位是否相等, 如果出现不相等, 则返回false
            if (a[i] != a2[i])
                return false;
        return true;
    }

    /**
     * 获取列表中包含key value的对象
     * @param array 列表
     * @param key 比对的key
     * @param value 比对的value
     * @returns 
     */
    public static getItemContainsKeyValue(array: Array<any>, key: string, value: any) {
        if (array) {
            for (let i = 0, len = array.length; i < len; i++) {
                let item = array[i];
                if (item[key] == value) {
                    return item;
                }
            }
        }

        return null;
    }

    /**
     * 获取指定对象所在的索引
     * @param arr 列表
     * @param keyName 对字段
     * @param keyValue 对比值
     * @returns 
     */
    public static indexOfByValue(arr: any[], keyName: string, keyValue) {
        let index = this.indexOf(arr, keyName, keyValue);
        if (index == -1) {
            index = 0;
        }
        return index
    }
}
