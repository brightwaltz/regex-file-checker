// 1) URL から ext パラメータを取得
const urlParams = new URLSearchParams(window.location.search);
let ext = urlParams.get("ext");

// 2) ext が取得できなかった場合は、デフォルトの拡張子を設定
if (!ext) {
  ext = "pdf"; // デフォルト拡張子を pdf とする例
}

// 3) input[type="file"] の accept 属性を動的に設定 (例: ".pdf", ".xlsx" など)
const fileInput = document.getElementById("fileInput");
fileInput.setAttribute("accept", `.${ext}`);

// 4) 正規表現を拡張子に応じて動的に生成
//    例) データ処理1101_第5回演習1_243360003山田太郎.pdf
//        ^データ処理\d+_第\d+回演習\d+_[0-9]{9}[ぁ-んァ-ヶ一-龠a-zA-Z]+\.(pdf|xxx)$
const fileNamePattern = new RegExp(
  '^データ処理\\d+_第\\d+回演習\\d+_[0-9]{9}[ぁ-んァ-ヶ一-龠a-zA-Z]+\\.' + ext + '$'
);

// ファイル選択時に現在のファイル名を表示
fileInput.addEventListener("change", () => {
  const uploadedFileNameDiv = document.getElementById("uploadedFileName");

  if (fileInput.files && fileInput.files.length > 0) {
    const fileName = fileInput.files[0].name;
    uploadedFileNameDiv.textContent = `現在のファイル名: ${fileName}`;
  } else {
    uploadedFileNameDiv.textContent = "ファイルが選択されていません。";
  }
});

document.getElementById("checkBtn").addEventListener("click", () => {
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
    resultDiv.textContent = `「${fileName}」は適切なファイル名です (拡張子: ${ext}).`;
    resultDiv.style.background = "#c8e6c9"; // 緑っぽい背景
  } else {
    // 不適切なファイル名
    resultDiv.innerHTML = `
      「${fileName}」は指定された形式ではありません。<br />
      <strong>正しい例:</strong><br />
      データ処理1101_第5回演習1_243360003山田太郎.${ext}
    `;
    resultDiv.style.background = "#ffcdd2"; // 赤っぽい背景
  }
});
