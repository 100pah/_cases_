const {cmdInline, cmd} = require('./shellUtil');

const testCaseList = [
    async () => {
        console.log(await cmdInline('ls -alF'));
    },
    async () => {
        const result = await cmdInline('date');
        console.log(`result is ${result}`);
    },
    async () => {
        try {
            await cmdInline('commandthatnotexist');
        }
        catch (err) {
            console.log('test passed, get error', err);
        }
    },
    async () => {
        try {
            // Will fail on node that does not support `--openssl-legacy-provider`.
            await cmd('node --version', {
                'NODE_OPTIONS': '--openssl-legacy-provider'
            });
        }
        catch (err) {
            console.log(err);
        }
    },
    async () => {
        await cmd('sh test.sh a', {
            MY_ENV_VALUE_1: 'my env value 1',
            MY_ENV_VALUE_2: 'my env value 2',
        });
    },
    async () => {
        // quote should be processed correctly.
        await cmd('sh test.sh a "b c"');
    },
    async () => {
        // quote should be processed correctly.
        await cmd('sh test.sh a \\\"b c\\\"');
    },
    async () => {
        // quote should be processed correctly.
        await cmd('sh test.sh a b\ c');
    },
];

async function test() {
    for (let i = 0; i < testCaseList.length; i++) {
        const testCase = testCaseList[i];
        console.log(`--- test case ${i} ---`);
        await testCase();
    }
}

test();
