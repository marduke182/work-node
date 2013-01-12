
/*
 * GET home page.
 */
var mongoose = require('mongoose');
var crypto = require('crypto');




function validatePresenceOf(value) {
    return value && value.length;
}

var Schema = mongoose.Schema
, ObjectId = Schema.ObjectId;

var CookieSchema = new Schema({
    cookie: {
        type: String
    },
    created: {
        type: Date
    }
});

var UserSchema = new Schema({
    name: {
        type: String, 
        index: {
            unique: true
        }
    },
    login: {
        type: String
    },
    hashed_password: {
        type: String
    },
    salt: {
        type: String
    },
    redmineKey: {
        type: String
    },
    img: {
        type: String
    },
    sessions: {
        type: [CookieSchema]
    }
});

UserSchema.virtual('id')
    .get(function() {
        return this._id.toHexString();
    });

UserSchema.virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

UserSchema.method('authenticate', function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
});

UserSchema.method('makeSalt', function() {
    return Math.round((new Date().valueOf() * Math.random())) + '';
});

UserSchema.method('encryptPassword', function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
});

UserSchema.pre('save', function(next) {
    if (!validatePresenceOf(this.password)) {
        next(new Error('Invalid password'));
    } else {
        next();
    }
});


var ProjectSchema = new Schema({
    name: {
        type: String
    },
    idRedmine: {
        type: String
    }
});

var ActivitySchema = new Schema({
    name: {
        type: String
    },
    idProyect: {
        type: String
    },
    idRedmine: {
        type: String
    }
});

var TimeSchema = new Schema({
    name: {
        type: String
    },        
    idProyect: {
        type: String
    },
    idActivity: {
        type: String
    }
});

mongoose.model('User', UserSchema);
mongoose.model('Proyect', ProjectSchema);
mongoose.model('Activity', ActivitySchema);
mongoose.model('Time', TimeSchema);


var serverDb = mongoose.createConnection("127.0.0.1","redmine", 27017, function(err) {
    if(err instanceof Error) {
        console.log("Ocurrio un error.");
    }
});


var User = serverDb.model('User');
var Project = serverDb.model('Proyect');
var Activity = serverDb.model('Activity');
var Time = serverDb.model('Time');

exports.user = User;
exports.project = Project;
exports.activity = Activity;
exports.time = Time;
exports.db = serverDb;