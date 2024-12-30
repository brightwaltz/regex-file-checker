// -------------------------------------------------------
// 1) ブラウザの localStorage からプリセットの正規表現を読み込み
//    localStorage に無ければ、デフォルトの配列を生成
// -------------------------------------------------------
const LOCAL_STORAGE_KEY = "regexPresets";
let regexPresets = [
  // デフォルトの正規表現（例）
  '^[ぁ-んァ-ヶ一-龠a-zA-Z0-9_-]+_第\\d+回演習\\d+_[0-9]{9}[ぁ-んァ-ヶ一-龠a-zA-Z]+\\.'
];

function loadRegexPresets() {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      regexPresets = JSON.parse(stored);
    } catch (e) {
      console.warn("Failed to parse localStorage. Using default presets.");
    }
  }
}

// -------------------------------------------------------
// 2) localStorage にプリセットを保存する関数
// -------------------------------------------------------
function saveRegexPresets() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(regexPresets));
}

// -------------------------------------------------------
// 3) 選択ボックスにプリセットを反映する関数
// -------------------------------------------------------
function renderRegexSelect() {
  const regexSelect = document.getElementById("regexSelect");

  // 一度クリア
  regexSelect.innerHTML = "";

  // 配列をもとに <option> を生成
  regexPresets.forEach((pattern, index) => {
    const option = document.createElement("option");
    option.value = pattern;
    option.textContent = pattern;
    // 最初の要素をデフォルト選択
    if (index === 0) {
      option.selected = true;
      // テキストボックスにも反映させる
      document.getElementById("regexPattern").value = pattern;
    }
    regexSelect.appendChild(option);
  });
}

// -------------------------------------------------------
// ページ読み込み時の初期処理
// -------------------------------------------------------

// 1) localStorage からプリセットをロード
loadRegexPresets();

// 2) 選択ボックスに描画
renderRegexSelect();

// 3) URLから拡張子パラメータを取得 (例: ?ext=docx)
const urlParams = new URLSearchParams(window.location.search);
let ext = urlParams.get("ext");
if (!ext) {
  ext = "docx"; // デフォルト拡張子
}

// 4) input[type="file"] の accept 属性を動的に設定
const fileInput = document.getElementById("fileInput");
fileInput.setAttribute("accept", `.${ext}`);

// -------------------------------------------------------
// ファイル選択時: 現在のファイル名を表示
// -------------------------------------------------------
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

// -------------------------------------------------------
// 「追加」ボタン: テキストボックスの正規表現をプリセットに加え、選択状態にする
// -------------------------------------------------------
document.getElementById("addRegexBtn").addEventListener("click", () => {
  const regexPatternInput = document.getElementById("regexPattern");
  const newPattern = regexPatternInput.value.trim();

  if (!newPattern) {
    alert("正規表現が未入力です。");
    return;
  }
  // 同じパターンが既にあれば追加しない
  if (!regexPresets.includes(newPattern)) {
    // 先頭に追加 (あるいは末尾に追加も可)
    regexPresets.unshift(newPattern);
    // 保存
    saveRegexPresets();
    // 再描画
    renderRegexSelect();
  }

  // 選択ボックスも先頭を選択状態にし、テキストボックスを同期
  document.getElementById("regexSelect").selectedIndex = 0;
  regexPatternInput.value = regexPresets[0];
});

// -------------------------------------------------------
// 選択ボックスが変更されたらテキストボックスへ反映
// -------------------------------------------------------
document.getElementById("regexSelect").addEventListener("change", (e) => {
  document.getElementById("regexPattern").value = e.target.value;
});

// -------------------------------------------------------
// 「ファイル名をチェック」クリック時の処理
// -------------------------------------------------------
document.getElementById("checkBtn").addEventListener("click", () => {
  const resultDiv = document.getElementById("result");
  resultDiv.textContent = "";
  resultDiv.style.background = "";

  // ファイル未選択
  if (!fileInput.files || !fileInput.files[0]) {
    resultDiv.textContent = "ファイルが選択されていません。";
    resultDiv.style.background = "#ffcccc";
    return;
  }

  // 現在選択されている正規表現 (「プリセットの正規表現」)
  const selectedPattern = document.getElementById("regexSelect").value;
  if (!selectedPattern) {
    resultDiv.textContent = "正規表現の選択肢がありません。";
    resultDiv.style.background = "#ffcccc";
    return;
  }

  // ファイル名をNFC正規化
  let fileName = fileInput.files[0].name;
  fileName = fileName.normalize("NFC");

  // 実際に使うパターン: 選択された正規表現 + ext + '$'
  let fullPatternString = selectedPattern + ext + '$';

  let fileNamePattern;
  try {
    fileNamePattern = new RegExp(fullPatternString);
  } catch (error) {
    resultDiv.textContent = `正規表現が不正です: ${error.message}`;
    resultDiv.style.background = "#ffcccc";
    return;
  }

  // テスト
  if (fileNamePattern.test(fileName)) {
    resultDiv.textContent = `「${fileName}」は適切なファイル名です (拡張子: ${ext}).`;
    resultDiv.style.background = "#c8e6c9"; // 緑
  } else {
    resultDiv.innerHTML = `
      「${fileName}」は指定された形式ではありません。<br />
      <strong>正規表現:</strong> <code>${fullPatternString}</code>
    `;
    resultDiv.style.background = "#ffcdd2"; // 赤
  }
});
