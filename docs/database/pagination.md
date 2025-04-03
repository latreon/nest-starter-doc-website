---
id: pagination
title: Pagination
sidebar_label: Pagination
---

# Pagination

## Overview

Effective pagination is crucial for handling large datasets in your API responses. The starter kit provides a standardized pagination solution that works seamlessly with TypeORM and NestJS.

## Pagination Types

The starter kit supports two pagination styles:

1. **Offset-based pagination**: Using `limit` and `offset` parameters
2. **Cursor-based pagination**: Using a cursor for more efficient pagination of large datasets

## Pagination DTOs

### Base Pagination DTO

```typescript
export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  offset?: number = 0;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
```

### Cursor Pagination DTO

```typescript
export class CursorPaginationDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
```

## Pagination Response Interface

```typescript
export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface CursorPaginatedResult<T> {
  data: T[];
  meta: {
    hasMore: boolean;
    nextCursor: string | null;
    limit: number;
  };
}
```

## Pagination Service

The starter kit includes a pagination service for standard operations:

```typescript
@Injectable()
export class PaginationService {
  async paginate<T>(
    queryBuilder: SelectQueryBuilder<T>,
    options: PaginationDto,
  ): Promise<PaginatedResult<T>> {
    const total = await queryBuilder.getCount();
    
    // Apply sorting
    if (options.sortBy) {
      const entity = queryBuilder.alias;
      queryBuilder.orderBy(
        `${entity}.${options.sortBy}`,
        options.sortOrder,
      );
    }
    
    // Apply pagination
    const data = await queryBuilder
      .skip(options.offset)
      .take(options.limit)
      .getMany();
    
    return {
      data,
      meta: {
        total,
        limit: options.limit,
        offset: options.offset,
      },
    };
  }

  async paginateWithCursor<T>(
    queryBuilder: SelectQueryBuilder<T>,
    options: CursorPaginationDto,
    cursorColumn: string = 'id',
  ): Promise<CursorPaginatedResult<T>> {
    // Apply cursor-based condition if cursor is provided
    if (options.cursor) {
      const decodedCursor = Buffer.from(options.cursor, 'base64').toString('utf-8');
      const [column, value] = decodedCursor.split(':');
      
      const operator = options.sortOrder === 'DESC' ? '<' : '>';
      const entity = queryBuilder.alias;
      
      queryBuilder.andWhere(
        `${entity}.${column} ${operator} :value`,
        { value },
      );
    }
    
    // Apply sorting
    const sortColumn = options.sortBy || cursorColumn;
    const entity = queryBuilder.alias;
    queryBuilder.orderBy(
      `${entity}.${sortColumn}`,
      options.sortOrder,
    );
    
    // Get one extra item to determine if there are more results
    const data = await queryBuilder
      .take(options.limit + 1)
      .getMany();
    
    const hasMore = data.length > options.limit;
    
    // Remove the extra item
    if (hasMore) {
      data.pop();
    }
    
    // Generate next cursor
    let nextCursor = null;
    if (hasMore && data.length > 0) {
      const lastItem = data[data.length - 1];
      const cursorValue = lastItem[sortColumn];
      const cursorString = `${sortColumn}:${cursorValue}`;
      nextCursor = Buffer.from(cursorString).toString('base64');
    }
    
    return {
      data,
      meta: {
        hasMore,
        nextCursor,
        limit: options.limit,
      },
    };
  }
}
```

## Usage Examples

### Controller Implementation

```typescript
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private paginationService: PaginationService,
  ) {}

  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query('search') search?: string,
  ): Promise<PaginatedResult<User>> {
    return this.usersService.findAll(paginationDto, search);
  }

  @Get('cursor')
  async findAllWithCursor(
    @Query() paginationDto: CursorPaginationDto,
    @Query('search') search?: string,
  ): Promise<CursorPaginatedResult<User>> {
    return this.usersService.findAllWithCursor(paginationDto, search);
  }
}
```

### Service Implementation

```typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private paginationService: PaginationService,
  ) {}

  async findAll(
    paginationDto: PaginationDto,
    search?: string,
  ): Promise<PaginatedResult<User>> {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');
    
    if (search) {
      queryBuilder.where(
        'user.email LIKE :search OR user.firstName LIKE :search OR user.lastName LIKE :search',
        { search: `%${search}%` },
      );
    }
    
    return this.paginationService.paginate(queryBuilder, paginationDto);
  }

  async findAllWithCursor(
    paginationDto: CursorPaginationDto,
    search?: string,
  ): Promise<CursorPaginatedResult<User>> {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');
    
    if (search) {
      queryBuilder.where(
        'user.email LIKE :search OR user.firstName LIKE :search OR user.lastName LIKE :search',
        { search: `%${search}%` },
      );
    }
    
    return this.paginationService.paginateWithCursor(
      queryBuilder,
      paginationDto,
      'createdAt',
    );
  }
}
```

## Frontend Implementation

### Example React Hook

```typescript
function useOffsetPagination<T>(
  apiEndpoint: string,
  initialParams: PaginationParams = {
    limit: 10,
    offset: 0,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  },
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [params, setParams] = useState<PaginationParams>(initialParams);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          limit: params.limit.toString(),
          offset: params.offset.toString(),
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
        });
        
        const response = await fetch(`${apiEndpoint}?${queryParams}`);
        const result = await response.json();
        
        setData(result.data);
        setTotal(result.meta.total);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiEndpoint, params]);

  return {
    data,
    loading,
    error,
    total,
    params,
    setParams,
  };
}
```

## Best Practices

1. **Always use DTOs**: Define clear pagination DTOs for your API
2. **Consistent Response Format**: Use standard pagination response interfaces
3. **Use Query Builders**: For complex pagination scenarios, use TypeORM query builders
4. **Choose Appropriate Method**: Use cursor-based pagination for large datasets
5. **Server-Side Sorting**: Handle sorting on the server to reduce client-side load
6. **Add Indexes**: Ensure database indexes on columns used for sorting and filtering
7. **Cache Results**: For static data, consider caching paginated results

## Performance Considerations

### Offset Pagination Limitations

Offset-based pagination can become inefficient for very large datasets because the database must scan and discard all rows before the offset. Consider these alternatives:

1. **Use cursor-based pagination** for large datasets
2. **Add appropriate indexes** on sorting columns
3. **Cache previous results** when possible
4. **Use `LIMIT`/`TAKE` with reasonable values** (10-100 items per page)

### Optimizing Count Queries

For large tables, count queries can be slow. Consider these optimizations:

1. **Separate count queries**: Run count queries separately and cache the results
2. **Estimate counts**: For very large tables, consider approximate counts
3. **Skip counts when possible**: For cursor-based pagination, you often don't need exact counts 