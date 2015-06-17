define(function (require) {

    var d3 = require('d3');
    var React = require('react');
    var draw = function (id, w, h, arr, buckets, xax, yax) {
        //remove
        d3.select("#" + id + " " + "svg").remove();
        if (!buckets) {
            buckets = 10;
        }
        // A formatter for counts.
        var formatCount = d3.format(",.0f");
        var margin = {top: 10, right: 30, bottom: 40, left: 30},
            width = w - margin.left - margin.right,
            height = h - margin.top - margin.bottom;
        //max
        var max = Number(d3.max(arr)) + 1;
        var x = d3.scale.linear()
            .domain([0, max])
            .range([0, width]);
        var data = d3.layout.histogram()
            .bins(x.ticks(buckets))
        (arr);
        var y = d3.scale.linear()
            .domain([0, d3.max(data, function (d) {
                return d.y;
            })])
            .range([height, 0]);
        var xAxis = d3.svg.axis()
            .scale(x)
            .ticks(buckets)
            .orient("bottom");
        var svg = d3.select("#" + id).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        var bar = svg.selectAll(".bar")
            .data(data)
            .enter().append("g")
            .attr("class", "bar")
            .attr("transform", function (d) {
                return "translate(" + x(d.x) + "," + y(d.y) + ")";
            });
        bar.append("rect")
            .attr("x", 1)
            .attr("width", x(data[0].dx) - 1)
            .attr("height", function (d) {
                return height - y(d.y);
            });
        bar.append("text")
            .attr("dy", ".75em")
            .attr("y", 6)
            .attr("x", x(data[0].dx) / 2)
            .attr("text-anchor", "middle")
            .attr("style", "fill:#fff")
            .text(function (d) {
                return formatCount(d.y);
            });
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        //draw the axis labels
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("class", "black")
            .attr("transform", "translate(" + (width / 2) + "," + (height + 40) + ")")
            .text(xax);
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("class", "black")
            .attr("transform", "translate(" + (-10) + "," + (height / 2) + ")rotate(-90)")
            .text(yax);
    }

    var draw2 = function (id, w, h, values, buckets) {
        //remove
        d3.select("#" + id + " " + "svg").remove();
        if (!buckets) {
            buckets = 20;
        }
        if (!values) {
            values = d3.range(1000).map(d3.random.bates(10));
        }
        w=$("#" + id).outerWidth();
        var formatCount = d3.format(",.0f");
        var margin = {top: 10, right: 30, bottom: 30, left: 30},
            width = w - margin.left - margin.right,
            height = h - margin.top - margin.bottom;
        var x = d3.scale.linear()
            .domain([d3.min(values), d3.max(values)])
            .range([0, width]);
        var data = d3.layout.histogram()
            .bins(x.ticks(buckets))
        (values);
        var y = d3.scale.linear()
            .domain([0, d3.max(data, function (d) {
                return d.y;
            })])
            .range([height, 0]);
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");
        var svg = d3.select("#" + id).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        var bar = svg.selectAll(".bar")
            .data(data)
            .enter().append("g")
            .attr("class", "bar")
            .attr("transform", function (d) {
                return "translate(" + x(d.x) + "," + y(d.y) + ")";
            });
        bar.append("rect")
            .attr("x", 1)
            .attr("width", x(data[0].dx) - 1)
            .attr("height", function (d) {
                return height - y(d.y);
            });
        bar.append("text")
            .attr("dy", ".75em")
            .attr("y", 6)
            .attr("x", x(data[0].dx) / 2)
            .attr("text-anchor", "middle")
            .text(function (d) {
                return formatCount(d.y);
            });
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
    }

    var Histogram = React.createClass({
        componentWillReceiveProps: function (nextProps) {
            var id = 'histogram' + nextProps.chartIndex;
            var w = nextProps.w;
            var h = nextProps.h;
            var arr = nextProps.arr;
            var buckets = nextProps.buckets;
            var xax = nextProps.xax;
            var yax = nextProps.yax;
            //draw(id, w, h, arr.split(","), buckets, xax, yax);
            draw2(id, w, h,arr)
        },
        componentDidMount: function () {
            var id = 'histogram' + this.props.chartIndex;
            var w = this.props.w;
            var h = this.props.h;
            var arr = this.props.arr;
            var buckets = this.props.buckets;
            var xax = this.props.xax;
            var yax = this.props.yax;
            //draw(id, w, h, arr.split(","), buckets, xax, yax);
            draw2(id, w, h,arr)
        },
        render: function () {
            var id = 'histogram' + this.props.chartIndex;
            return (
                <div id={id}>
                </div>
            )
        }
    });


    return Histogram;

    //d3.select("#generate").on("click", function (d) {
    //
    //    var w = d3.select("#width").property("value");
    //    var h = d3.select("#height").property("value");
    //
    //    var xax = d3.select("#xax").property("value");
    //    var yax = d3.select("#yax").property("value");
    //
    //    var arr = d3.select("#numbers").property("value").split(",");
    //    var buckets = d3.select("#buckets").property("value");
    //
    //    draw(w, h, arr, buckets, xax, yax);
    //});


});