/**
 * PersonListApp.js
 *
 * Allows users to add and remove users from an table.
 */
var PersonListView = (function() {
    var defaults = {
        fields: ['name', 'birthYear', 'removeButton'],
        tableId: "person-table",
        removePersonClass: "remove-person"
    };

    function PersonListView(options) {
        options = options || {};

        this.persons = [];
        this.fields = options.fields || defaults.fields;
        this.tableId = options.tableId || defaults.tableId;
        this.removePersonClass = options.removePersonClass || defaults.removePersonClass;

        // Bind just makes sure that `refresh` is called
        // with the app as `this`.
        PersonCollection.addListener(refresh.bind(this));
    }

    PersonListView.prototype.refresh = refresh;

    // Private Functions
    function refresh() {
        this.persons = PersonCollection.all();

        // Here we're using bind to make sure `createPersonRow` is always called
        // with `this.removePersonClass` in the first argument position.
        var personRows = this.persons.map(createPersonRow.bind(this));

        setPersonTableRows(this.tableId, personRows);
    }

    function createPersonRow(person) {
        var columns = this.fields.map(createPersonColumn.bind(this, person));
        return "<tr>" + columns.join() +"</tr>";
    }

    function createPersonColumn(person, field) {
        if (field === 'removeButton')
            return "<td><input type='button' class='" + this.removePersonClass +
                    "' value='Remove' personId='" + person.id + "'></td>";

        return "<td>" + person[field] + "</td>";
    }

    function setPersonTableRows(tableId, personRows) {
        var tbodySelector = "#" + tableId + " tbody";

        $(tbodySelector).html(personRows.join());
    }

    return PersonListView;
})();

