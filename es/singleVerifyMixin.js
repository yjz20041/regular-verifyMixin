import { createRuleMap, bindVerifications, _verifyRules, wrapCallbackWithVerifyMessage } from './util';
export default (function (instance) {
  var self = instance;
  var verifyName = self.data.verifyName;

  var verifyCallback = self.data.verifyCallback || function () {};

  var verifyRuleMap = {};
  var bind = bindVerifications();
  self.$watch('verifyRules', function (verifyRules) {
    verifyRuleMap = createRuleMap(verifyRules);
    bind(self, verifyRuleMap, verifyName, verifyCallback);
  });

  self.verify = function (type, cb) {
    var rules = type ? verifyRuleMap[type] : self.data.verifyRules;
    rules = rules || [];
    cb = wrapCallbackWithVerifyMessage(self, cb);

    var cb2 = function cb2(ret) {
      verifyCallback(ret);
      cb(ret);
    };

    if (!rules.length) {
      cb2({
        name: verifyName,
        value: self.getValue(),
        result: true
      });
    } else {
      _verifyRules(rules, self.getValue(), 0, verifyName, cb2);
    }
  };
});