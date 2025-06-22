import { DiagramType } from '../models/diagram.model';

export const DIAGRAM_EXAMPLES = {
  [DiagramType.AWS]: `# AWS Architecture Diagram Example
from diagrams import Diagram, Cluster, Edge
from diagrams.aws.compute import EC2, Lambda
from diagrams.aws.database import RDS
from diagrams.aws.network import ELB, CloudFront
from diagrams.aws.storage import S3

with Diagram("Web Service Architecture", show=False, direction="TB"):
    # Frontend
    cdn = CloudFront("CDN")
    
    # Load Balancer
    lb = ELB("Load Balancer")
    
    # Web Servers
    with Cluster("Web Servers"):
        web_servers = [
            EC2("Web Server 1"),
            EC2("Web Server 2"),
            EC2("Web Server 3")
        ]
    
    # Application Layer
    with Cluster("Application Layer"):
        api = Lambda("API Gateway")
        processors = [
            Lambda("Processor 1"),
            Lambda("Processor 2")
        ]
    
    # Database
    database = RDS("Database")
    
    # Storage
    storage = S3("File Storage")
    
    # Connections
    cdn >> lb
    lb >> web_servers
    web_servers >> api
    api >> processors
    processors >> database
    processors >> storage`,

  [DiagramType.ER]: `# Entity Relationship Diagram Example
from eralchemy import render_er

# Define your database schema
schema = '''
[User]
id INTEGER PRIMARY KEY
name VARCHAR(100) NOT NULL
email VARCHAR(100) UNIQUE NOT NULL
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

[Post]
id INTEGER PRIMARY KEY
title VARCHAR(200) NOT NULL
content TEXT
user_id INTEGER NOT NULL
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

[Comment]
id INTEGER PRIMARY KEY
content TEXT NOT NULL
post_id INTEGER NOT NULL
user_id INTEGER NOT NULL
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

[Category]
id INTEGER PRIMARY KEY
name VARCHAR(100) NOT NULL
description TEXT

[PostCategory]
post_id INTEGER NOT NULL
category_id INTEGER NOT NULL

User ||--o{ Post
Post ||--o{ Comment
User ||--o{ Comment
Post }o--o{ Category
'''

# This will generate an ER diagram
render_er(schema, 'output.png')`,

  [DiagramType.JSON]: `{
  "application": {
    "name": "UTEC Diagrams API",
    "version": "1.0.0",
    "description": "REST API for diagram generation",
    "config": {
      "database": {
        "host": "localhost",
        "port": 5432,
        "name": "utec_diagrams",
        "ssl": true,
        "connections": {
          "min": 5,
          "max": 20
        }
      },
      "aws": {
        "region": "us-east-1",
        "services": {
          "s3": {
            "bucket": "utec-diagrams-storage",
            "encryption": true
          },
          "lambda": {
            "timeout": 30,
            "memory": 256
          },
          "apiGateway": {
            "throttling": {
              "rateLimit": 1000,
              "burstLimit": 2000
            }
          }
        }
      },
      "authentication": {
        "jwt": {
          "secret": "your-secret-key",
          "expiresIn": "7d"
        },
        "providers": [
          "local",
          "google",
          "github"
        ]
      }
    },
    "endpoints": [
      {
        "path": "/api/auth/login",
        "method": "POST",
        "description": "User authentication"
      },
      {
        "path": "/api/diagrams",
        "method": "GET",
        "description": "Get user diagrams"
      },
      {
        "path": "/api/diagrams/generate",
        "method": "POST",
        "description": "Generate diagram from code"
      }
    ]
  }
}`,

  [DiagramType.MERMAID]: `graph TD
    A[Start] --> B{Is user authenticated?}
    B -->|Yes| C[Show Dashboard]
    B -->|No| D[Show Login Form]
    
    D --> E[User enters credentials]
    E --> F{Valid credentials?}
    F -->|Yes| G[Generate JWT Token]
    F -->|No| H[Show Error Message]
    
    G --> I[Store token in localStorage]
    I --> C
    H --> D
    
    C --> J[User selects diagram type]
    J --> K[Show Code Editor]
    K --> L[User writes code]
    L --> M[User clicks Generate]
    
    M --> N{Valid code?}
    N -->|Yes| O[Send to Lambda Function]
    N -->|No| P[Show Validation Error]
    
    O --> Q[Generate Diagram]
    Q --> R[Upload to S3]
    R --> S[Return Image URL]
    S --> T[Display Diagram]
    
    P --> L
    
    T --> U{Save diagram?}
    U -->|Yes| V[Save to Database]
    U -->|No| W[Continue Editing]
    
    V --> X[Success Message]
    W --> L
    X --> C
    
    style A fill:#e1f5fe
    style C fill:#c8e6c9
    style T fill:#fff3e0
    style X fill:#e8f5e8`,

  [DiagramType.SQL]: `# SQL Database Schema Diagram
# Define your database tables with relationships

users: {
  shape: sql_table
  id: int {constraint: primary_key}
  username: string {constraint: unique}
  email: string {constraint: unique}
  password_hash: string
  first_name: string
  last_name: string
  created_at: timestamp
  updated_at: timestamp
}

costumes: {
  shape: sql_table
  id: int {constraint: primary_key}
  name: string
  description: text
  silliness: int
  monster_id: int {constraint: foreign_key}
  user_id: int {constraint: foreign_key}
  created_at: timestamp
  last_updated: timestamp
}

monsters: {
  shape: sql_table
  id: int {constraint: primary_key}
  name: string
  movie: string
  weight: int
  height: int
  power_level: int
  created_at: timestamp
  last_updated: timestamp
}

# Define relationships between tables
costumes.monster_id -> monsters.id
costumes.user_id -> users.id`,
};

export function getExampleCode(type: DiagramType): string {
  return DIAGRAM_EXAMPLES[type] || '';
}

export function getDiagramTypeDescription(type: DiagramType): string {
  const descriptions = {
    [DiagramType.AWS]:
      'Crea diagramas de arquitectura de AWS usando Python y la librería diagrams. Puedes incluir servicios como EC2, Lambda, RDS, S3, etc.',
    [DiagramType.ER]:
      'Genera diagramas entidad-relación para bases de datos. Define entidades, atributos y relaciones usando la sintaxis de ERAlchemy.',
    [DiagramType.JSON]:
      'Visualiza estructuras JSON complejas como diagramas interactivos. Perfecto para documentar APIs y configuraciones.',
    [DiagramType.MERMAID]:
      'Crea diagramas versátiles con sintaxis Mermaid: flowcharts, diagramas de secuencia, Gantt, etc.',
    [DiagramType.SQL]:
      'Diseña esquemas de base de datos con tablas, columnas y relaciones. Sintaxis moderna similar a D2 para documentar tu base de datos.',
  };

  return descriptions[type] || '';
}
