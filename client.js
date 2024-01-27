const net = require("net");

// TCP/IPソケットを作成します。
// ここでソケットとは、通信を可能にするためのエンドポイントです。
const client = new net.Socket();

// サーバが待ち受けている特定の場所にソケットを接続します。
const server_address = "/socket_file"; // サンプルとしてローカルホストを使用

const requestData = {
  method: "",
  params: [],
  param_types: [],
  id: 0,
};

// コマンドラインからユーザーの入力を受け取る
const readline = require("readline");

function main() {
  // まず、ユーザーに呼び出したいメソッド、渡すパラメータと型を聞く
  //   メソッド名
  const rl1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl1.question("What method?", (method) => {
    console.log(method);
    requestData.method = method;
    rl1.close(); // readline インターフェースを閉じる
  });

  //   パラメータ
  const rl2 = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl2.question("Input parameters", (params) => {
    console.log(params);
    requestData.params = params.split(" ");
    rl2.close(); // readline インターフェースを閉じる
  });

  requestData.id += 1;

  // サーバに接続を試みます。
  client.connect(server_address, () => {
    console.log("Connected to server");

    // サーバにメッセージを送信します。
    const message = "Sending a message to the server side";
    client.write(message);
  });

  // ソケットからのデータを受信した際のイベントハンドラ
  client.on("data", (data) => {
    console.log("Server response: " + data);
    // 応答を受け取った後、クライアントを閉じます。
    client.destroy();
  });

  // ソケットが閉じられた際のイベントハンドラ
  client.on("close", () => {
    console.log("Connection closed");
  });

  // エラー発生時のイベントハンドラ
  client.on("error", (err) => {
    console.error("An error occurred: " + err.message);
    // プロセスを終了します。
    process.exit(1);
  });
}

main();
