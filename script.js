// URL パラメータから拡張子を取得し、デフォルトはdocxなど
const urlParams = new URLSearchParams(window.location.search);
let ext = urlParams.get("ext");
if (!ext) {
  ext = "docx";
}

// ファイル入力に対して accept 属性を反映
const fileInput = document.getElementById("fileInput");
fileInput.setAttribute("accept", `.${ext}`);

// ★修正したパターン
// 先頭：任意の日本語(ひらがな/カタカナ/漢字)・英数字
// その後 _第○回演習○_
// その後 9桁学籍番号 + [ぁ-んァ-ヶ一-龠a-zA-Z]+（氏名） + .ext
// 例：情報科学入門1122_第2回演習2_243360003鈴木一郎.docx
const fileNamePattern = new RegExp(
  '^[ぁ-んァ-ヶ一-龠a-zA-Z0-9_-]+_第\\d+回演習\\d+_[0-9]{9}[ぁ-んァ-ヶ一-龠a-zA-Z]+\\.' + ext + '$'
);

// ファイル選択時に現在のファイル名を表示
fileInput.addEventListener("change", () => {
  const uploadedFileNameDiv = document.getElementById("uploadedFileName");
  if (fileInput.files && fileInput.files.length > 0) {
    let rawName = fileInput.files[0].name;
    rawName = rawName.normalize("NFC"); // Unicode正規化
    uploadedFileNameDiv.textContent = `現在のファイル名: ${rawName}`;
  } else {
    uploadedFileNameDiv.textContent = "ファイルが選択されていません。";
  }
});

document.getElementById("checkBtn").addEventListener("click", () => {
  const resultDiv = document.getElementById("result");
  resultDiv.textContent = "";
  resultDiv.style.background = "";

  if (!fileInput.files || !fileInput.files[0]) {
    resultDiv.textContent = "ファイルが選択されていません。";
    resultDiv.style.background = "#ffcccc";
    return;
  }

  let fileName = fileInput.files[0].name;
  fileName = fileName.normalize("NFC"); // Unicode正規化

  if (fileNamePattern.test(fileName)) {
    // 適切
    resultDiv.textContent = `「${fileName}」は適切なファイル名です (拡張子: ${ext}).`;
    resultDiv.style.background = "#c8e6c9";
  } else {
    // 不適切
    resultDiv.innerHTML = `
      「${fileName}」は指定された形式ではありません。<br />
      <strong>正しい例:</strong><br />
      情報科学入門1122_第2回演習2_123456789鈴木一郎.${ext}
    `;
    resultDiv.style.background = "#ffcdd2";
  }
});
