import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId, Types } from "mongoose";

@Schema({ timestamps: true })
export class Book {


    @Prop({ type: String }) 
    author: string

    @Prop({
        type: String,
        required: true,
        trim: true,
        index:true
    })
    title:string

    @Prop()
    price: number

    
    @Prop()
    genre: string

    @Prop()
    review: string

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Comments' }] }) // Comments on the book
    comments: Types.ObjectId[];

    @Prop({
        minlength: 10,
        maxlength: 150
    })
    bio: string

    @Prop()
    publisher: string

}

export const BookSchema = SchemaFactory.createForClass(Book)