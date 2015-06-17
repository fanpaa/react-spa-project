define(['react'], function (React) {
    var Loading = React.createClass({
        render: function () {
            var mH={
                marginTop:(function(){
                    return (window.innerHeight/2-80-30)+'px';
                })()
            }
            return (
                <div className="clock-container" style={mH}>
                    <div className="spinner">
                        <div className="rect1"></div>
                        <div className="rect2"></div>
                        <div className="rect3"></div>
                        <div className="rect4"></div>
                        <div className="rect5"></div>
                    </div>
                </div>
            );
        }
    });

    return Loading;
})