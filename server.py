# socketとosモジュールをインポートします
import socket
import os
import json


# クライアント側に提供するメソッドをまとめたクラス
class Calculation:
    # floor(double x): 10 進数 x を最も近い整数に切り捨て、その結果を整数で返す。
    def floor(self, x):
        return int(x // 1)

    # nroot(int n, int x): 方程式 rn = x における、r の値を計算する。
    def nroot(self, n, x):
        return x ** (1 / n)

    # reverse(string s): 文字列 s を入力として受け取り、入力文字列の逆である新しい文字列を返す。
    def reverse(self, s):
        return s[::-1]

    # validAnagram(string str1, string str2): 2 つの文字列を入力として受け取り，2 つの入力文字列が互いにアナグラムであるかどうかを示すブール値を返す。
    def validAnagram(self, str1, str2):
        return sorted(str1) == sorted(str2)

    # sort(string[] strArr): 文字列の配列を入力として受け取り、その配列をソートして、ソート後の文字列の配列を返す。
    def sort(self, strArr):
        return sorted(strArr)


# レスポンスの基本型
response = {"results": "", "result_type": "", "id": ""}

# メソッド名と実際のメソッドの対応
hashmap = {
    "floor": Calculation.floor,
    "nroot": Calculation.nroot,
    "reverse": Calculation.reverse,
    "validAnagram": Calculation.validAnagram,
    "sort": Calculation.sort,
}


def main():
    # # UNIXソケットをストリームモードで作成します
    sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)

    # # このサーバが接続を待つUNIXソケットのパスを設定します
    server_address = "./socket_file"

    # # 以前の接続が残っていた場合に備えて、サーバアドレスをアンリンク（削除）します
    try:
        os.unlink(server_address)
    # サーバアドレスが存在しない場合、例外を無視します
    except FileNotFoundError:
        pass

    print("Starting up on {}".format(server_address))

    # # サーバアドレスにソケットをバインド（接続）します
    sock.bind(server_address)

    # # ソケットが接続要求を待機するようにします
    sock.listen(1)

    # # 無限ループでクライアントからの接続を待ち続けます
    while True:
        # クライアントからの接続を受け入れます
        connection, client_address = sock.accept()
        try:
            print("connection from", client_address)

            # ループが始まります。これは、サーバが新しいデータを待ち続けるためのものです。
            while True:
                # ここでサーバは接続からデータを読み込みます。
                data = connection.recv(1024)

                if data:
                    # 受け取ったデータはバイナリ形式なので、それを文字列に変換します。
                    # 'utf-8'は文字列のエンコーディング方式です。
                    data_str = data.decode("utf-8")

                    print("Received data: {}".format(data_str))

                    receivedData = json.loads(data)

                    print(receivedData)
                    # もしデータがあれば（つまりクライアントから何かメッセージが送られてきたら）以下の処理をします。
                    method = receivedData["method"]
                    params = receivedData["params"]
                    id = receivedData["id"]

                    # 指定されたメソッドを使用してレスポンスを作成してクライアントに返却

                # クライアントからデータが送られてこなければ、ループを終了します。
                else:
                    print("no data from", client_address)
                    break

        # 最終的に接続を閉じます
        finally:
            print("Closing current connection")
            connection.close()


main()
