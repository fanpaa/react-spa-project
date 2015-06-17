requirejs.config({
    baseUrl: '/',
    shim: {
        "noUiSlider": {
            deps: ["jquery"],
            exports: '$'
        },
        "bootstrap": {
            deps: ['jquery']
        }
    },
    paths: {
        react: 'bower_components/react/react.min',
        reactRouter: 'bower_components/react-router/build/umd/ReactRouter.min',
        jquery: 'bower_components/jquery/dist/jquery.min',
        c3: 'bower_components/c3/c3.min',
        d3: 'bower_components/d3/d3.min',
        webuploader: 'bower_components/webuploader-0.1.5/webuploader.nolog.min',
        noUiSlider: 'bower_components/noUiSlider.7.0.10/jquery.nouislider.all.min',
        bootstrap: "bower_components/bootstrap/dist/js/bootstrap.min",
        reactTable:"bower_components/reactable/build/reactable",
        fixedDataTable:"bower_components/fixed-data-table/dist/fixed-data-table.min"
    }
});

require(['react', 'reactRouter', 'js/build/my',
        'js/build/home', 'js/build/analytics', 'js/build/modifyParameter',
        'js/build/limitAndCollectionDays', 'js/build/analyticsResults'],
    function (React, ReactRouter, My, Home, Analytics,
              ModifyParameter, LimitAndCollectionDays, AnalyticsResults) {
        var Router = ReactRouter;
        var DefaultRoute = Router.DefaultRoute;
        //var Link = Router.Link;
        var Route = Router.Route;
        var RouteHandler = Router.RouteHandler;

        var App = React.createClass({
            mixins: [ReactRouter.Navigation, ReactRouter.State],
            componentDidMount:function(){
                $(".header-link").click(function(){
                    this.transitionTo('/');
                }.bind(this))
            },
            render: function () {
                return (
                    <div>
                        <div className="header">|<span className="span0">分析工具</span>
                            <span className="span1">Beta</span>
                            <div className="header-link"></div>
                        </div>
                        <RouteHandler/>
                        <div className="footer">版权所有 ©2015 鼎程（上海）金融信息服务有限公司 沪ICP备14012246</div>
                    </div>
                );
            }
        });

        var routes = (
            <Route path="/" handler={App}>
                <DefaultRoute handler={My}/>
                <Route name="my" handler={My}/>
                <Route name="home" handler={Home}/>
                <Route name="analytics" handler={Analytics}/>
                <Route name="modifyParameter" handler={ModifyParameter}/>
                <Route name="limitAndCollectionDays" handler={LimitAndCollectionDays}/>
                <Route name="analyticsResults" handler={AnalyticsResults}/>
            </Route>
        );

        Router.run(routes, function (Handler) {
            React.render(<Handler/>, document.body);
        });
    });