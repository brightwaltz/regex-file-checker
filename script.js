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
  const regexPattern = document.getElementById("regexPattern").value.trim();

  // ファイルが選択されていない場合
  if (!fileInput.files[0]) {
    resultDiv.textContent = "ファイルが選択されていません。";
    resultDiv.style.background = "#ffcccc";
    return;
  }

  // 正規表現パターンが空の場合
  if (!regexPattern) {
    resultDiv.textContent = "正規表現パターンを入力してください。";
    resultDiv.style.background = "#ffcccc";
    return;
  }

  // 選択されたファイル名を取得
  const fileName = fileInput.files[0].name;
  let re;
  try {
    // 新しい RegExp オブジェクトを生成
    re = new RegExp(regexPattern);
  } catch (error) {
    resultDiv.textContent = "正規表現パターンが不正です: " + error.message;
    resultDiv.style.background = "#ffcccc";
    return;
  }

  // ファイル名が正規表現にマッチするか判定
  if (re.test(fileName)) {
    // 適切なファイル名
    resultDiv.textContent = `「${fileName}」は適切なファイル名です。`;
    resultDiv.style.background = "#c8e6c9"; // 緑っぽい背景
  } else {
    // 不適切なファイル名
    // ユーザーにファイル名の提案を行う(例: アンダースコアと英数字に置換)
    const suggestion = fileName.replace(/[^a-zA-Z0-9_]/g, "_");

    resultDiv.innerHTML = `
      「${fileName}」は不適切なファイル名です。<br />
      例：<strong>${suggestion}</strong> はどうですか？
    `;
    resultDiv.style.background = "#ffcdd2"; // 赤っぽい背景
  }
});
