# Standards for Hashmap Keys

## Redis

All Redis keys are prefixed with the app name from config (`Elsa` by default) to allow multiple environments to share a Redis instance.

Format: `<AppName>:<category>:<params>`

### Key Categories

| Category                 | Format                                | Parameters                                                                                     | Example                                                           | Usage                                                                                |
| ------------------------ | ------------------------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **Cooldown (Guild)**     | `cd:g:<tagName>:<userId>:<guildId>`   | `tagName` - Command/tag name<br>`userId` - Discord user ID<br>`guildId` - Discord guild ID     | `Elsa:cd:g:help:123456789:987654321`                              | Tracks per-user cooldowns for commands in a guild. TTL matches cooldown duration.    |
| **Cooldown (Channel)**   | `cd:c:<tagName>:<userId>:<channelId>` | `tagName` - Command/tag name<br>`userId` - Discord user ID<br>`channelId` - Discord channel ID | `Elsa:cd:c:add:123456789:555555555`                               | Tracks per-user cooldowns for commands in a channel. TTL matches cooldown duration.  |
| **Command Parse Cache**  | `cmd-parse:<hash>`                    | `hash` - SHA256 hash of message content                                                        | `Elsa:cmd-parse:a1b2c3d4...`                                      | Caches parsed command structure to avoid re-parsing identical messages. TTL: 1 hour. |
| **Command Result Cache** | `cmd-run:<commandName>:<key>`         | `commandName` - Name of the command<br>`key` - The parse cache key                             | `Elsa:cmd-run:help:a1b2c3d4...`<br>`Elsa:cmd-run:tag:a1b2c3d4...` | Caches command execution results. TTL varies by command config.                      |

### Key Construction

Keys are built using type-safe helpers in `src/caching/keys.ts`:

```typescript
// Cooldowns
redisKeys.cooldown({ scope: "guild", tagName: "help", authorId: "123", scopeId: "789" });
// Returns: "Elsa:cd:g:help:123:789"

// Generic caches
makeRedisKey("cmd-parse:xyz");
// Returns: "Elsa:cmd-parse:xyz"
```

### Value Format

| Key Type       | Value | Notes                                      |
| -------------- | ----- | ------------------------------------------ |
| Cooldowns      | `"1"` | Blank value, TTL is the only relevant data |
| Command Parse  | JSON  | Serialized parse result                    |
| Command Result | JSON  | Serialized command response                |

### Lifecycle

- **Cooldowns**: `clearOnRestart: true` - Cleared on bot start
- **Command Parse**: `clearOnRestart: false` - Persists across restarts
- **Command Result**: Configurable per command via `cacheParams.clear`

---

## In-Memory Maps

JavaScript `Map` instances used for runtime state tracking (not persisted).

### Timer Keys (`core._timers`)

| Format            | Parameters                       | Example                | Usage                                                                           |
| ----------------- | -------------------------------- | ---------------------- | ------------------------------------------------------------------------------- |
| `cmd:<messageId>` | `messageId` - Discord message ID | `cmd:1234567890123456` | Tracks command execution time. Created on command start, deleted on completion. |
| `main`            | None                             | `main`                 | Tracks total application uptime from initialization to ready state.             |

**Construction:**

```typescript
// In Command.ts
private makeTimerKey() {
    return `cmd:${this.context.message.id}`;
}

// In Events.ts
core.startTimer("main");
```

**Lifecycle:**

- Created via `core.startTimer(id)`
- Queried via `core.queryTimer(id)` (throws if not found)
- Deleted via `core.stopTimer(id)` (throws if not found)
- Cleared on `core.reset()` (testing only)
