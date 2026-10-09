# ScholarSync - Research Data Portal

A modern React-based research data management portal with role-based access control.

## Features

- **Role-Based Access Control**
  - Researcher: Submit and view research papers
  - Department HOD: Review department submissions
  - Research Cell Admin: Manage submissions, data export/import
  - College Admin: Final approval, full access

- **Research Management**
  - Submit new research with title, abstract, keywords
  - Track submission status through approval workflow
  - Filter by department and status

- **Statistics Dashboard**
  - View research counts by department
  - Track approval progress
  - Visual bar charts

- **Data Portability**
  - LocalStorage persistence
  - JSON backup export/import
  - CSV backup export

## Demo Accounts (password: `pass`)

| Username | Role | Department |
|----------|------|------------|
| researcher1 | Researcher | CS |
| faculty2 | Researcher | EE |
| rc_admin | Research Cell Admin | RCA |
| hod_cs | Department HOD | CS |
| hod_ee | Department HOD | EE |
| college_admin | College Admin | College |

## Local Development

```bash
cd ScholarSync
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Vercel Deployment

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

Or connect your GitHub repository to Vercel for automatic deployments.

## Tech Stack

- React 19
- Vite
- React Router v7
- Lucide React (icons)
- LocalStorage (data persistence)
- JSON/CSV (backup)

## Approval Workflow

```
Researcher submits → Pending HOD → Pending Research Cell → Pending College → Approved by College
```

## Project Structure

```
ScholarSync/
├── src/
│   ├── utils/
│   │   └── storage.js      # LocalStorage + JSON/CSV utilities
│   ├── App.jsx             # Main app with routing
│   ├── App.css             # Component styles
│   └── index.css          # Global styles
├── vercel.json             # Vercel configuration
└── package.json
```

## License

This work is licensed under the [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/).

Copyright (c) 2026 Sai Karun Nandipati · https://karun99.github.io

## MCP server

This application ships a dependency-free [Model Context Protocol](https://modelcontextprotocol.io)
server (`mcp-server/server.mjs`) exposing its core operations to agentic clients.
It speaks JSON-RPC 2.0 over stdio and adds no runtime dependencies.

Add the repository's [`.mcp.json`](.mcp.json) to your MCP client, or run:

```bash
node mcp-server/server.mjs
```

Protocol smoke tests:

```bash
python3 -m unittest discover -s tests -p "test_mcp_server.py" -v
```

See [docs/MCP.md](docs/MCP.md) and [mcp-server/README.md](mcp-server/README.md).
