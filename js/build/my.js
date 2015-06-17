define(['js/build/configuration', 'react', 'reactRouter', 'js/build/loading'], function (Configuration, React, ReactRouter, Loading) {
    var My = React.createClass({displayName: "My",
        mixins: [ReactRouter.Navigation, ReactRouter.State],
        getInitialState: function () {
            return {
                data: null,
                loading: true
            }
        },
        counter: 0,
        sum: 0,
        tempData: null,
        hideLoading: function () {
            this.setState({loading: false})
        },
        inputClick: function () {
            this.transitionTo('home');
        },
        handleClick: function (case_name) {
            Configuration.CaseName = '/' + case_name;
            localStorage.setItem('case_name', Configuration.CaseName);
            this.getOpen_case(function () {
                this.transitionTo('analyticsResults');
            }.bind(this));
        },
        componentDidMount: function () {
            this.getCase();
        },
        getCase: function () {
            var _this = this;
            $.ajax({
                url: Configuration.REST + Configuration.API + '/get_cases',
                method: 'GET',
                contentType: 'text/plain',
                dataType: 'json'
            }).done(function (data) {
                //this.setState({data: data});
                //this.hideLoading();
                _this.tempData = data;
                _this.sum = data.case_list.length;
                $.each(data.case_list, function (index, item) {
                    _this.getAnalysis_summary(item.case_name);
                })
            }.bind(this));
        },

        getOpen_case: function (callback) {
            $.ajax({
                url: Configuration.REST + Configuration.API + Configuration.CaseName + '/open_case',
                method: 'GET',
                contentType: 'text/plain',
                dataType: 'json'
            }).done(function (res) {
                callback();
            });
        },
        getAnalysis_summary: function (CaseName) {
            var _this = this;
            $.ajax({
                url: Configuration.REST + Configuration.API + '/' + CaseName + '/analysis_summary',
                method: 'GET',
                contentType: 'text/plain',
                dataType: "json"
            }).done(function (data) {
                $.each(_this.tempData.case_list, function (index, item) {
                    if (item.case_name === CaseName) {
                        _this.tempData.case_list[index].total_expected_sale = data.total_expected_sale;
                        _this.tempData.case_list[index].total_credit_line = data.total_credit_line;
                        _this.tempData.case_list[index].ave_credit_account = data.ave_credit_account;
                        _this.tempData.case_list[index].total_dealers = data.total_dealer_count;
                        return false;
                    }
                })

                this.counter++;
                if (this.counter === this.sum) {
                    this.setState({data: this.tempData});
                    this.hideLoading();
                }
            }.bind(this));
        },
        render: function () {

            if (this.state.loading) {
                return (React.createElement(Loading, null))
            }

            return (
                React.createElement("div", null, 
                    React.createElement("div", {className: "my-header"}, 
                        React.createElement("span", null, "我的分析"), 

                        React.createElement("div", {className: "form-div"}, 
                            React.createElement("form", {className: "form-inline"}, 
                                React.createElement("button", {type: "button", className: "btn btn-primary", 
                                        onClick: this.inputClick}, 
                                    "新建分析"
                                )
                            )
                        )
                    ), 
                    React.createElement("div", {className: "my-table"}, 
                        React.createElement("table", {className: "table table-striped table-hover "}, 
                            React.createElement("thead", null, 
                            React.createElement("tr", null, 
                                React.createElement("th", null, "方案名"), 
                                React.createElement("th", {className: "tR tR-padding"}, "总支持销售规模（万）"), 
                                React.createElement("th", {className: "tR tR-padding"}, "总额度（万）"), 
                                React.createElement("th", {className: "tR tR-padding"}, "平均授信账期"), 
                                React.createElement("th", {className: "tR tR-padding"}, "总企业数")

                            )
                            ), 
                            React.createElement("tbody", null, 

                            this.state.data.case_list.map(function (item, i) {
                                return (
                                    React.createElement("tr", {className: "my-pointer", onClick: this.handleClick.bind(this,item.case_name)}, 
                                        React.createElement("td", null, item.name), 
                                        React.createElement("td", {className: "tR"}, Configuration.formatWC(item.total_expected_sale)), 
                                        React.createElement("td", {className: "tR"}, Configuration.formatWC(item.total_credit_line)), 
                                        React.createElement("td", {className: "tR"}, Configuration.formatRound(item.ave_credit_account)), 
                                        React.createElement("td", {className: "tR"}, item.total_dealers)
                                    )
                                );
                            }, this)

                            )
                        )
                    )

                )
            );
        }
    });

    return My;
})