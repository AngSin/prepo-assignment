### Running the project

- `docker-compose down && docker-compose build --pull && docker-compose up`
- Importing all the WETH transfers will take some time please wait for the message "Nest application successfully started" before testing

### Testing

- Once the application has completed importing all WETH transfers you can test by adding your address to the link:
- http://localhost:3000/transfers?address=<YOUR_ADDRESS>&limit=10&offset=0. Then visiting it. An invalid address will result in a bad request.
- To maintain server load, `limit` and `offset` properties are mandatory
- For testing inbound/outbound transfers you can pass the query param `direction` to the request for e.g. `?direction=out`. Acceptable fields are 'in', 'out' or 'both'

### Running locally for DEV:

- `docker run -d --name some-postgres -e POSTGRES_PASSWORD=securepassword -e POSTGRES_DB=prepo -p 5432:5432 postgres`
- `npx prisma migrate dev --name init`
- `npm run start:dev`

### Improvements:

- Not listening for new transfers
- Will not skip imports if a token has zero transfers thus `null` for `blockNumber` in the table
- Import transfers on first request?
- Push to dockerhub with transfers stored in db image?
- Custom Offset & limit missing error instead of `"message": "Validation failed (numeric string is expected)",`
- Missing upper bound restriction on `limit` query parameter
- Missing tests for service layer
- start.sh script instead of long npm start command
