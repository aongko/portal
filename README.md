# Portal

Generate and manage short URLs easily.

## Prisma and Planetscale

This project uses [Prisma](https://prisma.io) and [Planetscale](https://planetscale.com/).

View the guide here: [https://www.prisma.io/docs/guides/database/using-prisma-with-planetscale](https://www.prisma.io/docs/guides/database/using-prisma-with-planetscale)

### Schema Changes

Read more here: [https://docs.planetscale.com/tutorials/automatic-prisma-migrations](https://docs.planetscale.com/tutorials/automatic-prisma-migrations)

In short, before changing the schema, create a development branch on Planetscale. Connect to the newly created branch. Edit the schema, than run `db push`.

```bash
pscale branch create portal <branch-name>
pscale connect portal <branch-name> --port 3306
// edit schema.prisma
pnpm prisma db push
```

To deploy the changes to `main`:

```bash
pscale deploy-request create portal <branch-name>
pscale deploy-request deploy portal 1
```
