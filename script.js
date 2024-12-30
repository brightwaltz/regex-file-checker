// localStorageキー
const LOCAL_STORAGE_KEY = "regexPresets";

// デフォルトプリセット
let regexPresets = [
  '^[ぁ-んァ-ヶ一-龠a-zA-Z0-9_-]+_第\\d+回演習\\d+_[0-9]{9}[ぁ-んァ-ヶ一-龠a-zA-Z]+\\.'
];

function loadRegexPresets() {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      regexPresets = JSON.parse(stored);
    } catch (e) {
      console.warn("Failed to parse localStorage, using default presets.");
    }
  }
}

function saveRegexPresets() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(regexPresets));
}

function renderRegexSelect() {
  const regexSelect = document.getElementById("regexSelect");
  regexSelect.innerHTML = "";

  regexPresets.forEach((pattern, index) => {
    const option = document.createElement("option");
    option.value = pattern;
    option.textContent = pattern;
    if (index === 0) {
      option.selected = true;
      document.getElementById("regexPattern").value = pattern;
    }
    regexSelect.appendChild(option);
  });
}

// ---------------------------
// 初期化
// ---------------------------
loadRegexPresets();
renderRegexSelect();

// URLから拡張子 (例: ?ext=docx)
const urlParams = new URLSearchParams(window.location.search);
let ext = urlParams.get("ext") || "docx";

// 「現在の拡張子: ～」を表示
const currentExtDisplay = document.getElementById("currentExtDisplay");
currentExtDisplay.textContent = `現在の拡張子: ${ext}`;

// ファイル選択
const fileInput = document.getElementById("fileInput");
fileInput.setAttribute("accept", `.${ext}`);

fileInput.addEventListener("change", () => {
  const uploadedFileNameDiv = document.getElementById("uploadedFileName");
  if (fileInput.files && fileInput.files.length > 0) {
    let rawName = fileInput.files[0].name;
    rawName = rawName.normalize("NFC");
    uploadedFileNameDiv.textContent = `現在のファイル名: ${rawName}`;
  } else {
    uploadedFileNameDiv.textContent = "ファイルが選択されていません。";
  }
});

// 「追加」ボタン
document.getElementById("addRegexBtn").addEventListener("click", () => {
  const newPattern = document.getElementById("regexPattern").value.trim();
  if (!newPattern) {
    alert("正規表現が未入力です。");
    return;
  }
  // 重複チェック
  if (!regexPresets.includes(newPattern)) {
    regexPresets.unshift(newPattern);
    saveRegexPresets();
    renderRegexSelect();
  }
  // 先頭を選択状態に
  document.getElementById("regexSelect").selectedIndex = 0;
});

// 選択ボックス変更時
document.getElementById("regexSelect").addEventListener("change", (e) => {
  document.getElementById("regexPattern").value = e.target.value;
});

// 「ファイル名をチェック」ボタン
document.getElementById("checkBtn").addEventListener("click", () => {
  const resultDiv = document.getElementById("result");
  resultDiv.textContent = "";
  resultDiv.style.background = "";

  if (!fileInput.files || fileInput.files.length === 0) {
    resultDiv.textContent = "ファイルが選択されていません。";
    resultDiv.style.background = "#ffcccc";
    return;
  }

  const selectedPattern = document.getElementById("regexSelect").value;
  if (!selectedPattern) {
    resultDiv.textContent = "正規表現の選択肢がありません。";
    resultDiv.style.background = "#ffcccc";
    return;
  }

  // ファイル名をNFC正規化
  let fileName = fileInput.files[0].name;
  fileName = fileName.normalize("NFC");

  // 実際に使う正規表現: 選択されたパターン + ext + '$'
  let fullPattern = selectedPattern + ext + '$';

  let regexObj;
  try {
    regexObj = new RegExp(fullPattern);
  } catch (error) {
    resultDiv.textContent = `正規表現が不正です: ${error.message}`;
    resultDiv.style.background = "#ffcccc";
    return;
  }

  if (regexObj.test(fileName)) {
    resultDiv.textContent = `「${fileName}」は適切なファイル名です (拡張子: ${ext}).`;
    resultDiv.style.background = "#c8e6c9"; // 緑背景
  } else {
    resultDiv.innerHTML = `
      「${fileName}」は指定された形式ではありません。<br />
      <strong>正規表現:</strong> <code>${fullPattern}</code>
    `;
    resultDiv.style.background = "#ffcdd2"; // 赤背景
  }
});
