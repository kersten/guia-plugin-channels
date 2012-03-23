var ChannelsView = Backbone.View.extend({
    template: 'ChannelsTemplate',

    events: {
        'click .dropdown-menu > li > a': 'changeChannel'
    },

    initialize: function () {
        "use strict";

        var _this = this;

        this.collection = new ChannelCollection();

        this.collection.fetch({
            data: {
                active: true
            }, success: function (collection) {
                if (_this.options.channel !== undefined) {
                    _this.model = collection.get(_this.options.channel);
                } else {
                    _this.model = collection.models[0];
                }

                var template = _.template($('#' + _this.template).html(), {channels: collection, model: _this.model});
                $(_this.el).html(template);

                var top = $('.page-header').offset().top - 40 - 18;
                var floating = false;

                _this.getEpg();
            }
        });
    },

    changeChannel: function (ev) {
        "use strict";

        ev.preventDefault();

        if (this.model !== undefined && this.model.get('_id') === $(ev.currentTarget).data('_id')) {
            return;
        }

        this.model = this.collection.get($(ev.currentTarget).data('_id'));

        $('.dropdown-toggle', this.el).html('<img src="/logo/' + this.model.get('name') + '" style="height: 10px;" /> ' + this.model.get('name') + '<span class="caret"></span>');
        $('.page-header > h1 > small').html(this.model.get('name'));

        Backbone.history.navigate($(ev.currentTarget).attr('href'));

        this.getEpg();
    },

    getEpg: function () {
        "use strict";

        if (this.epgView !== undefined) {
            this.epgView.remove();
        }

        this.epgView = new ChannelsEpgView({
            model: this.model
        });

        $('.row', this.el).html(this.epgView.render().el);
    },

    render: function () {
        "use strict";

        return this;
    }
});