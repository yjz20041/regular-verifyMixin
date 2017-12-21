import {createRuleMap, bindVerifications, _verifyRules} from './util'
export default (instance) => {
    console.log(instance)
    var self = instance;
    var verifyRules = self.data.verifyRules || [];
    var verifyName = self.data.verifyName;
    var verifyCallback = self.data.verifyCallback || function (){};
    var verifyRuleMap = createRuleMap(verifyRules);

    bindVerifications(self, verifyRuleMap, verifyName, verifyCallback);

    self.verify = (type, cb) => {
        var rules = type ? verifyRuleMap[type] : verifyRules;
        var cb2 = (ret) => {
            verifyCallback(ret);
            cb(ret);
        }
        if (!verifyRules.length) {
            cb2({
                name: verifyName,
                value: self.getValue(),
                result: true
            });
        } else {
            _verifyRules(rules, self.getValue(),
                0, verifyName, cb2);
        }
    }

}





