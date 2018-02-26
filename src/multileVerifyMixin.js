export default (app) => {
    app.verifyFields = (fields, cb) => {
        var result = {
            result: true,
            message: {}
        };
        var values = {};
        var count = 0;
        if (!fields.length) {
            return cb(result);
        }
        var called = {};
        fields.forEach( (field, i) => {
            field.verify(null, ret => {
                // the cb may be called more than once unintentional 
                // in the pattern of rule, which will cause the called
                // number of the callback incresing. so, we flag them if
                // the callback has already called.
                if (called[i] !== true) {
                    count++;
                    called[i] = true;
                } 
                result.message[ret.name] = ret;
                values[ret.name] = ret.value;
                if (ret.result === false) {
                    result.result = false;
                }
                if (count === fields.length) {
                    if (result.result === true) {
                        result.values = values;
                    }
                    cb(result);
                }
            })
        })
    }
}
