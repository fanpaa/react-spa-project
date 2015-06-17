define(['react'], function (React) {
    var ProcessBar = React.createClass({displayName: "ProcessBar",
        render: function () {

            var class0, class1, class2;
            if (this.props.step == "step0") {
                class0 = "green1 fix-center";
                class1 = "grey2 fix-center";
                class2 = "grey3 fix-center";
            } else if (this.props.step == "step1") {
                class0 = "ok0 fix-center";
                class1 = "green2 fix-center";
                class2 = "grey3 fix-center";
            } else if (this.props.step == "step2") {
                class0 = "ok0 fix-center";
                class1 = "ok1 fix-center";
                class2 = "green3 fix-center";
            }

            return (
                React.createElement("div", {className: "process-bar"}, 
                    React.createElement("span", {className: class0}), 
                    React.createElement("span", {className: "line-img"}), 
                    React.createElement("span", {className: class1}), 
                    React.createElement("span", {className: "line-img"}), 
                    React.createElement("span", {className: class2})
                )
            );
        }
    });

    return ProcessBar;
})