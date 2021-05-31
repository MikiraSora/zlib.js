zlib.js
=======

MikiraSora folk notice
------
此folk repo支持额外的功能
* 异步Deflate(lz77)
* Deflate支持流式输入(即不用确定长度和内容).
* 支持微信小程序(小游戏). ( xxx 我cnm )

但因为是魔改而且本人也不怎么熟lz77，因此不保证此魔改库的功能完全正确.

如果需要实现流输入，则需要给compress参数的第一个对象添加两个方法: `get(idx:number)=>number`和`getLen(reqIdx:number)=>Promise<number>`<br>
 `get(idx:number)=>number` 获取某个下标的值<br>
`getLen(reqIdx:number)=>Promise<number>` 根据即将插入的值，提前计算更新长度<br>
**注意:使用流输入，需要自己手动计算校验码并覆写**

我的实现:
```typescript
import { math } from "../Global";
import { DynmaticAdler32Checksum } from "./DynmaticAdler32Checksum";

const PREV_BUFFER_MAX_SIZE = 32768 * 4;

export class VariableSegmentArray {
    appendDataReqCallback: () => Promise<Uint8Array>;
    baseIdx = 0;
    end: boolean = false;

    prevBuffer: Uint8Array
    prevBufferWritenLen = 0;

    buffer: Uint8Array = new Uint8Array(0);

    preloadTask: Promise<Uint8Array>;
    adler32: DynmaticAdler32Checksum;

    public constructor(appendDataReqCallback: () => Promise<Uint8Array>, adler32?: DynmaticAdler32Checksum, prevBufferSize = PREV_BUFFER_MAX_SIZE) {
        this.appendDataReqCallback = appendDataReqCallback;
        this.preloadTask = this.appendDataReqCallback();
        this.prevBuffer = new Uint8Array(prevBufferSize);
        this.adler32 = adler32;
    }

    public get(idx) {
        let actualIdx = idx - this.baseIdx;
        let v = null;
        if (actualIdx >= 0) {
            v = this.buffer[actualIdx];
        } else {
            let fixedReserveActualIdx = this.prevBufferWritenLen + actualIdx;
            if (fixedReserveActualIdx < 0) {
                console.log(String.format("VariableSegmentArray : idx : %s -> fixedReserveActualIdx : %s", idx, fixedReserveActualIdx))
                v = null;
            } else {
                v = this.prevBuffer[fixedReserveActualIdx];
            }
        }
        if (v === null) {
            console.log(String.format("VariableSegmentArray : idx : %s -> null", idx))
        }
        return v;
    }

    public async getLen(reqIdx) {
        /**
         * |---- ...... --------------| writenLen
         *                                | reqIdx
         */
        while (reqIdx >= this.buffer.length + this.baseIdx && !this.end) {
            let appendBuffer = await this.preloadTask;
            this.appendBuffer(appendBuffer);
            if (!this.end) {
                this.preloadTask = this.appendDataReqCallback();
            }
        }
        return this.buffer.length + this.baseIdx;
    }

    appendBuffer(appendBuffer: Uint8Array, end = false) {
        this.end = end || !appendBuffer;
        if (appendBuffer) {
            this.adler32?.appendNewData(appendBuffer);
            let oldBufferLength = this.buffer?.length ?? 0;

            if (this.buffer && oldBufferLength > 0) {
                let writenPos = math.min(this.prevBuffer.length, this.prevBufferWritenLen);
                let reqStartPos = (this.prevBuffer.length - oldBufferLength)
                let moveSize = writenPos - reqStartPos;
                if (moveSize > 0) {
                    //需要重新安排内容
                    //    shift out.
                    //    v                  
                    // |-----v------------------    |
                    this.prevBuffer.set(this.prevBuffer.slice(moveSize, moveSize + this.prevBufferWritenLen))
                    this.prevBufferWritenLen = math.max(0, this.prevBufferWritenLen - moveSize);
                }

                this.prevBuffer.set(this.buffer.slice(0, math.min(oldBufferLength, this.prevBuffer.length)), this.prevBufferWritenLen);
                this.prevBufferWritenLen += oldBufferLength;
            }

            this.baseIdx += oldBufferLength;
            this.buffer = appendBuffer;
        }
    }
}

```
实际用法:
```typescript 
let i = 0;
let arr = new VariableSegmentArray(async () => {
                        if (i > 100) {
                            return null;
                        }
                        let buffer: Uint8Array = new Uint8Array(8 * 1024 * 1024);
                        await ScheduleUtils.getInstance().delay(0.1);
                        // 这里顺便计算zlib校验码
                        i++;
                        return buffer;
                    });
                    let deflate3 = new Zlib.Deflate(arr);
                    let compressedBuffer: Uint8Array = await deflate3.compress();
                    //todo : 给compressedBuffer塞zlib校验码
```

ライセンス
-----------

Copyright &copy; 2012 imaya.
Licensed under the MIT License.
