# R3D Discord Bot

R3D is a modular Discord bot built for structured command handling, configurable modules, and optional dashboard telemetry. The project is organized to be easy to extend and maintain.

**Highlights**
- Modular command and module layout under `src/`.
- Config-driven behavior via `.env`.
- Safe-mode guardrails (default on) to prevent broad channel broadcasting.
- Optional realtime dashboard server (`server.js`).

**Requirements**
- Node.js 18+

**Quick Start**
1. Install dependencies:
```
npm install
```
2. Create a `.env` file:
```
copy .env.example .env
```
3. Start the bot:
```
npm run start
```

**Dashboard (Optional)**
```
npm run start:dashboard
```

**Environment Variables**
Required:
- `BOT_TOKEN` (Discord bot token)
- `OWNER_ID` or `OWNER_IDS` (comma-separated user IDs allowed to run owner-only commands)

Optional:
- `BOT_PREFIX` (default: `>`)
- `BOT_COOLDOWN_MS` (default: `2000`)
- `MAX_BROADCAST_CHANNELS` (default: `3`)
- `ALLOWED_CHANNELS` (comma-separated channel IDs to allow broadcast)
- `SAFE_MODE` (default: `true`)
- `LOG_LEVEL` (`debug`, `info`, `warn`, `error`)
- `BOT_ACTIVITY` (default: `R3D online`)
- `BOT_ACTIVITY_TYPE` (`Playing`, `Watching`, `Listening`, `Streaming`, `Competing`)

**Permission Levels**
- **Guest (Universal)**: Baseline access for all users. These commands function universally across servers and do not require elevated privileges.
- **Admins**: Requires specific Discord permissions (e.g., Ban Members).
- **Owners**: Restricted to bot owners defined in `OWNER_IDS`.
- **Dangerous**: High-risk commands requiring strict authentication.

**Commands**
- `>help`
- `>ping`
- `>uptime`
- `>stats`
- `>serverinfo`
- `>userinfo [@user]`
- `>dm [@user|id] [message]`
- `>say [message]`
- `>purge [1-100]`
- `>config`
- `>setprefix [prefix]`
- `>safemode [on/off/status]`
- `>godmode [on/off/status]`
- `>manipulate gaslight [@user] [text]`
- `>manipulate deepfake [@user] [personality]`
- `>social [trust/divide/chaos/infiltrate]`
- `>deceive [glitch/matrix/mirror]`
- `>control [puppet/influence/suggestion] [@user]`
- `>terminate protocol`

**Project Structure**
- `src/index.js` - entrypoint
- `src/commands/` - command definitions
- `src/modules/` - module logic
- `src/events/` - Discord event handlers
- `src/utils/` - shared utilities
- `server.js` - optional dashboard server
- `public/` - dashboard assets
- `data/` - persistent state (`bot_config.json`)

**Safety Defaults**
`SAFE_MODE` is enabled by default. This limits broadcast behavior to the invoking channel. To allow broader broadcasts, set `SAFE_MODE=false` and configure `ALLOWED_CHANNELS`.
