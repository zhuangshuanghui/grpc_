/**
 * 通用 Protobuf 工具类
 * 支持多个 proto 文件的消息类型
 */
// 类型定义
enum MessageType {
    PLAYER_MOVE = 1,
    PLAYER_JOIN = 2,
    ITEM_UPDATE = 3
}

// 协议头结构
interface ProtoHeader {
    msgType: MessageType; // 消息类型标识
    payload: Uint8Array;   // 实际proto数据
}

export class ProtoUtils {
        /**
     * 带类型的序列化
     * @param msgType 消息类型枚举值
     * @param protoType proto消息类型
     * @param data 消息数据
     */
        public static serializeWithType(
            msgType: MessageType,
            protoType: any,
            data: any
        ): Uint8Array {
            const payload = this.serialize(protoType, data);
            const header = new Uint8Array(1 + payload.length);
            header[0] = msgType; // 首字节存储消息类型
            header.set(payload, 1); // 后续存储实际数据
            return header;
        }
    
        /**
         * 带类型的反序列化
         * @param buffer 包含消息头的二进制数据
         * @param typeMap 消息类型映射表
         */
        public static deserializeWithType(
            buffer: Uint8Array,
            typeMap: Map<MessageType, any>
        ): { type: MessageType, data: any } {
            const msgType = buffer[0] as MessageType;
            const payload = buffer.slice(1);
            
            if (!typeMap.has(msgType)) {
                throw new Error(`Unknown message type: ${msgType}`);
            }
            
            return {
                type: msgType,
                data: this.deserialize(typeMap.get(msgType)!, payload)
            };
        }
    /**
     * 序列化对象为二进制数据
     * @param msgType 必须包含 encode 方法的消息GF类型
     * @param data 要序列化的数据对象
     * @returns Uint8Array 二进制数据
     */
    public static serialize<T extends { encode(message: any): protobuf.Writer }>(
        msgType: T,
        data: Parameters<T['encode']>[0]
    ): Uint8Array {
        try {
            const writer = msgType.encode(data);
            return writer.finish();
        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : 'Unknown error';
            console.error('Serialize error:', errMsg);
            throw new Error(`Protobuf serialize failed: ${errMsg}`);
        }
    }

    /**
     * 反序列化二进制数据为对象
     * @param msgType 必须包含 decode 方法的消息类型
     * @param buffer 二进制数据
     * @returns 反序列化后的消息对象
     */
    public static deserialize<T extends { decode(reader: Uint8Array | protobuf.Reader): any }>(
        msgType: T,
        buffer: Uint8Array | ArrayBuffer
    ): ReturnType<T['decode']> {
        try {
            const uint8Array = buffer instanceof ArrayBuffer
                ? new Uint8Array(buffer)
                : buffer;
            return msgType.decode(uint8Array);
        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : 'Unknown error';
            console.error('Deserialize error:', errMsg);
            throw new Error(`Protobuf deserialize failed: ${errMsg}`);
        }
    }

    /**
     * 将 Protobuf 对象转为普通 JS 对象
     * @param msgType 必须包含 toObject 方法的消息类型
     * @param pbObj Protobuf 对象
     * @param options 转换选项
     * @returns 普通 JS 对象
     */
    public static toObject<T extends {
        toObject(message: any, options?: any): any
    }>(
        msgType: T,
        pbObj: Parameters<T['toObject']>[0],
        options?: { defaults?: boolean }
    ): ReturnType<T['toObject']> {
        return msgType.toObject(pbObj, {
            defaults: options?.defaults ?? true
        });
    }

    /**
     * 从普通对象创建 Protobuf 对象
     * @param msgType 必须包含 create 方法的消息类型
     * @param plainObj 普通 JS 对象
     * @returns Protobuf 对象
     */
    public static fromObject<T extends { create(properties?: any): any }>(
        msgType: T,
        plainObj: Parameters<T['create']>[0]
    ): ReturnType<T['create']> {
        return msgType.create(plainObj);
    }

    // ... (其余方法保持与之前相同)
}