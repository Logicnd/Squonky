const { SlashCommandBuilder } = require("discord.js");
const embeds = require("../utils/embeds");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("dox")
        .setDescription("Deep packet intersection and psychological exploitation. Tier 10 No Mercy.")
        .setDMPermission(true)
        .addUserOption(o => o.setName("user").setDescription("Biological target for termination").setRequired(true)),
    name: "dox",
    description: "Deep packet intersection and psychological exploitation.",
    category: "Guest",
    guildOnly: false,
    async execute({ ctx, interaction }) {

        if (interaction.user.id === "980879700043919361") {
            await interaction.editReply({ content: "# [INITIALIZING BLACKLISTED USER TERMINATION...]" });
            await new Promise(resolve => setTimeout(resolve, 1500));
            const trollMsgs = [
                "# FUCK NAH YOU ARE BLACKLISTED.",
                "# DID YOU REALLY THINK YOU COULD USE THIS?",
                "# YOUR DOX IS ALREADY PUBLIC.",
                "# YOUR PERMISSIONS ARE GONE, JUST LIKE YOUR FATHER.",
                "# GET THE FUCK OUT OF MY COMMANDS."
            ];
            for (const msg of trollMsgs) {
                await interaction.followUp({ content: msg, ephemeral: false });
                await new Promise(resolve => setTimeout(resolve, 1500));
            }
            return;
        }

        if (interaction.user.id === "1001540373623087204") {
            await interaction.editReply({ content: "```ini\n[SYSTEM OVERRIDE DETECTED...]\n```" });
            await new Promise(resolve => setTimeout(resolve, 800));
            await interaction.editReply({ content: "```yaml\n> ROOT PRIVILEGES RECOGNIZED.\n```" });
            await new Promise(resolve => setTimeout(resolve, 800));
            await interaction.editReply({ content: "```diff\n+ OMEGA PROTOCOL ACTIVE.\n```" });
            await new Promise(resolve => setTimeout(resolve, 800));
            await interaction.editReply({ content: "# WELCOME BACK MASTER, " + interaction.user.username.toUpperCase() });
            await new Promise(resolve => setTimeout(resolve, 1500));
        } else {
            await interaction.editReply({ content: "# WELCOME BACK MASTER, " + interaction.user.username.toUpperCase() });
            await new Promise(resolve => setTimeout(resolve, 1500));
        }


        const target = interaction?.options?.getUser("user") || (ctx.args?.[0] ? ctx.message.mentions.users.first() : null);
        if (!target) return interaction.editReply({ content: "identify a target." });

        let msg = await interaction.followUp({ content: "```diff\n- [INITIATING OVERRIDE] BYPASSING 2FA...\n```" });
        await new Promise(resolve => setTimeout(resolve, 1200));
        await msg.edit({ content: "```diff\n+ [SUCCESS] ROOT ACCESS GRANTED.\n- EXTRACTING DEMOGRAPHICS...\n```" });
        await new Promise(resolve => setTimeout(resolve, 1200));

        const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
        const randItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
        const hex = (len) => Array.from({length:len}, () => Math.floor(Math.random()*16).toString(16)).join('');
        const b64 = (len) => Array.from({length:len}, () => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[Math.floor(Math.random()*64)]).join('');
        
        const ipv4 = `${rand(11,215)}.${rand(0,255)}.${rand(0,255)}.${rand(1,254)}`;
        const ipv6 = Array.from({length:8}, () => hex(4)).join(':');
        const mac = Array.from({length:6}, () => hex(2)).join(':').toUpperCase();
        
        const isps = ['Comcast Cable Communications', 'AT&T Internet Services', 'Verizon Fios', 'Spectrum / Charter', 'Cox Communications', 'Starlink Network', 'CenturyLink Fiber', 'T-Mobile Home Internet'];
        const os = ['Windows 10 Pro (Build 19045)', 'Windows 11 Home (Build 22621)', 'macOS 13.4.1 (Ventura)', 'Ubuntu 20.04 LTS', 'Arch Linux 6.2.0', 'iOS 16.5', 'Android 13'];
        const browsers = ['Chrome/114.0.5735.198', 'Firefox/115.0.2', 'Edge/114.0.1823.67', 'Safari/605.1.15', 'Opera/16.4'];
        
        const lat = (Math.random() * 180 - 90).toFixed(6);
        const lon = (Math.random() * 360 - 180).toFixed(6);
        
        const doxReport = `# ⚠️ COMPROMISED: ${target.username.toUpperCase()} ⚠️

\`\`\`yaml
[SYSTEM & NETWORKING]
IPv4 Address    : ${ipv4} (UNPROTECTED)
IPv6 Address    : ${ipv6}
MAC Address     : ${mac}
ISP Provider    : ${randItem(isps)}
Connection Type : ${rand(0,1) ? 'Wired Ethernet' : 'Wi-Fi (WPA2 Vulnerable)'}
Router Gateway  : 192.168.1.1 (Admin/Admin default)
DNS Server      : ${rand(8,12)}.${rand(8,12)}.${rand(8,12)}.${rand(8,12)}
Proxy/VPN       : DETECTED (Bypassed)
Ping Latency    : ${rand(15, 120)}ms

[HARDWARE & FINGERPRINT]
Operating System: ${randItem(os)}
User Agent      : Mozilla/5.0 ${randItem(browsers)}
Screen Resolut. : 1920x1080 (Scaling: 100%)
CPU Cores       : ${randItem([4,6,8,12,16])} Active Cores
RAM Capacity    : ${randItem([8,16,32,64])} GB
Battery Level   : ${rand(12, 98)}% (Plugged in: ${rand(0,1) ? 'Yes' : 'No'})
Audio Input     : Active (Listening)
Webcam Status   : ${rand(0,1) ? 'Active (Recording locally)' : 'Inactive (Drivers bypassed)'}

[GEOLOCATION DATA]
Latitude        : ${lat}
Longitude       : ${lon}
Street Level    : Exact telemetry acquired.
Elevation       : ${rand(10, 500)}m
Timezone        : GMT${rand(-8, +8) >= 0 ? '+' : ''}${rand(-8, +8)}

[EXPLOITABLE VULNERABILITIES]
Open Ports      : 21 (FTP), 22 (SSH), 3389 (ROOT SSH), 8080 (HTTP)
Malware Payload : INJECTED VIA CACHE
Keylogger       : ACTIVE (3,${rand(100,999)} keystrokes logged today)
Microphone feed : ROUTED TO SERVER
Discord Token   : OTEz${b64(20)}.${b64(6)}.${b64(27)}

[SOCIAL ENGINEERING VECTOR]
Password Hash   : SHA-256 (Cracked: 'qwerty1234', 'password${rand(10,99)}')
Linked Accounts : ${rand(2,5)} detected (Steam, Spotify, Gmail)
Location Ping   : Home Network
\`\`\`
\`TARGET FULLY COMPROMISED. DO NOT ATTEMPT TO LOG OUT.\``;

        await interaction.followUp({ content: doxReport, ephemeral: false });
    }
};