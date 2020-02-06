An JWT based authentication module for a nestjs application.

## Configuration
```typescript
import { getTokenByBearerHeader, getTokenByCookie, JwtModule } from '@nestjs-mods/jwt';

@Module({
  imports: [
    JwtModule.forRoot({
      jwtSecret: 'super-secret-phrase',
      defaultJwtSignOptions: {
        expiresIn: '7 days',
        algorithm: 'HS512',
      },
      tokenExtractors: [
        getTokenByCookie('user'),         // first try to extract a token from the cookie
        getTokenByBearerHeader,           // then try to extract the token by a bearer header
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

```

### Extractors
**extractTokenByCookie(cookieName: string)**

This extractor needs the cookie-parser
```typescript
import cookieParser from 'cookie-parser';
```
## API
### @Auth() Decorator
To access the authentication context you can use the @Auth() decorator.
```typescript
import { Auth, AuthContext } from '@nestjs-mods/jwt';

// ...

@Delete('login')
async logout(@Auth() auth: AuthContext) {
  return auth;
}
```

### TokenService
Because the AuthModule is a global scoped module you don't have to import the AuthModule to use the TokenService
```typescript
import { TokenService } from '@nestjs-mods/jwt';
import { Controller, Post } from '@nestjs/common';

@Controller('user')
export class UserController {

  constructor(
    private tokenService: TokenService<{ customPayloadField: string; }>,
  ) { }

  @Post('login')
  async login() {

    const token = await this.tokenService.createToken({
      customPayloadField: 'Hello world',
    });

  }
}
```
