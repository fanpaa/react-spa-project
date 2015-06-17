define(['react'], function (React) {
    var Loading = React.createClass({displayName: "Loading",
        render: function () {
            var mH={
                marginTop:(function(){
                    return (window.innerHeight/2-80-30)+'px';
                })()
            }
            return (
                React.createElement("div", {className: "clock-container", style: mH}, 
                    React.createElement("div", {className: "spinner"}, 
                        React.createElement("div", {className: "rect1"}), 
                        React.createElement("div", {className: "rect2"}), 
                        React.createElement("div", {className: "rect3"}), 
                        React.createElement("div", {className: "rect4"}), 
                        React.createElement("div", {className: "rect5"})
                    )
                )
            );
        }
    });

    return Loading;
})