import { instantiate, Node, NodePool, Prefab } from "cc";
import { SingtonClass } from "../../util/SingtonClass";

/**
 * 对象池管理器，用于管理游戏中的节点对象池
 * 继承自单例基类，确保全局只有一个实例
 */
export class ObjectPoolManager extends SingtonClass {
    // 存储所有对象池的Map，key为预制体名称，value为对应的节点池
    private _pools: Map<string, NodePool> = new Map()
    // 用于重置节点状态的函数
    private savedFunction: Function | null = null;
    // 重置节点函数的this作用域
    private savedScope: any = null;

    /**
     * 创建对象池
     * @param prefabName 预制体名称，作为对象池的key
     * @param prefab 预制体资源
     * @param initCount 初始创建的数量，默认为5
     */
    createrPools(prefabName: string, prefab: Prefab, initCount: number = 5) {
        // 如果已经存在该对象池，则警告并返回
        if (this._pools.has(prefabName)) {
            console.warn(prefabName, "已经存在");
            return
        }
        // 创建新的节点池
        let pool = new NodePool()
        // 将节点池存入Map
        this._pools.set(prefabName, pool)
        // 根据初始数量创建节点并放入池中
        for (let index = 0; index < initCount; index++) {
            let node = instantiate(prefab)
            pool.put(node)
        }
    }

    /**
     * 设置重置节点状态的函数
     * @param func 重置函数
     * @param scope 函数作用域
     */
    resetNodeFunc(func: Function, scope: any) {
        this.savedFunction = scope
        this.savedFunction = func
    }

    /**
     * 从对象池中获取节点
     * @param prefabName 预制体名称
     * @param prefab 可选，如果没有找到对象池且提供了prefab，会创建新的对象池
     * @returns 返回获取的节点，如果获取失败返回null
     */
    getFromPool(prefabName: string, prefab?: Prefab) {
        // 获取对应的对象池
        let pool = this._pools.get(prefabName)
        if (!pool) {
            // 如果没有找到对象池且没有提供prefab，则警告并返回null
            if (!prefab) {
                console.warn(prefabName, "没有这个对象池");
                return null;
            }
            // 如果有提供prefab，则创建新的对象池
            this.createrPools(prefabName, prefab)
            // 递归调用自身获取节点
            return this.getFromPool(prefabName)
        }
        // 如果池中有可用节点，则直接获取
        if (pool.size() > 0) {
            return pool.get()
        }
        // 如果池中没有节点但有prefab，则实例化一个新节点
        if (prefab) {
            console.log("");
            return instantiate(prefab)
        }
        // 既没有池中节点也没有prefab，则警告并返回null
        console.warn("没有新预制体和参数预制体");
        return null
    }

    /**
     * 将节点放回对象池
     * @param prefabName 预制体名称
     * @param prefab 要放回的节点
     */
    putFromPool(prefabName: string, prefab: Node) {
        // 获取对应的对象池
        let pool = this._pools.get(prefabName)
        if (!pool) {
            // 如果没有对应的对象池，则直接销毁节点
            console.log();
            prefab.destroy()
            return null
        }

        // 如果有设置重置函数，则调用重置节点状态
        if (this.savedFunction && this.savedScope) {
            this.savedFunction.call(this.savedScope);
        }
        // 将节点设为非激活状态
        prefab.active = false;
        // 将节点放回对象池
        pool.put(prefab)
    }

    /**
     * 清理指定的对象池
     * @param prefabName 要清理的预制体名称
     */
    clearOnePool(prefabName: string) {
        let pool = this._pools.get(prefabName)
        if (!pool) {
            return
        }
        // 清空对象池
        pool.clear()
        // 从Map中移除
        this._pools.delete(prefabName)
    }

    /**
     * 清理所有对象池
     */
    clearAll() {
        this._pools.clear()
    }
}