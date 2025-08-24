import { BoxCollider2D, ERigidBody2DType, Node, RigidBody2D, Size, TiledMap, TiledTile, Vec2, director, game } from "cc";
import { collisionCom } from "./collisionCom";

export class wuliTest {
    tiledMap: TiledMap = null;
    private visited: boolean[][] = [];
    private collisionTiles: {x: number, y: number}[] = [];
    private tileSize: Size;
    private mapSize: Size;

    constructor(tiledMap: TiledMap) {
        this.tiledMap = tiledMap;
        this.tileSize = this.tiledMap.getTileSize();
        this.mapSize = this.tiledMap.getMapSize();
        this.generateCollision();
    }

    async generateCollision() {
        const collisionLayer = this.tiledMap.getLayer("collision");
        
        // 初始化访问记录数组
        this.visited = new Array(this.mapSize.height);
        for (let y = 0; y < this.mapSize.height; y++) {
            this.visited[y] = new Array(this.mapSize.width).fill(false);
        }

        // 收集所有碰撞瓦片
        for (let y = 0; y < this.mapSize.height; y++) {
            for (let x = 0; x < this.mapSize.width; x++) {
                const tiled = collisionLayer.getTiledTileAt(x, y, true);
                if (tiled && tiled.grid !== 0) {
                    this.collisionTiles.push({x, y});
                }
            }
        }

        // 合并相邻瓦片
        for (const tile of this.collisionTiles) {
            if (!this.visited[tile.y][tile.x]) {
                const region = this.floodFill(tile.x, tile.y);
                this.createMergedCollider(region);
            }
        }
    }

    private floodFill(startX: number, startY: number): {minX: number, minY: number, maxX: number, maxY: number} {
        const queue: {x: number, y: number}[] = [{x: startX, y: startY}];
        const collisionLayer = this.tiledMap.getLayer("collision");
        
        let region = {
            minX: startX,
            minY: startY,
            maxX: startX,
            maxY: startY
        };

        this.visited[startY][startX] = true;

        const directions = [
            {dx: 0, dy: -1}, 
            {dx: 1, dy: 0}, 
            {dx: 0, dy: 1}, 
            {dx: -1, dy: 0}
        ];

        while (queue.length > 0) {
            const current = queue.shift()!;

            region.minX = Math.min(region.minX, current.x);
            region.minY = Math.min(region.minY, current.y);
            region.maxX = Math.max(region.maxX, current.x);
            region.maxY = Math.max(region.maxY, current.y);

            for (const dir of directions) {
                const newX = current.x + dir.dx;
                const newY = current.y + dir.dy;

                if (newX >= 0 && newY >= 0 && 
                    newX < this.mapSize.width && 
                    newY < this.mapSize.height &&
                    !this.visited[newY][newX]) {

                    const neighbor = collisionLayer.getTiledTileAt(newX, newY, true);
                    if (neighbor && neighbor.grid !== 0) {
                        this.visited[newY][newX] = true;
                        queue.push({x: newX, y: newY});
                    }
                }
            }
        }

        return region;
    }

    private createMergedCollider(region: {minX: number, minY: number, maxX: number, maxY: number}) {
        // 计算合并后的尺寸（单位：像素）
        const width = (region.maxX - region.minX + 1) * this.tileSize.width;
        const height = (region.maxY - region.minY + 1) * this.tileSize.height;
        
        // 关键修正：正确计算世界坐标位置（考虑Y轴反转）
        // Tiled地图坐标(左上角原点)转Cocos坐标(左下角原点)
        const tileToWorldX = (x: number) => (x + 0.5) * this.tileSize.width;
        const tileToWorldY = (y: number) => (this.mapSize.height - y - 0.5) * this.tileSize.height;
        
        // 计算合并区域的中心点（世界坐标）
        const centerX = tileToWorldX((region.minX + region.maxX) / 2);
        const centerY = tileToWorldY((region.minY + region.maxY) / 2);

        // 创建新节点
        const node = new Node();
        node.setPosition(centerX, centerY);
        this.tiledMap.node.addChild(node);

        // 添加物理组件
        const rigidbody = node.addComponent(RigidBody2D);
        const collider = node.addComponent(BoxCollider2D);
        node.addComponent(collisionCom);

        // 配置刚体
        rigidbody.group = 2;
        rigidbody.type = ERigidBody2DType.Static;
        rigidbody.enabledContactListener = true;

        // 配置碰撞体
        collider.size = new Size(width, height);
        collider.group = 2;
        collider.tag = 1;
        
        // 调试用：显示碰撞体边界
        // if (game.debug) {
        //     node.addComponent(DebugColliderDisplay);
        // }
    }
}

// 调试用组件：显示碰撞体边界
// class DebugColliderDisplay extends Component {
//     private collider: BoxCollider2D = null;
    
//     onLoad() {
//         this.collider = this.getComponent(BoxCollider2D);
//     }
    
//     onDrawGizmos() {
//         if (this.collider) {
//             const pos = this.node.position;
//             const size = this.collider.size;
//             Gizmos.drawRect(
//                 pos.x - size.width/2,
//                 pos.y - size.height/2,
//                 size.width,
//                 size.height,
//                 Color.RED
//             );
//         }
//     }
// }