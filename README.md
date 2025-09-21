# Music Training App - Mobile Version

iOS/Android対応の耳コピ練習アプリです。Apache Cordovaを使用して開発されており、クロスプラットフォーム対応しています。

## 特徴

- **📱 モバイル対応**: iOS/Android両プラットフォーム対応
- **🎵 音楽ファイル対応**: 端末内の音楽ファイルにアクセス可能
- **⚡ 速度調整**: 0.25x〜2.0xまで細かく調整可能
- **🔊 音量調整**: 0〜100%まで調整可能
- **📋 プレイリスト**: 複数の音源ファイルを管理
- **🎯 耳コピ特化**: 楽器練習に最適化されたUI/UX

## 技術スタック

- **Apache Cordova**: クロスプラットフォーム開発
- **HTML5/CSS3/JavaScript**: フロントエンド
- **Cordova Plugins**: ファイルアクセス、ファイル選択

## 使用プラグイン

```bash
cordova-plugin-file          # ファイルシステムアクセス
cordova-plugin-file-chooser  # ファイル選択
cordova-plugin-filepath      # ファイルパス解決
```

## 開発環境セットアップ

### 前提条件
- Node.js (v14以上)
- Cordova CLI
- Android Studio (Android開発)
- Xcode (iOS開発)

### インストール

```bash
# Cordova CLIをグローバルインストール
npm install -g cordova

# プロジェクトの依存関係をインストール
npm install

# プラットフォームを追加
cordova platform add android
cordova platform add ios

# プラグインをインストール
cordova plugin add cordova-plugin-file
cordova plugin add cordova-plugin-file-chooser
cordova plugin add cordova-plugin-filepath
```

## ビルドと実行

### 開発サーバー
```bash
cordova serve
# http://localhost:8000 でテスト可能
```

### Android
```bash
# デバッグビルド
cordova build android

# 実機で実行
cordova run android

# リリースビルド
cordova build android --release
```

### iOS
```bash
# デバッグビルド
cordova build ios

# 実機で実行
cordova run ios

# リリースビルド
cordova build ios --release
```

## アプリストア申請

### Android (Google Play Store)
1. 署名付きAPKを生成
2. Google Play Consoleにアップロード
3. アプリ情報、スクリーンショットを設定
4. 審査申請

### iOS (App Store)
1. App Store Connectでアプリ登録
2. Xcodeでアーカイブ作成
3. App Store Connectにアップロード
4. 審査申請

## 主な機能

### 音源再生
- **ファイル選択**: 端末の音楽ライブラリからファイルを選択
- **再生制御**: 再生/停止、前/次の曲、リピート
- **速度調整**: リアルタイムで再生速度を変更
- **音量調整**: 細かい音量制御

### 耳コピ支援
- **スロー再生**: 0.25x〜0.75xでの詳細分析
- **部分リピート**: 気になる箇所を繰り返し再生
- **プレイリスト**: 練習曲を整理して管理

## ディレクトリ構造

```
MusicListeningApp-Mobile/
├── config.xml              # Cordova設定ファイル
├── package.json            # npm依存関係
├── platforms/              # プラットフォーム固有ファイル
│   ├── android/
│   └── ios/
├── plugins/                # Cordovaプラグイン
├── www/                    # Webアプリソース
│   ├── index.html         # メインHTML
│   ├── script.js          # JavaScript機能
│   ├── style.css          # スタイル
│   ├── css/               # 追加CSS
│   ├── js/                # 追加JS
│   └── img/               # 画像リソース
└── README.md              # このファイル
```

## 収益化

### 広告収入
- AdMob統合でバナー/インタースティシャル広告
- 月間数千円〜数万円の収益可能性

### プレミアム機能
- 無制限プレイリスト
- 高度なエフェクト機能
- 月額課金モデル

## 今後の機能拡張

- [ ] 楽譜表示機能
- [ ] 録音・再生機能
- [ ] SNS連携
- [ ] クラウド同期
- [ ] 楽器チューナー統合
- [ ] メトロノーム機能

## トラブルシューティング

### Android SDK未設定
```bash
# Android Studioをインストール
# ANDROID_HOME環境変数を設定
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### iOS署名エラー
- Xcode > Preferences > Accounts でApple IDを設定
- Provisioning Profileを作成

## ライセンス

MIT License

## 作者

Developed with ❤️ for music enthusiasts

---

🎵 Let's make music practice more enjoyable! 🎵