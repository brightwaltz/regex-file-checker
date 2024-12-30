// 1) URL から拡張子パラメータを取得
const urlParams = new URLSearchParams(window.location.search);
let ext = urlParams.get("ext");
if (!ext) {
  ext = "docx"; // デフォルトの拡張子
}

// 2) input[type="file"] の accept 属性を動的に設定
const fileInput = document.getElementById("fileInput");
fileInput.setAttribute("accept", `.${ext}`);

// 3) 初期値: セレクトボックス＆テキストボックス
let defaultRegexWithoutExt = document.getElementById("regexSelect").value;

// ファイル選択時、現在のファイル名を表示
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

// セレクトボックスが変更されたらテキストボックスへ反映
document.getElementById("regexSelect").addEventListener("change", (e) => {
  defaultRegexWithoutExt = e.target.value;
  document.getElementById("regexPattern").value = defaultRegexWithoutExt;
});

// テキストボックス入力時、セレクトボックスを同期(任意)
document.getElementById("regexPattern").addEventListener("input", (e) => {
  defaultRegexWithoutExt = e.target.value;
  const select = document.getElementById("regexSelect");
  for (let i = 0; i < select.options.length; i++) {
    if (select.options[i].value === defaultRegexWithoutExt) {
      select.selectedIndex = i;
      break;
    }
  }
});

// 初期状態: テキストボックスにプリセットを表示
document.getElementById("regexPattern").value = defaultRegexWithoutExt;

// 「ファイル名をチェック」ボタン
document.getElementById("checkBtn").addEventListener("click", () => {
  const resultDiv = document.getElementById("result");
  resultDiv.textContent = "";
  resultDiv.style.background = "";

  if (!fileInput.files || !fileInput.files[0]) {
    resultDiv.textContent = "ファイルが選択されていません。";
    resultDiv.style.background = "#ffcccc";
    return;
  }

  // ユーザーが入力または選択した正規表現（拡張子除き）を取得
  let regexWithoutExt = document.getElementById("regexPattern").value.trim();
  if (!regexWithoutExt) {
    resultDiv.textContent = "正規表現が未入力です。";
    resultDiv.style.background = "#ffcccc";
    return;
  }

  // ファイル名をNFCで正規化
  let fileName = fileInput.files[0].name;
  fileName = fileName.normalize("NFC");

  // 最終的な正規表現パターン： (ユーザー入力) + 拡張子 + $
  // 例: ^[ぁ-んァ-ヶ一-龠a-zA-Z0-9_-]+_第\\d+回演習\\d+_[0-9]{9}[ぁ-んァ-ヶ一-龠a-zA-Z]+\\.+docx+$
  let fullPatternString = regexWithoutExt + ext + '$';

  // 正規表現生成 (エラー時はcatch)
  let fileNamePattern;
  try {
    fileNamePattern = new RegExp(fullPatternString);
  } catch (error) {
    resultDiv.textContent = `正規表現が不正です: ${error.message}`;
    resultDiv.style.background = "#ffcccc";
    return;
  }

  // マッチ判定
  if (fileNamePattern.test(fileName)) {
    resultDiv.textContent = `「${fileName}」は適切なファイル名です (拡張子: ${ext}).`;
    resultDiv.style.background = "#c8e6c9";
  } else {
    resultDiv.innerHTML = `
      「${fileName}」は指定された形式ではありません。<br />
      <strong>正規表現:</strong> <code>${fullPatternString}</code>
    `;
    resultDiv.style.background = "#ffcdd2";
  }
});
