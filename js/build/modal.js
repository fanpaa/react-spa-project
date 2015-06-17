define(['js/build/configuration', 'react', 'jquery', 'bootstrap', 'js/build/barChart', 'js/build/rangeSlider', 'js/build/loading'],
    function (Configuration, React, $, bootstrap, BarChart, RangeSlider, Loading) {
        var Modal = React.createClass({displayName: "Modal",
            getInitialState: function () {
                return {
                    data: null,
                    loading: true,
                    range1: [0, 360],
                    range2: [0, 9999]
                };
            },
            showLoading: function () {
                this.setState({loading: true})
            },
            hideLoading: function () {
                this.setState({loading: false})
            },
            getDealer_credit_summary: function (name, callback) {
                $.ajax({
                    url: Configuration.REST + Configuration.API + Configuration.CaseName + '/dealer_credit_summary?dealer_name=' + name,
                    method: 'GET',
                    contentType: 'text/plain',
                    dataType: "json"
                }).done(function (data) {
                    this.setState({data: data});
                    if (callback) {
                        callback();
                    }
                }.bind(this));
            },
            postDealer_credit_change: function (obj, callback) {
                $.ajax({
                    url: Configuration.REST + Configuration.API + Configuration.CaseName + '/dealer_credit_change',
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(obj),
                    dataType: 'json'
                }).done(function (res) {
                    if (callback) {
                        callback();
                    }
                }.bind(this));
            },
            componentDidMount: function () {
                var _this = this;
                $('#myModal').on('show.bs.modal', function (event) {
                    var button = $(event.relatedTarget);
                    var recipient = button.data('whatever');
                    var modal = $(this);
                    modal.find('.modal-title').text('授信微调  ' + Configuration.GlobalCompanyName)
                    _this.getDealer_credit_summary(Configuration.GlobalCompanyName, function () {


                        _this.hideLoading();
                        $("#myModal").on('click', '.post-dealer-data', function () {
                            _this.postDealer_credit_change({
                                name: Configuration.GlobalCompanyName,
                                credit_account: parseInt($("#rangeSlider11").val()),
                                credit_line: parseInt($("#rangeSlider12").val()) * 10000
                            }, function () {

                                React.findDOMNode(_this.refs.account).innerText = '--';
                                React.findDOMNode(_this.refs.line).innerText = '--';
                                React.findDOMNode(_this.refs.cal).innerText = '--';


                                $('#myModal').modal('hide');
                            })
                        });

                        $("#rangeSlider11,#rangeSlider12").on({
                            change: function () {
                                var r1, r2;
                                r1 = parseInt($("#rangeSlider11").val());
                                r2 = parseInt($("#rangeSlider12").val());

                                React.findDOMNode(_this.refs.account).innerText = r1;
                                React.findDOMNode(_this.refs.line).innerText = r2;
                                React.findDOMNode(_this.refs.cal).innerText = Math.round((r2 / r1) * 360);

                            }
                        });

                        $("#rangeSlider11Form,#rangeSlider12Form").submit(function (e) {
                            e.preventDefault();
                            var r1, r2;
                            r1 = parseInt($("#rangeSlider11").val());
                            r2 = parseInt($("#rangeSlider12").val());

                            React.findDOMNode(_this.refs.account).innerText = r1;
                            React.findDOMNode(_this.refs.line).innerText = r2;
                            React.findDOMNode(_this.refs.cal).innerText = Math.round((r2 / r1) * 360);


                        });

                    })
                })


            },
            render: function () {
                if (this.state.loading) {
                    return (
                        React.createElement("div", {className: "modal fade", id: "myModal", tabindex: "-1", role: "dialog", 
                             "aria-labelledby": "myModalLabel", 
                             "aria-hidden": "true"}, 
                            React.createElement("div", {className: "modal-dialog modal-lg"}, 
                                React.createElement("div", {className: "modal-content"}, 
                                    React.createElement("div", {className: "modal-header"}, 
                                        React.createElement("button", {type: "button", className: "close", "data-dismiss": "modal", 
                                                "aria-label": "Close"}, React.createElement("span", {
                                            "aria-hidden": "true"}, "×")), 
                                        React.createElement("h4", {className: "modal-title", id: "myModalLabel"}, "Modal title")
                                    ), 
                                    React.createElement("div", {className: "modal-body "}, 
                                        React.createElement(Loading, null)
                                    ), 
                                    React.createElement("div", {className: "modal-footer"}, 
                                        React.createElement("button", {type: "button", className: "btn btn-primary post-dealer-data"}, "应用"
                                        ), 
                                        React.createElement("button", {type: "button", className: "btn btn-default", "data-dismiss": "modal"}, "关闭"
                                        )
                                    )
                                )
                            )
                        )

                    );
                }
                return (
                    React.createElement("div", {className: "modal fade", id: "myModal", tabindex: "-1", role: "dialog", "aria-labelledby": "myModalLabel", 
                         "aria-hidden": "true"}, 
                        React.createElement("div", {className: "modal-dialog modal-lg"}, 
                            React.createElement("div", {className: "modal-content"}, 
                                React.createElement("div", {className: "modal-header"}, 
                                    React.createElement("button", {type: "button", className: "close", "data-dismiss": "modal", 
                                            "aria-label": "Close"}, React.createElement("span", {
                                        "aria-hidden": "true"}, "×")), 
                                    React.createElement("h4", {className: "modal-title", id: "myModalLabel"}, "Modal title")
                                ), 
                                React.createElement("div", {className: "modal-body "}, 
                                    React.createElement("div", {className: "row container-fluid"}, 
                                        React.createElement("div", {className: "col-md-9 left"}, 
                                            React.createElement("div", {className: "limit-collection-days-chart-title"}, "参考指标"), 
                                            React.createElement("div", {className: "row"}, 
                                                React.createElement("div", {className: "col-md-6"}, 
                                                    React.createElement("div", {className: "limit-collection-days-chart-title"}, "订单付款期限分布"), 
                                                    React.createElement(BarChart, {chartIndex: "11", 
                                                              X: this.state.data.dso_histogram.bucket_boundary, 
                                                              Y: [['订单个数'].concat(this.state.data.dso_histogram.bill_count)], 
                                                              tips: "", isHistogram: "true", width: "350", height: "200"}), 

                                                    React.createElement("div", {className: "modify-parameter-middle-chart-ps"}, 
                                                        "平均付款期限 ", this.state.data.dso_histogram.average, "天" + ' ' +
                                                        "最大值 ", this.state.data.dso_histogram.max, "天"
                                                    )
                                                ), 
                                                React.createElement("div", {className: "col-md-6"}, 
                                                    React.createElement("div", {className: "limit-collection-days-chart-title"}, "历史贸易趋势"), 
                                                    React.createElement(BarChart, {chartIndex: "10", 
                                                              X: ['x'].concat(this.state.data.deal_history.date), 
                                                              Y: [['订单金额'].concat(this.state.data.deal_history.bill_amount)].concat([['回款金额'].concat(this.state.data.deal_history.payment_amount)]), 
                                                              tips: "", width: "350", height: "200"}), 

                                                    React.createElement("div", {className: "modify-parameter-middle-chart-ps"}, 
                                                        "过去一年销售额 ", Configuration.formatW(this.state.data.deal_history.sale_last_year), "万" + ' ' +
                                                        "增长率 ", Configuration.formatRound(this.state.data.deal_history.growth_last_year), "%"
                                                    )
                                                )
                                            ), 
                                            React.createElement("div", {className: "row"}, 
                                                React.createElement("div", {className: "col-md-4"}, 
                                                    React.createElement("div", {className: "limit-collection-days-chart-title"}, "订单指标"), 
                                                    React.createElement("div", {className: "row border"}, 
                                                        React.createElement("div", {className: "col-md-6"}, 
                                                            React.createElement("span", {className: "data-span"}, React.createElement("span", {
                                                                className: "num"}, this.state.data.total_deal), "笔"), 
                                                            React.createElement("br", null), 
                                                            React.createElement("span", {className: "label-span"}, "总订单数")
                                                        ), 
                                                        React.createElement("div", {className: "col-md-6"}, 
                                                            React.createElement("span", {className: "data-span"}, React.createElement("span", {
                                                                className: "num"}, this.state.data.dso_histogram.max), "天"), 
                                                            React.createElement("br", null), 
                                                            React.createElement("span", {className: "label-span"}, "最高付款期限")
                                                        )
                                                    )
                                                ), 
                                                React.createElement("div", {className: "col-md-8"}, 
                                                    React.createElement("div", {className: "limit-collection-days-chart-title"}, "逾期指标"), 
                                                    React.createElement("div", {className: "row"}, 
                                                        React.createElement("div", {className: "col-md-3"}, 
                                                            React.createElement("span", {className: "data-span"}, React.createElement("span", {
                                                                className: "num"}, this.state.data.overdue_deal_count), "笔"), 
                                                            React.createElement("br", null), 
                                                            React.createElement("span", {className: "label-span"}, "逾期订单数")
                                                        ), 
                                                        React.createElement("div", {className: "col-md-3"}, 
                                                            React.createElement("span", {className: "data-span"}, React.createElement("span", {
                                                                className: "num"}, (100 * this.state.data.overdue_deal_count_percentage).toFixed(0)), "%"), 
                                                            React.createElement("br", null), 
                                                            React.createElement("span", {className: "label-span"}, "逾期订单数占总订单比")
                                                        ), 
                                                        React.createElement("div", {className: "col-md-3"}, 
                                                            React.createElement("span", {className: "data-span"}, React.createElement("span", {
                                                                className: "num"}, Configuration.formatW(this.state.data.overdue_deal_amount)), "万"), 
                                                            React.createElement("br", null), 
                                                            React.createElement("span", {className: "label-span"}, "逾期订单总金额")
                                                        ), 
                                                        React.createElement("div", {className: "col-md-3"}, 
                                                            React.createElement("span", {className: "data-span"}, React.createElement("span", {
                                                                className: "num"}, (100 * this.state.data.overdue_deal_amount_percentage).toFixed(0)), "%"), 
                                                            React.createElement("br", null), 
                                                            React.createElement("span", {className: "label-span"}, "逾期订单金额占总订单金额比")
                                                        )
                                                    )
                                                )
                                            ), 

                                            React.createElement("div", {className: "range-slider-container-title"}, "授信设置"), 
                                            React.createElement("div", {className: "range-slider-container row"}, 

                                                React.createElement("div", {className: "col-md-6"}, 

                                                    React.createElement("div", {className: "range-slider-title"}, "设置授信账期"), 
                                                    React.createElement(RangeSlider, {chartIndex: "11", 
                                                                 min: this.state.range1[0], 
                                                                 max: this.state.range1[1], 
                                                                 now: this.state.data.credit_account})
                                                ), 
                                                React.createElement("div", {className: "col-md-6"}, 

                                                    React.createElement("div", {className: "range-slider-title"}, "设置授信额度"), 
                                                    React.createElement(RangeSlider, {chartIndex: "12", label: "万", 
                                                                 min: this.state.range2[0], 
                                                                 max: this.state.range2[1], 
                                                                 now: Configuration.formatW(this.state.data.credit_line)})
                                                )

                                            )

                                        ), 
                                        React.createElement("div", {className: "col-md-3 right"}, 
                                            React.createElement("div", {className: "right-title"}, "授信结果预览"), 
                                            React.createElement("div", {className: "right-style-div row"}, 
                                                React.createElement("div", {className: "col-md-6"}, 
                                                    React.createElement("div", null, "授信账期"), 
                                                    React.createElement("span", {className: "data-span"}, React.createElement("span", {
                                                        className: "num"}, this.state.data.credit_account), "天"), 
                                                    React.createElement("br", null), 
                                                    React.createElement("span", {className: "label-span"}, "微调前")
                                                ), 
                                                React.createElement("div", {className: "col-md-6"}, 
                                                    React.createElement("div", null, "授信账期"), 
                                                    React.createElement("span", {className: "data-span"}, React.createElement("span", {className: "num cl-red", 
                                                                                      ref: "account"}, "--"), "天"), 
                                                    React.createElement("br", null), 
                                                    React.createElement("span", {className: "label-span"}, "微调后")
                                                )
                                            ), 
                                            React.createElement("div", {className: "right-style-div row"}, 
                                                React.createElement("div", {className: "col-md-6"}, 
                                                    React.createElement("div", null, "授信额度"), 
                                                    React.createElement("span", {className: "data-span"}, React.createElement("span", {
                                                        className: "num"}, Configuration.formatW(this.state.data.credit_line)), "万"), 
                                                    React.createElement("br", null), 
                                                    React.createElement("span", {className: "label-span"}, "微调前")
                                                ), 
                                                React.createElement("div", {className: "col-md-6"}, 
                                                    React.createElement("div", null, "授信额度"), 
                                                    React.createElement("span", {className: "data-span"}, React.createElement("span", {className: "num cl-red", 
                                                                                      ref: "line"}, "--"), "万"), 
                                                    React.createElement("br", null), 
                                                    React.createElement("span", {className: "label-span"}, "微调后")
                                                )
                                            ), 
                                            React.createElement("div", {className: "right-style-div row"}, 
                                                React.createElement("div", {className: "col-md-6"}, 
                                                    React.createElement("div", null, "支持贸易规模"), 
                                                    React.createElement("span", {className: "data-span"}, React.createElement("span", {
                                                        className: "num"}, Configuration.formatW(this.state.data.expected_sale)), "万"), 
                                                    React.createElement("br", null), 
                                                    React.createElement("span", {className: "label-span"}, "微调前")
                                                ), 
                                                React.createElement("div", {className: "col-md-6"}, 
                                                    React.createElement("div", null, "支持贸易规模"), 
                                                    React.createElement("span", {className: "data-span"}, React.createElement("span", {
                                                        className: "num cl-red", ref: "cal"}, "--"), "万"), 
                                                    React.createElement("br", null), 
                                                    React.createElement("span", {className: "label-span"}, "微调后")
                                                )
                                            )
                                        )
                                    )
                                ), 
                                React.createElement("div", {className: "modal-footer"}, 
                                    React.createElement("button", {type: "button", className: "btn btn-primary post-dealer-data"}, "应用"
                                    ), 
                                    React.createElement("button", {type: "button", className: "btn btn-default", "data-dismiss": "modal"}, "关闭")
                                )
                            )
                        )
                    )

                );
            }
        });

        return Modal;
    })