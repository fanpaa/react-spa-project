define(['noUiSlider', 'react'], function ($, React) {
    var RangeSlider = React.createClass({displayName: "RangeSlider",
        indexId: function () {
            return 'rangeSlider' + this.props.chartIndex;
        },
        componentWillReceiveProps:function(nextProps){
            console.info('update slider')
            console.log(nextProps)
            //var indexId = this.indexId();
            //$("#" + indexId).noUiSlider("option", "values", [nextProps.min, nextProps.max]);

            var indexId = this.indexId();
            $("#" + indexId)[0].destroy();
            $("#" + indexId).noUiSlider({
                start: [parseInt(nextProps.now||0)],
                step: 1,
                range: {
                    'min': [nextProps.min||0],
                    'max': [nextProps.max||100]
                },
                format: wNumb({
                    decimals: 0
                })
            });
            $("#" + indexId).noUiSlider_pips({
                mode: 'values',
                values: [nextProps.min, nextProps.max],
                density: 3
            });
            $("#" + indexId).Link('lower').to($("#" + indexId + "Input"));

        },
        componentDidMount: function () {
            console.info('init slider')
            console.log(this.props)
            var indexId = this.indexId();
            $("#" + indexId).noUiSlider({
                start: [parseInt(this.props.now||0)],
                step: 1,
                range: {
                    'min': [this.props.min||0],
                    'max': [this.props.max||100]
                },
                format: wNumb({
                    decimals: 0
                })
            });
            $("#" + indexId).noUiSlider_pips({
                mode: 'values',
                values: [this.props.min, this.props.max],
                density: 3
            });
            $("#" + indexId).Link('lower').to($("#" + indexId + "Input"));

        },
        render: function () {
            var indexId = this.indexId();
            var inputId = indexId + "Input";
            var inputForm = indexId + "Form";
            var label=this.props.label?this.props.label:'天';
            var head=this.props.label?this.props.head:'';
            return (
                React.createElement("div", {className: "range-slider-module"}, 
                    React.createElement("div", {className: "range-slider-text-head"}, head), 
                    React.createElement("div", {className: "range-slider-text"}, label), 
                    React.createElement("form", {id: inputForm}, React.createElement("input", {type: "text", id: inputId, className: "form-control"})), 
                    React.createElement("div", {id: indexId})
                )
            )
        }
    });
    return RangeSlider;
})