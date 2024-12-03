import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDTO } from './dto/signup.dto';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/roles.enum';
import { AuthRolesGuard } from 'src/roles/roles.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('users')
  @Roles(Role.ADMIN)
  @UseGuards(AuthRolesGuard)
  getAllUsers() {
    return this.authService.getAllUsers();
  }

  @Post('signup')
  async signup(@Body() signupData: SignupDTO) {
    return this.authService.signup(signupData);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      return { message: 'Invalid credentials' };
    }
    return this.authService.login(user);
  }
}
