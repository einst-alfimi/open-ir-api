const crypto = require('crypto');

module.exports = {
    randomStr: (letter, length) => {
        const S = letter ?? "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const N = length ?? 64;
        return Array.from(crypto.randomFillSync(new Uint8Array(N))).map((n)=>S[n%S.length]).join('');
    },
    makeUniqueId: () => {
        const S = "abcdefghijklmnopqrstuvwxyz0123456789";
        const N = 32;
        const R = Array.from(crypto.randomFillSync(new Uint8Array(N))).map((n)=>S[n%S.length]).join('');
        let cdn1 = R.match(/.{8}/g);
        return cdn1.join("-");
    } 
}