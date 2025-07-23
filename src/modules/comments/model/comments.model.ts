import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({ timestamps: true })
export class Comments {

        @Prop({
            type: String,
            maxlength: 39
        })
        content: string

       @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] }) // user
        user: Types.ObjectId[]

       @Prop({ type: [{ type: Types.ObjectId, ref: 'Book' }] }) // book
        book: Types.ObjectId[]; 
}

export const commentSchema = SchemaFactory.createForClass(Comments) 