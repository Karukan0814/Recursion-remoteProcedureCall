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

const methodList = ["floor", "nroot", "reverse", "validAnagram", "sort"];

// コマンドラインからユーザーの入力を受け取る
const readline = require("readline");
function question(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// 数値か確認する関数
function isNumericString(str) {
  console.log("str", str);
  const num = Number(str);
  return !isNaN(num) && str === num.toString();
}

// パラメータの入力チェック関数
function validateParams(method, params) {
  console.log("method", method);

  console.log("params", params);
  if (!Array.isArray(params)) {
    return false;
  }
  if (method == "floor") {
    console.log(isNumericString(params[0]));
    return params.length == 1 && isNumericString(params[0]);
  } else if (method == "nroot") {
    return (
      params.length === 2 && params.every((param) => isNumericString(param))
    );
  } else if (method == "reverse" || method == "sort") {
    return params.length === 1;
  } else if (method == "validAnagram") {
    return params.length === 2;
  }
}

async function main() {
  // まず、ユーザーに呼び出したいメソッド、渡すパラメータを聞く

  while (true) {
    const id = await question("Input ID: ");

    // 数値に変換し、数値であるかどうかをチェック
    requestData.id = Number(id);
    if (!isNaN(requestData.id)) {
      // 有効な数値が入力された場合はループを抜ける
      break;
    } else {
      console.log("Please input id as number");
    }
  }
  while (true) {
    const method = await question("What method is required?");

    requestData.method = method;
    if (methodList.includes(method)) {
      // 有効なメソッドが入力された場合はループをに抜ける
      break;
    } else {
      console.log("Please input a method existing");
    }
  }

  while (true) {
    const paramsStr = await question("Input params");

    const params = paramsStr.split(" ");

    if (validateParams(requestData.method, params)) {
      // 有効なメソッドが入力された場合はループをに抜ける
      requestData.params = params;
      break;
    } else {
      console.log("Please input valid params.");
    }
  }

  // サーバに接続を試みます。
  client.connect(server_address, () => {
    console.log("Connected to server");
    console.log({ requestData });
    // サーバにリクエストデータを送信します。
    client.write(JSON.stringify(requestData));
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
