An JWT based authentication module for a nestjs application.

## Installation
```bash
npm install --save @bexxx/nestjs-auth
```

### Configuration
```typescript
import { AuthModule } from '@bexxx/auth';

@Module({
  imports: [
    AuthModule.forRoot({
      jwtSecret: 'super-secret-phrase',
    //   defaultJwtSignOptions: null,
      extractToken: (req) => req.headers.authorization || req.cookies.jwt,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

```
