const { buildPoseidon } = require("circomlibjs");
const snarkjs = require("snarkjs");

// NFTのメタデータJSON
const metadata = {
  "name": "遠雷 琥珀の車検証NFT #LM500h",
  "description": "レクサス LM500h EXECUTIVE仕様のデジタル車検証です。本NFTは車両のスペックおよび所有権を証明します。",
  "image": "https://ipfs.io/ipfs/QmdDdSbzESytt4oLeyyKXMu9Fx2E15F8Vt3Y42wX3bVEdj/images/QR2.gif",
  "attributes": [
    {
      "trait_type": "車検証PDF",
      "value": "https://ipfs.io/ipfs/QmdDdSbzESytt4oLeyyKXMu9Fx2E15F8Vt3Y42wX3bVEdj/images/6.pdf"
    },
    {
      "trait_type": "自賠責保険証書PDF",
      "value": "https://ipfs.io/ipfs/QmdDdSbzESytt4oLeyyKXMu9Fx2E15F8Vt3Y42wX3bVEdj/images/5.pdf"
    },
    {
      "trait_type": "Owner Name",
      "value": "遠雷 琥珀"
    }
  ]
};

// 文字列をPoseidonハッシュ値に変換する補助関数
async function hashName(poseidon, nameStr) {
  const bytes = Buffer.from(nameStr, 'utf-8');
  let num = 0n;
  for (let i = 0; i < bytes.length; i++) {
    num = (num << 8n) + BigInt(bytes[i]);
  }
  return poseidon.F.toString(poseidon([num]));
}

// ユーザーが入力した名前をもとに Proof を生成する関数
async function generateProof(userInputName) {
  const poseidon = await buildPoseidon();

  // 1. メタデータから Owner Name ("遠雷 琥珀") を抽出
  const ownerAttr = metadata.attributes.find(attr => attr.trait_type === "Owner Name");
  const jsonOwnerName = ownerAttr ? ownerAttr.value : "";

  // 2. 名前のハッシュ計算 (ローカル上で実行)
  const myNameHash = await hashName(poseidon, userInputName);
  const ownerNameHash = await hashName(poseidon, jsonOwnerName);

  // 3. ZK回路への入力データを作成
  const circuitInputs = {
    myNameHash: myNameHash,
    ownerNameHash: ownerNameHash
  };

  // 4. ローカルで ZK Proof を生成
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    circuitInputs,
    "./owner_verifier_js/owner_verifier.wasm",
    "owner_verifier_final.zkey"
  );

  return { proof, publicSignals };
}

module.exports = { generateProof };
