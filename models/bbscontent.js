var mongoose = require('mongoose')
var Schema = mongoose.Schema

var BbsContentSchema = new Schema({
    reg_time: {type: String},
    target_url: {type: String},
    addr: {type: String},
    keyword: {type: String},
    author: {type: String},
    title: {type: String},
    key_level: {type: Number},
    attent_vehicle: {type: String},
    content: {type: String},
    pub_time: {type: Date},
    author_url: {type: String},
    from_url: {type: String},
    floor: {type: String}
}, {collection: 'bbs_contents'})

BbsContentSchema.index({pub_time: -1})
BbsContentSchema.index({addr:1, pub_time:-1})

mongoose.model('BbsContent', BbsContentSchema)
