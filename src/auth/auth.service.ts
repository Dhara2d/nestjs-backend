import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignupDTO } from './dto/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly UserModal: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.UserModal.find({}, { name: 1, email: 1, role: 1 }).exec();
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.UserModal.findOne({ email: email });
    if (!user) {
      throw new UnauthorizedException('Wrong credientials');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong credientials');
    }

    return { userId: user._id, username: user.name, role: user.role };
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user.userId,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      userName: payload.username,
      userId: payload.sub,
      role: payload.role,
    };
  }

  async signup(signupData: SignupDTO) {
    const { email, password, name, role } = signupData;
    const emailAlreadyExist = await this.UserModal.findOne({
      email: email,
    });

    if (emailAlreadyExist) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.UserModal.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return newUser;
  }
}
