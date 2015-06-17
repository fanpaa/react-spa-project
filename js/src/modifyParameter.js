define(['js/build/configuration', 'react', 'jquery',
        'js/build/processBar', 'js/build/barChart',
        'js/build/donutChart', 'js/build/rangeSlider', 'reactRouter', 'js/build/loading'],
    function (Configuration, React, $, ProcessBar,
              BarChart, DonutChart, RangeSlider, ReactRouter, Loading) {
        var ModifyParameter = React.createClass({
            mixins: [ReactRouter.Navigation, ReactRouter.State],
            getInitialState: function () {
                return {
                    data: null,
                    barChart: null,
                    rangeValue: 0,
                    targetDiv: 'no_deal_day_till_now',
                    loading: true
                }
            },
            hideLoading: function () {
                this.setState({loading: false})
            },
            componentDidMount: function () {
                var _this = this;


                this.getAdmittence_summary(function () {
                    this.getAdmittence_detail('no_deal_day_till_now', function () {
                        _this.hideLoading();


                        $(".modify-parameter-middle-chart-tab")
                            .text($(".modify-parameter .left>div:first-child")
                                .find('span.left-title').text());
                        $(".modify-parameter-middle-title")
                            .text($(".modify-parameter .left>div:first-child")
                                .find('span.left-title').attr('data-ps'));
                        $(".modify-parameter-middle-chart-title-ps")
                            .text($(".modify-parameter .left>div:first-child")
                                .find('span.left-title').attr('data-detail'));

                        $(".modify-parameter").on("click", ".left>div", function (e) {
                            if ($(e.target).hasClass('close-btn')) {

                                var condition_name = $(this)
                                    .find('span.left-title').attr('data-condition-name');
                                var count = parseInt($("#rangeSlider0").val());
                                var obj = {
                                    condition: condition_name,
                                    checked_value: count,
                                    checked: 'FALSE'
                                };
                                _this.postAdmittence_change(obj);

                            } else {
                                $(this).addClass('active').siblings().removeClass('active');
                                $(".modify-parameter-middle-chart-tab").text($(this)
                                    .find('span.left-title').text());
                                $(".modify-parameter-middle-title").text($(this)
                                    .find('span.left-title').attr('data-ps'));
                                $(".modify-parameter-middle-chart-title-ps").text($(this)
                                    .find('span.left-title').attr('data-detail'));

                                _this.getAdmittence_detail($(this)
                                    .find('span.left-title').attr('data-condition-name'));
                            }

                        });

                        $("#rangeSlider0").on({
                            change: function () {
                                var condition_name = $(".modify-parameter .left>div.active").find('span.left-title').attr('data-condition-name');
                                var count = parseInt($("#rangeSlider0Input").val());
                                var obj = {
                                    condition: condition_name,
                                    checked_value: count,
                                    checked: 'TRUE'
                                };
                                _this.postAdmittence_change(obj);
                            }
                        });


                        $("#rangeSlider0Form").submit(function (e) {
                            e.preventDefault();
                            var condition_name = $(".modify-parameter .left>div.active").find('span.left-title').attr('data-condition-name');
                            var count = parseInt($("#rangeSlider0Input").val());
                            var obj = {
                                condition: condition_name,
                                checked_value: count,
                                checked: 'TRUE'
                            };
                            _this.postAdmittence_change(obj);
                        })


                    });
                }.bind(this));
            },
            preClick: function () {
                this.transitionTo('analytics');
            },
            nextClick: function () {
                this.transitionTo('limitAndCollectionDays');
            },
            getAdmittence_summary: function (callback) {
                $.ajax({
                    url: Configuration.REST + Configuration.API + Configuration.CaseName + '/admittence_summary',
                    method: 'GET',
                    contentType: 'text/plain',
                    dataType: "json"
                }).done(function (data) {
                    this.setState({data: data});
                    callback()
                }.bind(this));
            },
            getAdmittence_detail: function (condition_name, callback) {
                $.ajax({
                    url: Configuration.REST + Configuration.API + Configuration.CaseName + '/admittence_detail?condition=' + condition_name,
                    method: 'GET',
                    contentType: 'text/plain',
                    dataType: "json"
                }).done(function (data) {
                    var a = this.state;
                    a.barChart = data;
                    a.rangeValue = a.data.admittence_condition[condition_name].checked_value;
                    a.targetDiv = condition_name;
                    this.setState(a);
                    if (callback) {
                        callback();
                    }
                }.bind(this));
            },
            postAdmittence_change: function (obj) {
                //hack float
                switch (obj.condition) {
                    case 'total_overdue_bill_count_percentage':
                    case "1_3_day_overdue_amount_percentage" :
                    case "4_7_day_overdue_amount_percentage" :
                    case "7_more_day_overdue_amount_percentage" :
                    case 'total_overdue_amount_percentage':
                    case 'max_overdue_amount_percentage':
                        obj.checked_value = obj.checked_value / 100;
                        break;
                    case 'ave_monthly_sale_amount':
                        obj.checked_value = obj.checked_value * 10000;

                        break;
                    default:

                }

                $.ajax({
                    url: Configuration.REST + Configuration.API + Configuration.CaseName + '/admittence_change',
                    method: 'POST',
                    contentType: 'application/json',
                    dataType: "json",
                    data: JSON.stringify(obj)
                }).done(function (res) {
                    var a = this.state;

                    if (obj.checked === "TRUE") {
                        a.data.total_dealer_count = res.total_dealer_count;
                        a.data.admitted_dealer_count = res.admitted_dealer_count;
                        a.data.non_admitted_dealer_count = res.non_admitted_dealer_count;
                        a.data.total_sale_amount = res.total_sale_amount;
                        a.data.admitted_dealer_sale_amount = res.admitted_dealer_sale_amount;
                        a.data.non_admitted_dealer_sale_amount = res.non_admitted_dealer_sale_amount;
                        a.barChart.admitted_count = res.admiited_count;
                        a.barChart.admitted_percentage = res.admitted_percentage;

                        a.data.admittence_condition[obj.condition].checked_value = obj.checked_value;
                        a.data.admittence_condition[obj.condition].checked = obj.checked;
                        a.rangeValue = obj.checked_value;
                        a.targetDiv = obj.condition;
                        this.setState(a);
                    } else if (obj.checked === "FALSE") {
                        a.data.total_dealer_count = res.total_dealer_count;
                        a.data.admitted_dealer_count = res.admitted_dealer_count;
                        a.data.non_admitted_dealer_count = res.non_admitted_dealer_count;
                        a.data.total_sale_amount = res.total_sale_amount;
                        a.data.admitted_dealer_sale_amount = res.admitted_dealer_sale_amount;
                        a.data.non_admitted_dealer_sale_amount = res.non_admitted_dealer_sale_amount;
                        a.barChart.admitted_count = res.admiited_count;
                        a.barChart.admitted_percentage = res.admitted_percentage;

                        a.data.admittence_condition[obj.condition].checked = obj.checked;
                        this.setState(a);
                    }


                }.bind(this));
            },
            chooseClassName: function (condition) {
                if (condition == this.state.targetDiv) {
                    if (this.state.data.admittence_condition[condition].checked == "TRUE") {
                        return 'active';
                    } else if (this.state.data.admittence_condition[condition].checked == "FALSE") {
                        return 'active disable-option';
                    }
                } else {
                    if (this.state.data.admittence_condition[condition].checked == "TRUE") {
                        return '';
                    } else if (this.state.data.admittence_condition[condition].checked == "FALSE") {
                        return 'disable-option';
                    }
                }

            },
            chooseText: function (condition) {
                if (this.state.data.admittence_condition[condition].checked == "TRUE") {
                    var number = this.state.data.admittence_condition[condition].checked_value;
                    switch (condition) {
                        case 'no_deal_day_till_now':
                            return '连续' + number + '天';
                            break;
                        case 'ave_monthly_sale_amount':
                            return '低于' + Configuration.formatW(number) + '万元';
                            break;
                        case 'ave_dso':
                        case 'ave_overdue_days':
                        case 'max_overdue_days':
                            return '超过' + number + '天';
                            break;
                        case 'total_overdue_bill_count_percentage':
                        case "1_3_day_overdue_amount_percentage" :
                        case "4_7_day_overdue_amount_percentage" :
                        case "7_more_day_overdue_amount_percentage" :
                        case 'total_overdue_amount_percentage':
                        case 'max_overdue_amount_percentage':
                            //todo hack
                            return '大于' + (number * 100).toFixed(0) + '%';
                            break;
                    }
                } else if (this.state.data.admittence_condition[condition].checked == "FALSE") {
                    return '未设置';
                }
            },
            render: function () {

                if (this.state.loading) {
                    return (<Loading />)
                }

                var processBar, btnControl, rangeSlider, rangeBar,topBtn;
                if (this.props.dialog) {
                    processBar = <div></div>;
                    topBtn = (<div className="top-btn-class">
                        <button type="button" className="btn btn-primary modify-btn-success"
                                id="optionContainer">收起
                        </button>
                    </div>);
                    btnControl = <div></div>;
                } else {
                    processBar = <ProcessBar step="step1"/>;
                    topBtn=<div></div>;
                    btnControl = (<div>
                        <button type="button" className="btn btn-primary modify-btn-success"
                                onClick={this.nextClick}>完成准入<span className="glyphicon glyphicon-menu-right"></span>
                        </button>
                        <button type="button" className="btn btn-default modify-btn-pre" onClick={this.preClick}>
                            上一步
                        </button>
                    </div>);
                }


                console.log('--------' + this.state.targetDiv)
                switch (this.state.targetDiv) {
                    case 'total_overdue_bill_count_percentage':
                    case "1_3_day_overdue_amount_percentage" :
                    case "4_7_day_overdue_amount_percentage" :
                    case "7_more_day_overdue_amount_percentage" :
                    case 'total_overdue_amount_percentage':
                    case 'max_overdue_amount_percentage':
                        rangeSlider = (<RangeSlider chartIndex="0" label={'%'}
                                                    max={100*this.state.barChart.max}
                                                    min={100*this.state.barChart.min}
                                                    now={100*this.state.rangeValue}/>);

                        rangeBar = (<div className="modify-parameter-middle-chart-ps">
                            整体平均值 {100 * this.state.barChart.average}% 最大值 {100 * this.state.barChart.max}%
                        </div>)
                        break;
                    case 'ave_monthly_sale_amount':
                        rangeSlider = (<RangeSlider chartIndex="0" label={'万元'}
                                                    max={Configuration.formatW(this.state.barChart.max)}
                                                    min={Configuration.formatW(this.state.barChart.min)}
                                                    now={Configuration.formatW(this.state.rangeValue)}/>);
                        rangeBar = (<div className="modify-parameter-middle-chart-ps">
                            整体平均值 {Configuration.formatW(this.state.barChart.average)}万元
                            最大值 {Configuration.formatW(this.state.barChart.max)}万元
                        </div>)

                        break;
                    default:
                        rangeSlider = (<RangeSlider chartIndex="0"
                                                    max={this.state.barChart.max}
                                                    min={this.state.barChart.min}
                                                    now={this.state.rangeValue}/>);
                        rangeBar = (<div className="modify-parameter-middle-chart-ps">
                            整体平均值 {Configuration.formatRound(this.state.barChart.average)}天 最大值 {this.state.barChart.max}天
                        </div>)

                }


                return (
                    <div>
                        {processBar}
                        {topBtn}
                        <div className="modify-parameter container">
                            <div className="title row">准入设置</div>
                            <div className="title-ps row">根据经销商贸易相关性，历史还款行为等关键指标设置授信准入标准。</div>
                            <div className="row wrap">
                                <div className="col-md-3 left">
                                    <div className={this.chooseClassName('no_deal_day_till_now')}>
                                        <span className="left-title"
                                              data-detail="经销商距数据截止日连续无交易天数的分布"
                                              data-ps="距数据截止日连续x天没有交易不准入"
                                              data-condition-name="no_deal_day_till_now">距数据截止日连续无交易天数</span>
                                        <br/>
                                        <span
                                            className="opt">{this.chooseText('no_deal_day_till_now')}<span
                                            className="close-btn">x</span></span>

                                    </div>
                                    <div className={this.chooseClassName('ave_monthly_sale_amount')}>
                                        <span className="left-title" data-detail="经销商月均交易金额的分布"
                                              data-ps="月均交易金额低于x万元不准入"
                                              data-condition-name="ave_monthly_sale_amount">月均交易金额</span>
                                        <br/>
                                        <span
                                            className="opt">{this.chooseText('ave_monthly_sale_amount')}<span
                                            className="close-btn">x</span></span>
                                    </div>
                                    <div className={this.chooseClassName('ave_dso')}>
                                        <span className="left-title" data-detail="经销商平均销售周转天数的分布"
                                              data-ps="平均销售周转天数超过x天不准入"
                                              data-condition-name="ave_dso">平均销售周期</span>
                                        <br/>
                                        <span
                                            className="opt">{this.chooseText('ave_dso')}<span
                                            className="close-btn">x</span></span>
                                    </div>
                                    <div className={this.chooseClassName('ave_overdue_days')}>
                                        <span className="left-title" data-detail="经销商平均逾期天数的分布"
                                              data-ps="平均逾期天数超过x天，不准入"
                                              data-condition-name="ave_overdue_days">平均逾期天数</span>
                                        <br/>
                                        <span className="opt">{this.chooseText('ave_overdue_days')}<span
                                            className="close-btn">x</span></span>
                                    </div>
                                    <div className={this.chooseClassName('max_overdue_days')}>
                                        <span className="left-title" data-detail="经销商最大逾期天数的分布"
                                              data-ps="最大逾期天数超过x天，不准入"
                                              data-condition-name="max_overdue_days">最大逾期天数</span>
                                        <br/>
                                        <span className="opt">{this.chooseText('max_overdue_days')}<span
                                            className="close-btn">x</span></span>
                                    </div>
                                    <div className={this.chooseClassName('total_overdue_bill_count_percentage')}>
                                        <span className="left-title" data-detail="经销商总逾期订单比例的分布"
                                              data-ps="总逾期订单比例大于x%，不准入"
                                              data-condition-name="total_overdue_bill_count_percentage">总逾期订单比例</span>
                                        <br/>
                                        <span
                                            className="opt">{this.chooseText('total_overdue_bill_count_percentage')}<span
                                            className="close-btn">x</span></span>
                                    </div>
                                    <div className={this.chooseClassName('1_3_day_overdue_amount_percentage')}>
                                        <span className="left-title" data-detail="经销商1-3天逾期订单金额比例的分布"
                                              data-ps="1-3天逾期订单金额占已核销订单金额比例大于x%，不准入"
                                              data-condition-name="1_3_day_overdue_amount_percentage">1-3天逾期订单金额比例</span>
                                        <br/>
                                        <span
                                            className="opt">{this.chooseText('1_3_day_overdue_amount_percentage')}<span
                                            className="close-btn">x</span></span>
                                    </div>
                                    <div className={this.chooseClassName('4_7_day_overdue_amount_percentage')}>
                                        <span className="left-title" data-detail="经销商4-7天逾期订单金额比例的分布"
                                              data-ps="4-7天逾期订单金额占已核销订单金额比例大于x%，不准入"
                                              data-condition-name="4_7_day_overdue_amount_percentage">4-7天逾期订单金额比例</span>
                                        <br/>
                                        <span
                                            className="opt">{this.chooseText('4_7_day_overdue_amount_percentage')}<span
                                            className="close-btn">x</span></span>
                                    </div>
                                    <div className={this.chooseClassName('7_more_day_overdue_amount_percentage')}>
                                        <span className="left-title" data-detail="经销商大于7天逾期订单金额比例的分布"
                                              data-ps="大于7天逾期订单金额占已核销订单金额比例大于x%，不准入"
                                              data-condition-name="7_more_day_overdue_amount_percentage">大于7天逾期订单金额比例</span>
                                        <br/>
                                        <span
                                            className="opt">{this.chooseText('7_more_day_overdue_amount_percentage')}<span
                                            className="close-btn">x</span></span>
                                    </div>
                                    <div className={this.chooseClassName('total_overdue_amount_percentage')}>
                                        <span className="left-title" data-detail="经销商累计逾期金额占总订单金额比例的分布"
                                              data-ps="累计逾期金额占已核销订单金额比例大于x%，不准入"
                                              data-condition-name="total_overdue_amount_percentage">累计逾期金额占订单总金额比例</span>
                                        <br/>
                                        <span className="opt">{this.chooseText('total_overdue_amount_percentage')}<span
                                            className="close-btn">x</span></span>
                                    </div>
                                    <div className={this.chooseClassName('max_overdue_amount_percentage')}>
                                        <span className="left-title" data-detail="经销商最大逾期金额占总订单金额比例的分布"
                                              data-ps="最大逾期金额占已核销订单金额比例大于x%，不准入"
                                              data-condition-name="max_overdue_amount_percentage">最大逾期金额占订单总金额比例</span>
                                        <br/>
                                        <span className="opt">{this.chooseText('max_overdue_amount_percentage')}<span
                                            className="close-btn">x</span></span>
                                    </div>

                                </div>
                                <div className="col-md-6 middle">
                                    <div className="modify-parameter-middle-chart-tab"></div>
                                    <div className="modify-parameter-middle-title"></div>
                                    <div className="modify-parameter-middle-chart-title">参考指标</div>
                                    <div className="modify-parameter-middle-chart-title-ps"></div>
                                    <BarChart chartIndex="2" X={this.state.barChart.bucket_bounday}
                                              Y={[['经销商个数'].concat(this.state.barChart.dealer_count)]}
                                              isHistogram="true" height="230"/>

                                    {rangeBar}

                                    <div className="range-slider-container-title">准入设置</div>
                                    <div className="range-slider-container row">
                                        <div className="col-md-6">
                                            {rangeSlider}

                                        </div>
                                        <div className="col-md-6">
                                            <div className="row" className="range-slider-container-right">
                                                <div className="col-md-6">{this.state.barChart.admitted_count}<br/>准入家数
                                                </div>
                                                <div
                                                    className="col-md-6">{(100 * this.state.barChart.admitted_percentage).toFixed(2)}%<br/>准入比例
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="col-md-3 right">
                                    <div className="right-title">准入结果预览</div>
                                    <DonutChart chartIndex="0" title="准入经销商占比" height="160" divStyle={{paddingLeft:"60px"}}
                                                data1={this.state.data.admitted_dealer_count}
                                                data2={this.state.data.non_admitted_dealer_count}
                                                total={this.state.data.total_dealer_count+'家'}/>
                                    <DonutChart chartIndex="1" title="准入经销商销售额占比" height="160"
                                                data1={Configuration.formatW(this.state.data.admitted_dealer_sale_amount)}
                                                data2={Configuration.formatW(this.state.data.non_admitted_dealer_sale_amount)}
                                                total={Configuration.formatW(this.state.data.total_sale_amount)+'万'}/>
                                </div>
                            </div>
                            {btnControl}
                        </div>

                    </div>

                );
            }
        });

        return ModifyParameter;
    })