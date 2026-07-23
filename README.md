🚗 ZK PDF Access Control (ゼロ知識認証による車検証PDFアクセス制御)
NFTメタデータ内の Owner Name（所有者名）と閲覧者の名前が一致していることを、名前そのものをサーバーやネットワーク上に開示することなく（ゼロ知識証明） 数学的に検証し、車検証PDFへのアクセス権限を付与するシステムの実装デモです。
💡 システムの特長
•	完全なプライバシー保護: ネットワーク上および検証サーバー側には、所有者の氏名テキストが一切送信されません。
•	改ざん不可能な所有権証明: 正しい名前を知っていることの暗号学的証明（Proof）のみを提出するため、偽名でのアクセスは不可能です。
•	Groth16 プロトコル: ゼロ知識証明の中でも軽量で検証速度が高速な Groth16 を採用しています。
🛠 技術スタック
•	Circuit (回路): Circom 2.1.0（名前のハッシュ一致を判定するゼロ知識回路の定義）
•	Proof Protocol: snarkjs（証明の生成および検証）
•	Hash Function: Poseidon Hash（ZK親和性の高い暗号的ハッシュ関数）
•	Server: Node.js / Express（Proofを検証してPDFアクセスURLを返すAPIサーバー）
📂 プロジェクト構造
•	owner_verifier.circom: 名前のハッシュ判定を行うZK回路定義
•	client.js: ローカル側で入力名をハッシュ化してProofを生成する処理
•	server.js: Proofのみを受け取り数学的に検証するAPIサーバー
•	test.js: 一連の認証フロー（成功・失敗パターン）をテストするスクリプト
•	verification_key.json: サーバー側で使用する検証鍵 (Trusted Setup成果物)
•	package.json: プロジェクトの依存関係設定
•	README.md: プロジェクトドキュメント



🚀 使い方 / 動作手順
1. 依存ライブラリのインストール
npm install
2. 回路のコンパイルと鍵の生成（Trusted Setup）
回路のコンパイル (r1cs, wasmの出力):
circom owner_verifier.circom --wasm --r1cs --sym
Trusted Setup (Powers of Tau の準備):
snarkjs powersoftau new bn128 12 pot12_0000.ptau -v
snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First" -v -e="rand123"
snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v
回路専用のzkey生成と検証鍵のエクスポート:
snarkjs groth16 setup owner_verifier.r1cs pot12_final.ptau owner_verifier_0000.zkey
snarkjs zkey contribute owner_verifier_0000.zkey owner_verifier_final.zkey --name="Second" -v -e="rand456"
snarkjs zkey export verificationkey owner_verifier_final.zkey verification_key.json


🧪 テストの実行
1. 検証サーバーの起動
ターミナル1でサーバーを起動します。
node server.js
2. 認証テストの実行
ターミナル2でテストスクリプトを実行します。
node test.js

２：名前を入力して認証テストをした場合は、node index.js
入力を遠雷 琥珀としてください。
