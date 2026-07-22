const readline = require("readline");
const { generateProof } = require("./client");

// ターミナルで文字入力を受け取る設定
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  console.log("\n==================================================");
  console.log(" 🚗 ゼロ知識認証（ZKP）車検証PDFアクセスシステム");
  console.log("==================================================\n");

  // 1. ユーザーに名前の入力を促す
  rl.question("あなたの名前を入力してください: ", async (inputName) => {
    const trimmedName = inputName.trim();
    
    if (!trimmedName) {
      console.log("❌ 名前が入力されていません。終了します。");
      rl.close();
      return;
    }

    console.log(`\n[1/3] ローカル環境で「${trimmedName}」のゼロ知識証明(Proof)を計算中...`);

    try {
      // 2. ローカルで Proof を生成（名前が一致しないとエラーになります）
      const { proof, publicSignals } = await generateProof(trimmedName);
      console.log("      └─ ✅ 証明(Proof)の生成に成功しました！（※名前そのものは秘匿されます）");

      // 3. サーバーへ Proof のみを送信（名前テキストは送信しません）
      console.log("\n[2/3] 検証サーバーへ Proof のみを送信しています...");
      const response = await fetch("http://localhost:3000/api/verify-and-get-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proof, publicSignals })
      });

      const result = await response.json();

      // 4. 結果の表示
      console.log("\n[3/3] サーバーからの応答:");
      if (result.success) {
        console.log(`\n🎉 ${result.message}`);
        console.log(`📄 車検証PDFのURL: ${result.pdfUrl}\n`);
      } else {
        console.log(`\n❌ ${result.message}\n`);
      }

    } catch (error) {
      console.log("\n❌ 認証エラー: 入力された名前は JSON の Owner Name と一致しません。");
      console.log("   （数学的制約を満たせないため、Proofの生成に失敗しました）\n");
    }

    rl.close();
  });
}

main();
