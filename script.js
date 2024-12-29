// ----------------------------
// 1) URL から ext パラメータを取得
//    例：?ext=docx -> 'docx'
const urlParams = new URLSearchParams(window.location.search);
let ext = urlParams.get("ext");

// 2) ext が取得できない場合はデフォルト拡張子を設定
if (!ext) {
  ext = "pdf"; // デフォルトは pdf、必要に応じて変更可
}

// 3) input[type="file"] の accept 属性を動的に設定
const fileInput = document.getElementById("fileInput");
fileInput.setAttribute("accept", `.${ext}`);

// ----------------------------
// 4) 正規表現を拡張子に応じて動的に生成
//    例: データ処理1101_第5回演習1_243360003山田太郎.docx
//      ^データ処理       -> "データ処理" の文字列
//      \d+               -> 1桁以上の数字 (例: 1101)
//      _第               -> "_第"
//      \d+               -> 1桁以上の数字 (例: 5)
//      回演習            -> "回演習"
//      \d+               -> 1桁以上の数字 (例: 1)
//      _                 -> "_"
//      [0-9]{9}          -> 9桁の数字 (例: 243360003)
//      [ぁ-んァ-ヶ一-龠a-zA-Z]+ -> 氏名（日本語/英字）
//      \.ext             -> 変数 ext に基づく拡張子
const fileNamePattern = new RegExp(
  '^データ処理\\d+_第\\d+回演習\\d+_[0-9]{9}[ぁ-んァ-ヶ一-龠a-zA-Z]+\\.' + ext + '$'
);

// ----------------------------
// ファイル選択時に現在のファイル名を表示 (Unicode正規化)
fileInput.addEventListener("change", () => {
  const uploadedFileNameDiv = document.getElementById("uploadedFileName");

  if (fileInput.files && fileInput.files.length > 0) {
    let rawName = fileInput.files[0].name;
    // ① 選択されたファイル名をNFCで正規化
    rawName = rawName.normalize("NFC");

    uploadedFileNameDiv.textContent = `現在のファイル名: ${rawName}`;
  } else {
    uploadedFileNameDiv.textContent = "ファイルが選択されていません。";
  }
});

// ----------------------------
// 「ファイル名をチェック」クリック時の処理 (Unicode正規化してマッチ判定)
document.getElementById("checkBtn").addEventListener("click", () => {
  const resultDiv = document.getElementById("result");
  // 初期化
  resultDiv.textContent = "";
  resultDiv.style.background = "";

  if (!fileInput.files || !fileInput.files[0]) {
    resultDiv.textContent = "ファイルが選択されていません。";
    resultDiv.style.background = "#ffcccc";
    return;
  }

  // ② チェック時にも正規化
  let fileName = fileInput.files[0].name;
  fileName = fileName.normalize("NFC");

  // パターンに合致するか判定
  if (fileNamePattern.test(fileName)) {
    // 適切なファイル名
    resultDiv.textContent = `「${fileName}」は適切なファイル名です (拡張子: ${ext}).`;
    resultDiv.style.background = "#c8e6c9"; // 緑
  } else {
    // 不適切なファイル名
    resultDiv.innerHTML = `
      「${fileName}」は指定された形式ではありません。`;
    resultDiv.style.background = "#ffcdd2"; // 赤
  }
});
