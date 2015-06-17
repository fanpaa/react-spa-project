define(['react'], function (React) {
    var ProcessBar = React.createClass({
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
                <div className="process-bar">
                    <span className={class0}></span>
                    <span className="line-img"></span>
                    <span className={class1}></span>
                    <span className="line-img"></span>
                    <span className={class2}></span>
                </div>
            );
        }
    });

    return ProcessBar;
})