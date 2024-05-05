import { decrypt, encrypt, generateKey } from "./services/cryptoService.js";

const key = generateKey(32);
console.log(decrypt(encrypt('xd', key), key));