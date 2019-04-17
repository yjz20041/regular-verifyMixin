"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _util = require("./util");

var _default = function _default(instance) {
  var self = instance;
  var verifyRules = self.data.verifyRules || [];
  var verifyName = self.data.verifyName;

  var verifyCallback = self.data.verifyCallback || function () {};

  var verifyRuleMap = (0, _util.createRuleMap)(verifyRules);
  (0, _util.bindVerifications)(self, verifyRuleMap, verifyName, verifyCallback);

  self.verify = function (type, cb) {
    var rules = type ? verifyRuleMap[type] : verifyRules;
    cb = (0, _util.wrapCallbackWithVerifyMessage)(self, cb);

    var cb2 = function cb2(ret) {
      verifyCallback(ret);
      cb(ret);
    };

    if (!verifyRules.length) {
      cb2({
        name: verifyName,
        value: self.getValue(),
        result: true
      });
    } else {
      (0, _util._verifyRules)(rules, self.getValue(), 0, verifyName, cb2);
    }
  };
};

exports.default = _default;