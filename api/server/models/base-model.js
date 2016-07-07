var loopback = require('loopback');

module.exports = function(BaseModel) {

  BaseModel.observe('before save', function (ctx, next) {

    var loopbackCtx = loopback.getCurrentContext();
    var accessToken = loopbackCtx && loopbackCtx.get('accessToken');
    var userId = accessToken && accessToken.userId.toString();
    userId = userId || "System";


    if (ctx.instance) {
      ctx.instance.createdOn =new Date();
      if(userId) {
        ctx.instance.createdBy = userId;
        ctx.instance.lastUpdatedBy = userId;
      }
        ctx.instance.lastUpdatedOn =new Date();
    }
    else {
      ctx.data.lastUpdatedOn =new Date();
      if(userId)
        ctx.data.lastUpdatedBy = userId;
    }

    next();
  });


};
