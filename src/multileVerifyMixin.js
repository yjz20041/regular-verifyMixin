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
        fields.forEach( field => {
            field.verify(null, ret => {
                count++;
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





