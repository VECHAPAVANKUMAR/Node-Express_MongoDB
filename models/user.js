var mongoos = require('mongoose');
var Schema = mongoos.Schema;

let userSchema = new Schema(
  {
    username : {
      type : String,
      required : true,
      unique : true
    },
    password : {
      type : String,
      required : true
    },
    admin : {
      type : Boolean,
      default : false
    }
  }
)

let Users = mongoos.model('user', userSchema)
module.exports = Users;
