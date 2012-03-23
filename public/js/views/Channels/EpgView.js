var ChannelsEpgView = Backbone.View.extend({
    template: 'ChannelsEpgTemplate',
    page: 1,

    events: {
        'click .getMoreEvents': 'loadEvents'
    },

    initialize: function () {
        "use strict";

        var template = _.template($('#' + this.template).html());
        $(this.el).html(template);

        this.collection = new EventCollection();
        this.collection.url = 'EventCollection:getEpg';

        this.loadEvents();
    },

    loadEvents: function () {
        "use strict";

        var _this = this;

        this.collection.fetch({data: {_id: this.model.get('_id'), page: this.page}, success: function (events) {
            _.each(events.models, function (model) {
                var date = new XDate(model.get('start') * 1000);

                if (_this.currentDay === undefined || _this.currentDay != date.toString('dd.MM.yyyy')) {
                    if (_this.currentDay !== undefined) {
                        $('.events', _this.el).append('<div class="span12"><hr /><h4>' + $.t('day.' + date.toString('dddd')) + date.toString(' - dd.MM.yyyy') + '</h4><hr /></div>');
                    } else {
                        $('.events', _this.el).append('<div class="span12"><h4>' + $.t('day.' + date.toString('dddd')) + date.toString(' - dd.MM.yyyy') + '</h4><hr /></div>');
                    }
                }

                _this.currentDay = date.toString('dd.MM.yyyy');

                var view = new ChannelsEpgEntryView({
                    model: model
                });

                $('.events', _this.el).append(view.render().el);
            });
        }});

        this.page++;
    },

    render: function () {
        return this;
    }
});