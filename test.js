const { generateProof } = require("./client");

async function runTest() {
  console.log("\n-------------------------------------------");
  console.log("テスト 1: 正しい名前（遠雷 琥珀）を入力した場合");
  console.log("-------------------------------------------");
  try {
    // 1. クライアント側でProof作成
    console.log("・ローカルでゼロ知識証明(Proof)を生成中...");
    const { proof, publicSignals } = await generateProof("遠雷 琥珀");
    console.log("・Proofの生成に成功しました！");

    // 2. サーバーへProofのみを送信して検証
    console.log("・サーバーへProofを送信して検証要求を行っています...");
    const response = await fetch("http://localhost:3000/api/verify-and-get-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proof, publicSignals })
    });
    
    const result = await response.json();
    console.log("・サーバーからのレスポンス:", result);
  } catch (e) {
    console.error("エラー:", e.message);
  }

  console.log("\n-------------------------------------------");
  console.log("テスト 2: 違う名前（田中 太郎）を入力した場合");
  console.log("-------------------------------------------");
  try {
    console.log("・不正な名前でProofを生成しようとしています...");
    await generateProof("田中 太郎");
  } catch (e) {
    console.log("・【期待通りの動作】名前が一致しないため、ローカルでのProof生成自体が弾かれました！");
  }
  console.log("-------------------------------------------\n");
}

runTest();
