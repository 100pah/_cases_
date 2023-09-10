async function retry(fn, maxCount) {
    maxCount = Math.max(0, maxCount);
    let count = 0;
    while (true) {
        try {
            return await fn();
        }
        catch (err) {
            if (count >= maxCount) {
                throw err;
            }
            count++;
        }
    }
}

module.exports.retry = retry;
