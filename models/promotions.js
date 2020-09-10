// Mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Load currency type
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const promotionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ""
    },
    price: {
        type: Currency,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

var Promotion = mongoose.model('Promotion', promotionSchema);

module.exports = Promotion;