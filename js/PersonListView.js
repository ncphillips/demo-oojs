/**
 * PersonListView.js
 *
 * Listens for changes to a Person collection and updates the DOM accordingly.
 */
var PersonListView = (function() {
    /**
     * Private Static Variables
     */
    var defaults = {
        fields: ['name', 'birthYear', 'removeButton'],
        tableId: "person-table",
        removePersonClass: "remove-person"
    };

    /**
     * Constructor
     */
    function PersonListView(collection, options) {
        options = options || {};

        this.persons = [];
        this.fields = options.fields || defaults.fields;
        this.tableId = options.tableId || defaults.tableId;
        this.removePersonClass = options.removePersonClass || defaults.removePersonClass;
        this.collection = collection;

        this.collection.addListener(this.refresh.bind(this));
    }

    /**
     * Public Methods
     */ 
    PersonListView.prototype.refresh = function() {
        this.persons = this.collection.all();

        var personRows = this.persons.map(createPersonRow, this);

        createPersonTable(this.tableId, personRows);
    };

    /**
     * Private Functions (Requires Binding)
     */ 
    function createPersonRow(person) {
        var columns = this.fields.map(createPersonColumn.bind(this, person));

        return "<tr>" + columns.join() +"</tr>";
    }

    function createPersonColumn(person, field){
        if(field === 'removeButton'){
            return createRemoveButton(person, this.removePersonClass);
        }

        return "<td>" + person[field] + "</td>";
    }

    /**
     * Private Static Functions (No Binding)
     */
    function createRemoveButton(person, removePersonClass) {
         return "<td><input type='button' class='" + removePersonClass +
                    "' value='Remove' personId='" + person.id + "'></td>";
    }

    function createPersonTable(tableId, personRows) {
        var tbodySelector = "#" + tableId + " tbody";

        $(tbodySelector).html(personRows.join());
    }

    /**
     * Module Definition
     */
    return PersonListView;
})();

