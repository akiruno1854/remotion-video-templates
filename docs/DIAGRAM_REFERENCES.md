# Diagram references

## mingrammer/diagrams

- Repository: https://github.com/mingrammer/diagrams
- License: MIT
- Useful ideas adopted: cloud-resource categorization, provider/service node taxonomy, cluster-oriented architecture-diagram conventions.
- We do not copy its renderer into Remotion. ELK remains the layout engine and this repository keeps its own visual design system.

## awslabs/aws-icons-for-plantuml / AWS Architecture Icons

- Repository: https://github.com/awslabs/aws-icons-for-plantuml
- Useful as a reference for AWS service naming and official icon availability.
- AWS service icons are not copied wholesale into this repository. Their use is governed by AWS asset/trademark terms separately from our code.

## Design principle

Reuse external layout/catalog know-how where licensing is clear, while keeping the visual language (node cards, edge styling, typography, spacing, animation) owned by this Remotion pipeline so that AWS, RAG, Git and other topics share one consistent look.
