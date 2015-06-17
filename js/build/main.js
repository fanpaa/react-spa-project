var Router = window.ReactRouter;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var Table = window.Reactable.Table;

var App = React.createClass({displayName: "App",
    render: function () {
        return (
            React.createElement("div", {className: "container"}, 
                React.createElement("header", null, 
                    React.createElement("ul", null, 
                        React.createElement("li", null, React.createElement(Link, {to: "/"}, "home")), 
                        React.createElement("li", null, React.createElement(Link, {to: "analytics"}, "analytics")), 
                        React.createElement("li", null, React.createElement(Link, {to: "modifyParameter"}, "modifyParameter")), 
                        React.createElement("li", null, React.createElement(Link, {to: "limitAndCollectionDays"}, "limitAndCollectionDays")), 
                        React.createElement("li", null, React.createElement(Link, {to: "analyticsResults"}, "analyticsResults"))
                    )
                ), 
                React.createElement(RouteHandler, null)
            )
        );
    }
});

var Home = React.createClass({displayName: "Home",
    render: function () {
        return (
            React.createElement("div", {className: "home"}, 
                "Home", 
                React.createElement(BarChart, null)
            )

        );
    }
});

var Analytics = React.createClass({displayName: "Analytics",
    render: function () {
        return (
            React.createElement("div", null, 
                "Analytics"
            )
        );
    }
});

var ModifyParameter = React.createClass({displayName: "ModifyParameter",
    render: function () {
        return (
            React.createElement("div", null, 
                "ModifyParameter"
            )
        );
    }
});

var LimitAndCollectionDays = React.createClass({displayName: "LimitAndCollectionDays",
    render: function () {
        return (
            React.createElement("div", null, 
                "LimitAndCollectionDays"
            )
        );
    }
});

var AnalyticsResults = React.createClass({displayName: "AnalyticsResults",
    render: function () {
        return (
            React.createElement("div", null, 
                "AnalyticsResults"
            )
        );
    }
});

var TestTable = React.createClass({displayName: "TestTable",

    render: function () {
        return (
            React.createElement(Table, {className: "table", data: [
    { Name: 'Griffin Smith', Age: '18' },
    { Age: '23',  Name: 'Lee Salminen' },
    { Age: '28', Position: 'Developer' },
    { Name: 'Griffin Smith', Age: '18' },
    { Age: '30',  Name: 'Test Person' },
    { Name: 'Another Test', Age: '26', Position: 'Developer' },
    { Name: 'Third Test', Age: '19', Position: 'Salesperson' },
    { Age: '23',  Name: 'End of this Page', Position: 'CEO' },
], itemsPerPage: 3})
        )
    }
});

var RangeSlider = React.createClass({displayName: "RangeSlider",
    componentDidMount: function () {
        $("#rangeSlider").noUiSlider({
            start: [20, 80],
            connect: true,
            range: {
                'min': 0,
                'max': 100
            }
        });
    },
    render: function () {
        return (
            React.createElement("div", {id: "rangeSlider"})
        )
    }
});

var BarChart = React.createClass({displayName: "BarChart",
    componentDidMount: function () {
        var chart = c3.generate({
            bindto: '#barChart',
            data: {
                x: 'x',
                columns: [
                    ['x',0,30,60,90,120,150,180,210,240,270,300,330,360,390,410],
                    ['data1',2,3,1,4,6,7,9,6,5,3,8,6,5,4,3],
                    ['data2',3,4,5,2,6,8,6,4,2,1,0,8,7,6,5]
                ],
                type: 'bar',
                selection: {
                    multiple: true
                }
            },
        //    subchart: {
        //    show: true
        //},
            legend: {
                show: true
            }

        });
    },
    render: function () {
        return (
            React.createElement("div", {id: "barChart"})
        )
    }
});

var Uploader = React.createClass({displayName: "Uploader",
    componentDidMount: function () {
        var uploader = new WebUploader.Uploader({

            // swf文件路径
            swf: '/bower_components/webuploader-0.1.5/Uploader.swf',

            // 文件接收服务端。
            server: 'localhost',

            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: '#picker',

            // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
            resize: false
        });

        // 当有文件被添加进队列的时候
        uploader.on('fileQueued', function (file) {
            $('.home').append('<div id="' + file.id + '" class="item">' +
            '<h4 class="info">' + file.name + '</h4>' +
            '<p class="state">等待上传...</p>' +
            '</div>');
        });

        $("#ctlBtn").on('click', function () {
            uploader.upload();
        });

        // 文件上传过程中创建进度条实时显示。
        uploader.on('uploadProgress', function (file, percentage) {
            var $li = $('#' + file.id),
                $percent = $li.find('.progress .progress-bar');

            // 避免重复创建
            if (!$percent.length) {
                $percent = $('<div class="progress progress-striped active">' +
                '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                '</div>' +
                '</div>').appendTo($li).find('.progress-bar');
            }

            $li.find('p.state').text('上传中');

            $percent.css('width', percentage * 100 + '%');
        });
        uploader.on('uploadSuccess', function (file) {
            $('#' + file.id).find('p.state').text('已上传');
        });

        uploader.on('uploadError', function (file) {
            $('#' + file.id).find('p.state').text('上传出错');
        });

        uploader.on('uploadComplete', function (file) {
            $('#' + file.id).find('.progress').fadeOut();
        });


    },
    render: function () {
        return (
            React.createElement("div", {id: "uploader", className: "wu-example"}, 
                React.createElement("div", {id: "thelist", className: "uploader-list"}), 
                React.createElement("div", {className: "btns"}, 
                    React.createElement("div", {id: "picker"}, "选择文件"), 
                    React.createElement("button", {id: "ctlBtn", className: "btn btn-default"}, "开始上传")
                )
            )
        )
    }
});


var routes = (
    React.createElement(Route, {path: "/", handler: App}, 
        React.createElement(DefaultRoute, {handler: Home}), 
        React.createElement(Route, {name: "analytics", handler: Analytics}), 
        React.createElement(Route, {name: "modifyParameter", handler: ModifyParameter}), 
        React.createElement(Route, {name: "limitAndCollectionDays", handler: LimitAndCollectionDays}), 
        React.createElement(Route, {name: "analyticsResults", handler: AnalyticsResults})

    )
);

Router.run(routes, function (Handler) {
    React.render(React.createElement(Handler, null), document.body);
});










