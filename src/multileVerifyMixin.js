export default (app) => {
    app.verifyFields = (fields, cb) => {
        var result = {result: true};
        var count = 0;
        if (!fields.length) {
            return cb(result);
        }
        fields.forEach( field => {
            field.verify(null, ret => {
                count++;
                result[ret.name] = ret;
                if (ret.result === false) {
                    result.result = false;
                }
                if (count === fields.length) {
                    cb(result);
                }
            })
        })
    }
}





