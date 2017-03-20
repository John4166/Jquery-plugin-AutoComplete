# Jquery-plugin-AutoComplete
Jquery的自动补全插件

在闲暇时间写得基于原型的jquery插件<br/>
调用方法为
````
$(selector).autoComplete({options})
````

其中`options`的参数有三个
````
* data      --自动补全的json数据，必选
* id        --input框下的父元素的id，默认为"Auto-complete-ul",非必选
* isAllow   --当输入值与数据对应补上时，失焦状态下清空输入框的值，默认flase关闭开关，非必选

````

