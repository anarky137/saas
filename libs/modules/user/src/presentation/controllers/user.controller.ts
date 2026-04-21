import { Controller, Get, Param } from '@nestjs/common';
import type { UserService } from '../../application/handlers/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<unknown> {
    const user = await this.userService.getUserById({ id });
    if (!user) {
      return { error: 'User not found' };
    }
    return {
      id: user.id,
      accountId: user.accountId,
      email: user.email,
      displayName: user.displayName,
      status: user.status,
    };
  }
}
