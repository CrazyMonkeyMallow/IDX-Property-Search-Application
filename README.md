# IDX Property Search Application

## Overview

This project is a full-stack real-estate search application. Users can filter, sort, paginate, and open a property detail page with photos, open houses, and an optional Google Maps location.

The main UI is available at `http://localhost:3000`. The backend API runs at `http://localhost:5000`.

### Screenshot

Run the frontend locally and open `http://localhost:3000` to view the Listings page. The application includes a filter form, sort controls, property cards, and pagination. A screenshot can be captured from that page with the browser's developer tools.

## Tech Stack

- Node.js 18+ (Node 20 LTS is recommended)
- Express 5.2
- MySQL 8 (normally run in Docker)
- `mysql2` 3.22
- React 18.3
- React Router 6.30
- Create React App / `react-scripts` 5.0.1
- Jest and Supertest for backend route tests
- React Testing Library for frontend component tests

## Architecture

```text
frontend/src  -> React pages and components -> /api/* proxy
                                              |
src/server.js -> Express routes -> MySQL rets database
```

The frontend owns presentation state (filters, sorting, pagination, loading). The backend validates query parameters, builds parameterized SQL, and returns JSON. The database pool is mocked in route tests so tests do not require a running MySQL server.

## Setup From A Fresh Machine

1. Install Node.js 20 LTS, Docker Desktop, and Git.
2. Clone the repository and enter it:

   ```bash
   git clone https://github.com/CrazyMonkeyMallow/IDX-Property-Search-Application.git
   cd IDX-Property-Search-Application
   ```

3. Start MySQL 8 in Docker. If the container already exists, use `docker start idx-mysql-local` instead:

   ```bash
   docker run --name idx-mysql-local \
     -e MYSQL_ROOT_PASSWORD=your_password \
     -e MYSQL_DATABASE=rets \
     -p 3306:3306 -d mysql:8
   ```

4. Import the supplied SQL files:

   ```bash
   docker exec -i idx-mysql-local mysql -uroot -pyour_password rets < sql/rets_property.sql
   docker exec -i idx-mysql-local mysql -uroot -pyour_password rets < sql/rets_openhouse.sql
   ```

5. Verify the database:

   ```bash
   docker exec -it idx-mysql-local mysql -uroot -p rets
   # In MySQL:
   SHOW TABLES;
   SELECT COUNT(*) FROM rets_property;
   SELECT COUNT(*) FROM rets_openhouse;
   ```

6. Create the root `.env` file:

   ```env
   PORT=5000
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=rets
   ```

7. Install backend dependencies and start the API:

   ```bash
   npm install
   npm start
   ```

8. In a second terminal, install and start the frontend:

   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Add a valid REACT_APP_GOOGLE_MAPS_API_KEY if maps are required.
   npm start
   ```

## API Reference

### `GET /api/health`

Returns service and database health.

Example response:

```json
{"status":"ok","database":"connected"}
```

### `GET /api/properties`

Returns a filtered, sorted page of properties.

Supported query parameters are `city`, `zipcode`, `minPrice`, `maxPrice`, `beds`, `baths`, `limit`, `offset`, `sortBy`, and `sortOrder`. Empty values are ignored. Valid sort fields are `L_SystemPrice`, `ListingContractDate`, `LM_Int2_3`, and `L_Keyword2`; sort order is `asc` or `desc`.

Example request:

```text
/api/properties?city=Austin&minPrice=300000&beds=3&limit=20&offset=0&sortBy=L_SystemPrice&sortOrder=asc
```

Example response:

```json
{
  "total": 1,
  "limit": 20,
  "offset": 0,
  "results": [{"listingId":"A1","address":"10 Main Street","price":500000,"beds":3}]
}
```

Invalid parameters return `400` with `{ "status": "error", "message": "..." }`. Database failures return `500`.

### `GET /api/properties/:id`

Returns the full database row for one listing. Invalid IDs return `400`; unknown IDs return `404`.

Example: `/api/properties/A1`

### `GET /api/properties/:id/openhouses`

Returns open houses ordered by date and start time. It returns `[]` when a known property has no open houses and `404` when the property does not exist.

## Database Schema Summary

- `rets_property`: listing data including `L_ListingID` (key), address fields, `L_SystemPrice`, beds, baths, `L_Photos`, and map coordinates.
- `rets_openhouse`: open-house data including `L_ListingID`, `OpenHouseDate`, `OH_StartTime`, `OH_EndTime`, and `all_data`.
- Relationship: `rets_openhouse.L_ListingID` identifies its parent `rets_property.L_ListingID`.

## Testing And Coverage

Run backend tests:

```bash
npm test
npm run test:coverage
```

Run frontend tests and coverage:

```bash
cd frontend
npm test -- --watchAll=false
npm test -- --watchAll=false --coverage
```

Tests cover route success/error paths, every property filter, pagination, sorting, photo parsing, filter controls, property cards, and detail-page behavior. Coverage reports are written to `coverage/` directories.

## Known Issues And Future Improvements

- Some `L_Photos` URLs come from a protected third-party media service and may return `403` or `ERR_BLOCKED_BY_ORB` in a browser. A production system should proxy authorized media or store approved image copies.
- Google Maps requires a valid key with Maps Embed API enabled and localhost restrictions configured. The app hides the map when coordinates are missing.
- `frontend/build/` is intentionally ignored; run `npm run build` when a deployment artifact is needed.
- Future work could add request cancellation with `AbortController`, stronger database migrations, and server-side media proxying.
