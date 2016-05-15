/**
 * PersonListView.js
 *
 * Listens for changes to a Person collection and updates the DOM accordingly.
 */
var PersonListView = (function() {
    var defaults = {
        fields: ['name', 'birthYear', 'removeButton'],
        tableId: "person-table",
        removePersonClass: "remove-person"
    };

    function PersonListView(collection, options) {
        options = options || {};

        this.persons = [];
        this.fields = options.fields || defaults.fields;
        this.tableId = options.tableId || defaults.tableId;
        this.removePersonClass = options.removePersonClass || defaults.removePersonClass;

        collection.addListener(refresh.bind(this));
    }

    /**
     * Methods
     */ 
    PersonListView.prototype.refresh = function() {
        this.persons = PersonCollection.all();

        var personRows = this.persons.map(createPersonRow, this);

        setPersonTableRows(this.tableId, personRows);
    };

    /**
     * Private Functions
     */ 
    function createPersonRow(person) {
        var columns = this.fields.map(createPersonColumn.bind(this, person));
        return "<tr>" + columns.join() +"</tr>";
    }

    function createPersonColumn(person, field) {
        if (field === 'removeButton')
            return createRemoveButton(person, this.removePersonClass);

        return "<td>" + person[field] + "</td>";
    }
    
    function createRemoveButton(person, removePersonClass) {
         return "<td><input type='button' class='" + removePersonClass +
                    "' value='Remove' personId='" + person.id + "'></td>";
    }

    function setPersonTableRows(tableId, personRows) {
        var tbodySelector = "#" + tableId + " tbody";

        $(tbodySelector).html(personRows.join());
    }

    return PersonListView;
})();

