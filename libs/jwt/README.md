An JWT based authentication module for a nestjs application.

## Configuration
```typescript
import { getTokenByBearerHeader, getTokenByCookie, JwtModule } from '@nestjs-mods/jwt';

@Module({
  imports: [
    JwtModule.forRoot({
      secret: 'super-secret-phrase',
      defaultSignOptions: {
        expiresIn: '7 days',
        algorithm: 'HS512',
      },
      tokenResolver: [
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

### Resolve a token from request
You can add as much token resolver as you like the first one in the list that returns a token wins.

#### getTokenByCookie(cookieName: string)
If you store your token in a cookie you need the [cookie-parser](https://www.npmjs.com/package/cookie-parser) middleware.

#### getTokenByBearerHeader()
Resolves the token from the authorization header

## API
### Param decorators

```typescript
import { Payload, Token } from '@nestjs-mods/jwt';

// ...

@Get()
route(@Payload() payload: any, @Token() token: string) {

// ...

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
