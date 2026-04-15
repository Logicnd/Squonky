# R3D Bot Permission Requirements & Universal Compatibility

This document outlines the permission requirements for R3D's command suite and describes the universal compatibility features that allow the bot to function in low-permission environments.

## Universal Functionality (Zero-Permission Mode)

R3D is designed to be "Universal First." This means **every command** will attempt to run regardless of the bot's permissions. 
If the bot lacks the specific permissions required for a destructive action (e.g., banning a user, deleting channels), it will automatically degrade to **Simulation Mode**.

### Simulation Mode
When a command cannot be fully executed due to permission restrictions, R3D will:
1.  **Acknowledge the command**: You will not receive a generic "Access Denied" error.
2.  **Simulate the outcome**: The bot will describe what *would* have happened.
3.  **Provide visual feedback**: Embeds will be marked with `[SIMULATION]` or `[DRILL MODE]`.

This ensures that the bot remains interactive and useful for demonstration or roleplay purposes even in servers where it has no administrative power.

---

## Command-Specific Requirements

While all commands function in Simulation Mode, the following permissions are required for **Active Mode** (actual execution).

### 🛡️ Admin Commands
| Command | Required Permission | Active Behavior | Simulation Behavior |
| :--- | :--- | :--- | :--- |
| `banhammer` | `Ban Members` | Bans the target user. | Shows a "Judgment Delivered" embed without banning. |
| `lockdown` | `Manage Channels` | Locks/Unlocks all text channels. | Displays a "Lockdown Active" alert without modifying channels. |
| `purge` | `Manage Messages` | Bulk deletes messages. | Shows an "Incinerated" message without actually deleting history. |

### ⚠️ Dangerous Commands (Owner/Auth Required)
| Command | Required Permission | Active Behavior | Simulation Behavior |
| :--- | :--- | :--- | :--- |
| `nuke` | `Manage Channels`, `Ban Members` | Deletes all channels/roles, bans users. | Displays a "Nuclear Launch" sequence in chat. |
| `raid` | `Manage Channels` (for channel spam) | Creates spam channels. | Logs "Bypassing firewall..." messages in chat. |
| `ransom` | `Manage Roles`, `Manage Channels` | Locks server, creates hostage role. | Displays "Server Seized" embed. |

### 👑 Owner Commands
| Command | Required Permission | Active Behavior | Simulation Behavior |
| :--- | :--- | :--- | :--- |
| `blackout` | `Manage Channels` | Deletes all channels except one. | Shows "Blackout Simulation" embed. |
| `subjugate` | `Administrator` | Grants Admin role to a user. | Shows "Subjugation Simulation" embed. |

---

## Troubleshooting

### "Server context unavailable"
If you see this error, the bot is likely missing the basic **View Channels** permission or has not been invited with the correct scope (`bot` + `applications.commands`).

### "Interaction Failed"
If a command hangs, check the bot's console logs (if you host it) or ensure the bot has permission to **Send Messages** and **Embed Links** in the current channel.
