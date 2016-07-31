//## Moment.JS Holiday Plugin
//
//Usage:
//  Call .holiday() from any moment object. If date is a US Federal Holiday, name of the holiday will be returned.
//  Otherwise, return nothing.
//
//  Example:
//    `moment('12/25/2013').holiday()` will return "Christmas Day"
//
//Holidays:
//  You can configure holiday bellow. The 'M' stands for Month and represents fixed day holidays.
//  The 'W' stands for Week, and represents holidays with date based on week day rules.
//  Example: '10/2/1' Columbus Day (Second monday of october).
//
//License:
//  Copyright (c) 2013 [Jr. Hames](http://jrham.es) under [MIT License](http://opensource.org/licenses/MIT)
(function () {
    var moment;

    moment = typeof require !== "undefined" && require !== null ? require("moment") : this.moment;

    //Holiday definitions
    var _holidays = {
        'M': {//Month, Day
            '01/01': { holiday: 'new year', greeting: "<i class='fa fa-calendar-times-o text-danger'></i> Happy New Year <i class='fa fa-calendar-check-o text-success'></i>" },
            '07/12': { holiday: 'independence day', greeting: 'Happy Independence Day!' },
            '02/14': { holiday: 'valentine\'s day', greeting: "<i class='fa fa-heart text-danger'></i> Happy Valentine\'s Day <i class='fa fa-heart text-danger'></i>" },
        },
        'W': {//Month, Week of Month, Day of Week
          
        },
        'S': [
            {from: '12/01', to: '12/31', holiday: 'christmas', greeting: "<i class='fa fa-tree text-success'></i> Merry Christmas <i class='fa fa-tree text-success'></i>"},
            {from: '01/01', to: '01/07', holiday: 'New Year', greeting: "Happy New Year"},
        ]


    };

    moment.fn.holidayRange = function () {
        var m = this;
        var h = false;
        
        $.each(_holidays.S, function (i, r) {
            var f = moment(r.from, "MM/DD");
            var t = moment(r.to, "MM/DD");
            var range = moment().range(f, t);

            if (range.contains(moment(m._i, m._f))) {
                h = r;
                this.break;
            }
        });
        return h;
    };

    moment.fn.holiday = function () {

        var diff = 1 + (0 | (this._d.getDate() - 1) / 7),
                memorial = (this._d.getDay() === 1 && (this._d.getDate() + 7) > 30) ? "5" : null;

        return (_holidays['M'][this.format('MM/DD')] || _holidays['W'][this.format('M/' + (memorial || diff) + '/d')]);
    };

    if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
        module.exports = moment;
    }

}(this));