define(['d3'], function (d3) {
    var case_name = localStorage.getItem('case_name') || '/new';
    return {
        REST: 'http://cannot.tell.you:8880',
        GlobalFileName: '',
        GlobalCompanyName: '',
        API: '/api2',
        CaseName: case_name,
        formatW: function (x) {
            if (x && x!="NA") {
                return d3.round(parseInt(x) / 10000);
            } else {
                return '--'
            }
        },
        formatWC: function (x) {
            if (x && x!="NA") {
                var data = d3.round(parseInt(x) / 10000);
                return d3.format(',')(data)
            } else {
                return '--'
            }
        },
        formatComma: function (x) {
            if (x && x!="NA") {
                var comma = d3.format(',');
                return comma(x);
            } else {
                return '--'
            }
        },
        formatRound: function (x) {
            if (x && x!="NA") {
                return d3.round(x, 0);

            } else {
                return '--'
            }
        }
    };
});