# Arviona — Developer Handbook & Guidelines

Welcome to the Arviona developer guide. Follow these standards and practices when contributing to this repository.

---

## 🛠️ Code Conventions

### Java (Spring Boot)
- **Lombok**: Always use Lombok `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`, and `@Builder` for JPA models.
- **REST Entities**: Ensure REST endpoints return standard `ResponseEntity<T>` wrappers with appropriate HTTP status codes.
- **DTOs**: Never expose raw JPA entities to the client directly; map them to DTOs or clean maps.
- **Soft Deletes**: Use the `is_deleted` column to flag records as deleted rather than dropping rows from database tables.

### JavaScript/React
- **Framer Motion**: Add subtle micro-animations (e.g. spring transitions, hover scales) to interactives.
- **Lazy Loading**: Use `React.lazy()` for all dashboard and sub-dashboard components to maintain a lightweight core bundle.
- **Context State**: Keep the state normalized inside `DataContext.jsx` and avoid ad-hoc fetch logic inside view components.

---

## 🧪 Flyway Database Migrations
- Write database schema updates in `server/src/main/resources/db/migration/`.
- File naming format: `V[Number]__[Description].sql`.
- Never edit an existing migration script once committed. Create a new version number (e.g. `V9__...`) to modify schemas.

---

## 🔒 Security Best Practices
- Never commit API keys, MySQL passwords, or secret seeds to the repository. Use environment variables or local `application.properties` overrides.
- Ensure all endpoints except auth are annotated with `@PreAuthorize` to restrict access by roles (`ROLE_STUDENT`, `ROLE_TEACHER`, etc.).
