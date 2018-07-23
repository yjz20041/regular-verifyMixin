# regular-verifyMixin


### 功能
就像使regular组件轻松拥有校验功能。

#


### 安装

目前只支持npm： npm install --save regular-verifyMixin

#


### 最佳实践

```js
  import {singleVerifyMixin} from 'regular-verifymixin';
  
  Regular.extend({
    name: 'VerifiedComponent',
    config () {
      singleVerifyMixin(this);
    },
    
    getValue () {
      return this.data._value
    }
  
  })
```

#
