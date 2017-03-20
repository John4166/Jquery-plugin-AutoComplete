/**
 * Created by Administrator on 2017/1/14.
 */
/**
 * jquery自动补全插件
 * 用法：1.引入jquery
 * 2.$(selector).autoComplete({ data:array,id:""ulid,isAllow:false})
 *  data--自动补全数据，类型为对象，并且，现在只能确定为data=[{id:"id",name:"name"},{id:"id2",name:"name2"}]；
 *  id--自动补全的ul列表的id，用于与其他自动补全ul区别开
 *  isAllow--设置input取值输入开关，打开时可实现当找不到与数据对应的值时，失去焦点就清空输入框的值，默认flase关闭开关。
 *  selector：jquery的元素选择器，可以使.class、#id、div...等
 */
(function($){
    function AutoComplete(selector,data,isAllow,id){
        this.eleInput=$(selector);
        this.data=data;
        this.id=id;
        this.selectedEleId='';
        this.allowInput=isAllow;
        this.draw=function(){
            var that=this;
            //获取数组数据
            var dataArr=that.data;
            //被选中li元素id

            //设置标志位，当input框输入值找不到对应的data数据时，flag=true
            var flag=false;


            //新增ul父元素，并添加为input的兄弟节点
            var eleUL=$('<ul class="auto-datalist" id="'+that.id+'"></ul>');
            eleUL.width(this.eleInput.outerWidth());

            //获得需要输出数据数组
            function getDisplayData(array,str){
                var displayData=[],j=0;
                for(var i=0;i<array.length;i++){
                    if(array[i].name.indexOf(str)>=0){
                        displayData[j]=array[i];
                        j++;
                    }
                }
                return displayData;
            }

            //循环遍历，显示元素
            function ShowArray(array){
                eleUL.empty();
                if(typeof array=='object'&& array.constructor==Array){
                    $.each(array, function (index, value) {
                        var eleDataList=document.createElement('li');
                        eleDataList.className='auto-list';
                        eleDataList.innerText=value.name;
                        eleDataList.setAttribute("data-value",value.id);
                        eleDataList.addEventListener('mousedown',function(event){
                            var e= event || window.event;
                            that.eleInput.val(e.target.innerHTML);
                            that.selectedEleId=e.target.getAttribute("data-value");
                            //console.log(that.selectedEleId)
                        });
                        eleUL.append(eleDataList).show();
                    })
                }
            }

            //绑定事件并显示元素
            that.eleInput.on('input',function () {
                flag=false;
                var val= $.trim(that.eleInput.val()), displayData;
                if(val!=''){
                    displayData=getDisplayData(dataArr,val);
                    if(displayData.length==0){
                        flag=true;
                    }
                }else{
                    displayData=dataArr;
                }
                ShowArray(displayData);

                //添加父元素时间
            }).wrap("<div style='display:inline-block;position:relative;'></div>")

                .focus(function () {
                    //获得焦点时添加ul元素，并显示提示
                    $(this).after(eleUL);
                    ShowArray(dataArr);

                }).blur(function(){
                    //失去焦点的时候，判断是否打开开关，并隐藏
                    if(that.allowInput && flag){
                        $(this).val("");
                    }
                    eleUL.hide();

                }).keydown(function (e) {
                    //获取ul元素
                    var elemUL=$('#'+that.id);
                    //ul的窗口高度
                    var viewHeight=elemUL.outerHeight();
                    //ul下li元素高度
                    var eleLiHeight=elemUL.find("li:gt(0)").outerHeight();

                    //键盘事件
                    var $elem=elemUL.find('li.auto-list-active');
                    if(e.keyCode==40){  //向下方向键
                        if($elem.length!=0){
                            var $next = $elem.next();
                            $elem.removeClass("auto-list-active");
                            $next.addClass("auto-list-active");
                            var nextIndex=$("#"+that.id+' li').index($next);
                            var nextTotalHeight=parseInt(nextIndex+1)*parseInt(eleLiHeight);
                            if(nextTotalHeight>=viewHeight){
                               elemUL.scrollTop(nextTotalHeight-eleLiHeight);
                            }
                        } else {
                            elemUL.find("li:first-child").addClass("auto-list-active");

                        }
                    }if(e.keyCode==38){ //向上方向键
                        if($elem.length!=0){
                            var $prev = $elem.prev();
                            $elem.removeClass("auto-list-active");
                            $prev.addClass("auto-list-active");
                            var prevIndex=$("#"+that.id+' li').index($prev);
                            var prevTotalHeight=parseInt(prevIndex+1)*parseInt(eleLiHeight);
                            elemUL.scrollTop(prevTotalHeight-eleLiHeight);
                        } else {
                            return false;
                        }
                    }if(e.keyCode==13){ //Enter键
                        if($elem.length!=0){
                            $(this).val($elem.text());
                            that.selectedEleId=$elem.attr("data-value");
                            //console.log(that.selectedEleId)
                            eleUL.hide();
                        }

                    }

                });
        }

    }
    $.fn.autoComplete= function (obj) {
        var selector=$(this);
        //设置input取值输入开关，找不到与数据对应的值时，清空输入框的值，默认flase关闭开关。
        var isAllow=obj.isAllow || false;
        var ulId=obj.id||"Auto-complete-ul";
        var autoInstance=new AutoComplete(selector,obj.data,isAllow,ulId);
        autoInstance.draw();
        return autoInstance;
    };

})(jQuery);