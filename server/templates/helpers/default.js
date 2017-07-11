module.exports = function(options) {
    if (!this._switch_break_) {
        return options.fn(this);
    }
};
