//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

module egret {

    var setTimeoutCache:any = {};
    var setTimeoutIndex:number = 0;

    var setTimeoutCount:number = 0;
    /**
     * 在指定的延迟（以毫秒为单位）后运行指定的函数。
	 * @method egret.setTimeout
     * @param listener {Function} 侦听函数
     * @param thisObject {any} this对象
     * @param delay {number} 延迟时间，以毫秒为单位
     * @param ...args {any} 参数列表
	 * @returns {number} 返回索引，可以用于 clearTimeout
     */
    export function setTimeout(listener:Function, thisObject:any, delay:number, ...args):number {
        var data = {listener: listener, thisObject: thisObject, delay: delay, params: args};

        setTimeoutCount++;
        if (setTimeoutCount == 1) {
            sys.$ticker.$startTick(timeoutUpdate, null);
        }

        setTimeoutIndex++;
        setTimeoutCache[setTimeoutIndex] = data;
        return setTimeoutIndex;
    }

    /**
     * 清除指定延迟后运行的函数。
	 * @method egret.clearTimeout
     * @param key {number} egret.setTimeout所返回的索引
     */
    export function clearTimeout(key:number):void {
        if (setTimeoutCache[key]) {
            setTimeoutCount--;
            delete setTimeoutCache[key];

            if (setTimeoutCount == 0) {
                sys.$ticker.$stopTick(timeoutUpdate, null);
            }
        }

    }

    function timeoutUpdate(dt:number):boolean {
        for (var key in setTimeoutCache) {
            var data = setTimeoutCache[key];
            data.delay -= dt;
            if (data.delay <= 0) {
                data.listener.apply(data.thisObject, data.params);

                clearTimeout(key);
            }
        }

        return true;
    }
}