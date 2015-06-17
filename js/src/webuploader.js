define(['js/build/configuration', 'jquery', 'webuploader', 'react', 'reactRouter'], function (Configuration, $, WebUploader, React, ReactRouter) {
    var Uploader = React.createClass({
        mixins: [ReactRouter.Navigation, ReactRouter.State],
        componentDidMount: function () {
            var _this = this;
            var uploader = new WebUploader.Uploader({
                swf: '/bower_components/webuploader-0.1.5/Uploader.swf',
                dnd: '#uploader',
                server: Configuration.REST + '/file-upload',
                pick: '#picker',
                resize: false,
                accept: {
                    title: 'Excel',
                    extensions: 'xls,xlsx',
                    mimeTypes: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                },
                auto: true,
                fileVal: 'File'
            });

            // 文件上传成功，给item添加成功class, 用样式标记上传成功。
            uploader.on('uploadSuccess', function (file) {
                console.log("上传成功");
                Configuration.GlobalFileName = file.name;
                Configuration.CaseName = '/' + 'new';
                localStorage.setItem('case_name',Configuration.CaseName);
                _this.transitionTo('analytics');

            });

            // 文件上传失败，显示上传出错。
            uploader.on('uploadError', function (file) {
                console.error("上传失败");
                Configuration.GlobalFileName = file.name;
                Configuration.CaseName = '/' + 'new';
                localStorage.setItem('case_name',Configuration.CaseName);
                _this.transitionTo('analytics');
            });

        },
        render: function () {
            return (
                <div id="uploader" className="wu-example">
                    <div className="uploader-title">将数据文件拖到此处</div>
                    <div className="uploader-title-else">或者，您可以</div>
                    <div className="btns uploader-btns-container">
                        <div id="picker">上传数据文件</div>
                        {/* <button id="ctlBtn" className="btn btn-default">开始上传</button> */}
                    </div>
                    <div className="uploader-title-else2">支持xls, xlsx文件</div>
                    {/*<div id="thelist" className="uploader-list"></div>*/}
                </div>
            )
        }
    });

    return Uploader;
})