define(['react', 'js/build/processBar', 'js/build/webuploader', 'js/build/rangeSlider', 'js/build/barChart'],
    function (React, ProcessBar, WebUploader, RangeSlider, BarChart) {
        var Home = React.createClass({displayName: "Home",
            render: function () {
                return (
                    React.createElement("div", null, 
                        React.createElement(ProcessBar, {step: "step0"}), 

                        React.createElement("div", {className: "container"}, 
                            React.createElement("div", {className: "home"}, 
                                React.createElement(WebUploader, null)
                            )

                        )
                    )
                );
            }
        });

        return Home;
    })