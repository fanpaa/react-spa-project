define(['react', 'js/build/processBar', 'js/build/webuploader', 'js/build/rangeSlider', 'js/build/barChart'],
    function (React, ProcessBar, WebUploader, RangeSlider, BarChart) {
        var Home = React.createClass({
            render: function () {
                return (
                    <div>
                        <ProcessBar step="step0"/>

                        <div className="container">
                            <div className="home">
                                <WebUploader/>
                            </div>

                        </div>
                    </div>
                );
            }
        });

        return Home;
    })