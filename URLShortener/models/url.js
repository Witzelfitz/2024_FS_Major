import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import Joi from 'joi';

const urlSchema = new mongoose.Schema({
    originalUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, default: () => nanoid(5) },
    createdAt: { type: Date, default: Date.now },
    validDays: { type: Number, default: 7 },
    deleteAt: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    clicks: { type: Number, default: 0 }
});

function validateUrl(url) {
    const schema = Joi.object({
        originalUrl: Joi.string().uri({ scheme: ['http', 'https'] }).required(),
        honeypotField: Joi.string().allow('').optional(),
        createdAt: Joi.date(),
        deleteAt: Joi.date(),
        validDays: Joi.number(),
        clicks: Joi.number()
    });
    return schema.validate(url);
}




const Url = mongoose.model('Url', urlSchema);

export { Url, validateUrl };
