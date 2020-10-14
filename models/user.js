var mongoos = require('mongoose');
var Schema = mongoos.Schema;
// passport-local is used for Basic Authentication
// Because of using passport-local-mongoose plugin
// it will provide some methods for signup and login
var passportLocalMongoose = require('passport-local-mongoose');

let userSchema = new Schema(
  {
    admin : {
      type : Boolean,
      default : false
    }
  }
)

// we can remove username and password from userSchema
// because passport-local-mongoose plugin will support
// for username and hashed storage of password
userSchema.plugin(passportLocalMongoose);

let Users = mongoos.model('user', userSchema)
module.exports = Users;
