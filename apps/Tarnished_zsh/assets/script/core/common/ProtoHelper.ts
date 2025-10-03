// utils/proto-helper.ts
import * as $protobuf from 'protobufjs/minimal';

type ProtoClass<T> = {
  encode(message: T): $protobuf.Writer;
  decode(reader: Uint8Array): T;
  create(properties?: Partial<T>): T;
};

export class ProtoHelper {
  // 全局编码缓存（WeakMap 自动处理内存回收）
  private static encodeCache = new WeakMap<object, Uint8Array>();

  /**
   * 通用编码（带缓存）
   */
  static encode<T extends object>(message: T, protoClass: ProtoClass<T>): Uint8Array {
    if (!this.encodeCache.has(message)) {
      this.encodeCache.set(message, protoClass.encode(message).finish());
    }
    return this.encodeCache.get(message)!;
  }

  /**
   * 通用解码
   */
  static decode<T>(data: Uint8Array, protoClass: ProtoClass<T>): T {
    return protoClass.decode(data);
  }

  /**
   * 快速创建消息对象
   */
  static create<T>(props: Partial<T>, protoClass: ProtoClass<T>): T {
    return protoClass.create(props);
  }
}