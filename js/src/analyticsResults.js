define(['js/build/configuration', 'react', 'jquery',
        'bootstrap', 'js/build/processBar', 'js/build/barChart',
        'js/build/donutChart', 'js/build/rangeSlider', 'js/build/rangeSlider2',
        'js/build/modifyParameter', 'js/build/limitAndCollectionDays',
        'reactRouter', 'js/build/modal', 'js/build/fixedDataTable', 'js/build/loading'],
    function (Configuration, React, $, bootstrap, ProcessBar,
              BarChart, DonutChart, RangeSlider, RangeSlider2,
              ModifyParameter, LimitAndCollectionDays, ReactRouter, Modal, FixedDataTable, Loading) {
        var AnalyticsResults = React.createClass({
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
                React.render(<LimitAndCollectionDays dialog="true"/>, document.getElementById("modifyContainer"));
            },
            modifyHandler: function () {
                $('.top-opt-btn').removeClass('btn-primary');
                $('.modify-btn').addClass('btn-primary');
                React.render(<ModifyParameter dialog="true"/>, document.getElementById("modifyContainer"));
            },
            render: function () {

                if (this.state.loading) {
                    return (<Loading />)
                }

                var file = "", warningDiv;
                if (typeof Configuration.GlobalFileName !== "undefined") {
                    file = Configuration.GlobalFileName;
                }
                return (
                    <div className="analytics-results">
                        <div className="analytics-header">
                            <span>分析结果</span>

                            {/*<div className="uploader-history">
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
                            */}
                        </div>
                        <div className="analytics container-fluid">
                            <div>
                                <div className="title">
                                    <span className="in-title">概述</span>
                                    <button type="button" className="btn btn-default limit-btn top-opt-btn"
                                            onClick={this.limitHandler}>授信设置
                                    </button>
                                    <button type="button" className="btn btn-default modify-btn top-opt-btn"
                                            onClick={this.modifyHandler}>准入设置
                                    </button>
                                </div>
                                <div id="modifyContainer"></div>
                                <div className="data row">
                                    <div className="col-md-4">
                                        <span className="data-span"><span
                                            className="num">{Configuration.formatWC(this.state.data.total_expected_sale)}</span>万</span>
                                        <br/>
                                        <span className="label-span">总支持销售规模</span>
                                    </div>
                                    <div className="col-md-4">
                                        <span className="data-span"><span
                                            className="num">{Configuration.formatWC(this.state.data.total_credit_line)}</span>万</span>
                                        <br/>
                                        <span className="label-span">总额度</span>
                                    </div>
                                    <div className="col-md-4">
                                        <span className="data-span"><span
                                            className="num">{Configuration.formatRound(this.state.data.ave_credit_account)}</span>天</span>
                                        <br/>
                                        <span className="label-span">平均授信账期</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="data row">
                                    <div className="col-md-4">
                                        <DonutChart chartIndex="2" title="经销商个数" height="130"
                                                    divStyle={{textAlign:"center",padding:0}}
                                                    data1={this.state.data.admitted_dealer_count}
                                                    data2={this.state.data.non_admitted_dealer_count}
                                                    total={this.state.data.total_dealer_count+'家'}/>
                                    </div>
                                    <div className="col-md-4">
                                        <DonutChart chartIndex="3" title="经销商销售规模" height="130"
                                                    divStyle={{textAlign:"center",padding:0}}
                                                    data1={Configuration.formatW(this.state.data.admitted_dealer_sale_amount)}
                                                    data2={Configuration.formatW(this.state.data.non_admitted_dealer_sale_amount)}
                                                    total={Configuration.formatW(this.state.data.total_sale_amount)+'万'}/>
                                    </div>
                                    <div className="col-md-4">
                                        <BarChart chartIndex="5"
                                                  X={this.state.data.credit_line_distribution.bucket_bounday}
                                                  Y={[['经销商个数'].concat(this.state.data.credit_line_distribution.dealer_count)]}
                                                  tips="授信额度分布" isHistogram="true" height="160"/>

                                    </div>
                                </div>
                            </div>

                            <div className="data-table">
                                <div className="title">
                                    <span className="in-title">授信企业明细</span>
                                    <a href={this.state.data.download_detail_url} id="download">下载授信明细</a>
                                    <span className="glyphicon glyphicon-download-alt"></span>
                                </div>
                                <div className="data-table-filter">
                                    <span className="filter-title">授信额度区间</span>

                                    <div className="rangeSlider2">
                                        <RangeSlider2 chartIndex="1" start={this.state.range[0]}
                                                      end={this.state.range[1]}
                                                      max={this.state.data.credit_line_distribution.max}
                                                      min={this.state.data.credit_line_distribution.min}/>
                                    </div>
                                    <form id="searchForm"><input type="text" className="form-control search"
                                                                 placeholder="请输入企业名称"/>
                                        <span className="glyphicon glyphicon-search"></span></form>
                                </div>

                                {/**/}
                                <table className="table table-striped table-hover ">
                                    <thead>
                                    <tr>
                                        <th>企业名称</th>
                                        <th>内部授信账期</th>
                                        <th>测算账期</th>
                                        <th className="tR tR-padding">内部授信额度（万）</th>
                                        <th className="tR tR-padding">测算额度（万）</th>
                                        <th className="tR tR-padding">支持销售规模（万）</th>
                                        <th>操作</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.details.dealers.map(function (item, i) {
                                        return (
                                            <tr>
                                                <td>{item.name}</td>
                                                <td>{item.core_credit_account}</td>
                                                <td>{item.suggest_credit_account}</td>
                                                <td className="tR">{item.core_credit_line}</td>
                                                <td className="tR">{item.suggest_credit_line}</td>
                                                <td className="tR">{Configuration.formatRound(item.expected_sale)}</td>
                                                <td><a href="javascript:"
                                                       onClick={this.handleClick.bind(this,item.name)}
                                                       key={i}>微调</a></td>
                                            </tr>
                                        );
                                    }, this)}
                                    </tbody>
                                </table>


                            </div>

                        </div>

                        {<Modal/>}
                    </div>

                );
            }
        });

        return AnalyticsResults;
    })