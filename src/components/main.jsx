import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Select,
  Card,
  message,
  Tabs,
  Collapse,
  Divider,
  Tooltip,
  Tag,
  Space,
  Spin,
} from "antd";
import {
  LockOutlined,
  UnlockOutlined,
  InfoCircleOutlined,
  CopyOutlined,
  DeleteOutlined,
  KeyOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { RSA, AES256, CaesarCipher, XOR, TrippleDES } from "project-key-vault";

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Panel } = Collapse;

const EncryptionToolbox = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [key, setKey] = useState("");
  const [shift, setShift] = useState(3);
  const [algorithm, setAlgorithm] = useState("CaesarEncrypt");
  const [key1, setKey1] = useState("");
  const [key2, setKey2] = useState("");
  const [key3, setKey3] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("1");

  const handleRun = () => {
    if (!text) {
      message.warning("Please enter text to process");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      let output = "";

      // Initialize algorithm classes
      const rsa = new RSA();
      const aes = new AES256();
      const caesar = new CaesarCipher(shift);
      const xor = new XOR();
      const trippleDES = new TrippleDES();

      // Encrypt/Decrypt logic
      switch (algorithm) {
        case "CaesarEncrypt":
          if (!shift) throw new Error("Shift value required");
          output = caesar.encrypt(text);
          break;
        case "CaesarDecrypt":
          if (!shift) throw new Error("Shift value required");
          output = caesar.decrypt(text);
          break;
        case "aes256Encrypt":
          if (!key) throw new Error("Key required for AES-256");
          output = aes.aes256Encrypt(text, key);
          break;
        case "aes256Decrypt":
          if (!key) throw new Error("Key required for AES-256");
          output = aes.aes256Decrypt(text, key);
          break;
        case "RSAEncrypt":
          output = rsa.rsaencrypt(text);
          break;
        case "RSADecrypt":
          output = rsa.rsadecrypt(text);
          break;
        case "XOREncrypt":
          if (!key) throw new Error("Key required for XOR");
          output = xor.XorEncrypt(text, key);
          break;
        case "XORDecrypt":
          if (!key) throw new Error("Key required for XOR");
          output = xor.XorDecrypt(text, key);
          break;
        case "TrippleDESEncrypt":
          if (!key1 || !key2 || !key3)
            throw new Error("All three keys required for Triple DES");
          output = trippleDES.tripledesencrypt(text, key1, key2, key3);
          break;
        case "TrippleDESDecrypt":
          if (!key1 || !key2 || !key3)
            throw new Error("All three keys required for Triple DES");
          output = trippleDES.tripledesdecrypt(text, key1, key2, key3);
          break;
        default:
          throw new Error("Unsupported algorithm");
      }
      setResult(output);
      message.success(
        `${
          algorithm.includes("Encrypt") ? "Encrypted" : "Decrypted"
        } successfully`
      );
    } catch (err) {
      console.error(err);
      message.error(`Operation failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyResult = () => {
    if (!result) {
      message.warning("No result to copy");
      return;
    }
    navigator.clipboard.writeText(result);
    message.success("Result copied to clipboard");
  };

  const clearAll = () => {
    setText("");
    setResult("");
    setKey("");
    setKey1("");
    setKey2("");
    setKey3("");
    message.info("All fields cleared");
  };

  const renderKeyInputs = () => {
    switch (true) {
      case algorithm.includes("Caesar"):
        return (
          <Input
            prefix={<KeyOutlined style={{ color: "#1890ff" }} />}
            type="number"
            placeholder="Shift value (1-25)"
            value={shift}
            onChange={(e) => setShift(Number(e.target.value))}
            min={1}
            max={25}
          />
        );
      case algorithm.includes("TrippleDES"):
        return (
          <Space direction="vertical" style={{ width: "100%" }}>
            <Input
              prefix={<KeyOutlined style={{ color: "#1890ff" }} />}
              placeholder="Key 1"
              value={key1}
              onChange={(e) => setKey1(e.target.value)}
            />
            <Input
              prefix={<KeyOutlined style={{ color: "#1890ff" }} />}
              placeholder="Key 2"
              value={key2}
              onChange={(e) => setKey2(e.target.value)}
            />
            <Input
              prefix={<KeyOutlined style={{ color: "#1890ff" }} />}
              placeholder="Key 3"
              value={key3}
              onChange={(e) => setKey3(e.target.value)}
            />
          </Space>
        );
      case algorithm.includes("RSA"):
        return null; // RSA doesn't need key input in this implementation
      default:
        return (
          <Input
            prefix={<KeyOutlined style={{ color: "#1890ff" }} />}
            placeholder="Encryption key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
        );
    }
  };

  const getAlgorithmDetails = () => {
    const details = {
      CaesarEncrypt: {
        name: "Caesar Cipher",
        desc: "Simple substitution cipher with shift value",
      },
      CaesarDecrypt: {
        name: "Caesar Cipher",
        desc: "Simple substitution cipher with shift value",
      },
      aes256Encrypt: {
        name: "AES-256",
        desc: "Advanced Encryption Standard (256-bit)",
      },
      aes256Decrypt: {
        name: "AES-256",
        desc: "Advanced Encryption Standard (256-bit)",
      },
      RSAEncrypt: { name: "RSA", desc: "Asymmetric public-key cryptography" },
      RSADecrypt: { name: "RSA", desc: "Asymmetric public-key cryptography" },
      XOREncrypt: { name: "XOR", desc: "Binary XOR operation with key" },
      XORDecrypt: { name: "XOR", desc: "Binary XOR operation with key" },
      TrippleDESEncrypt: {
        name: "Triple DES",
        desc: "Three-key triple DES encryption",
      },
      TrippleDESDecrypt: {
        name: "Triple DES",
        desc: "Three-key triple DES decryption",
      },
    };
    return details[algorithm] || { name: algorithm, desc: "" };
  };

  const algorithmDetails = getAlgorithmDetails();

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
      <Card
        title={
          <span style={{ display: "flex", alignItems: "center" }}>
            <SafetyOutlined style={{ fontSize: 20, marginRight: 8 }} />
            <span>CryptoVault: Multi-Algorithm Encryption Toolbox</span>
          </span>
        }
        bordered={false}
        headStyle={{ borderBottom: "1px solid #f0f0f0" }}
        bodyStyle={{ padding: "24px 16px" }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabBarExtraContent={
            <Tooltip title="Current algorithm details">
              <Tag color="blue" icon={<InfoCircleOutlined />}>
                {algorithmDetails.name}
              </Tag>
            </Tooltip>
          }>
          <TabPane
            tab={
              <span>
                <LockOutlined />
                Operations
              </span>
            }
            key="1">
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {/* Left Column - Controls */}
              <Card
                style={{ flex: 1, minWidth: 300 }}
                bodyStyle={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}>
                <Select
                  value={algorithm}
                  onChange={setAlgorithm}
                  style={{ width: "100%" }}
                  dropdownMatchSelectWidth={false}>
                  <Option value="CaesarEncrypt">
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <LockOutlined style={{ marginRight: 8 }} />
                      Caesar Encrypt
                    </span>
                  </Option>
                  <Option value="CaesarDecrypt">
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <UnlockOutlined style={{ marginRight: 8 }} />
                      Caesar Decrypt
                    </span>
                  </Option>
                  <Option value="aes256Encrypt">
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <LockOutlined style={{ marginRight: 8 }} />
                      AES-256 Encrypt
                    </span>
                  </Option>
                  <Option value="aes256Decrypt">
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <UnlockOutlined style={{ marginRight: 8 }} />
                      AES-256 Decrypt
                    </span>
                  </Option>
                  <Option value="RSAEncrypt">
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <LockOutlined style={{ marginRight: 8 }} />
                      RSA Encrypt
                    </span>
                  </Option>
                  <Option value="RSADecrypt">
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <UnlockOutlined style={{ marginRight: 8 }} />
                      RSA Decrypt
                    </span>
                  </Option>
                  <Option value="XOREncrypt">
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <LockOutlined style={{ marginRight: 8 }} />
                      XOR Encrypt
                    </span>
                  </Option>
                  <Option value="XORDecrypt">
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <UnlockOutlined style={{ marginRight: 8 }} />
                      XOR Decrypt
                    </span>
                  </Option>
                  <Option value="TrippleDESEncrypt">
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <LockOutlined style={{ marginRight: 8 }} />
                      Triple DES Encrypt
                    </span>
                  </Option>
                  <Option value="TrippleDESDecrypt">
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <UnlockOutlined style={{ marginRight: 8 }} />
                      Triple DES Decrypt
                    </span>
                  </Option>
                </Select>

                {renderKeyInputs()}

                <Collapse ghost style={{ marginTop: 16 }}>
                  <Panel header="Algorithm Info" key="1">
                    <p>
                      <strong>Name:</strong> {algorithmDetails.name}
                    </p>
                    <p>
                      <strong>Description:</strong> {algorithmDetails.desc}
                    </p>
                    <p>
                      <strong>Mode:</strong>{" "}
                      {algorithm.includes("Encrypt")
                        ? "Encryption"
                        : "Decryption"}
                    </p>
                  </Panel>
                </Collapse>

                <Button
                  type="primary"
                  onClick={handleRun}
                  block
                  loading={loading}
                  style={{ marginTop: "auto" }}>
                  {algorithm.includes("Encrypt") ? "Encrypt" : "Decrypt"} Text
                </Button>
              </Card>

              {/* Right Column - Input/Output */}
              <Card
                style={{ flex: 2, minWidth: 300 }}
                bodyStyle={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}>
                <TextArea
                  rows={6}
                  placeholder={`Enter text to ${
                    algorithm.includes("Encrypt") ? "encrypt" : "decrypt"
                  }...`}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  style={{ marginBottom: 16 }}
                />

                <Divider orientation="left">Result</Divider>

                <div
                  style={{
                    flex: 1,
                    position: "relative",
                    minHeight: 200,
                  }}>
                  {loading ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                      }}>
                      <Spin tip="Processing..." />
                    </div>
                  ) : (
                    <>
                      <TextArea
                        readOnly
                        rows={6}
                        value={result}
                        style={{
                          backgroundColor: result ? "#f6ffed" : "#f5f5f5",
                          borderColor: result ? "#b7eb8f" : "#d9d9d9",
                          height: "100%",
                        }}
                      />
                      {result && (
                        <Space
                          style={{ position: "absolute", top: 8, right: 8 }}>
                          <Tooltip title="Copy result">
                            <Button
                              type="text"
                              icon={<CopyOutlined />}
                              onClick={copyResult}
                            />
                          </Tooltip>
                          <Tooltip title="Clear all">
                            <Button
                              type="text"
                              icon={<DeleteOutlined />}
                              onClick={clearAll}
                            />
                          </Tooltip>
                        </Space>
                      )}
                    </>
                  )}
                </div>
              </Card>
            </div>
          </TabPane>

          <TabPane
            tab={
              <span>
                <InfoCircleOutlined />
                Documentation
              </span>
            }
            key="2">
            <Card style={{ marginBottom: 16 }}>
              <h3>How to Use</h3>
              <ol>
                <li>
                  Select an encryption/decryption algorithm from the dropdown
                </li>
                <li>Enter the required parameters (key, shift value, etc.)</li>
                <li>Input the text you want to process</li>
                <li>
                  Click the{" "}
                  {algorithm.includes("Encrypt") ? "Encrypt" : "Decrypt"} button
                </li>
                <li>View and copy your results</li>
              </ol>
            </Card>

            <Collapse accordion>
              <Panel header="Algorithm Security Levels" key="1">
                <p>
                  <strong>Basic Security:</strong> Caesar, XOR (not secure for
                  production)
                </p>
                <p>
                  <strong>Moderate Security:</strong> Triple DES (legacy
                  systems)
                </p>
                <p>
                  <strong>High Security:</strong> AES-256 (current standard)
                </p>
                <p>
                  <strong>Public Key:</strong> RSA (asymmetric encryption)
                </p>
              </Panel>
              <Panel header="Best Practices" key="2">
                <p>• Always use strong, random keys</p>
                <p>• Never store keys in source code</p>
                <p>• Use different keys for different purposes</p>
                <p>• For production, use established cryptographic libraries</p>
              </Panel>
            </Collapse>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default EncryptionToolbox;
