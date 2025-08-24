import { SingtonClass } from "../../util/SingtonClass";
import { StringUtil } from "../../util/StringUtil";
import { ManagerCenter } from "../center/ManagerCenter";

export enum LanguageType {
    ZH_CN,
    ZH_TW,
    EN,
}

export class I18nCfg {
    public id: string;
    public zhcn: string;
    public zhtw: string;
    public en: string;
}

export class I18nManager extends SingtonClass {
    private m_i18nDic = {}
    private m_languateType: LanguageType = LanguageType.ZH_CN;

    public init() {
        console.log("i18nMgr init");

        let codeCfg = ManagerCenter.configMgr.getConfigData('i18nCode');
        for (let index = 0; index < codeCfg.length; index++) {
            const data = codeCfg[index];
            let i18nCfg = new I18nCfg();
            i18nCfg.id = data.id;
            i18nCfg.zhcn = data.zhcn;
            i18nCfg.zhtw = data.zhtw;
            i18nCfg.en = data.en;
            this.m_i18nDic[data.id] = i18nCfg;
        }
    }


    public getCurLanguage() {
        return this.m_languateType;
    }

    public i18Dic() {
        return this.m_i18nDic;
    }

    // this.m_i18nDic[data.id] = i18nCfg;


    public setCurLanguage(lang: LanguageType) {
        this.m_languateType = lang;
    }

    /**
 * 获取当前语言环境下对应的文本
 * @param i18nId 文本id
 * @returns 文本
 */
    public getStr(i18nId: string) {
        let data = this.m_i18nDic[i18nId];
        if (data) {
            switch (this.m_languateType) {
                case LanguageType.EN:
                    return data.en;
                case LanguageType.ZH_TW:
                    return data.zhtw;
                default:
                    return data.zhcn;
            }
        }
        return null;
    }

    //对获取的字符串进行格式化
    public getStrFormat(i18nId: string, ...args: any[]) {
        var str = this.getStr(i18nId);
        if (str) {
            return StringUtil.format(str, ...args);
        }
        return null;
    }

    public getStrFormat2(i18nId: string, ...codes: any[]) {

        var str = this.getStr(i18nId);
        if (str) {
            let args = [];
            for (let i = 0, len = codes.length; i < len; i++) {
                args.push(this.getStr(codes[i]));
            }
            return StringUtil.format(str, ...args);
        }
        return null;
    }

    //     /**
    // * 显示错误号提示
    // * @param errorId i18nCode 配置id
    // */
    //     public showErrorCode(errorId: number) {
    //         var str = this.getStr("code_error_" + errorId);
    //         if (str) {
    //             GShowText(str);
    //         } else {
    //             GShowText("错误号id = " + errorId);
    //         }
    //     }


}