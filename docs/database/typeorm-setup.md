---
id: typeorm-setup
title: TypeORM Setup
sidebar_label: TypeORM Setup
---

# TypeORM Setup

## Overview

The starter kit uses TypeORM, a powerful Object-Relational Mapping (ORM) library, to interact with various database systems. This document explains how TypeORM is configured and used in the starter kit.

## Database Configuration

### Environment Variables

Configure your database connection in `.env`:

```env
# Database Configuration
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=nest_starter
DB_SYNCHRONIZE=false
DB_LOGGING=true
```

### TypeORM Module Configuration

The starter kit configures TypeORM in the `database.module.ts` file:

```typescript
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get('DB_TYPE', 'postgres'),
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_DATABASE', 'nest_starter'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
        synchronize: configService.get('DB_SYNCHRONIZE', false),
        logging: configService.get('DB_LOGGING', true),
        ssl: configService.get('DB_SSL', false)
          ? {
              rejectUnauthorized: false,
            }
          : false,
      }),
    }),
  ],
})
export class DatabaseModule {}
```

## Entities

Entities represent database tables and their relationships. Here's an example of a User entity:

```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => Post, post => post.author)
  posts: Post[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

## Repository Pattern

TypeORM leverages the repository pattern to manage entities. Here's how to use it:

```typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneBy({ email });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
```

## TypeORM Module Registration

Register your entities in the module:

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([User, Post, Comment])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
```

## Query Builder

For complex queries, use TypeORM's QueryBuilder:

```typescript
async findUserPostsWithComments(userId: string): Promise<Post[]> {
  return this.postsRepository
    .createQueryBuilder('post')
    .leftJoinAndSelect('post.author', 'author')
    .leftJoinAndSelect('post.comments', 'comment')
    .leftJoinAndSelect('comment.user', 'commentUser')
    .where('author.id = :userId', { userId })
    .orderBy('post.createdAt', 'DESC')
    .getMany();
}
```

## Transactions

Handle database transactions with TypeORM:

```typescript
@Injectable()
export class TransferService {
  constructor(
    private connection: Connection,
    private accountsService: AccountsService,
  ) {}

  async transferFunds(
    fromAccountId: string,
    toAccountId: string,
    amount: number,
  ): Promise<void> {
    return this.connection.transaction(async (manager) => {
      // Get repositories for this transaction
      const accountRepo = manager.getRepository(Account);
      
      // Deduct from source account
      await accountRepo.decrement(
        { id: fromAccountId },
        'balance',
        amount
      );
      
      // Add to destination account
      await accountRepo.increment(
        { id: toAccountId },
        'balance',
        amount
      );
      
      // Create transaction records
      const transactionRepo = manager.getRepository(Transaction);
      
      await transactionRepo.save([
        {
          accountId: fromAccountId,
          type: 'DEBIT',
          amount,
          description: `Transfer to account ${toAccountId}`,
        },
        {
          accountId: toAccountId,
          type: 'CREDIT',
          amount,
          description: `Transfer from account ${fromAccountId}`,
        },
      ]);
    });
  }
}
```

## Subscribers

TypeORM subscribers allow you to listen to entity events:

```typescript
@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(
    private dataSource: DataSource,
    private logger: Logger,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  beforeInsert(event: InsertEvent<User>) {
    this.logger.log(`User is about to be created: ${event.entity.email}`);
  }

  afterInsert(event: InsertEvent<User>) {
    this.logger.log(`User has been created: ${event.entity.email}`);
  }
}
```

## Multi-Database Support

The starter kit supports multiple database connections:

```typescript
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'default',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // Primary database config
      }),
    }),
    TypeOrmModule.forRootAsync({
      name: 'reporting',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // Secondary database config
      }),
    }),
  ],
})
export class DatabaseModule {}
```

To use a specific connection:

```typescript
@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report, 'reporting')
    private reportRepository: Repository<Report>,
  ) {}

  // Methods using reportRepository...
}
```

## Testing with TypeORM

The starter kit includes utilities for testing with TypeORM:

```typescript
describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should find a user by email', async () => {
    const user = repository.create({
      email: 'test@example.com',
      password: 'password',
      firstName: 'Test',
      lastName: 'User',
    });
    
    await repository.save(user);
    
    const found = await service.findByEmail('test@example.com');
    expect(found).toBeDefined();
    expect(found.email).toEqual('test@example.com');
  });
});
```

## Best Practices

1. **Avoid `synchronize: true` in Production**: This option can lead to data loss in production environments
2. **Use Migrations for Schema Changes**: Always use migrations to modify your database schema in production
3. **Implement Entity Validation**: Use class-validator and class-transformer for entity validation
4. **Use Indexes for Performance**: Add appropriate indexes to your entities for better query performance
5. **Handle Relations Carefully**: Be aware of eager and lazy loading behavior with relations
6. **Use Query Builder for Complex Queries**: Leverage QueryBuilder for complex queries instead of raw SQL
7. **Implement Soft Deletes**: Consider using soft deletes for entities that shouldn't be permanently removed 