FROM node:22

WORKDIR /app
# docker-compose.ymlのcommandで `npm install` と `npm run dev` を実行するため、
# このDockerfileでは作業ディレクトリの指定のみ行います。
# ソースコードのコピーと依存関係のインストールは、
# docker-composeのvolumesとcommandで行われます。
