import _Object$keys from "@babel/runtime-corejs2/core-js/object/keys";

var assertRule = function assertRule(rule) {
  if (typeof rule.trigger !== 'string' || !rule.trigger) {
    throw new Error('the trigger of the rule must be present');
  }
};

var presetRule = {
  require: function require(value, cb) {
    cb(!(value === undefined || value === '' || // eslint-disable-next-line use-isnan
    value === NaN || value === null));
  },
  number: /^\d+$/,
  float: /^\d+(.\d)?\d*$/,
  url: /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?/,
  phone: /^\d{11}$/,
  email: /^[a-z]([a-z0-9]*[-_]?[a-z0-9]+)*@([a-z0-9]*[-_]?[a-z0-9]+)+[.][a-z]{2,3}([.][a-z]{2})?$/i
};
export var createRuleMap = function createRuleMap(rules) {
  var ret = {};
  rules.forEach(function (rule) {
    assertRule(rule);

    if (rule.trigger && typeof rule.trigger === 'string') {
      rule.trigger.split(',').forEach(function (triggerType) {
        ret[triggerType] = ret[triggerType] || [];
        ret[triggerType].push({
          pattern: rule.pattern,
          message: rule.message
        });
      });
    }
  });
  return ret;
};
export var wrapCallbackWithVerifyMessage = function wrapCallbackWithVerifyMessage(self, cb) {
  return function (ret) {
    if (ret.result === false) {
      self.verifyMessage = ret.message;
    } else {
      delete self.verifyMessage;
    }

    self.$update();

    if (typeof cb === 'function') {
      cb(ret);
    }
  };
};
export var bindVerifications = function bindVerifications(self, ruleMap, verifyName, cb) {
  cb = wrapCallbackWithVerifyMessage(self, cb);

  _Object$keys(ruleMap).forEach(function (triggerType) {
    self.$on(triggerType, function (type) {
      return function () {
        var typeRules = ruleMap[type];
        var value = self.getValue();

        if (typeRules.length) {
          _verifyRules(typeRules, value, 0, verifyName, cb);
        }
      };
    }(triggerType));
  });
};
export var _verifyRules = function _verifyRules(rules, value, order, name, cb) {
  var rule = rules[order];
  var message = rule.message;

  _verifyRule(rule, value, function (ret) {
    if (ret === true) {
      if (order + 1 >= rules.length) {
        cb({
          name: name,
          value: value,
          result: true
        });
      } else {
        _verifyRules(rules, value, order + 1, name, cb);
      }
    } else {
      cb({
        name: name,
        value: value,
        result: false,
        message: typeof ret === 'string' ? ret : message
      });
    }
  });
};
export var _verifyRule = function _verifyRule(rule, value, cb) {
  var pattern = rule.pattern;

  if (typeof pattern === 'string') {
    if (presetRule[pattern]) {
      pattern = presetRule[pattern];
    } else {
      throw new Error("the pattern of the rule should be \n            one of the RegExp \u3001 function and string including \n            'require/number/float/email/phone/url'");
    }
  }

  if (pattern instanceof RegExp) {
    cb(pattern.test(value));
  } else if (typeof pattern === 'function') {
    pattern(value, function (ret) {
      cb(ret);
    });
  }
};