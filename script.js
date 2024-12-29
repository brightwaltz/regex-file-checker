// 固定の正規表現パターンを定義
// 例：データ処理1101_第5回演習1_[243360003][山田太郎].pdf
//     データ処理1101_第5回演習1_[243360003][YamadaTaro].xlsx
//   ^データ処理    -> "データ処理" の文字列
//   \d+            -> 1桁以上の数字 (例: 1101)
//   _第            -> "_第"
//   \d+            -> 1桁以上の数字 (例: 5)
//   回演習         -> "回演習"
//   \d+            -> 1桁以上の数字 (例: 1)
//   _              -> "_"
//   \[ [0-9]{9} \] -> 9桁の数字を[]で括る (例: [243360003])
//   \[ [ぁ-んァ-ヶ一-龠a-zA-Z]+ \] -> 氏名を[]で括る (例: [山田太郎], [TaroYamada]など)
//   \.(pdf|xlsx)   -> 拡張子は "pdf" か "xlsx"
const fileNamePattern = new RegExp(
  '^データ処理\\d+_第\\d+回演習\\d+_\\[[0-9]{9}\\]\\[[ぁ-んァ-ヶ一-龠a-zA-Z]+\\]\\.(pdf|xlsx)$'
);

// ファイル選択時に現在のファイル名を表示
document.getElementById("fileInput").addEventListener("change", () => {
  const fileInput = document.getElementById("fileInput");
  const uploadedFileNameDiv = document.getElementById("uploadedFileName");

  if (fileInput.files && fileInput.files.length > 0) {
    const fileName = fileInput.files[0].name;
    uploadedFileNameDiv.textContent = `現在のファイル名: ${fileName}`;
  } else {
    uploadedFileNameDiv.textContent = "ファイルが選択されていません。";
  }
});

document.getElementById("checkBtn").addEventListener("click", () => {
  const fileInput = document.getElementById("fileInput");
  const resultDiv = document.getElementById("result");

  // 結果表示の初期化
  resultDiv.textContent = "";
  resultDiv.style.background = "";

  // ファイルが選択されていない場合
  if (!fileInput.files || !fileInput.files[0]) {
    resultDiv.textContent = "ファイルが選択されていません。";
    resultDiv.style.background = "#ffcccc";
    return;
  }

  const fileName = fileInput.files[0].name;

  // パターンに合致するか判定
  if (fileNamePattern.test(fileName)) {
    // 適切なファイル名
    resultDiv.textContent = `「${fileName}」は適切なファイル名です。`;
    resultDiv.style.background = "#c8e6c9"; // 緑っぽい背景
  } else {
    // 不適切なファイル名
    // 主な間違い：
    //  - 学籍番号が9桁でない
    //  - 氏名が入っていない or 全角/英字以外の記号が入っている
    //  - 拡張子が pdf / xlsx でない
    //  - 指定の形式（データ処理～回演習～）に沿っていない 等
    resultDiv.innerHTML = `
      「${fileName}」は指定された形式ではありません。<br />
      <strong>正しい例:</strong><br />
      データ処理1101_第5回演習1_[243360003][山田太郎].pdf<br />
      データ処理1101_第5回演習1_[243360003][YamadaTaro].xlsx
    `;
    resultDiv.style.background = "#ffcdd2"; // 赤っぽい背景
  }
});
