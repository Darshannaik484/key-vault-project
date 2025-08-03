import React, { useState } from "react";
import { Input, Button, Select } from "antd";
import { RSA, AES256, CaesarCipher, XOR, TrippleDES } from "project-key-vault";

const { Option } = Select;

const EncryptionToolbox = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [key, setKey] = useState("");
  const [shift, setShift] = useState(3);
  const [algorithm, setAlgorithm] = useState("CaesarEncrypt");
  const [key1, setKey1] = useState("");
  const [key2, setKey2] = useState("");
  const [key3, setKey3] = useState("");
  const handleRun = () => {
    try {
      let output = "";

      // Initialize algorithm classes
      const rsa = new RSA();
      const aes = new AES256();
      const caesar = new CaesarCipher(shift);
      const xor = new XOR();
      const trippleDES = new TrippleDES();

      console.log("Algorithm:", algorithm);
      console.log("Text:", text);
      console.log("Key:", key);
      console.log("Shift:", shift);

      // Test Caesar Cipher directly
      if (algorithm === "CaesarEncrypt") {
        output = caesar.encrypt(text);
      } else if (algorithm === "CaesarDecrypt") {
        output = caesar.decrypt(text);
      } else if (algorithm === "aes256Encrypt") {
        output = aes.aes256Encrypt(text, key);
      } else if (algorithm === "aes256Decrypt") {
        output = aes.aes256Decrypt(text, key);
      } else if (algorithm === "RSAEncrypt") {
        output = rsa.rsaencrypt(text);
      } else if (algorithm === "RSADecrypt") {
        output = rsa.rsadecrypt(text);
      } else if (algorithm === "XOREncrypt") {
        output = xor.XorEncrypt(text, key);
      } else if (algorithm === "XORDecrypt") {
        output = xor.XorDecrypt(text, key);
      } else if (algorithm === "TrippleDESEncrypt") {
        output = trippleDES.tripledesencrypt(text, key1, key2, key3);
      } else if (algorithm === "TrippleDESDecrypt") {
        output = trippleDES.tripledesdecrypt(text, key1, key2, key3);
      } else {
        output = "Unsupported algorithm selected.";
      }

      console.log("Final output:", output);
      setResult(output);
    } catch (err) {
      console.error("Error details:", err);
      console.error("Error message:", err.message);
      console.error("Error stack:", err.stack);
      setResult(`Operation failed: ${err.message}`);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>🔐 Multi-Algorithm Encryption Toolbox</h2>

      <p>Select Algorithm:</p>
      <Select
        value={algorithm}
        onChange={setAlgorithm}
        style={{ width: "100%", marginBottom: 10 }}>
        <Option value="CaesarEncrypt">Caesar Cipher Encrypt</Option>
        <Option value="CaesarDecrypt">Caesar Cipher Decrypt</Option>
        <Option value="aes256Encrypt">AES-256 Encrypt</Option>
        <Option value="aes256Decrypt">AES-256 Decrypt</Option>
        <Option value="RSAEncrypt">RSA Encrypt</Option>
        <Option value="RSADecrypt">RSA Decrypt</Option>
        <Option value="XOREncrypt">XOR Encrypt</Option>
        <Option value="XORDecrypt">XOR Decrypt</Option>
        <Option value="TrippleDESEncrypt">Triple DES Encrypt</Option>
        <Option value="TrippleDESDecrypt">Triple DES Decrypt</Option>
      </Select>

      <Input.TextArea
        rows={4}
        placeholder="Enter text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ marginBottom: 10 }}
      />

      {algorithm.includes("Caesar") && (
        <Input
          type="number"
          placeholder="Shift value"
          value={shift}
          onChange={(e) => setShift(Number(e.target.value))}
          style={{ marginBottom: 10 }}
        />
      )}

      {["aes256Encrypt", "aes256Decrypt", "XOREncrypt", "XORDecrypt"].includes(
        algorithm
      ) && (
        <Input
          placeholder="Enter key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          style={{ marginBottom: 10 }}
        />
      )}
      {["TrippleDESEncrypt", "TrippleDESDecrypt"].includes(algorithm) && (
        <>
          <Input
            placeholder="Enter Key 1"
            value={key1}
            onChange={(e) => setKey1(e.target.value)}
            style={{ marginBottom: 10 }}
          />
          <Input
            placeholder="Enter Key 2"
            value={key2}
            onChange={(e) => setKey2(e.target.value)}
            style={{ marginBottom: 10 }}
          />
          <Input
            placeholder="Enter Key 3"
            value={key3}
            onChange={(e) => setKey3(e.target.value)}
            style={{ marginBottom: 10 }}
          />
        </>
      )}

      <Button type="primary" onClick={handleRun} block>
        Run
      </Button>

      <p style={{ marginTop: 20 }}>
        <strong>Result:</strong>
        <div
          style={{
            background: "#f0f0f0",
            padding: "10px",
            borderRadius: "5px",
            wordBreak: "break-word",
          }}>
          {result}
        </div>
      </p>
    </div>
  );
};

export default EncryptionToolbox;
