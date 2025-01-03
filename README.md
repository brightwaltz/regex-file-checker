# ファイル名チェッカー (regex-file-checker)

このツールは、アップロードしたファイルの名前が正規表現（Regex）のルールを満たしているかどうかをチェックし、不適切な文字が含まれている場合は置き換え例を提案してくれるシンプルなWebアプリです。  
以下のリンクからアクセスするだけで、すぐに利用できます。

---

## 1. 使い方

1. **アクセス**  
   - 指定された GitHub Pages の URL にブラウザでアクセスしてください。

2. **ファイルをアップロード**  
   - 「ファイルを選択」ボタンをクリックして、チェックしたいファイルをアップロードします。

3. **正規表現パターンを入力**  
   - `^[a-zA-Z0-9_]+$` のように、自分がチェックしたいパターンをテキストボックスに入力します。  
   - 例：  
     - 半角英数字とアンダースコアのみ → `^[a-zA-Z0-9_]+$`  
     - 先頭が英文字で始まる8～20文字 → `^[a-zA-Z][a-zA-Z0-9_]{7,19}$`  

4. **「ファイル名をチェック」を押す**  
   - ファイル名が入力した正規表現パターンに合っているかをすぐに確認できます。

5. **結果の表示**  
   - マッチした場合：ファイル名が「適切です」と表示され、背景が緑系に変わります。  
   - マッチしない場合：ファイル名が「不適切です」と表示され、不適切な文字をアンダースコア (`_`) に置き換えた例が提示されます。背景は赤系です。

---

## 2. 正規表現パターンについて

- **入力例**:  
  - `^[a-zA-Z0-9_]+$` → 半角英数字とアンダースコアのみ許可  
  - `^[a-zA-Z][a-zA-Z0-9_]{7,19}$` → 先頭が英文字、合計8～20文字のファイル名  
- **エラー**:  
  - 正規表現パターン自体が誤っている（例：括弧やエスケープシーケンスのミスなど）場合はエラーメッセージが表示されます。

---

## 3. 特徴・メリット

- **直感的な操作**  
  手順に沿ってボタンを押すだけで判定結果が得られる。
  
- **リアルタイムなチェック**  
  ファイルをアップロードして正規表現を入力したら、すぐに結果が表示されるため、校正作業がスムーズ。

- **置き換え例の提示**  
  万一、不適切な文字が含まれていても、置き換えの提案を表示するので修正が簡単。

- **プライバシー**  
  ブラウザ上の処理のみでファイル名を判定するため、サーバー側でアップロードファイル名を保持しません。

---

## 4. 注意点

- **拡張子やファイルの中身のチェックは行いません**  
  このツールはファイル名（文字列）のみを対象にしています。  
- **提案される置き換え例は一例です**  
  実際にアップロード先で許容されるファイル名規則とは異なる場合があります。あくまでも目安として利用ください。

---

## 5. サポート・問い合わせ

- **バグ報告や機能要望**  
  このツールの改善案やバグを見つけた場合は、GitHubのリポジトリ（[Issues](../../issues) など）でご連絡ください。  
- **ライセンス**  
  特に明記がない限り、[MIT License](https://opensource.org/licenses/MIT) で公開されています。  
- **コードの確認**  
  GitHub リポジトリでソースコードを自由に閲覧し、ご自身の用途に合わせて改変・再利用することが可能です。

---

以上でファイル名チェッカーの紹介は終わりです。ぜひ、ファイル名の管理を効率化するのにお役立てください！
