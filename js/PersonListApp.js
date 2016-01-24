/**
 * PersonListApp.js
 *
 * Allows users to add and remove users from an table.
 */
var PersonListApp = (function() {
    function PLA(options) {
        options = options || {};

        this.tableId = options.tableId || "person-table";
        this.removePersonClass = options.removePersonClass || "remove-person";
        this.persons = [];

        // Bind just makes sure that `refresh` is called
        // with the app as `this`.
        PersonCollection.addListener(refresh.bind(this));
    }

    // Public App API
    PLA.prototype.addPerson = function(name, birthYear) {
        PersonCollection.create(name, birthYear).save();
    }

    PLA.prototype.removePerson = function(id) {
        PersonCollection.findById(id).remove();
    }

    // Private Functions
    function refresh() {
        this.persons = PersonCollection.all();

        // Here we're using bind to make sure `createPersonRow` is always called
        // with `this.removePersonClass` in the first argument position.
        var personRows = this.persons.map(createPersonRow.bind(null, this.removePersonClass));

        setPersonTableRows(this.tableId, personRows);
    }

    function createPersonRow(removePersonClass, person) {
        return(
            "<tr>" +
                "<td>" + person.name + "</td>" +
                "<td>" + person.birthYear+ "</td>" +
                "<td>" +
                    "<input type='button' class='" + removePersonClass +
                        "' value='Remove' personId='" + person.id + "'>" +
                "</td>" +
            "</tr>"
        );
    }

    function setPersonTableRows(tableId, personRows) {
        var tbodySelector = "#" + tableId + " tbody";

        $(tbodySelector).html(personRows.join());
    }

    return PLA;
})();

