Number.prototype[Symbol.iterator] = function() {
    const value = this.valueOf();
    let count = 0;
    let done = false;
    return {
        next() {
            count++;
            if (count > value) {
                done = true;
            }
            return {
                value: done ? undefined : count,
                done,
            }
        },
    }
}