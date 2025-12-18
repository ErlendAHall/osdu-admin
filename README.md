# OSDU Admin

This project aims to offer advanced edit and create capabilities for OSDU records.
Parts of the source code is developed internally at Equinor, but anyone is free to contribute or fork.

## End-user Features
- Open a single OSDU record in a HTML schema.
- Open several records in editable table rows.
- Create and update records. (Planned)
- View a selection of records in a table view by kind in tabs. (Planned)
- Create a mixed table view of records by querying in natural language. (Planned)
- Edit settings (instance URIs, units...) (Planned)

## Technical features
- Created with React with the help of Vite.
- Pure client-side application, OSDU instance agnostic.
- Utilizes IndexedDB.
- LLM that constructs OSDU Rest API queries from natural languages prompts. (Planned)

## How to spin it up
1. Clone the repository
2. cd into the directory, run `npm i`
3. When ready, run `npm run dev` and the instance is available on `localhost:3000`

## MVP Roadmap

- ~~Provide a kind, fetch the record and populate a HTML form.~~
- Edit and save a record.
- Create a new record.
- Tracking changes in IndexedDB. Undo changes, undo all changes.
- Tabbed interface, open several records.
