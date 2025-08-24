import { AnimationClip, AudioClip, Font, JsonAsset, Prefab, SpriteAtlas, SpriteFrame, sp } from "cc";
import { SingtonClass } from "../../util/SingtonClass";
import { ResLoad } from "../loader/ResLoad";

/**Bundle资源管理*/
export class BundleManager extends SingtonClass {
    /**
     * 加载预制体
     * @param bundleName  bundle名
     * @param prefabname  资源名
     * @param callback  资源回调
     */
    public loadPrefab(bundleName: string, prefabname: string, callback: any) {
        ResLoad.loadAsset<Prefab>(bundleName, prefabname, Prefab, (prefabAsset) => {
            callback(prefabAsset);
        }, true);
    }

    /**
     * 加载UI预制体
     * @param bundleName  bundle名
     * @param prefabname  资源名
     * @param callback  资源回调
     */
    public loadUIPrefab(bundleName: string, prefabname: string, callback: any) {
        // this.loadPrefab("ui_" + bundleName, prefabname, callback);
        this.loadPrefab(bundleName, prefabname, callback);
    }

    /**加载spine预制体 */
    public loadSpinePrefab(prefabname, callback: any) {
        this.loadPrefab("spine_" + prefabname, prefabname, callback);
    }

    /**
     * 加载 spine 资源
     * @param spinename spine名 （bundle名和资源名保持一致）
     * @param callback 资源回调
     */
    public loadSpine(spinename: string, callback: any) {
        ResLoad.loadAsset<JsonAsset>(spinename, spinename, sp.SkeletonData, (spineasset) => {
            callback(spineasset);
        })
    }

    /**
     * 加载配置资源
     * @param spinename 配置名
     * @param callback 资源回调
     */
    public loadConfig(configname: string, callback: any) {
        ResLoad.loadAsset("config", configname, JsonAsset, (configData) => {
            callback(configData);
        }, false);
    }

    /**
     * 加载字体资源
     * @param spinename 资源名
     * @param callback 资源回调
     */
    public loadFont(fontname: string, callback: any) {
        ResLoad.loadAsset("font", fontname, Font, (font) => {
            callback(font);
        }, false);
    }

    /**
     * 加载音效资源
     * @param bundlename 音效名
     * @param callback 资源回调
     */
    loadAudio(bundlename: string, callback: any) {
        ResLoad.loadAsset(bundlename, bundlename, AudioClip, (audioClip) => {
            callback(audioClip);
        }, false);
    }

    /**
     * 加载动画资源
     * @param bundlename  动画bundle
     * @param animname 动画名
     * @param callback 资源回调
     */
    public loadAnim(bundlename: string, animname: string, callback: any) {
        ResLoad.loadDirAsset(bundlename, animname, AnimationClip, (animationClip) => {
            callback(animationClip);
        }, false);
    }

    /**
     * 加载图片资源
     * @param bundlename bundle名
     * @param imagename 图片名
     * @param callback 资源回调
     */
    public loadImage(bundlename: string, imagename: string, callback: any) {
        ResLoad.loadAsset<SpriteFrame>(bundlename, imagename, SpriteFrame, (spriteFrame) => {
            callback(spriteFrame)
        }, false);
    }

    /**
     * 获取图标资源
     * @param atlasname 图集名
     * @param spritename 图标名字
     * @param callback 回调
     */
    public loadSprite(atlasname: string, spritename: string, callback: any) {
        ResLoad.loadAsset<SpriteAtlas>(atlasname, atlasname, SpriteAtlas, (atlasasset) => {
            let sp: SpriteFrame = atlasasset.getSpriteFrame(spritename);
            callback(sp);
        }, false);
    }
}


