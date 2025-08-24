import { NodePool } from "cc";
import { SingtonClass } from "../util/SingtonClass";

export class ObjectPoolManager extends SingtonClass{

    private _pools:Map<string,NodePool>=new Map()


    constructor(parameters) {
        super()   
    }

    //创建对象池  释放对象池  拿对应对象池 放回对象池
    
    createPool(){
        
    }


}