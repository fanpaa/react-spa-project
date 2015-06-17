define(['noUiSlider', 'react'], function ($, React) {
    var RangeSlider2 = React.createClass({displayName: "RangeSlider2",
        indexId: function () {
            return 'rangeSlider2_' + this.props.chartIndex;
        },
        componentWillReceiveProps:function(nextProps){
            console.info('update slider')
            console.log(nextProps)

            var indexId = this.indexId();
            $("#" + indexId)[0].destroy();
            $("#" + indexId).noUiSlider({
                start: [nextProps.start||0, nextProps.end||0],
                step: 1,
                range: {
                    'min': [nextProps.min||0],
                    'max': [nextProps.max||0]
                },
                format: wNumb({
                    decimals: 0
                })
            });
            $("#" + indexId).noUiSlider_pips({
                mode: 'values',
                values: [nextProps.min||0, nextProps.max||0],
                density: 3
            });

            $("#" + indexId).Link('lower').to('-inline-<div class="tooltipForSlider"></div>', function ( value ) {
                $(this).html(
                    '<span>' + value + '</span>'
                );
            });
            $("#" + indexId).Link('upper').to('-inline-<div class="tooltipForSlider"></div>', function ( value ) {
                $(this).html(
                    '<span>' + value + '</span>'
                );
            });

        },
        componentDidMount: function () {
            var indexId = this.indexId();
            $("#" + indexId).noUiSlider({
                start: [this.props.start||0, this.props.end||0],
                step: 1,
                range: {
                    'min': [this.props.min||0],
                    'max': [this.props.max||0]
                },
                format: wNumb({
                    decimals: 0
                })
            });
            $("#" + indexId).noUiSlider_pips({
                mode: 'values',
                values: [this.props.min||0, this.props.max||0],
                density: 3
            });

            $("#" + indexId).Link('lower').to('-inline-<div class="tooltipForSlider"></div>', function ( value ) {
                $(this).html(

                    '<span>' + value + '</span>'
                );
            });
            $("#" + indexId).Link('upper').to('-inline-<div class="tooltipForSlider"></div>', function ( value ) {
                $(this).html(

                    '<span>' + value + '</span>'
                );
            });
        },
        render: function () {
            var indexId = this.indexId();
            return (
                React.createElement("div", null, 
                    React.createElement("div", {id: indexId})
                )
            )
        }
    });
    return RangeSlider2;
})