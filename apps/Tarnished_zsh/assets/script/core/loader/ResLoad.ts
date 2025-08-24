import { Asset, AssetManager, Constructor, Prefab, SpriteAtlas, SpriteFrame, assetManager, sp } from "cc";
import { Log } from "../../util/Log";
import { StringUtil } from "../../util/StringUtil";

type AssetType<T = Asset> = Constructor<T>;
type loadAssetCallback = (any) => void;

/**资源加载 */
export class ResLoad {
    /**ab包配置列表 */
    private static abdepslist: Map<string, string[]>;
    public static init() {
        // this.abdepslist = GGetConfigData('abmanifest'); 需要配置
        // this.abdepslist=new Map([["testAb",["testAb"]],["notice",["notice"]]])
    }

    /**
     * 加载AssetBundle以及依赖的AB包
     * @param bundlename bundle名
     * @param callback 加载完成回调
     * @param withDeps 是否加载依赖
     */
    private static loadAssetBundle(bundlename: string, callback: loadAssetCallback, withDeps: boolean = true) {
        
        this.loadAssetBundleWithoutDeps(bundlename, callback);
        // if (withDeps) {
        //     console.log("this.abdepslist",this.abdepslist);
            
        //     let deps = this.abdepslist[bundlename];
        //     if (deps && deps.length > 0) {
        //         let cnt = 0;
        //         let bError = false;//资源加载是否出错
        //         for (let i = 0, len = deps.length; i < len; i++) {
        //             var dep = deps[i];
        //             this.loadAssetBundle(dep, (bundl: AssetManager.Bundle) => {
        //                 if (!bundl) {
        //                     bError = true;
        //                 }
        //                 cnt++;
        //                 if (cnt == len) {
        //                     if (bError) {
        //                         callback(null);
        //                         return;
        //                     }
        //                     this.loadAssetBundleWithoutDeps(bundlename, callback);
        //                 }
        //             }, true)
        //         }
        //     } else {
        //         this.loadAssetBundleWithoutDeps(bundlename, callback);
        //     }
        // } else {
        //     this.loadAssetBundleWithoutDeps(bundlename, callback);
        // }
    }

    /**
     * 加载单个AssetBundle，不包括依赖的AB包
     * @param bundlename bundle名
     * @param callback 加载完成回调
     * @returns 
     */
    private static loadAssetBundleWithoutDeps(bundlename: string, callback: loadAssetCallback) {
        if (StringUtil.isNullOrEmpty(bundlename)) {
            Log.LogError(`加载资源包失败,资源包名字为空`);
            callback(null);
            return;
        }

        let bundle = assetManager.getBundle(bundlename);
        if (bundle == null) {
            assetManager.loadBundle(bundlename, (err: Error, bundle: AssetManager.Bundle) => {
                if (err) {
                    Log.LogError(`加载单个bundle资源包${bundlename}错==>${err.message}`);
                    callback(null);
                    return;
                } else {
                    callback(bundle);
                }
            });
        }
        else {
            callback(bundle);
        }
    }

    /**
     * 资源加载
     * @param bundlename bundle名
     * @param path 目标文件夹路径
     * @param assettype 资源类型
     * @param callback 加载完成回调
     */
    public static loadDirAsset<T extends Asset>(bundlename: string, path: string, assettype: AssetType, callback: loadAssetCallback, withDeps: boolean = true) {
        this.loadAssetBundle(bundlename, (bundle: AssetManager.Bundle) => {
            if (bundle) {
                bundle.loadDir(path, assettype, (err, dataasset: Asset[]) => {
                    if (err) {
                        Log.LogError(`加载资源对象路径${path}出错,${err.message}`);
                        callback(null);
                        return;
                    }
                    callback(dataasset);
                });
            } else {
                callback(null);
            }
        }, withDeps);
    }

    /**
     * 资源加载
     * @param bundlename bundle名
     * @param assetname 资源名
     * @param assettype 资源类型
     * @param callback 加载完成回调
     */
    public static loadAsset<T extends Asset>(bundlename: string, assetname: string, assettype: AssetType, callback: loadAssetCallback, withDeps: boolean = false) {
        this.loadAssetBundle(bundlename, (bundle: AssetManager.Bundle) => {
            if (bundle) {
                bundle.load(assetname, assettype, (err, dataasset: Asset) => {
                    if (err) {
                        Log.LogError(`加载资源对象${assetname}出错,${err.message}`);
                        callback(null);
                        return;
                    }
                    callback(dataasset);
                });
            } else {
                callback(null);
            }
        }, withDeps);
    }

