import { BoxCollider2D, ERigidBody2DType, Node, RigidBody2D, Size, TiledMap, TiledTile, Vec2, director, game } from "cc";
import { collisionCom } from "./collisionCom";
/**
 * 对tilemap地图添加碰撞体，会合并相邻的碰撞体
 * 
 */
export class GenerateCollision {
    tiledMap: TiledMap = null;
    // 标记每个瓦片是否已访问的二维数组（防止重复处理）
    private visited: boolean[][] = [];
    // 存储所有碰撞瓦片坐标的集合
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
        
        // 初始化访问记录二维数组（尺寸 = 地图高度x地图宽度）
        this.visited = new Array(this.mapSize.height);
        for (let y = 0; y < this.mapSize.height; y++) {
            this.visited[y] = new Array(this.mapSize.width).fill(false);
        }

        // 第一遍扫描：收集所有碰撞瓦片坐标
        for (let y = 0; y < this.mapSize.height; y++) {
            for (let x = 0; x < this.mapSize.width; x++) {
                const tiled = collisionLayer.getTiledTileAt(x, y, true);
                if (tiled && tiled.grid !== 0) {
                    this.collisionTiles.push({x, y});
                }
            }
        }

        // 第二遍扫描：洪水填充合并相邻瓦片
        for (const tile of this.collisionTiles) {
            // 跳过已处理的瓦片
            if (!this.visited[tile.y][tile.x]) {
                // 洪水填充获取连续区域边界
                const region = this.floodFill(tile.x, tile.y);
                // 为该区域创建合并碰撞体
                this.createMergedCollider(region);
            }
        }
    }

        /**
     * 洪水填充算法：搜索连续碰撞区域
     * @param startX - 起始瓦片的X坐标
     * @param startY - 起始瓦片的Y坐标
     * @returns 包含区域边界信息的对象{minX, minY, maxX, maxY}
     */
    private floodFill(startX: number, startY: number): {minX: number, minY: number, maxX: number, maxY: number} {
        // 使用队列实现广度优先搜索(BFS)
        const queue: {x: number, y: number}[] = [{x: startX, y: startY}];
        const collisionLayer = this.tiledMap.getLayer("collision");
        
        // 初始化当前区域边界（初始点为最小最大边界）
        let region = {
            minX: startX,
            minY: startY,
            maxX: startX,
            maxY: startY
        };

        // 标记起始点已访问
        this.visited[startY][startX] = true;

        
        // 定义4个邻接方向：上、右、下、左
        const directions = [
            {dx: 0, dy: -1}, 
            {dx: 1, dy: 0}, 
            {dx: 0, dy: 1}, 
            {dx: -1, dy: 0}
        ];

        
        // BFS主循环
        while (queue.length > 0) {
            // 从队列头部取出当前点
            const current = queue.shift()!;

            
            // 更新区域边界范围
            region.minX = Math.min(region.minX, current.x);
            region.minY = Math.min(region.minY, current.y);
            region.maxX = Math.max(region.maxX, current.x);
            region.maxY = Math.max(region.maxY, current.y);

            // 检查四个相邻方向
            for (const dir of directions) {
                const newX = current.x + dir.dx;
                const newY = current.y + dir.dy;

                // 边界检查
                if (newX >= 0 && newY >= 0 && 
                    newX < this.mapSize.width && 
                    newY < this.mapSize.height &&
                    !this.visited[newY][newX]) {
                    // 获取相邻瓦片
                    const neighbor = collisionLayer.getTiledTileAt(newX, newY, true);
                    // 验证是有效碰撞瓦片
                    if (neighbor && neighbor.grid !== 0) {
                        // 标记已访问并加入队列
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