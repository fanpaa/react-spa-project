define(['react', 'reactTable'], function (React, ReactTable) {
    var ReactTable = React.createClass({displayName: "ReactTable",
        render: function () {
            var Table=ReactTable.Table;
            return (
                React.createElement(Table, {className: "table", data: this.props.data}
                )
            )
        }
    });

    return ReactTable;
})