    /**
    * 加载多个资源
    * @param resArr 加载的资源列表，[{'bundle':string, 'assetType':string,...]
    * @param callback 单个加载完回调
    */
    public static loadAssetArr(resArr, callback: loadAssetCallback) {
        for (let i = 0, len = resArr.length; i < len; i++) {
            let bundlename = resArr[i].bundle;
            let assettype = this.getAssetType(resArr[i].assettype);
            this.loadAssetBundle(bundlename, (bundle: AssetManager.Bundle) => {
                if (bundle) {
                    bundle.loadDir("", assettype, (err, dataasset) => {
                        if (err) {
                            Log.LogError(`加载bundle全部资源对象bundlename =>${bundlename}出错,${err.message},资源包 =>,${dataasset}`);
                        }
                        if (callback) {
                            callback(dataasset);
                        }
                    });
                } else {
                    if (callback) {
                        callback(null);
                    }
                }
            }, true);
        }
    }

    /**
     * 资源预加载
     * @param bundlename bundle名
     * @param assetnames 资源名
     * @param assettype 资源类型
     * @param callback 资源回调
     */
    public static preloadAsset<T extends Asset>(bundlename: string, assetnames: string | string[] | null, assettype: AssetType, callback?: loadAssetCallback) {
        this.loadAssetBundle(bundlename, (bundle: AssetManager.Bundle) => {
            if (bundle) {
                if (assetnames) {
                    bundle.preload(assetnames, assettype, (err, dataasset) => {
                        if (err) {
                            Log.LogError(`资源预加载对象bundlename =>${bundlename}    assetnames=>${assetnames}出错,${err.message}`);
                        }
                        if (callback) {
                            callback({ bundle: dataasset, name: bundlename });
                        }
                    });
                } else {
                    bundle.preloadDir("", assettype, (err, dataasset) => {
                        if (err) {
                            Log.LogError(`资源预加载全部对象bundlename =>${bundlename}   assetnames?=>${assetnames}出错,${err.message},资源包 =>,${dataasset}`);
                        }
                        if (callback) {
                            callback({ bundle: dataasset, name: bundlename });
                        }
                    });

                }
            } else {
                if (callback) {
                    callback(null);
                }
            }
        }, true);
    }



    /**
     * 释放资源
     * @param bundlename bundle名
     * @param assetname 资源名
     */
    public static release(bundlename: string, assetname: string) {
        var bundle = assetManager.getBundle(bundlename);
        if (bundle) {
            var asset = bundle.get(assetname);
            if (asset) {
                this.releasePrefabtDepsRecursively(asset);
            }
        }
    }

    /**
     * 通过相对文件夹路径删除所有文件夹中资源
     * @param path          资源文件夹路径
     * @param bundleName    远程资源包名
     */
    public static releaseDir(path: string, bundleName?: string) {
        var bundle: AssetManager.Bundle | null = assetManager.getBundle(bundleName);
        if (bundle) {
            var infos = bundle.getDirWithPath(path);
            if (infos) {
                infos.map((info) => {
                    this.releasePrefabtDepsRecursively(info.uuid);
                });
            }

            // if (path == "") {
            //     assetManager.removeBundle(bundle);
            // }
        }
    }

    /** 释放预制依赖资源 */
    private static releasePrefabtDepsRecursively(uuid: string | Asset) {
        if (uuid instanceof Asset) {
            uuid.decRef();
            // assetManager.releaseAsset(uuid);
        }
        else {
            var asset = assetManager.assets.get(uuid);
            if (asset) {
                asset.decRef();
                // assetManager.releaseAsset(asset);
            }
        }
    }

    /**
     * 获取加载资源类型
     * @param assettype 资源类型字符串 
     * @returns AssetType
     */
    public static getAssetType(assettype: string): AssetType {
        let asset: any;
        if (assettype == "Prefab") {
            asset = Prefab;
        } else if (assettype == "Spine") {
            asset = sp.SkeletonData;
        } else if (assettype == "Atlas") {
            asset = SpriteAtlas;
        } else if (assettype == "Texture") {
            asset = SpriteFrame;
        }
        return asset
    }

    /** 打印缓存中所有资源信息 */
    dump() {
        assetManager.assets.forEach((value: Asset, key: string) => {
            console.log(assetManager.assets.get(key));
        })
        console.log(`当前资源总数:${assetManager.assets.count}`);
    }
}