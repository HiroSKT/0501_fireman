//Webコンテンツを開発するためのNode.js簡易Webサーバ

//WebサーバがListenするIPアドレス（ローカルホストのIP）
var var_LISTEN_IP = '127.0.0.1';

//WebサーバがListenするポート（適当に決定？）
var var_LISTEN_PORT = 8086;

//ファイル名が指定されていない場合に返す「既定のフィアル名」
var var_DEFAULT_FILE = "index.html";

var http = require('http'),
    fs = require('fs');
const { Server } = require('node:http');

//拡張子を抽出
function func_getExtension(var_fileName) {
    var var_fileNameLength = var_fileName.length;
    var var_dotPoint = var_fileName.indexOf('.', var_fileNameLength -5);
    var var_extn = var_fileName.substring(var_dotPoint + 1, var_fileNameLength);
    return var_extn;
}
//抽出した拡張子を参照して，Content-Typeを指定する？？ファイルの拡張子を調べて何かしているのはわかるが，詳細は不明。
function func_getContentType(var_fileName) {
    //ファイル名を取得して，小文字に変換して保持する
    var var_extension = func_getExtension(var_fileName).toLowerCase();
    var var_contentType = {
        'html': 'text/html',
        'htm' : 'text/htm',
        'css' : 'text/css',
        'js'  : 'text/javaScript; charset=utf-8',
        'json': 'application/json; charset=utf-8',
        'xml' : 'application/xml; charset=utf-8',
        'jpeg': 'image/jpeg',
        'jpg' : 'image/jpg',
        'gif' : 'image/gif',
        'png' : 'image/png',
        'mp3' : 'audio/mp3',
    };
    var var_contentType_value = var_contentType[var_extension];
    if (var_contentType_value === undefined) {
        var_contentType_value = 'text/plain';        
    };
    return var_contentType_value;
}

//Webサーバのロジック？？
//フレームワークを使用せず，Nodejs単体で静的なファイルサーバ（FS）を構築する
var var_server = http.createServer();
var_server.on('request',
    function (var_request, var_response) {
        console.log('requested Url:' + var_request.url);
        var var_requestedFile = var_request.url;
        var_requestedFile = (var_requestedFile.substring(var_requestedFile.length -1, 1) === '/') 
? var_requestedFile + var_DEFAULT_FILE : var_requestedFile;
        console.log('Handle Url:' + var_requestedFile);
        console.log('File Extention:' + func_getExtention( var_requestedFile));
        console.log('Content-Type:' + func_getContentType( var_requestedFile));
        fs.readFile('.' + var_requestedFile,'binary', function (err, data) {
            if (err) {
                var_response.writeHead(404, {'Content-Type': 'text/plain'});
                var_response.write('not found\n');
                var_response.end();
            }else{
                var_response.writeHead(200, {'Content-Type': func_getContentType(var_requestedFile)});
                var_response.write(data, "binary");
                var_response.end();
            }
        });
    }
);

var_server.listen(var_LISTEN_PORT, var_LISTEN_IP);
console.log('Server running at htt@://' + var_LISTEN_IP + ':' + var_LISTEN_PORT);



