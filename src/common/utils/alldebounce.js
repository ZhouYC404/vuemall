export default function alldebounce(func,delay) {
        let timer = null
        return function(){
            clearTimeout(timer)
            timer = setTimeout(() => {
                func.apply(this)
                /* console.log('1111');这个测试函数放在func里面比较好，不然可能执行完func但是没来得及执行这个111就被下一条定时器顶掉了 */
            }, delay);
        }
}