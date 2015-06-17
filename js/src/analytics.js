define(['js/build/configuration', 'react', 'js/build/processBar', 'js/build/barChart', 'reactRouter', 'js/build/loading','js/build/histogram'], function (Configuration, React, ProcessBar, BarChart, ReactRouter, Loading,Histogram) {
    var Analytics = React.createClass({
        mixins: [ReactRouter.Navigation, ReactRouter.State],
        getInitialState: function () {
            return {
                warning: false,
                data: null,
                loading: true
            };
        },
        hideLoading: function () {
            this.setState({loading: false})
        },
        inputClick: function () {
            this.transitionTo('home');
        },
        preClick: function () {
            this.transitionTo('home');
        },
        nextClick: function () {
            this.transitionTo('modifyParameter');
        },
        componentDidMount: function () {
            console.log('analytics');
            $.ajax({
                url: Configuration.REST + Configuration.API + Configuration.CaseName + '/data_summary',
                method: 'GET',
                contentType: 'text/plain',
                dataType: "json"
            }).done(function (data) {
                this.setState({data: data});
                this.hideLoading();
            }.bind(this));

        },
        render: function () {

            if (this.state.loading) {
                return (<Loading />)
            }


            var file = "", warningDiv;
            if (typeof Configuration.GlobalFileName !== "undefined") {
                file = Configuration.GlobalFileName;
            }

            if (this.state.warning) {
                warningDiv = (
                    <div className="alert alert-warning analytics-warning" role="alert">
                        <strong>数据缺失信息：</strong>500家经销商中共有<strong>40</strong>家数据缺失，涉及销售金额<strong>400.00</strong>万，销售金额比例<strong>20%</strong>
                    </div>
                );
            } else {
                warningDiv = "";
            }

            return (
                <div>
                    <ProcessBar step="step0"/>

                    <div className="analytics-header">
                        <span>企业贸易数据总览</span>

                        {/*<div className="uploader-history">
                            <form className="form-inline">
                                <label>数据文件</label>
                                <input type="text" className="form-control" disabled value={file} id="input_control"/>
                                <button type="button" className="btn btn-primary uploader-history-submit"
                                        onClick={this.inputClick}>
                                    重新上传
                                </button>
                            </form>
                        </div>
                        */}
                    </div>
                    <div className="analytics container-fluid">
                        {warningDiv}
                        <div className="analytics-data0">
                            <div className="title">数据时间跨度</div>
                            <div className="data row">
                                <div className="col-md-6">
                                    <span className="data-span">{this.state.data.bill_date_span.start_date}--{this.state.data.bill_date_span.end_date}</span>
                                    <br/>
                                    <span className="label-span">订单时间跨度</span>
                                </div>
                                <div className="col-md-6">
                                    <span className="data-span">{this.state.data.payment_date_span.start_date}--{this.state.data.payment_date_span.end_date}</span>
                                    <br/>
                                    <span className="label-span">付款时间跨度</span>
                                </div>
                            </div>
                        </div>
                        <div className="analytics-data1">
                            <div className="title">贸易数据概况</div>
                            <div className="data row">
                                <div className="col-md-4">
                                    <span className="data-span"><span
                                        className="num">{this.state.data.total_bill_count}</span>笔</span>
                                    <br/>
                                    <span className="label-span">订单总数</span>
                                </div>
                                <div className="col-md-4">
                                    <span className="data-span"><span
                                        className="num">{Configuration.formatWC(this.state.data.total_bill_amount)}</span>万</span>
                                    <br/>
                                    <span className="label-span">订单总金额</span>
                                </div>
                                <div className="col-md-4">
                                    <span className="data-span"><span
                                        className="num">{Configuration.formatWC(this.state.data.total_payment_amount)}</span>万</span>
                                    <br/>
                                    <span className="label-span">付款总金额</span>
                                </div>
                            </div>
                        </div>
                        <div className="analytics-data2">
                            <div className="title">经销商数据概况</div>
                            <div className="data row">
                                <div className="col-md-4">
                                    <span className="data-span"><span
                                        className="num">{this.state.data.total_dealer_count}</span>家</span>
                                    <br/>
                                    <span className="label-span">经销商总数</span>
                                </div>
                                <div className="col-md-4">
                                    <span className="data-span"><span
                                        className="num">{this.state.data.total_dealer_count_has_bill}</span>家</span>
                                    <br/>
                                    <span className="label-span">有订单记录家数</span>
                                </div>
                                <div className="col-md-4">
                                    <span className="data-span"><span
                                        className="num">{this.state.data.total_dealer_count_has_payment}</span>家</span>
                                    <br/>
                                    <span className="label-span">有付款记录家数</span>
                                </div>
                            </div>
                        </div>
                        <div className="analytics-chart">
                            <div className="data row">
                                <div className="col-md-6">
                                    <BarChart chartIndex="0" X={['x'].concat(this.state.data.deal_history.date)}
                                              Y={[['订单金额'].concat(this.state.data.deal_history.bill_amount)].concat([['汇款金额'].concat(this.state.data.deal_history.payment_amount)])}
                                              tips="企业历史贸易数据趋势"/>
                                </div>
                                <div className="col-md-6">
                                    <BarChart chartIndex="1"
                                              X={this.state.data.dso_histogram.bucket_boundary}
                                              Y={[['经销商个数'].concat(this.state.data.dso_histogram.dealer_count)]}
                                              tips="经销商平均付款期限分布" isHistogram="true" height="300"/>

                                    {/*<div className="chart-title">经销商平均付款期限分布</div>

                                    <Histogram chartIndex="0" w="600" h="300" arr={this.state.data.dso_histogram.data} xax="label x" yax="label y" buckets="20"/>

                                    */}
                                </div>
                            </div>
                        </div>

                        <button type="button" className="btn btn-primary modify-btn-success"
                                onClick={this.nextClick}>准入设置<span className="glyphicon glyphicon-menu-right"></span>
                        </button>
                    </div>

                </div>

            );
        }
    });

    return Analytics;
})