import { CloseMode, LayerType } from "../../Define";

export class ModuleConfig {
    private static moduleList={
        LoginWindow: {
            name: "登录",
            layerType: LayerType.Window,
            closeMode: CloseMode.Destroy,
            bundle: "login",
            prefab: "LoginWindow",
        },
        PlazaWindow: {
            name: "大厅",
            layerType: LayerType.Window,
            closeMode: CloseMode.Delay,
            bundle: "plaza",
            prefab: "PlazaWindow",
        },
        NoticeWindow: {
            name: "公告",
            layerType: LayerType.Window,
            closeMode: CloseMode.Delay,
            bundle: "notice",
            prefab: "NoticeWindow",
        },
        MainGameWindow: {
            name: "游戏主场景",
            layerType: LayerType.Window,
            closeMode: CloseMode.Delay,
            bundle: "mainGame",
            prefab: "MainGameWindow",
        },
    }


        /**
     * 获取模块名
     * @param moduleName 模块名
     * @returns 
     */
        static getTitle(moduleName: string): string {
            let moduleInfo = this.moduleList[moduleName]["name"];
            return moduleInfo;
        };
    
        /**
         * 判断配置中是否有配置此
         * @param moduleName 模块名
         * @returns 
         */
        static hasModule(moduleName: string): boolean {
            let moduleInfo = this.moduleList[moduleName]
            return moduleInfo != null
        };
    
        /**
         * 获取配置数据
         * @param moduleName 模块名
         * @returns 
         */
        static getModuleInfo(moduleName: string): any {
            return this.moduleList[moduleName]
        };
    
        /**
         * 获取bundle名
         * @param moduleName 模块名
         * @returns bundle名
         */
        static getModuleBundle(moduleName: string): string {
            return this.moduleList[moduleName] && this.moduleList[moduleName].bundle || null
        };
    
        /**
         * 获取预制体名字
         * @param moduleName 模块名
         * @returns 预制体名字
         */
        static getModulePrefab(moduleName: string): string {
            return this.moduleList[moduleName] && this.moduleList[moduleName].prefab || null
        };
    
        /**
         * 获取预制体层级
         * @param moduleName 模块名
         * @returns LayerType
         */
        static getModuleLayerType(moduleName: string): LayerType {
            return this.moduleList[moduleName] ? this.moduleList[moduleName].layerType : null
        };
        /**
         * 获取关闭模式
         * @param moduleName 模块名
         * @returns CloseMode
         */
        static getModuleCloseMode(moduleName: string): CloseMode {
            return this.moduleList[moduleName] ? this.moduleList[moduleName].closeMode : null
        };
        /**
         * 获取是否显示遮罩
         * @param moduleName 模块名
         * @returns boolean
         */
        static getModuleShowMask(moduleName: string): boolean {
            if (this.moduleList[moduleName] != null && this.moduleList[moduleName].showMask != null) {
                return this.moduleList[moduleName].showMask;
            }
            return true;
        };
        /**
         * 获取遮罩透明度值
         * @param moduleName 模块名
         * @returns 透明度值
         */
        static getModuleAlpha(moduleName: string): number {
            if (this.moduleList[moduleName] != null) {
                if (this.moduleList[moduleName].alpha != null && this.moduleList[moduleName].alpha > 0) {
                    return this.moduleList[moduleName].alpha;
                } else {
                    let layer = this.getModuleLayerType(moduleName);
                    if (layer == LayerType.Window) {
                        return 204;//80%
                    } else {
                        return 127.5;//50%
                    }
                }
            }
            return 255;
        };
    
        /**
        * 是否可以点击
        * @param moduleName 模块名
        * @returns boolean
        */
        static getModuleClickMask(moduleName: string): boolean {
            if (this.moduleList[moduleName] != null && this.moduleList[moduleName].clickMask != null) {//配置这个字段就用配置的值
                return this.moduleList[moduleName].clickMask;
            }
            let layer = this.getModuleLayerType(moduleName);
            return layer != LayerType.Window ? true : false;//LayerType.Windowc层不可点击遮罩
        };
    
        /**
        * 功能说明id
        * @param moduleName 模块名
        * @returns funcHelp_功能说明 id
        */
        static getModulHelpId(moduleName: string): number {
            if (this.moduleList[moduleName] != null && this.moduleList[moduleName].helpId != null) {
                return this.moduleList[moduleName].helpId;
            }
            return null;
        };
        
}