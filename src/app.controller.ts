import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './common/guards/roles.guard';
import { UserRole } from './common/enums/user-role.enum';
import { Roles } from './common/decorators/roles.decorator';
import { AuthUser } from './common/decorators/user.decorator';

@Controller()
export class AppController {
  // @Get('movies')
  // @UseGuards(AuthGuard())
  // root(@AuthUser() authenticatedUser) {
  //   return {
  //     movies: [
  //       {
  //         name: 'Star Wars: Episode IV',
  //         year: 1977,
  //         genre: 'Space-Opera',
  //         image: 'http://localhost:3000/static/2.jpg',
  //       },
  //       {
  //         name: 'Alien',
  //         year: 1979,
  //         genre: 'Sci-Fi',
  //         image: 'http://localhost:3000/static/1.jpg',
  //       },
  //       {
  //         name: 'Flash Gordon',
  //         year: 1980,
  //         genre: 'Superhero',
  //         image: 'http://localhost:3000/static/3.jpg',
  //       },
  //     ],
  //   };
  // }

  // @Get('/admin')
  // @Roles(UserRole.Admin)
  // @UseGuards(AuthGuard(), RolesGuard)
  // admin(@AuthUser() authenticatedUser) {
  //   return {
  //     data: `Yay, you are an admin!`,
  //   };
  // }
}
