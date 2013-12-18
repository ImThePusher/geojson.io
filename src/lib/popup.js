module.exports = function(context) {
    return function(e) {
        var sel = d3.select(e.popup._contentNode);

        sel.selectAll('.cancel')
            .on('click', clickClose);

        sel.selectAll('.save')
            .on('click', saveFeature);

        sel.selectAll('.add')
            .on('click', addRow);

        sel.selectAll('.delete-invert')
            .on('click', removeFeature);

        function clickClose() {
            context.map.closePopup(e.popup);
        }

        function removeFeature() {
            if (e.popup._source && context.mapLayer.hasLayer(e.popup._source)) {
                context.mapLayer.removeLayer(e.popup._source);
                context.data.set({map: context.mapLayer.toGeoJSON()}, 'popup');
            }
        }

        function losslessNumber(x) {
            var fl = parseFloat(x);
            if (fl.toString() === x) return fl;
            else return x;
        }

        function saveFeature() {
            var obj = {};
            sel.selectAll('tr').each(collectRow);
            function collectRow() {
                var key = d3.select(this).selectAll('input')[0][0].value,
                    val = losslessNumber(d3.select(this).selectAll('input')[0][1].value);

                if (key && key === 'id') {
                    e.popup._source.feature.id = val;
                } else if (key) {
                    obj[key] = val;
                }
            }
            e.popup._source.feature.properties = obj;
            context.data.set({map: context.mapLayer.toGeoJSON()}, 'popup');
            context.map.closePopup(e.popup);
        }

        function addRow() {
            var tr = sel.select('tbody')
                .append('tr');

            tr.append('th')
                .append('input')
                .attr('type', 'text');

            tr.append('td')
                .append('input')
                .attr('type', 'text');
        }
    };
};
