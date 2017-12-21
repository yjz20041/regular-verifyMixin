const assertRule = (rule) => {
    if (typeof rule.trigger !== 'string' || !rule.trigger) {
        throw new Error('the trigger of the rule must be present')
    }
}
export const createRuleMap = rules => {
    var ret = {};
    rules.forEach( rule => {
        assertRule(rule);
        if (rule.trigger && typeof rule.trigger === 'string') {
            rule.trigger.split(',').forEach(triggerType => {
                ret[triggerType] = ret[triggerType] || [];
                ret[triggerType].push({
                    pattern: rule.pattern,
                    message: rule.message
                });
            })
        }
    });
    return ret;
}

export const bindVerifications = (self, ruleMap, verifyName, cb) => {
    Object.keys(ruleMap).forEach(triggerType => {
        self.$on(triggerType, (function(type) {
            return function () {
                var typeRules = ruleMap[type];
                var value = self.getValue();
                if (typeRules.length) {
                    _verifyRules(typeRules, value, 0,
                        verifyName, cb);
                }
            }
          
        })(triggerType))
    })
}


export const _verifyRules = (rules, value, order, name, cb) => {

    var rule = rules[order];
    var message = rule.message;

    _verifyRule(rule, value, ret => {
        if (ret === true) {
            if (order + 1 >= rules.length) {
                cb({
                    name,
                    value,
                    result: true
                })
            } else {
                _verifyRules(rules, value, order + 1, name, cb);
            }
        } else {
            cb({
                name,
                value,
                result: false,
                message: typeof ret === 'string' ? ret : message
            })
        }
    })

}

export const _verifyRule = (rule, value, cb) => {
    var pattern = rule.pattern;
    if (pattern instanceof RegExp) {
        cb(pattern.test(value));
    } else if (typeof pattern === 'function') {
        pattern(value, ret => {
            cb(ret);
        })
    }
}