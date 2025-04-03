---
id: migrations
title: Database Migrations
sidebar_label: Migrations
---

# Database Migrations

## Overview

Database migrations provide a systematic way to manage database schema changes over time. The starter kit integrates TypeORM's migration system to help you manage schema changes safely.

## Migration Principles

1. **Version Control**: Migrations should be committed to version control to track database changes
2. **Forward Only**: Each migration should be designed to run only once 
3. **Incremental Changes**: Break complex schema changes into smaller, manageable migrations
4. **Reversibility**: When possible, include both up and down migrations for rollbacks

## Configuration

### TypeORM Migration Configuration

The starter kit configures migrations in the database module and `ormconfig.js`:

```javascript
// ormconfig.js
module.exports = {
  type: process.env.DB_TYPE || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'nest_starter',
  entities: [__dirname + '/dist/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/dist/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};
```

### NPM Scripts

The starter kit includes npm scripts to simplify migration commands:

```json
{
  "scripts": {
    "migration:generate": "npm run build && typeorm migration:generate -n",
    "migration:run": "npm run build && typeorm migration:run",
    "migration:revert": "npm run build && typeorm migration:revert",
    "migration:create": "typeorm migration:create -n"
  }
}
```

## Creating Migrations

### Automatic Migration Generation

TypeORM can automatically generate migrations by comparing your entity definitions to the current database schema:

```bash
npm run migration:generate -- CreateUsers
```

This generates a migration file like `TIMESTAMP-CreateUsers.ts` in the `src/migrations` directory:

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1647443300405 implements MigrationInterface {
  name = 'CreateUsers1647443300405';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "firstName" character varying NOT NULL,
        "lastName" character varying NOT NULL,
        "isActive" boolean NOT NULL DEFAULT false,
        "role" character varying NOT NULL DEFAULT 'user',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
```

### Manual Migration Creation

For more complex migrations, you can create a migration manually:

```bash
npm run migration:create -- AddUserProfileData
```

This creates a skeleton migration file that you can fill in:

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserProfileData1647443400123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add your migration logic here
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD COLUMN "profilePicture" character varying,
      ADD COLUMN "bio" text
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Add your rollback logic here
    await queryRunner.query(`
      ALTER TABLE "users" 
      DROP COLUMN "profilePicture",
      DROP COLUMN "bio"
    `);
  }
}
```

## Running Migrations

### Apply Pending Migrations

To run all pending migrations:

```bash
npm run migration:run
```

### Revert Migrations

To revert the most recent migration:

```bash
npm run migration:revert
```

## Complex Migration Examples

### Adding Foreign Keys

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  // Create the posts table
  await queryRunner.query(`
    CREATE TABLE "posts" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "title" character varying NOT NULL,
      "content" text NOT NULL,
      "authorId" uuid,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
      CONSTRAINT "PK_posts" PRIMARY KEY ("id")
    )
  `);
  
  // Add the foreign key
  await queryRunner.query(`
    ALTER TABLE "posts" 
    ADD CONSTRAINT "FK_posts_users" 
    FOREIGN KEY ("authorId") 
    REFERENCES "users"("id") 
    ON DELETE CASCADE
  `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
  // Drop the foreign key first
  await queryRunner.query(`
    ALTER TABLE "posts" 
    DROP CONSTRAINT "FK_posts_users"
  `);
  
  // Then drop the table
  await queryRunner.query(`DROP TABLE "posts"`);
}
```

### Data Migrations

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  // Create new role column with enum type
  await queryRunner.query(`
    CREATE TYPE "user_role_enum" AS ENUM ('admin', 'moderator', 'user')
  `);
  
  // Add the new column
  await queryRunner.query(`
    ALTER TABLE "users" 
    ADD COLUMN "roleEnum" "user_role_enum" NOT NULL DEFAULT 'user'
  `);
  
  // Migrate data from string role to enum role
  await queryRunner.query(`
    UPDATE "users" 
    SET "roleEnum" = 'admin'::"user_role_enum" 
    WHERE "role" = 'admin'
  `);
  
  await queryRunner.query(`
    UPDATE "users" 
    SET "roleEnum" = 'moderator'::"user_role_enum" 
    WHERE "role" = 'moderator'
  `);
  
  // Drop old column
  await queryRunner.query(`
    ALTER TABLE "users" 
    DROP COLUMN "role"
  `);
  
  // Rename new column
  await queryRunner.query(`
    ALTER TABLE "users" 
    RENAME COLUMN "roleEnum" TO "role"
  `);
}
```

### Index Management

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  // Add indexes for better performance
  await queryRunner.query(`
    CREATE INDEX "IDX_users_email" ON "users"("email")
  `);
  
  await queryRunner.query(`
    CREATE INDEX "IDX_posts_author" ON "posts"("authorId")
  `);
  
  await queryRunner.query(`
    CREATE INDEX "IDX_posts_created_at" ON "posts"("createdAt")
  `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
  // Drop indexes
  await queryRunner.query(`DROP INDEX "IDX_posts_created_at"`);
  await queryRunner.query(`DROP INDEX "IDX_posts_author"`);
  await queryRunner.query(`DROP INDEX "IDX_users_email"`);
}
```

## Migration Best Practices

### 1. Testing Migrations

Always test migrations in a development or staging environment before applying them to production:

```typescript
// In your test files
describe('Migrations', () => {
  it('should run all migrations without errors', async () => {
    const connection = await createConnection({
      ...ormConfig,
      database: 'test_migrations_db',
      synchronize: false,
      migrationsRun: true,
      dropSchema: true,
    });
    
    expect(connection.isConnected).toBe(true);
    await connection.close();
  });
});
```

### 2. Database Backups

Always back up your database before running migrations in production:

```bash
# For PostgreSQL
pg_dump -U username -d database_name -f backup.sql

# Restore if needed
psql -U username -d database_name -f backup.sql
```

### 3. Breaking Changes

When making breaking schema changes, consider these strategies:

1. **Add before remove**:
   - First migration: Add new columns/tables
   - Code update: Handle both old and new schemas
   - Second migration: Remove old columns/tables once code is updated

2. **Temporary columns**:
   - Create temporary columns for transitions
   - Migrate data between columns
   - Remove temporary columns after successful migration

### 4. Performance Considerations

1. **Large Tables**: For large tables, consider running migrations during off-hours
2. **Locks**: Be aware of table locks during migrations that could affect application performance
3. **Batching**: Split large data migrations into smaller batches

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  // Add new column
  await queryRunner.query(`
    ALTER TABLE "large_table" ADD COLUMN "new_column" text
  `);
  
  // Batch processing for large data migrations
  const batchSize = 1000;
  let processed = 0;
  let hasMore = true;
  
  while (hasMore) {
    const result = await queryRunner.query(`
      UPDATE "large_table"
      SET "new_column" = "old_column"
      WHERE "new_column" IS NULL
      LIMIT ${batchSize}
    `);
    
    processed += result.affected || 0;
    hasMore = result.affected === batchSize;
    
    // Optional: Add a small delay to reduce database load
    if (hasMore) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
}
```
``` 