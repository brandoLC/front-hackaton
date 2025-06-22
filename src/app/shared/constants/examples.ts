export const DIAGRAM_EXAMPLES = {
  aws: `# AWS Architecture Example
from diagrams import Diagram, Edge
from diagrams.aws.compute import EC2
from diagrams.aws.database import RDS
from diagrams.aws.network import ELB
from diagrams.aws.storage import S3

with Diagram("Simple Web Service", show=False):
    lb = ELB("Load Balancer")
    web = EC2("Web Server")
    db = RDS("Database")
    storage = S3("Storage")
    
    lb >> web >> db
    web >> storage`,

  er: `# Entity Relationship Example
from eralchemy import render_er

# Define your database schema
schema = """
User
--
id INTEGER PK
name VARCHAR(100)
email VARCHAR(100)
created_at TIMESTAMP

Post
--
id INTEGER PK
title VARCHAR(200)
content TEXT
user_id INTEGER FK >- User.id
created_at TIMESTAMP

Comment
--
id INTEGER PK
content TEXT
post_id INTEGER FK >- Post.id
user_id INTEGER FK >- User.id
created_at TIMESTAMP
"""

render_er(schema, 'diagram.png')`,

  json: `{
  "application": {
    "name": "UTEC Diagrams",
    "version": "1.0.0",
    "services": {
      "frontend": {
        "technology": "Angular 20",
        "features": [
          "Diagram Editor",
          "Code Syntax Highlighting",
          "Real-time Preview"
        ]
      },
      "backend": {
        "technology": "AWS Lambda",
        "functions": [
          "generateDiagram",
          "saveDiagram",
          "authenticate"
        ]
      },
      "storage": {
        "diagrams": "S3 Bucket",
        "users": "DynamoDB"
      }
    },
    "integrations": {
      "github": "Load code from repositories",
      "export": ["PNG", "SVG", "PDF"]
    }
  }
}`,

  mermaid: `graph TD
    A[User Login] --> B{Authentication}
    B -->|Success| C[Dashboard]
    B -->|Failed| A
    C --> D[Create Diagram]
    C --> E[View Diagrams]
    D --> F[Code Editor]
    F --> G[Generate Preview]
    G --> H{Valid Code?}
    H -->|Yes| I[Show Diagram]
    H -->|No| J[Show Errors]
    J --> F
    I --> K[Save Diagram]
    K --> E
    
    style A fill:#e1f5fe
    style C fill:#f3e5f5
    style I fill:#e8f5e8`,
};

export const DIAGRAM_INSTRUCTIONS = {
  aws: {
    title: 'AWS Architecture Diagrams',
    description:
      'Crea diagramas de arquitectura usando la librería diagrams de Python',
    tips: [
      'Importa los servicios de AWS que necesites',
      'Usa Edge() para conectar servicios',
      'Agrupa servicios relacionados con Cluster()',
    ],
  },
  er: {
    title: 'Entity Relationship Diagrams',
    description: 'Define relaciones entre entidades de base de datos',
    tips: [
      'Define las tablas con sus campos',
      'Usa PK para claves primarias',
      'Usa FK para claves foráneas',
    ],
  },
  json: {
    title: 'JSON Structure Visualization',
    description: 'Visualiza estructuras JSON complejas como diagramas',
    tips: [
      'Usa JSON válido como entrada',
      'Anida objetos para mostrar jerarquías',
      'Los arrays se muestran como listas',
    ],
  },
  mermaid: {
    title: 'Mermaid Diagrams',
    description: 'Crea diagramas versátiles con sintaxis Mermaid',
    tips: [
      'Usa graph TD para diagramas de flujo verticales',
      'Usa sequenceDiagram para diagramas de secuencia',
      'Aplica estilos con style',
    ],
  },
};
