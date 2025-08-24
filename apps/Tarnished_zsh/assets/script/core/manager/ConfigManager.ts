import { JsonAsset } from 'cc';
import { Log } from '../../util/Log';
import { SingtonClass } from '../../util/SingtonClass';
import { StringUtil } from '../../util/StringUtil';
import { ManagerCenter } from '../center/ManagerCenter';
// import { ChannelConfig } from '../net/ChannelConfig';

export class ConfigManager extends SingtonClass {

    private m_confogLength: {};
    private m_configDatas: Map<string, any> = new Map();
    /**
     * 预加载配置列表
     */
    private m_preloadCfgs: string[] = [
        "activity",
        "activityLoop",
        'activityOpenServerGift',
        'activitySevenDay',
        'activitySevenTask',
        'activityTab',
        'adventure',
        'testTable',
        'i18nCode',
    ];

    /**
     * 预加载配置
     */
    public async preload(): Promise<void> {
        Log.LogInfo("confog preload");
        return new Promise((resolve, error) => {
            let len = this.m_preloadCfgs.length;
            if (len == 0) {
                resolve();
            } else {
                let cnt = 0;
                for (let i = 0; i < len; i++) {
                    this.loadConfigData(this.m_preloadCfgs[i], () => {
                        cnt++;
                        if (cnt == len) {
                            resolve();
                        }
                    })
                }
            }
        });
    }


    /**
   * 加载配置表
   * @param cfgname 配表名字
   */
    public loadConfigData(cfgname: string, callback?) {
        if (this.m_configDatas.has(cfgname)) {
            if (callback) callback(this.m_configDatas.get(cfgname));
        } else {
            ManagerCenter.bundleMgr.loadConfig(cfgname, (configdata: JsonAsset) => {
                let data = configdata.json;
                this.m_configDatas.set(cfgname, data);
                if (callback) callback(data);
            });
        }
    }



    /**
     * 获取缓存的配表数据
     * @param cfgname 配置表名
     * @param param 配置字段
     * @returns 
     */
    public getConfigData(cfgname: string, ...param) {
        if (this.m_configDatas.has(cfgname)) {
            let cfg = this.m_configDatas.get(cfgname);
            let curCfg = cfg;
            if (param[0] != null) {
                param[0] = String(param[0])
            }
            for (let i = 0; i < param.length; i++) {
                if (curCfg[param[i]] != null) {
                    curCfg = curCfg[param[i]]
                }
                else {
                    // if (ChannelConfig.showLog) {
                    //     GWarn(StringUtil.format2("表配错了！表({0})不存在ID: {1}", cfgname, param[i]))
                    // }
                    console.error("表配错了！表({0})不存在ID: {1}");
                    
                    return null;
                }
            }
            return curCfg;
        }
        return null;
    }


    //全部表数据
    get  allTable(){
        return this.m_configDatas
    }

}