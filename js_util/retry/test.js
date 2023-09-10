const {retry} = require('./retry');

////////////////////////////////////////////////////
/// test case
/// For example, "successAt is 2" means
/// "fail, fail, success" occur sequentially.
function makeRequest(successAt) {
    let callIdx = 0;
    return function () {
        const thisCallIdx = callIdx;
        callIdx++;
        console.log('call request at ' + thisCallIdx);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (thisCallIdx === successAt) {
                    console.log('success at ' + thisCallIdx);
                    resolve({
                        data: 'succ_' + Math.random(),
                    });
                }
                else {
                    console.log('fail at ' + thisCallIdx);
                    reject({
                        data: 'err_' + Math.random(),
                    });
                }
            }, 300);
        });
    }
}

const makeTestCase = (retryCount, successAt) => () => {
    const request = makeRequest(successAt);
    retry(request, retryCount)
        .then(result => {
            console.log('Final success ', result);
        })
        .catch(err => {
            console.log('Final fail ', err);
        });
}


const testCase_1 = makeTestCase(1, 0);
const testCase_2 = makeTestCase(6, 5);
const testCase_3 = makeTestCase(5, Infinity);

testCase_1();
testCase_2();
testCase_3();
