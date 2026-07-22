const express = require("express");
const snarkjs = require("snarkjs");
const fs = require("fs");

const app = express();
app.use(express.json());

// STEP 3 で出力した検証鍵を読み込み
const verificationKey = JSON.parse(fs.readFileSync("./verification_key.json"));

// 証明を検証してPDFアクセス権限を与えるAPI
app.post("/api/verify-and-get-pdf", async (req, res) => {
  try {
    const { proof, publicSignals } = req.body;

    // ZK Proof の数学的検証（※名前文字列そのものは届いていません）
    const isValid = await snarkjs.groth16.verify(verificationKey, publicSignals, proof);

    if (isValid) {
      res.json({
        success: true,
        message: "【認証成功】所有者本人であることがゼロ知識証明されました！",
        pdfUrl: "https://ipfs.io/ipfs/QmdDdSbzESytt4oLeyyKXMu9Fx2E15F8Vt3Y42wX3bVEdj/images/6.pdf"
      });
    } else {
      res.status(403).json({ success: false, message: "【認証失敗】無効な証明です。" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3000, () => {
  console.log("検証サーバーが起動しました: http://localhost:3000");
});
