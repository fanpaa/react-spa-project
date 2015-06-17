define(['js/build/configuration', 'react', 'jquery',
        'bootstrap', 'js/build/processBar', 'js/build/barChart',
        'js/build/donutChart', 'js/build/rangeSlider', 'js/build/rangeSlider2',
        'js/build/modifyParameter', 'js/build/limitAndCollectionDays',
        'reactRouter', 'js/build/modal', 'js/build/fixedDataTable', 'js/build/loading'],
    function (Configuration, React, $, bootstrap, ProcessBar,
              BarChart, DonutChart, RangeSlider, RangeSlider2,
              ModifyParameter, LimitAndCollectionDays, ReactRouter, Modal, FixedDataTable, Loading) {
        var AnalyticsResults = React.createClass({displayName: "AnalyticsResults",
            mixins: [ReactRouter.Navigation, ReactRouter.State],
            getInitialState: function () {
                return {
                    data: null,
                    details: [],
                    range: [0, 100],
                    loading: true
                }
            },
            showLoading: function () {
                this.setState({loading: true})
            },
            hideLoading: function () {
                this.setState({loading: false})
            },
            refreshTop: function () {
                //optionContainer
                $('.top-opt-btn').removeClass('btn-primary');
                React.unmountComponentAtNode(document.getElementById('modifyContainer'));
                this.getAnalysis_summary(function () {
                    this.getCredit_dealer_detail(this.state.range[0], this.state.range[1], '')
                }.bind(this));
                $('body').scrollTop(0);
            },
            inputClick: function () {
                this.transitionTo('home');
            },
            handleClick: function (i) {
                Configuration.GlobalCompanyName = i;
                $("#myModal").modal('show')
            },
            componentDidMount: function () {
                var _this = this;
                this.getAnalysis_summary(function () {
                    this.getCredit_dealer_detail(this.state.range[0], this.state.range[1], '', function () {

                        _this.hideLoading();
                        $("#rangeSlider2_1").on({
                            change: function () {
                                var count = $("#rangeSlider2_1").val();
                                console.log(count)

                                _this.getCredit_dealer_detail(count[0], count[1], '');

                            }.bind(this)
                        });

                        $("#searchForm").submit(function (e) {
                            e.preventDefault();
                            var name = $(".form-control.search").val().trim();
                            _this.getCredit_dealer_detail(_this.state.data.credit_line_distribution.min, _this.state.data.credit_line_distribution.max, name);
                        }.bind(this))


                        $(".analytics-results").on('click', '#optionContainer', function () {
                            _this.refreshTop();
                        }.bind(this))

                        $(".analytics-results").on('click', '.post-dealer-data', function () {
                            console.log('click');
                            //TODO hack callback function
                            setTimeout(function () {
                                _this.getAnalysis_summary(function () {
                                    _this.getCredit_dealer_detail(_this.state.range[0], _this.state.range[1], '')
                                });
                            }, 800)
                        })

                    });


                }.bind(this));


            },
            getAnalysis_summary: function (callback) {
                $.ajax({
                    url: Configuration.REST + Configuration.API + Configuration.CaseName + '/analysis_summary',
                    method: 'GET',
                    contentType: 'text/plain',
                    dataType: "json"
                }).done(function (data) {
                    this.setState({data: data});
                    this.setState({range: [this.state.data.credit_line_distribution.min, this.state.data.credit_line_distribution.max]});
                    if (callback) {
                        callback();
                    }
                }.bind(this));
            },
            getCredit_dealer_detail: function (min, max, name, callback) {
                $.ajax({
                    url: Configuration.REST + Configuration.API + Configuration.CaseName + '/credit_dealer_detail?min_credit_line=' + min + '&max_credit_line=' + max + '&name=' + name,
                    method: 'GET',
                    contentType: 'text/plain',
                    dataType: "json"
                }).done(function (data) {
                    this.setState({details: data, range: [parseInt(min), parseInt(max)]});
                    if (callback) {
                        callback();
                    }
                }.bind(this));
            },
            limitHandler: function () {
                $('.top-opt-btn').removeClass('btn-primary');
                $('.limit-btn').addClass('btn-primary');
                React.render(React.createElement(LimitAndCollectionDays, {dialog: "true"}), document.getElementById("modifyContainer"));
            },
            modifyHandler: function () {
                $('.top-opt-btn').removeClass('btn-primary');
                $('.modify-btn').addClass('btn-primary');
                React.render(React.createElement(ModifyParameter, {dialog: "true"}), document.getElementById("modifyContainer"));
            },
            render: function () {

                if (this.state.loading) {
                    return (React.createElement(Loading, null))
                }

                var file = "", warningDiv;
                if (typeof Configuration.GlobalFileName !== "undefined") {
                    file = Configuration.GlobalFileName;
                }
                return (
                    React.createElement("div", {className: "analytics-results"}, 
                        React.createElement("div", {className: "analytics-header"}, 
                            React.createElement("span", null, "分析结果")

                            /*<div className="uploader-history">
                                <form className="form-inline">
                                    <label>数据文件</label>
                                    <input type="text" className="form-control" disabled value={file}
                                           id="input_control"/>
                                    <button type="button" className="btn btn-primary uploader-history-submit"
                                            onClick={this.inputClick}>
                                        重新上传
                                    </button>
                                </form>
                            </div>
                            */
                        ), 
                        React.createElement("div", {className: "analytics container-fluid"}, 
                            React.createElement("div", null, 
                                React.createElement("div", {className: "title"}, 
                                    React.createElement("span", {className: "in-title"}, "概述"), 
                                    React.createElement("button", {type: "button", className: "btn btn-default limit-btn top-opt-btn", 
                                            onClick: this.limitHandler}, "授信设置"
                                    ), 
                                    React.createElement("button", {type: "button", className: "btn btn-default modify-btn top-opt-btn", 
                                            onClick: this.modifyHandler}, "准入设置"
                                    )
                                ), 
                                React.createElement("div", {id: "modifyContainer"}), 
                                React.createElement("div", {className: "data row"}, 
                                    React.createElement("div", {className: "col-md-4"}, 
                                        React.createElement("span", {className: "data-span"}, React.createElement("span", {
                                            className: "num"}, Configuration.formatWC(this.state.data.total_expected_sale)), "万"), 
                                        React.createElement("br", null), 
                                        React.createElement("span", {className: "label-span"}, "总支持销售规模")
                                    ), 
                                    React.createElement("div", {className: "col-md-4"}, 
                                        React.createElement("span", {className: "data-span"}, React.createElement("span", {
                                            className: "num"}, Configuration.formatWC(this.state.data.total_credit_line)), "万"), 
                                        React.createElement("br", null), 
                                        React.createElement("span", {className: "label-span"}, "总额度")
                                    ), 
                                    React.createElement("div", {className: "col-md-4"}, 
                                        React.createElement("span", {className: "data-span"}, React.createElement("span", {
                                            className: "num"}, Configuration.formatRound(this.state.data.ave_credit_account)), "天"), 
                                        React.createElement("br", null), 
                                        React.createElement("span", {className: "label-span"}, "平均授信账期")
                                    )
                                )
                            ), 
                            React.createElement("div", null, 
                                React.createElement("div", {className: "data row"}, 
                                    React.createElement("div", {className: "col-md-4"}, 
                                        React.createElement(DonutChart, {chartIndex: "2", title: "经销商个数", height: "130", 
                                                    divStyle: {textAlign:"center",padding:0}, 
                                                    data1: this.state.data.admitted_dealer_count, 
                                                    data2: this.state.data.non_admitted_dealer_count, 
                                                    total: this.state.data.total_dealer_count+'家'})
                                    ), 
                                    React.createElement("div", {className: "col-md-4"}, 
                                        React.createElement(DonutChart, {chartIndex: "3", title: "经销商销售规模", height: "130", 
                                                    divStyle: {textAlign:"center",padding:0}, 
                                                    data1: Configuration.formatW(this.state.data.admitted_dealer_sale_amount), 
                                                    data2: Configuration.formatW(this.state.data.non_admitted_dealer_sale_amount), 
                                                    total: Configuration.formatW(this.state.data.total_sale_amount)+'万'})
                                    ), 
                                    React.createElement("div", {className: "col-md-4"}, 
                                        React.createElement(BarChart, {chartIndex: "5", 
                                                  X: this.state.data.credit_line_distribution.bucket_bounday, 
                                                  Y: [['经销商个数'].concat(this.state.data.credit_line_distribution.dealer_count)], 
                                                  tips: "授信额度分布", isHistogram: "true", height: "160"})

                                    )
                                )
                            ), 

                            React.createElement("div", {className: "data-table"}, 
                                React.createElement("div", {className: "title"}, 
                                    React.createElement("span", {className: "in-title"}, "授信企业明细"), 
                                    React.createElement("a", {href: this.state.data.download_detail_url, id: "download"}, "下载授信明细"), 
                                    React.createElement("span", {className: "glyphicon glyphicon-download-alt"})
                                ), 
                                React.createElement("div", {className: "data-table-filter"}, 
                                    React.createElement("span", {className: "filter-title"}, "授信额度区间"), 

                                    React.createElement("div", {className: "rangeSlider2"}, 
                                        React.createElement(RangeSlider2, {chartIndex: "1", start: this.state.range[0], 
                                                      end: this.state.range[1], 
                                                      max: this.state.data.credit_line_distribution.max, 
                                                      min: this.state.data.credit_line_distribution.min})
                                    ), 
                                    React.createElement("form", {id: "searchForm"}, React.createElement("input", {type: "text", className: "form-control search", 
                                                                 placeholder: "请输入企业名称"}), 
                                        React.createElement("span", {className: "glyphicon glyphicon-search"}))
                                ), 

                                /**/
                                React.createElement("table", {className: "table table-striped table-hover "}, 
                                    React.createElement("thead", null, 
                                    React.createElement("tr", null, 
                                        React.createElement("th", null, "企业名称"), 
                                        React.createElement("th", null, "内部授信账期"), 
                                        React.createElement("th", null, "测算账期"), 
                                        React.createElement("th", {className: "tR tR-padding"}, "内部授信额度（万）"), 
                                        React.createElement("th", {className: "tR tR-padding"}, "测算额度（万）"), 
                                        React.createElement("th", {className: "tR tR-padding"}, "支持销售规模（万）"), 
                                        React.createElement("th", null, "操作")
                                    )
                                    ), 
                                    React.createElement("tbody", null, 
                                    this.state.details.dealers.map(function (item, i) {
                                        return (
                                            React.createElement("tr", null, 
                                                React.createElement("td", null, item.name), 
                                                React.createElement("td", null, item.core_credit_account), 
                                                React.createElement("td", null, item.suggest_credit_account), 
                                                React.createElement("td", {className: "tR"}, item.core_credit_line), 
                                                React.createElement("td", {className: "tR"}, item.suggest_credit_line), 
                                                React.createElement("td", {className: "tR"}, Configuration.formatRound(item.expected_sale)), 
                                                React.createElement("td", null, React.createElement("a", {href: "javascript:", 
                                                       onClick: this.handleClick.bind(this,item.name), 
                                                       key: i}, "微调"))
                                            )
                                        );
                                    }, this)
                                    )
                                )


                            )

                        ), 

                        React.createElement(Modal, null)
                    )

                );
            }
        });

        return AnalyticsResults;
    })