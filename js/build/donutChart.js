define(['c3', 'react'], function (c3, React) {
    var DonutChart = React.createClass({displayName: "DonutChart",
        indexId: function () {
            return 'donutChart' + this.props.chartIndex;
        },
        componentWillReceiveProps: function (nextProps) {
            console.info('update donut')
            console.log(nextProps)
            this.chart = c3.generate({
                bindto: '#' + this.indexId(),
                data: {
                    columns: [
                        ['准入', nextProps.data1],
                        ['未准入', nextProps.data2]
                    ],
                    type: 'donut'
                },
                legend: {
                    position: 'right'
                },
                size: {
                    height: nextProps.height,
                    width: nextProps.width
                },
                color: {
                    pattern: ['#69cbf4', '#f5846a']
                },
                donut: {
                    title: "共" + nextProps.total,
                    label: {
                        show: false
                    }
                }
            });
        },
        componentDidMount: function () {
            console.info('init donut')
            console.log(this.props)
            this.chart = c3.generate({
                bindto: '#' + this.indexId(),
                data: {
                    columns: [
                        ['准入', this.props.data1],
                        ['未准入', this.props.data2]
                    ],
                    type: 'donut'
                },
                legend: {
                    position: 'right'
                },
                size: {
                    height: this.props.height,
                    width: this.props.width
                },
                color: {
                    pattern: ['#69cbf4', '#f5846a']
                },
                donut: {
                    title: "共" + this.props.total,
                    label: {
                        show: false
                    }
                }
            });
        },
        render: function () {
            var divStyle = {};
            if (this.props.divStyle) {
                divStyle = this.props.divStyle;
            }
            return (
                React.createElement("div", null, 
                    React.createElement("div", {id: this.indexId()}), 
                    React.createElement("div", {className: "donut-title", style: divStyle}, this.props.title)
                )
            )
        }
    });

    return DonutChart;
})