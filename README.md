> [!NOTE]
> NodeJs: >=v20.17.0
> 
> npm: >=v10.8.2
> 
> Framework: AdonisJs
> 
> Database: Postgres

### Local Setup

- Create an `.env` file in root directory and copy the contents of `.env.example` file into it.
- Add `DB_PASSWORD` and `DB_DATABASE` to `.env` file.
- Run `node ace migration:refresh --seed`.
- Run `npm run dev` to start local server.
