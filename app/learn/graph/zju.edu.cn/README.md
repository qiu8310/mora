

> 来自官网课件 [http://give.zju.edu.cn/cgcourse/new/frame/index.html](http://give.zju.edu.cn/cgcourse/new/frame/index.html)

**由于官网在我mac上用起来不爽，所以我就用我的方法生成了一个它的目录树，仅此而已**


### 生成方法

1. 首先访问官网
2. 在开发者工具上执行[JS脚本](./get-json.js)，能生成一个 data.json 文件，并把生成的文件拷贝到当前脚本目录
3. 最后用[PHP脚本](./make-html.php)，在命令行里执行 `php -f make-html.php`，便能在你当前目录下生成一个 menu.html 的文件
4. 做了点后期处理

**脚本可以手动修改，以生成你需要的html**

