import React, { useState, useEffect } from "react";
import RSA from "project-key-vault";
const RSAEncryptor = () => {
  const [inputText, setInputText] = useState("");
  const [encryptedText, setEncryptedText] = useState("");
  const [decryptedText, setDecryptedText] = useState("");

  const rsaObj = new RSA();
  useEffect(() => {
    if (inputText.trim() === "") {
      setEncryptedText("");
      setDecryptedText("");
      return;
    }

    try {
      const enc = rsaObj.rsaencrypt(inputText);
      const dec = rsaObj.rsadecrypt(enc);
      setEncryptedText(enc);
      setDecryptedText(dec);
    } catch (err) {
      setEncryptedText("Encryption Error");
      setDecryptedText("");
      console.error(err);
    }
  }, [inputText]);

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "600px",
        margin: "auto",
        fontFamily: "sans-serif",
      }}>
      <h2> Real-Time RSA Encryptor</h2>
      <input
        type="text"
        placeholder="Enter text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          marginBottom: "15px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />

      <div>
        <strong>Encrypted Text:</strong>
        <div
          style={{ background: "#eef", padding: "10px", borderRadius: "5px" }}>
          {encryptedText}
        </div>
      </div>

      <div style={{ marginTop: "15px" }}>
        <strong>Decrypted Text:</strong>
        <div
          style={{ background: "#efe", padding: "10px", borderRadius: "5px" }}>
          {decryptedText}
        </div>
      </div>
    </div>
  );
};

export default RSAEncryptor;
