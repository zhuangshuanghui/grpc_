import { Modules1Data } from "../../modules/modules1/Modules1Data"

/**
 * Data管理中心,负责提供统一的数据访问接口
 */
export class DataCenter {
    private static dataMap = {}

    /**角色数据 */
    static get  modules1Data(): Modules1Data {
        let key = 'modules1Data'
        if (!this.dataMap[key])
            this.dataMap[key] = new Modules1Data()
        return this.dataMap[key]
    }


    
    /**数据重置 */
    static reset() {
        for (let name in this.dataMap) {
            if (this.dataMap[name].reset)
                this.dataMap[name].reset()
        }
    }

    /**数据清理 */
    static clear() {
        for (let name in this.dataMap) {
            if (this.dataMap[name].clear)
                this.dataMap[name].clear()
        }
        this.dataMap = {}
    }
}