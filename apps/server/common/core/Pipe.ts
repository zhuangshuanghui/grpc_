import { EventEmitter } from "events";

// LV格式（4字节Header+由Header表示长度的Body），可自行决定Body大小，一般2个字节够用了，4个字节最大表示几十亿，完全够用
const headerLen = 4;

/***
 * 处理TCP粘包问题
 */
export class Pipe extends EventEmitter {
  pipe: Buffer = Buffer.alloc(0);
  constructor() {
    super();
  }

  push(buffer: Buffer) {
    this.pipe = Buffer.concat([this.pipe, buffer]);

    while (this.pipe.length > headerLen) {
      const bodyLen = this.pipe.readUint32BE(0);
      const packageLen = headerLen + bodyLen;
      if (this.pipe.length >= packageLen) {
        const data = this.pipe.slice(headerLen, packageLen);
        this.pipe = this.pipe.slice(packageLen);
        this.emit("data", data);
      } else {
        break;
      }
    }
  }

  pack(data: any) {
    const body = Buffer.from(JSON.stringify(data));
    const header = Buffer.alloc(headerLen);
    if (body.length > 2 ** (headerLen * 8) - 1) {
      console.log("so big!", JSON.stringify(data));
      throw new Error("数据量太大，仅支持4个字节");
    }
    header.writeUInt32BE(body.length);
    const buffer = Buffer.concat([header, body]);
    return buffer;
  }
}
