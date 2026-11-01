# amazon-linux-mobaxterm-visual

An animated, step-by-step visual that shows how to log in to an **Amazon Linux 2023** EC2 server with **MobaXterm on Windows**. A diagram (laptop, internet, gate, EC2) sits above a MobaXterm window mock with its SFTP side panel. No build step, no dependencies. Story: Ravi visits his warehouse.

## Moving objects

| Packet | Meaning |
|---|---|
| 🔑 | SSH key / login |
| ✉️ | Typed command |
| 💾 | File (SFTP drag and drop) |
| 📦 | Software update (dnf) |
| ✅ | Success response |
| 😈 | Intruder (blocked by the Security Group) |

## The 12 steps

1. The big picture
2. Key pair (.pem)
3. Open the door: Security Group, port 22, My IP
4. New session: Session > SSH
5. Attach the key: Advanced SSH settings > Use private key
6. First-visit host key question
7. Welcome screen, info box and prompt anatomy
8. First commands
9. File trolley: SFTP side panel
10. Updates and software (dnf, nginx)
11. Look around (disk, memory, logs, MultiExec and Tunneling tips)
12. Leave safely and "When it breaks"

## MobaXterm quick reference

- **Session:** Session > SSH > Remote host, tick Specify username = `ec2-user`, Port 22.
- **Key:** Advanced SSH settings > Use private key > `my-key.pem` (no conversion needed).
- **SFTP panel:** left side, drag and drop files to upload.
- **MultiExec:** run one command on several open sessions at once.
- **Tunneling:** reach private servers through one reachable server.
- Exact dialog wording varies a little between MobaXterm versions.

## Amazon Linux 2023 cheat sheet

- Default user: `ec2-user`. Use `sudo` for admin tasks, never log in as root.
- Package manager: `dnf` (`yum` still works as an alias).
- Services: `sudo systemctl enable --now nginx`, `systemctl status nginx`.

## Run locally

```bash
cd amazon-linux-mobaxterm-visual
python3 -m http.server 8000
```
Open http://localhost:8000

## Host on GitHub Pages

1. Create a repository and upload all files (keep the folders).
2. Settings > Pages.
3. Build and deployment: **Deploy from a branch**.
4. Branch **main**, folder **/ (root)**, Save.
5. Open `https://YOUR-USERNAME.github.io/REPO-NAME/` after a minute.

## Project structure

```
amazon-linux-mobaxterm-visual/
  index.html     structure only
  css/style.css  theme, diagram and MobaXterm mock styles
  js/app.js      SVG builder, MobaXterm mocks, step and command data
  .nojekyll
  LICENSE        MIT (replace YOUR NAME)
  README.md
```

## Customise

- **Text and commands:** edit `STEPS` (each step has `plain`, `tech`, `watch`, `why`, and `cmds` or `clicks`) and `TROUBLE` in `js/app.js`. Command helper: `C(command, output, meaning)`.
- **Colours:** change `--gold`, `--teal`, `--blue`, `--red`, `--green` on `.stage` in `css/style.css`.
- **Placeholders:** only `<EC2_PUBLIC_IP>`, `my-key.pem`, `ip-10-0-1-25` are used. Never commit real keys or IPs.
