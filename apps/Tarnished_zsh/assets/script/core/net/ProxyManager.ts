
import { Modules1Proxy } from "../../modules/modules1/Modules1Proxy";
import { SingtonClass } from "../../util/SingtonClass";

/**通用协议管理类*/
export class ProxyManager extends SingtonClass {
	public init() {
        Modules1Proxy.getInstance().init()

	}

	public destroy() {
        Modules1Proxy.getInstance().destroy()
	}
}
