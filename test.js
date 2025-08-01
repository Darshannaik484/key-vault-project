// import { RSA } from "project-key-vault";

// const rsaobj = new RSA();
// console.log(rsaobj.rsaencrypt("Hello World"));
// console.log(rsaobj.rsadecrypt(rsaobj.rsaencrypt("Hello World")));
class TrippleDES {
  pad(text) {
    const padLength = 8 - (text.length % 8);
    return text + "~".repeat(padLength === 8 ? 0 : padLength);
  }
  unpad(text) {
    return text.replace(/~+$/, "");
  }
  addMod256(block, key) {
    let result = "";
    for (let i = 0; i < block.length; i++) {
      const m = block.charCodeAt(i);
      const k = key.charCodeAt(i % key.length);
      result += String.fromCharCode((m + k) % 256);
    }
    return result;
  }

  subMod256(block, key) {
    let result = "";
    for (let i = 0; i < block.length; i++) {
      const c = block.charCodeAt(i);
      const k = key.charCodeAt(i % key.length);
      result += String.fromCharCode((c - k + 256) % 256);
    }
    return result;
  }

  tripledesencrypt(text, key1, key2, key3) {
    const padded = this.pad(text);
    let encrypted = "";
    for (let i = 0; i < padded.length; i += 8) {
      let block = padded.slice(i, i + 8);
      block = this.addMod256(block, key1);
      block = this.subMod256(block, key2);
      block = this.addMod256(block, key3);
      encrypted += block;
    }
    return encrypted;
  }

  tripledesdecrypt(text, key1, key2, key3) {
    let decrypted = "";
    for (let i = 0; i < text.length; i += 8) {
      let block = text.slice(i, i + 8);
      block = this.subMod256(block, key3);
      block = this.addMod256(block, key2);
      block = this.subMod256(block, key1);
      decrypted += block;
    }
    return this.unpad(decrypted);
  }

  // Add methods that match the App.js calls
  tripleDESEncrypt(text, key) {
    // Split the key into 3 parts for Triple DES
    const key1 = key.slice(0, Math.ceil(key.length / 3));
    const key2 = key.slice(
      Math.ceil(key.length / 3),
      Math.ceil((2 * key.length) / 3)
    );
    const key3 = key.slice(Math.ceil((2 * key.length) / 3));
    return this.tripledesencrypt(text, key1, key2, key3);
  }

  tripleDESDecrypt(text, key) {
    // Split the key into 3 parts for Triple DES
    const key1 = key.slice(0, Math.ceil(key.length / 3));
    const key2 = key.slice(
      Math.ceil(key.length / 3),
      Math.ceil((2 * key.length) / 3)
    );
    const key3 = key.slice(Math.ceil((2 * key.length) / 3));
    return this.tripledesdecrypt(text, key1, key2, key3);
  }
}
export { TrippleDES };
const obj = new TrippleDES();

const plaintext = "darshan123";
const key = "mysecurekey";

const encrypted = obj.tripleDESEncrypt(plaintext, key);
console.log("Encrypted:", encrypted);

const decrypted = obj.tripleDESDecrypt(encrypted, key);
console.log("Decrypted:", decrypted);
