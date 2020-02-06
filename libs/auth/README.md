An JWT based authentication module for a nestjs application.

## Installation
```bash
npm install --save @bexxx/nestjs-auth
```

### Configuration
```typescript
import { AuthModule, extractByBearerHeader, extractTokenByCookie } from '@bexxx/auth';

@Module({
  imports: [
    AuthModule.forRoot({
      jwtSecret: 'super-secret-phrase',
      defaultJwtSignOptions: {
        expiresIn: '7 days',
        algorithm: 'HS512',
      },
      tokenExtractors: [
        extractTokenByCookie('user'),   // first try to extract a token from the cookie
        extractByBearerHeader,          // then try to extract the token by a bearer header
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

```
