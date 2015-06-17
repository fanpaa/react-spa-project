define(['c3', 'react'], function (c3, React) {
    var BarChart = React.createClass({displayName: "BarChart",
        indexId: function () {
            return 'batChart' + this.props.chartIndex;
        },
        componentWillReceiveProps: function (nextProps) {
            console.info('update bar')
            console.log(nextProps)
            if (nextProps.isHistogram) {
                this.chart = c3.generate({
                    bindto: '#' + this.indexId(),
                    data: {
                        columns: nextProps.Y,
                        type: 'bar'
                    },
                    size: {
                        height: nextProps.height,
                        width: nextProps.width
                    },
                    bar: {
                        width: {
                            ratio: 0.90
                        }
                    },
                    axis: {
                        x: {
                            type: 'category',
                            categories: nextProps.X,
                            show: nextProps.show ? false : true,
                            tick: {
                                culling: true,
                                multiline: false
                            }
                        },
                        y: {
                            label: {
                                text: '经销商个数',
                                position: 'outer-middle'
                                // inner-top : default
                                // inner-middle
                                // inner-bottom
                                // outer-top
                                // outer-middle
                                // outer-bottom
                            }
                        }
                    },
                    legend: {
                        show: false
                    }
                });
            } else {
                this.chart = c3.generate({
                    bindto: '#' + this.indexId(),
                    data: {
                        x: 'x',
                        xFormat: '%Y.%m',
                        columns: Array(nextProps.X).concat(nextProps.Y),
                        type: 'bar'
                    },
                    size: {
                        height: nextProps.height,
                        width: nextProps.width
                    },
                    axis: {
                        x: {
                            type: 'timeseries',
                            tick: {
                                format: '%Y.%m'
                            }
                        }
                    }
                });
            }
        },
        componentDidMount: function () {
            console.info('init bar')
            console.log(this.props)
            if (this.props.isHistogram) {
                this.chart = c3.generate({
                    bindto: '#' + this.indexId(),
                    data: {
                        columns: this.props.Y,
                        type: 'bar'
                    },
                    size: {
                        height: this.props.height,
                        width: this.props.width
                    },
                    bar: {
                        width: {
                            ratio: 0.90
                        }
                    },
                    axis: {
                        x: {
                            type: 'category',
                            categories: this.props.X,
                            show: this.props.show ? false : true,
                            tick: {
                                culling: true,
                                multiline: false
                            }
                        },
                        y: {
                            label: {
                                text: '经销商个数',
                                position: 'outer-middle'
                                // inner-top : default
                                // inner-middle
                                // inner-bottom
                                // outer-top
                                // outer-middle
                                // outer-bottom
                            }
                        }
                    },
                    legend: {
                        show: false
                    }
                });
            } else {
                this.chart = c3.generate({
                    bindto: '#' + this.indexId(),
                    data: {
                        x: 'x',
                        xFormat: '%Y.%m',
                        columns: Array(this.props.X).concat(this.props.Y),
                        type: 'bar'
                    },
                    size: {
                        height: this.props.height,
                        width: this.props.width
                    },
                    axis: {
                        x: {
                            type: 'timeseries',
                            tick: {
                                format: '%Y.%m'
                            }
                        }
                    }
                });
            }
        },
        render: function () {
            return (
                React.createElement("div", null, 
                    React.createElement("div", {className: "chart-title"}, this.props.tips), 
                    React.createElement("div", {id: this.indexId()})
                )
            )
        }
    });

    return BarChart;
})