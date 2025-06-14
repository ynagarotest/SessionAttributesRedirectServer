# ベースとなるNode.jsの公式イメージを選択
FROM node:18-slim

# アプリケーションの作業ディレクトリを作成
WORKDIR /usr/src/app

# package.jsonとpackage-lock.jsonをコピー
# package-lock.jsonがあれば、より再現性の高いインストールが可能
COPY package*.json ./

# 依存パッケージをインストール
RUN npm install

# アプリケーションのソースコードをコピー
COPY . .

# アプリケーションがリッスンするポートを指定
EXPOSE 8080

# コンテナ起動時に実行するコマンド
CMD [ "npm", "start" ]