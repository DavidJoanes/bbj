function title(str) {
    return str.replace(/(^|\s)\S/g, function(t) { return t.toUpperCase() });
}

module.exports = title