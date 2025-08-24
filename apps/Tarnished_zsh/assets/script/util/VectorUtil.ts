import { Vec3 } from "cc";

export class VectorUtil {

    static parseVec3(numArr) {
        return new Vec3(numArr[0], numArr[1], numArr[2] || 0);
    }

    /**
     * 贝塞尔曲线坐标
     * @param t 路径比例（0 ~ 1）
     * @param p1 起始点
     * @param cp 中间点
     * @param p2 终点
     */
    static bezierPos(t: number, p1: Vec3, cp: Vec3, p2: Vec3) {
        let x = (1 - t) * (1 - t) * p1.x + 2 * t * (1 - t) * cp.x + t * t * p2.x;
        let y = (1 - t) * (1 - t) * p1.y + 2 * t * (1 - t) * cp.y + t * t * p2.y;
        return new Vec3(x, y, 0);
    }

    /**x轴反转 */
    static flipX(vect: Vec3) {
        return new Vec3(-vect.x, vect.y, vect.z);
    }

    /**x轴取正 */
    static absX(vect: Vec3) {
        return new Vec3(Math.abs(vect.x), vect.y, vect.z);
    }

    /**Vec3乘x倍数 */
    static multi(vect : Vec3, multi : number) {
        return new Vec3(vect.x * multi, vect.y * multi, vect.z * multi);
    }

    /**Vec3相加 */
    static add(v1 : Vec3, v2 : Vec3,) {
        return new Vec3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }
}