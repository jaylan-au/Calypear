export default {
  install: function (Vue, options) {
    // 1. add global method or property
    Vue.$log = function () {
      console.log(arguments);
    }
  }
}
