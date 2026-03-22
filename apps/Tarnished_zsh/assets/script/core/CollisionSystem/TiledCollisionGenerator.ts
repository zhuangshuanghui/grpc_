import { _decorator, Component, TiledMap, RigidBody2D, BoxCollider2D, ERigidBody2DType, Node, Vec3, Size } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TiledCollisionGenerator')
export class TiledCollisionGenerator extends Component {

    @property({ type: TiledMap, tooltip: '地图组件，如果不拖入则自动在当前节点查找' })
    public tiledMap: TiledMap | null = null;

    @property({ tooltip: '在Tiled中创建的对象层名称' })
    public collisionLayerName: string = 'collisions';

    start() {
        // 在组件启动时，自动生成碰撞体
        this.generateCollisions();
    }

    private generateCollisions() {
        // 1. 获取 TiledMap 组件
        if (!this.tiledMap) {
            this.tiledMap = this.getComponent(TiledMap);
        }

        if (!this.tiledMap) {
            console.error("未找到 TiledMap 组件！请将此脚本挂载到有 TiledMap 的节点上。");
            return;
        }

        // 2. 获取我们在 Tiled 中画的 collisions 对象层

        let objectGroup = this.tiledMap.getObjectGroup(this.collisionLayerName);
        if (!objectGroup) {
            console.warn(`地图中没有找到名为 '${this.collisionLayerName}' 的对象层！`);
            return;
        }

        // 3. 获取该层中所有的对象（我们在 Tiled 里画的矩形）
        let objects = objectGroup.getObjects();

        // 4. 遍历这些对象，生成物理碰撞盒
        for (let i = 0; i < objects.length; i++) {
            let obj = objects[i];

            // 解析 Tiled 对象的数据 (x, y, 宽, 高)
            // 注意：Tiled 对象导出的 x, y 通常是指矩形的【左下角】坐标
            let x = obj.x;
            let y = obj.y;
            let width = obj.width || 32;
            let height = obj.height || 32;

            // 创建一个空的子节点用来挂载物理组件
            let colliderNode = new Node(`Wall_Collider_${i}`);
            this.node.addChild(colliderNode);

            // 设置节点位置
            // 因为 BoxCollider2D 的锚点在中心，所以我们要把节点的中心点放在矩形的中心
            let centerX = x + width / 2;
            let centerY = y + height / 2;

            // 注意：这里假设你的 TiledMap 节点的锚点 (Anchor) 是 (0, 0)。
            // 如果你的地图锚点是 (0.5, 0.5)，这里需要减去地图宽高的一半做偏移。
            colliderNode.setPosition(new Vec3(centerX, centerY-height, 0));

            // 添加静态刚体 (Static表示它是固定不动的墙壁，不会掉下去)
            let rigidBody = colliderNode.addComponent(RigidBody2D);
            rigidBody.type = ERigidBody2DType.Static;

            // 添加矩形碰撞盒并设置大小
            let boxCollider = colliderNode.addComponent(BoxCollider2D);
            boxCollider.size = new Size(width, height);

            // 可选：设置碰撞分组 (Group)
            // boxCollider.group = 1 << 1; // 假设墙壁在第 1 个物理分组
        }

        console.log(`✅ 成功生成了 ${objects.length} 个地图碰撞体！`);
    }
}