# Database Migrations

## Setup Instructions

1. **Set up your database connection:**
   ```bash
   # Add DATABASE_URL to .env.local
   DATABASE_URL=mysql://user:password@host:port/database?sslaccept=strict
   ```

2. **Generate Prisma Client:**
   ```bash
   npm run db:generate
   ```

3. **Push schema to database (development):**
   ```bash
   npm run db:push
   ```

4. **Create migration (production):**
   ```bash
   npm run db:migrate
   ```

5. **Open Prisma Studio (optional):**
   ```bash
   npm run db:studio
   ```

## Database Providers

### PlanetScale (Recommended)
- MySQL-compatible
- Serverless
- Free tier available
- Connection string format: `mysql://username:password@host/database?sslaccept=strict`

### Supabase
- PostgreSQL
- Free tier available
- Connection string format: `postgresql://user:password@host:5432/database`

### Self-hosted MySQL
- Full control
- Requires server management
- Connection string format: `mysql://user:password@localhost:3306/database`

## Schema Updates

When updating the schema:

1. Edit `prisma/schema.prisma`
2. Run `npm run db:push` (development) or `npm run db:migrate` (production)
3. The Prisma Client will be automatically regenerated

## Important Notes

- Always backup your database before running migrations in production
- Test migrations in a staging environment first
- The schema includes models for: User, Product, Order, OrderItem, Booking


