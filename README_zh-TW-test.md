# 繁中測試版：Windows 安裝

此分支尚在測試，預設語言仍為英文。啟動後可在介面語言選單切換為「繁體中文（台灣）」。

1. 安裝 Git。Windows 需有 `winget` 才能自動安裝 Node.js；若沒有，請先從 [Node.js 官網](https://nodejs.org/)安裝 LTS 版本。
2. 開啟命令提示字元，執行：

   ```bat
   git clone -b zh-tw-ui-test https://github.com/DianNaoTou/character_select_stand_alone_app.git
   cd character_select_stand_alone_app
   install-and-run.bat
   ```

`install-and-run.bat` 會檢查 Node.js（20 以上）與 npm；缺少時透過 `winget` 安裝 Node.js LTS，接著執行 `npm install`、`npm start`。Windows 可能要求同意安裝或顯示管理員提示。若剛裝完 Node.js 卻找不到指令，請重新開啟命令提示字元，再執行 `install-and-run.bat`。

日後更新測試版：

```bat
git pull
install-and-run.bat
```

若要連 Forge Neo，請先在 Forge Neo 啟動參數加入 `--api`，再於 SAA 設定中選 WebUI 並填入對應的 IP 與連接埠。
