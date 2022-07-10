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

## Development Setup

- [pnpm](https://pnpm.io/)
- [pscale](https://planetscale.com/features/cli)
- [vscode](https://code.visualstudio.com/)
  - ESLint
  - Prettier - Code formatter (format on save, format on paste)
  - Typescript (use workspace version)
  - Tailwind CSS IntelliSense

Or copy the setting below for VSCode workspace settings.json

```json
{
  "editor.tabSize": 2,
  "typescript.tsdk": "node_modules/typescript/lib",
  "editor.formatOnPaste": true,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```
