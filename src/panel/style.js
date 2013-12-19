var fs = require('fs');

module.exports = function(context) {

    /*
        TODO:
        - on focus, get actual feature data object, not a clone, so we can change it directly
        - get initially selected layer
        - autocomplete style property names
        - helpers for style value types (color picker, ...)

        - named styles that can be applied to multiple features

        - dynamic styles based on feature properties/geometry
    */
    function render(selection) {
        var feature = undefined;

        function rerender() {
            var table = selection
                .html('')
                .append('div')
                    .attr('class', 'pad2 prose')
                    .append('table')
                        .append('tbody');

            var rows = table.selectAll("tr")
                .data(styles());

            rows.enter().append("tr");
            rows.exit().remove();
            rows.html(displayStyle);
            rows.on("change", function(style) {
                var e = d3.event,
                    geojson = context.data.get('map'),
                    styles = geojson.features[0].style; // FIXME: get real feature

                if (e.target.name === 'key') {
                    delete styles[style.key];
                    styles[e.target.value] = style.value
                } else {
                    styles[style.key] = e.target.value;
                }

                context.data.set('map', geojson);
            })
        }

        context.dispatch.on('focus', function(f) {
            feature = f;
            rerender();
        });
        context.dispatch.on('blur', function() {
            feature = undefined;
            rerender();
        });

        rerender();

        function styles() {
            return feature ? d3.entries(feature.style).concat({}) : [];
        }

        function displayStyle(s) {
            return '<tr><th><input name="key" value="'+ (s.key || "") + '" /></th>' +
                '<td><input name="value" value="' + (s.value || "") + '" /></td></tr>';
        }
    }

    render.off = function() {
    };

    return render;
};
