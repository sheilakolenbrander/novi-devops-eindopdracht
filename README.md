```mermaid
flowchart LR
  Repo[(GitHub repo)] -->|push main / pull_request| GA[GitHub Actions]

  subgraph FE[Frontend (Angular) workflow]
    direction TB
    FE1[Checkout] --> FE2[Setup Node 20 + npm cache]
    FE2 --> FE3[Lint (ESLint)]
    FE3 --> FE4[Unit tests (Jasmine/Karma)]
    FE4 --> FE5[Build (prod)]
    FE5 --> FE6[Docker build (nginx)]
    FE6 --> FE7[Tag: SHA + latest]
    FE7 --> FE8[Push naar GHCR]
    FE8 --> FE9[Webhook → Render deploy]
  end

  subgraph BE[Backend (.NET 8) workflow]
    direction TB
    BE1[Checkout] --> BE2[Setup .NET 8]
    BE2 --> BE3[Restore]
    BE3 --> BE4[Unit tests (xUnit)]
    BE4 --> BE5[Docker build (ASP.NET Core)]
    BE5 --> BE6[Tag: SHA + latest]
    BE6 --> BE7[Push naar GHCR]
    BE7 --> BE8[Webhook → Render deploy]
  end

  GA --> FE1
  GA --> BE1

  FE8 --> GHCR[(GitHub Container Registry - GHCR)]
  BE7 --> GHCR

  FE9 --> RenderFE[Render Web Service (Frontend)]
  BE8 --> RenderBE[Render Web Service (Backend)]

  User[Gebruiker] -->|HTTPS| RenderFE
  RenderFE -->|REST API| RenderBE
```
