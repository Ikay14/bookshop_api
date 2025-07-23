import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";



export type UserDocument = User & Document & {
  sanitize(): Partial<User>;
};

@Schema({ timestamps: true })
export class User extends Document {

  @Prop({ 
      type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
    })
    email: string;

    @Prop({
      type: String,
        minlength: 6,
        select: false, 
    })
    password: string;

    @Prop({
          type: String
     })
    firstName: string

    @Prop({
          type: String
     })
    lastName: string

    @Prop({
          type: String
    })
    picture: string

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Book' }] }) // books authored by this user
    books: Types.ObjectId[];

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] }) // following 
    following: Types.ObjectId[];

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] }) // followers
    followers: Types.ObjectId[];

    

}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.sanitize = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.otp;
  delete obj.otpExpires;
  delete obj.__v;
  delete obj.updatedAt;
  return obj;
  
};
