define(['js/build/configuration', 'react', 'jquery', 'js/build/processBar', 'js/build/barChart', 'js/build/rangeSlider', 'reactRouter', 'js/build/loading'],
    function (Configuration, React, $, ProcessBar, BarChart, RangeSlider, ReactRouter, Loading) {
        var LimitAndCollectionDays = React.createClass({
            mixins: [ReactRouter.Navigation, ReactRouter.State],
            getInitialState: function () {
                return {
                    data: null,
                    loading: true
                }
            },
            hideLoading: function () {
                this.setState({loading: false})
            },
            componentDidMount: function () {
                var _this = this;
                this.getCredit_summary(function () {
                    _this.hideLoading();

                    $("#rangeSlider1,#rangeSlider2,#rangeSlider3").on({
                        change: function () {
                            var r1, r2, r3;
                            r1 = $("#rangeSlider1").val() ? parseInt($("#rangeSlider1").val()) : _this.state.data.credit_setting["unified.config"].CreditAccount;
                            r2 = $("#rangeSlider2").val() ? parseInt($("#rangeSlider2").val()) / 100 : _this.state.data.credit_setting["actualDSO.config"].credit_account_parameter;
                            r3 = $("#rangeSlider3").val() ? parseInt($("#rangeSlider3").val()) / 100 : _this.state.data.credit_setting["sale.growth.config"].sale_growth_parameter;

                            var obj = {
                                "type": _this.state.data.credit_setting.type,
                                "unified.setting": {
                                    "CreditAccount": r1,
                                    "sale_growth_parameter": r3
                                },
                                "actualDSO.setting": {
                                    "credit_account_parameter": r2,
                                    "sale_growth_parameter": r3
                                }
                            };

                            _this.postChange_credit_setting(obj);
                        }
                    });


                    $("#rangeSlider1Form,#rangeSlider2Form,#rangeSlider3Form").submit(function (e) {
                        e.preventDefault();
                        var r1, r2, r3;
                        r1 = $("#rangeSlider1").val() ? parseInt($("#rangeSlider1").val()) : _this.state.data.credit_setting["unified.config"].CreditAccount;
                        r2 = $("#rangeSlider2").val() ? parseInt($("#rangeSlider2").val()) / 100 : _this.state.data.credit_setting["actualDSO.config"].credit_account_parameter;
                        r3 = $("#rangeSlider3").val() ? parseInt($("#rangeSlider3").val()) / 100 : _this.state.data.credit_setting["sale.growth.config"].sale_growth_parameter;

                        var obj = {
                            "type": _this.state.data.credit_setting.type,
                            "unified.setting": {
                                "CreditAccount": r1,
                                "sale_growth_parameter": r3
                            },
                            "actualDSO.setting": {
                                "credit_account_parameter": r2,
                                "sale_growth_parameter": r3
                            }
                        };

                        _this.postChange_credit_setting(obj);

                    });


                    $('[name=optionsRadios]').change(function () {
                        //var a = _this.state;
                        //console.log($(this).val())
                        //a.data.credit_setting.type = $(this).val();
                        //_this.setState(a);


                        var r1, r2, r3;
                        r1 =  _this.state.data.credit_setting["unified.config"].CreditAccount;
                        r2 =  _this.state.data.credit_setting["actualDSO.config"].credit_account_parameter;
                        r3 =  _this.state.data.credit_setting["sale.growth.config"].sale_growth_parameter;

                        var obj = {
                            "type": $(this).val(),
                            "unified.setting": {
                                "CreditAccount": r1,
                                "sale_growth_parameter": r3
                            },
                            "actualDSO.setting": {
                                "credit_account_parameter": r2,
                                "sale_growth_parameter": r3
                            }
                        };

                        console.log(obj)

                        _this.postChange_credit_setting(obj);
                    })

                });


            },
            preClick: function () {
                this.transitionTo('modifyParameter');
            },
            nextClick: function () {
                this.transitionTo('analyticsResults');
            },
            getCredit_summary: function (callback) {
                $.ajax({
                    url: Configuration.REST + Configuration.API + Configuration.CaseName + '/credit_summary',
                    method: 'GET',
                    contentType: 'text/plain',
                    dataType: "json"
                }).done(function (data) {
                    this.setState({data: data});
                    callback();
                }.bind(this));
            },
            postChange_credit_setting: function (obj) {
                $.ajax({
                    url: Configuration.REST + Configuration.API + Configuration.CaseName + '/change_credit_setting',
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(obj),
                    dataType: 'json'
                }).done(function (data) {
                    this.setState({data: data});
                }.bind(this));
            },
            cancelDialog: function () {
                React.unmountComponentAtNode(document.getElementById('modifyContainer'));
            },
            render: function () {


                if (this.state.loading) {
                    return (<Loading />)
                }

                var processBar, btnControl, rangeControl,topBtn;
                if (this.props.dialog) {
                    processBar = <div></div>;
                    topBtn = (<div className="top-btn-class">
                        <button type="button" className="btn btn-primary modify-btn-success"
                                id="optionContainer">收起
                        </button>
                    </div>);
                    btnControl = <div></div>;
                } else {
                    processBar = <ProcessBar step="step2"/>;
                    topBtn=<div></div>;
                    btnControl = (<div>
                        <button type="button" className="btn btn-primary modify-btn-success"
                                onClick={this.nextClick}>完成授信<span className="glyphicon glyphicon-menu-right"></span>
                        </button>
                        <button type="button" className="btn btn-default modify-btn-pre" onClick={this.preClick}>
                            上一步
                        </button>
                    </div>);
                }

                if (this.state.data.credit_setting.type == "unified") {
                    rangeControl = (<div className="range-slider-container row">
                        <div className="col-md-4">
                            <div className="radio-label-type">授信方式</div>
                            <div className="radio">
                                <input type="radio" name="optionsRadios" id="optionsRadios1"
                                       value="unified" defaultChecked/>
                                <label htmlFor="optionsRadios1"> 按固定账期统一授信
                                </label>
                            </div>
                            <div className="radio">
                                <input type="radio" name="optionsRadios" id="optionsRadios2"
                                       value="actualDSO"/>
                                <label htmlFor="optionsRadios2"> 按实际付款周期分别授信
                                </label>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="range-slider-title">设置授信账期</div>
                            <RangeSlider chartIndex="1"
                                         max={this.state.data.credit_setting["unified.config"].max_credit_account}
                                         min={this.state.data.credit_setting["unified.config"].min_credit_account}
                                         now={this.state.data.credit_setting["unified.config"].CreditAccount}/>
                        </div>
                        <div className="col-md-4">
                            <div className="range-slider-title">设置年销售增长率</div>
                            <RangeSlider chartIndex="3" label="%"
                                         max={100*this.state.data.credit_setting["sale.growth.config"].max_sale_growth_parameter}
                                         min={100*this.state.data.credit_setting["sale.growth.config"].min_sale_growth_parameter}
                                         now={100*this.state.data.credit_setting["sale.growth.config"].sale_growth_parameter}/>
                        </div>

                    </div>);
                } else if (this.state.data.credit_setting.type == "actualDSO") {
                    rangeControl = (<div className="range-slider-container row">
                        <div className="col-md-4">
                            <div className="radio-label-type">授信方式</div>
                            <div className="radio">
                                <input type="radio" name="optionsRadios" id="optionsRadios1"
                                       value="unified"/>
                                <label htmlFor="optionsRadios1"> 按固定账期统一授信
                                </label>
                            </div>
                            <div className="radio">
                                <input type="radio" name="optionsRadios" id="optionsRadios2"
                                       value="actualDSO" defaultChecked/>
                                <label htmlFor="optionsRadios2"> 按实际付款周期分别授信
                                </label>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="range-slider-title">设置账期系数</div>
                            <RangeSlider chartIndex="2" label="%"
                                         max={100*this.state.data.credit_setting["actualDSO.config"].max_credit_account_parameter}
                                         min={100*this.state.data.credit_setting["actualDSO.config"].min_credit_account_parameter}
                                         now={100*this.state.data.credit_setting["actualDSO.config"].credit_account_parameter}/>
                        </div>
                        <div className="col-md-4">
                            <div className="range-slider-title">设置年销售增长率</div>
                            <RangeSlider chartIndex="3" label="%"
                                         max={100*this.state.data.credit_setting["sale.growth.config"].max_sale_growth_parameter}
                                         min={100*this.state.data.credit_setting["sale.growth.config"].min_sale_growth_parameter}
                                         now={100*this.state.data.credit_setting["sale.growth.config"].sale_growth_parameter}/>
                        </div>

                    </div>);
                }

                return (
                    <div>
                        {processBar}
                        {topBtn}
                        <div className="limit-collection-days container">
                            <div className="title row">授信设置</div>
                            <div className="title-ps row">
                                设置授信账期，并通过设置需要支持的整体销售规模，动商，参考经销商历史付款周期设置授信账期，并通过设置需要支持的整体销售规模，动态生成每个经销商所需要的信用额度。
                            </div>
                            <div className="row wrap">
                                <div className="col-md-9 left">
                                    <div className="limit-collection-days-chart-title">参考指标</div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="limit-collection-days-chart-title">平均付款期限分布</div>

                                            <BarChart chartIndex="4"
                                                      X={this.state.data["dso_histogram.data"].bucket_boundary}
                                                      Y={[['经销商个数'].concat(this.state.data["dso_histogram.data"].dealer_count)]}
                                                      tips="" height="230" isHistogram="true"/>

                                            <div className="modify-parameter-middle-chart-ps">
                                                整体平均付款期限 {Configuration.formatRound(this.state.data["dso_histogram.data"].average)}天
                                                最大值 {this.state.data["dso_histogram.data"].max}天
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="limit-collection-days-chart-title">历史贸易趋势</div>


                                            <BarChart chartIndex="3" X={['x'].concat(this.state.data.deal_history.date)}
                                                      Y={[['订单金额'].concat(this.state.data.deal_history.bill_amount)].concat([['回款金额'].concat(this.state.data.deal_history.payment_amount)])}
                                                      tips="" height="230"/>

                                            <div className="modify-parameter-middle-chart-ps">
                                                过去一年销售额 {Configuration.formatW(this.state.data.deal_history.sale_last_year)}万
                                                增长率 {this.state.data.deal_history.growth_last_year}%
                                            </div>
                                        </div>
                                    </div>
                                    <div className="range-slider-container-title">授信设置</div>
                                    {rangeControl}

                                </div>
                                <div className="col-md-3 right">
                                    <div className="right-title">授信结果预览</div>
                                    <div className="limit-collection-days-style-div">
                                        <span className="data-span"><span
                                            className="num">{Math.round(this.state.data.ave_credit_account)}</span>天</span>
                                        <br/>
                                        <span className="label-span">平均授信账期</span>
                                    </div>
                                    <div className="limit-collection-days-style-div">
                                        <span className="data-span"><span
                                            className="num">{Configuration.formatW(this.state.data.ave_credit_line)}</span>万</span>
                                        <br/>
                                        <span className="label-span">平均授信额度</span>
                                    </div>
                                    <div className="limit-collection-days-style-div">
                                        <span className="data-span"><span
                                            className="num">{Configuration.formatW(this.state.data.total_credit_line)}</span>万</span>
                                        <br/>
                                        <span className="label-span">总授信额度</span>
                                    </div>
                                    <div className="limit-collection-days-style-div">
                                        <span className="data-span"><span
                                            className="num">{Configuration.formatW(this.state.data.total_expected_sale)}</span>万</span>
                                        <br/>
                                        <span className="label-span">总支持贸易规模</span>
                                    </div>
                                </div>
                            </div>

                            {btnControl}

                        </div>
                    </div>


                );
            }
        });

        return LimitAndCollectionDays;
    })