# Architecture

## Core Patterns

### Abstract Classes

Abstract classes enforce implementation contracts. Extend them, the compiler tells you what to implement. Base classes handle shared behavior (lifecycle, error handling, logging).

### Lazy Singleton Containers

Dependencies are managed through containers with lazy getters:

```typescript
get tagService(): TagService {
    return (this._tagService ??= new TagService());
}
```

This allows for flexibility in testing, since not ALL the dependencies have to be defined on startup.

### Dependency Injection

Services and other classes should accept dependencies as constructor parameters, but can accept defaults:

```typescript
class TagService {
    constructor(
        private tagRepo = app.database.tagRepo,
        private userRepo = app.database.userRepo,
    ) {}
}
```

This pattern allows normal usage to rely on container defaults while enabling tests to inject mocks:

```typescript
// Production - uses defaults
const service = new TagService();

// Testing - inject mocks
const service = new TagService(mockTagRepo, mockUserRepo);
```

Always use this pattern when a class depends on other services or repositories. The important part is we can inject mocks, this is why using defaults are fine, and a good junction between convenience and flexibility.

### Definition/Instance Split (Commands)

Commands use two classes:

- **CommandDef** - Metadata, registration, factory. One per command type.
- **CommandInstance** - Execution state and logic. Fresh instance per invocation.

This separates "what is this command" from "executing this command right now".

---

## Data Flow

All database access follows: **Service → Repository → Entity**

```txt
Command/Event
    ↓
Service (business logic, validation, orchestration)
    ↓
Repository (data access, queries, relations)
    ↓
Entity (TypeORM model, database row)
```

- **Services** contain business logic. They validate inputs, enforce rules, and coordinate between repositories.
- **Repositories** handle data access only. They query, save, and manage entity relations. No business logic.
- **Entities** are TypeORM models representing database tables. They define columns and relations.

Never access a repository directly from a command or event handler - always go through a service.

---

## Layers

- **Discord**: Bot client, commands, event handlers
- **Services**: Business logic, validation, orchestration
- **Repositories**: Data access (extend `BaseRepository`)
- **Entities**: TypeORM models

---

## Where To Make Changes

### Commands

1. Create in `src/commands/impl/<category>/`
2. Extend `CommandDef` and `CommandInstance`
3. Register in `src/commands/Commands.ts`

```typescript
class CommandMyCommandDef extends CommandDef<CommandMyCommandInstance> {
    ...
}

class CommandMyCommandInstance extends CommandInstance {
    ...
}
```

### Services

1. Create in `src/services/`
2. Add lazy getter to `src/core/containers/Services.ts`

### Repositories

1. Extend `BaseRepository<YourEntity>` in `src/db/repositories/`
2. Add lazy getter to `src/core/containers/Database.ts`

### Event Handlers

1. Extend `DiscordEventHandler<"eventName">` in `src/bot/events/`
2. Register in `src/bot/DiscordBot.ts` handlers array

### Entities

1. Create in `src/db/entities/` with TypeORM decorators
2. Add to `src/db/dataSource.ts` entities array

### Errors

- **ClientError** (4xx) - Cause by users. Requires to described how to reply to getting this error, since it will depend on its nature.
- **InternalError** (5xx) - Caused by us. Does not need to describe logging or how to reply to it.

Create in `src/core/errors/client/` or `src/core/errors/internal/`.

---

## What NOT To Do

- **Don't bypass the container** - Always access dependencies via `app.x`. Direct imports break the singleton pattern and make testing impossible.

- **Don't bypass dependency injection** - Never directly inject a dependency, statically, into a Class or function. It should always be an argument, but it can default to a child of `depencies`.

- **Don't access repositories from commands** - Commands should call services. Services call repositories. This keeps business logic centralized and testable.

- **Don't put business logic in repositories** - Repositories do data access only. Validation, permission checks, and orchestration belong in services.

- **Don't skip abstract methods** - If you're fighting the compiler to avoid implementing something, you're doing it wrong. The abstract methods exist to enforce consistency.

    > Some can be left empty if they do not provide anything important for the specific use case. Typically logging methods.

- **Don't use `console.log`** - Use `app.core.logger`. It handles formatting, file output, and log levels. Exception: during shutdown when the logger may be unavailable.

- **Don't create entities directly for saving** - Use repository methods. They handle relations, defaults, and ensure the entity manager is used correctly.

- **Don't store state in CommandDef** - Definitions are singletons. Per-execution state belongs in CommandInstance.

## Notes

This repo is not production-ready yet. As such, you can find examples of the codebase not enforcing these rules perfectly for now, and more patterns WILL be implemented. Like using more interfaces.

You should nonetheless try to implement your code as close to these docs as possible. Old code being bad is fine-ish, but not new code.
