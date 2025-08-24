
import { sys } from "cc";
// import "miniprogram-api-typings"
import { UIConst } from "./Define";

/**SDK设备信息*/
export class SDKPaltformInfo {
    /**设备像素比 */
    private static pixelRatio;
    /**屏幕宽度 单位px*/
    private static screenWidth = 0;
    /**屏幕高度 单位px*/
    private static screenHeight = 0;
    /**安全区域宽度*/
    private static width = 0;
    /**安全区域的高度 */
    private static height = 0;
    /**安全区域的左上角y坐标*/
    private static top = 0;
    /**安全区域的右下角y坐标*/
    private static bottom;
    /**安全区域的左上角x坐标*/
    private static left;
    /**安全区域的右上角x坐标*/
    private static right;

    /**菜单栏 宽度 */
    private static menuWidth;
    /**菜单栏 高度 */
    private static menuHeight;
    /**上边界坐标 */
    private static menutTop;
    /**下边界坐标 */
    private static menuBottom = 0;
    /**左边界坐标 */
    private static menuLeft = 0;
    /** 又边界坐标*/
    private static menuRight;


    //高度比
    private static _sh;
    //宽度比
    private static _sw;
    //适配宽度
    private static _advW;
    public static init() {
        this.initWXWindowInfo();//Adaptive
    }

    /**初始化 微信窗口信息 */
    private static initWXWindowInfo() {
        if (sys.platform == sys.Platform.WECHAT_GAME) {//微信
            // const windowInfo = wx.getWindowInfo();
            // const safeArea = windowInfo.safeArea;
            // this.pixelRatio = windowInfo.pixelRatio;
            // this.screenWidth = windowInfo.screenWidth;
            // this.screenHeight = windowInfo.screenHeight;
            // this.width = safeArea.width;
            // this.height = safeArea.height;
            // this.top = safeArea.top;
            // this.bottom = safeArea.bottom;
            // this.left = safeArea.left;
            // this.right = safeArea.right;

            // GLog("设备像素比 = =", windowInfo.pixelRatio)
            // GLog("屏幕宽度，单位px = =", windowInfo.screenWidth)
            // GLog("屏幕高度，单位px = =", windowInfo.screenHeight)
            // GLog("安全区域的宽度 = = ", safeArea.width)
            // GLog("安全区域的高度 = = ", safeArea.height)
            // GLog("左上角y坐标   = = ", safeArea.top)
            // GLog("右下角y坐标   = = ", safeArea.bottom)
            // GLog("左上角x坐标   = = ", safeArea.left)
            // GLog("右上角x坐标   = = ", safeArea.right)

            // const menu = wx.getMenuButtonBoundingClientRect();
            // this.menuWidth = menu.width;
            // this.menuHeight = menu.height;
            // this.menutTop = menu.top;
            // this.menuBottom = menu.bottom;
            // this.menuLeft = menu.left;
            // this.menuRight = menu.right;
            // GLog("菜单栏  宽度 = = ", menu.width)
            // GLog("菜单栏  高度 = = ", menu.height)
            // GLog("上边界坐标   = = ", menu.top)
            // GLog("下边界坐标   = = ", menu.bottom)
            // GLog("左边界坐标   = = ", menu.left)
            // GLog("又边界坐标   = = ", menu.right)

            // GLog("适配高度   =  展示宽度", this.sh * this.width, "  展示高度      ", 1080);

        } else if (sys.platform == sys.Platform.DESKTOP_BROWSER) {//浏览器
            // GLog("1111111111  = = ", sys.getSafeAreaRect())
            this._advW = sys.getSafeAreaRect().width;
            // this.screenHeight = sys.getSafeAreaRect().height;
        } else {
            this._advW = UIConst.Width;
        }

    }

    /**适配总宽度 */
    public static get advW(): number {
        if (this._advW == null) {
            this._advW = this.sh * this.width;
        }
        return this._advW;
    }

    /**适配值 */
    public static get advValue(): number {
        if (this.advW > UIConst.Width) {
            return (this.advW - UIConst.Width) / 2;
        }
        return 0;
    }

    /**高度比 */
    public static get sh(): number {
        if (!this._sh) {
            this._sh = 0;
            if (this.screenHeight) {
                this._sh = UIConst.Height / this.screenHeight;
            }
        }
        return this._sh;
    }

    /**宽度度比 */
    public static get sw(): number {
        if (!this._sw) {
            this._sw = 0;
            if (this.screenWidth) {
                this._sw = this.advW / this.screenWidth;
            }
        }
        return this._sw;
    }

    /**刘海偏移x转换坐标 */
    public static get liuhaiOffsetX(): number {
        return this.top * this.sw;
    }

    /**菜单栏下边界Y转换坐标 */
    public static get menuBottomY(): number {
        return this.menuBottom * this.sh;
    }


    /**菜单栏左边界x转换坐标 */
    public static get menuLeftX(): number {
        return (this.screenWidth - this.menuLeft) * this.sw;
    }












    //适配规则测试
    testAdaptive() {
        //设备分辨率
        let fw = 932;
        let fh = 430;

        //设计分辨率
        let w = 1920;
        let h = 1080;

        let b1 = h / fh;
        let b2 = w / fw;

        //适配高度
        let sw = b1 * fw;
        // GLog("适配高度   =  展示宽度", sw, "  展示高度      ", h);

        //适配宽度
        let sh = b2 * fh;
        // GLog("适配宽度   =  展示宽度", w, "  展示高度      ", sh);

        //宽度高度适勾选
        if (w / h > fw / fh) {
            // GLog("自动适配宽度   =  展示宽度", w, "  展示高度      ", sh);
        } else {
            // GLog("自动适配高度   =  展示宽度", sw, "  展示高度      ", h);
        }

        //宽度高度不勾选
        if (w / h > fw / fh) {
            // GLog("宽度高度不勾选 =   自动适配高度   =  展示宽度", sw, "  展示高度      ", h);
        } else {
            // GLog("宽度高度不勾选 =   自动适配宽度   =  展示宽度", w, "  展示高度      ", sh);
        }

    }

}


