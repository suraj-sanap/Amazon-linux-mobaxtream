/* amazon-linux-mobaxterm-visual: SVG diagram, MobaXterm mocks, step data. No dependencies. */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg', P = 8;
  var PROMPT = '[ec2-user@ip-10-0-1-25 ~]$ ';
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Text content: edit freely ---------- */
  function C(c, out, mean) { return { c: c, out: out, mean: mean }; }
  var LOGO = ['   ,     #_', '   ~\\_  ####_        Amazon Linux 2023', '  ~~  \\_#####\\', '  ~~     \\###|',
    "  ~~       \\#/ ___   https://aws.amazon.com/linux/amazon-linux-2023", "   ~~       V~' '->", '    ~~~         /', '      ~~._.   _/', '         _/ _/', "       _/m/'"];
  var INFO = ['SSH compression  : OK', 'SSH-browser      : OK (SFTP panel on the left)', 'X11-forwarding   : not needed on a server', 'For more info, ctrl+click on help or visit our website.'];
  var BW = 56;
  function padTo(t) { while (t.length < BW) { t += ' '; } return t; }
  var DASH = '+' + Array(BW + 3).join('-') + '+';
  var BANNER = [DASH].concat(INFO.map(function (t) { return '| ' + padTo(t) + ' |'; }), [DASH, ''], LOGO);
  var OLD = [
    { t: 'The big picture', sub: 'Laptop to server',
      plain: "Ravi sits in his shop (your Windows laptop) and wants to work inside his warehouse in another city (an EC2 server). Amazon Linux 2023 is the warehouse's rulebook: AWS's own Linux, where you log in as ec2-user and install software with dnf.",
      tech: 'EC2 instance running Amazon Linux 2023, reached over the internet through an Internet Gateway using SSH.',
      watch: 'Laptop, Internet, gate (IGW) and the EC2 server inside AWS.',
      why: 'Every later step is one piece of this one journey.',
      clicks: ['Nothing to type yet. Find your EC2 instance in the AWS console and note its Public IPv4 address (the street address).'] },
    { t: 'Key pair', sub: 'The key AWS hands you',
      plain: 'AWS gives you one key, the .pem file, when you create the key pair. It is shown only once. Anyone with it can enter the warehouse, so never share it.',
      tech: 'EC2 key pair: AWS keeps the public half, you download the private half (my-key.pem).',
      watch: 'A key travels from AWS to your laptop.',
      why: 'Lose the .pem and you cannot log in with that key again.',
      clicks: ['AWS Console > EC2 > Key Pairs > Create key pair.', 'Name: my-key. Type: RSA. Format: .pem.', 'Click Create and save my-key.pem somewhere safe.'] },
    { t: 'Open the door', sub: 'Security Group, port 22',
      plain: 'The door guard has a visitor list. We add one line: only my own address may use the SSH phone extension (port 22). Strangers are turned away.',
      tech: 'Security Group inbound rule: SSH, TCP, port 22, source My IP (never 0.0.0.0/0).',
      watch: 'The allowed path turns green. A stranger is blocked.',
      why: 'An open port 22 invites password guessing from the whole internet.',
      clicks: ['EC2 > Security Groups > your group > Edit inbound rules.', 'Add rule: Type SSH, Protocol TCP, Port 22, Source My IP.', 'Save rules.'] },
    { t: 'PuTTYgen', sub: '.pem becomes .ppk', view: 'keygen',
      plain: "PuTTY's lock does not fit the .pem key, so we re-cut it. PuTTYgen is the key cutter. Same key, new shape.",
      tech: 'PuTTYgen converts an OpenSSH private key (.pem) to PuTTY format (.ppk).',
      watch: 'The key in the diagram is now labelled .ppk.',
      why: 'PuTTY cannot read a .pem file directly.',
      clicks: ['Open PuTTYgen > Load. Set file filter to All Files and pick my-key.pem.', 'Click OK on the "imported foreign key" message.', 'Click Save private key (no passphrase for a lab) and name it my-key.ppk.'] },
    { t: 'PuTTY session', sub: 'Address, port, name', view: 'session',
      plain: "Write the warehouse's street address and phone extension on a contact card, and name it so you can call again with one click.",
      tech: 'PuTTY Session: Host Name ec2-user@<EC2_PUBLIC_IP>, Port 22, Connection type SSH, saved as ravi-warehouse.',
      watch: 'The laptop is tagged with the saved session.',
      why: 'Typing ec2-user@ in the host name saves you from a login prompt.',
      clicks: ['PuTTY > Session > Host Name: ec2-user@<EC2_PUBLIC_IP>.', 'Port 22, Connection type SSH.', 'Saved Sessions: ravi-warehouse, then click Save.'] },
    { t: 'Attach the key', sub: 'Credentials and keepalive', view: 'cred',
      plain: 'Tell PuTTY which key to show at the door, and ask it to ping the warehouse every 30 seconds so the line does not hang up when idle.',
      tech: 'Connection > SSH > Auth > Credentials > Private key file = my-key.ppk. Connection > Seconds between keepalives = 30.',
      watch: 'The laptop tag now also shows the keepalive.',
      why: 'Newer PuTTY puts the key under Credentials, older versions directly under Auth.',
      clicks: ['Connection > SSH > Auth > Credentials (older: Auth).', 'Private key file for authentication > Browse > my-key.ppk.', 'Connection > Seconds between keepalives: 30.', 'Back in Session click Save, then Open.'] },
    { t: 'First-visit popup', sub: 'Is this the right warehouse?', view: 'alert',
      plain: 'The first time, PuTTY says: "I have never seen this warehouse. Here is its fingerprint. Is it the right one?" If you trust it, say yes.',
      tech: 'PuTTY Security Alert: the server host key fingerprint is cached in the registry after Accept.',
      watch: 'A key packet travels laptop, internet, gate, EC2.',
      why: 'It protects you from connecting to an impostor server.',
      clicks: ['Accept = trust and remember this server.', 'Connect Once = trust this time only.', 'Cancel = stop. Pick this if the fingerprint looks wrong.'] },
    { t: 'Welcome screen', sub: 'Amazon Linux appears', view: 'term', banner: true,
      plain: 'You are in. This black window is the warehouse itself. The prompt tells you who you are and where you stand.',
      tech: 'Amazon Linux 2023 login banner and the bash prompt of user ec2-user.',
      watch: 'Typed commands (envelopes) go in, answers (ticks) come back.',
      why: 'Reading the prompt tells you which server and which user you are before you run anything.',
      clicks: ['Nothing to type. Read the banner and the prompt, then move to the next step.'] },
    { t: 'First commands', sub: 'Who, where, what',
      plain: 'Ask the warehouse simple questions: who am I, where am I, what rules do you run on?',
      tech: 'Basic identity and system information commands.',
      watch: 'Each command is an envelope; each answer a tick.',
      why: 'These are the first things to run on any new server.',
      cmds: [C('whoami', 'ec2-user', 'Your staff badge name.'),
        C('hostname', 'ip-10-0-1-25.ec2.internal', "The warehouse's internal name."),
        C('pwd', '/home/ec2-user', 'You are in your home folder.'),
        C('ls -la', 'total 12\ndrwx------ 3 ec2-user ec2-user  95 Jan  1 10:41 .\ndrwxr-xr-x 3 root     root      22 Jan  1 10:40 ..\ndrwx------ 2 ec2-user ec2-user  29 Jan  1 10:40 .ssh', 'All files, including hidden ones. .ssh holds your allowed keys.'),
        C('cat /etc/os-release', 'NAME="Amazon Linux"\nVERSION="2023"\nID="amzn"\nVERSION_ID="2023"\nPRETTY_NAME="Amazon Linux 2023"', 'Confirms the operating system.'),
        C('uname -r', '6.1.xx-xx.xxx.amzn2023.x86_64', 'The kernel (engine) version. Your numbers will differ.'),
        C('uptime', ' 10:42:07 up 12 min,  1 user,  load average: 0.00, 0.00, 0.00', 'How long the server has been on and how busy it is.')] },
    { t: 'Updates and software', sub: 'sudo, dnf, nginx',
      plain: 'sudo is the manager\'s master badge, used only for one command at a time. dnf is the supplier who delivers and installs software. We never log in as root.',
      tech: 'dnf package manager, sudo privilege escalation, systemd service management.',
      watch: 'A package travels from the internet to the EC2 server.',
      why: 'Regular updates close security holes. Using sudo only when needed limits mistakes.',
      cmds: [C('sudo dnf check-update', 'Last metadata expiration check: 0:01:12 ago.', 'Lists available updates (may print nothing on a fresh server).'),
        C('sudo dnf update -y', 'Dependencies resolved.\n...\nComplete!', '-y means "yes to all questions".'),
        C('sudo dnf install -y nginx', 'Installed:\n  nginx-1.24.0-1.amzn2023.0.x86_64\nComplete!', 'Installs the Nginx web server.'),
        C('sudo systemctl enable --now nginx', 'Created symlink /etc/systemd/system/multi-user.target.wants/nginx.service.', 'Starts Nginx now and at every reboot.'),
        C('systemctl status nginx', '● nginx.service - The nginx HTTP and reverse proxy server\n     Active: active (running)', 'Green and running means success. Press q to leave.'),
        C('curl -I localhost', 'HTTP/1.1 200 OK\nServer: nginx/1.24.0', 'The server answers its own web request.')] },
    { t: 'Look around', sub: 'Disk, memory, processes',
      plain: 'Walk the warehouse: how full is the floor (disk), how many workers are busy (memory, processes), what has the log book recorded?',
      tech: 'Resource and log inspection: df, free, top, ps, tail.',
      watch: 'Disk and memory bars appear on the EC2 box.',
      why: 'Full disks and exhausted memory are the most common causes of "the server is slow".',
      cmds: [C('df -h', 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/xvda1      8.0G  1.8G  6.2G  23% /', 'Disk space. Watch the Use% column.'),
        C('free -m', '              total   used   free\nMem:            949    360    120', 'Memory in megabytes.'),
        C('top', 'top - 10:50:01 up 20 min, 1 user\n(press q to quit)', 'Live view of running programs. Press q to quit.'),
        C('ps aux | head', 'USER   PID %CPU %MEM COMMAND\nroot     1  0.0  1.0 /usr/lib/systemd/systemd', 'Lists processes; head shows the first ten lines.'),
        C('sudo tail -n 20 /var/log/messages', '(last 20 lines of the system log)', 'The newest entries of the server log book.'),
        C('ls -l', 'total 0', 'Long listing of the current folder.')],
      extra: 'About chmod 400 my-key.pem: Linux and Mac users run it on their laptop so only they can read the key. PuTTY on Windows does not need it.' },
    { t: 'Leave safely', sub: 'exit and troubleshooting',
      plain: 'Hang up politely with exit. If the call fails, the cards below tell you which door is closed.',
      tech: 'exit or Ctrl+D ends the SSH session cleanly.',
      watch: 'The session ends; check the "When it breaks" cards.',
      why: 'Closing cleanly avoids half-open sessions.',
      cmds: [C('exit', 'logout', 'Ends the session. PuTTY closes the window.')] }
  ];
  function mod(o, p) { var r = {}, k; for (k in o) { r[k] = o[k]; } for (k in p) { r[k] = p[k]; } return r; }
  var STEPS = [
    OLD[0],
    mod(OLD[1], { plain: 'AWS gives you one key, the .pem file, when you create the key pair. It is shown only once. Anyone with it can enter the warehouse, so never share it. MobaXterm can use it exactly as it is.' }),
    OLD[2],
    { t: 'New session', sub: 'Session > SSH', view: 'session',
      plain: "Open MobaXterm, click Session, choose SSH. This is your contact card for the warehouse: street address and staff badge.",
      tech: 'MobaXterm Session > SSH: Remote host <EC2_PUBLIC_IP>, Specify username ec2-user, Port 22.',
      watch: 'The laptop is tagged with the session name.',
      why: 'MobaXterm saves the session in the left panel for one-click reconnects.',
      clicks: ['MobaXterm > Session (top-left) > SSH.', 'Remote host: <EC2_PUBLIC_IP>.', 'Tick Specify username and type ec2-user. Port 22.'] },
    { t: 'Attach the key', sub: 'Advanced SSH settings', view: 'adv',
      plain: 'Show MobaXterm the .pem key directly. No key cutter (PuTTYgen) is needed, because MobaXterm already fits this lock.',
      tech: 'Advanced SSH settings > Use private key > my-key.pem.',
      watch: 'The laptop tag now shows the key file.',
      why: 'One tool, no .pem to .ppk conversion.',
      clicks: ['Open the Advanced SSH settings tab.', 'Tick Use private key and browse to my-key.pem.', 'Click OK. The session connects and is saved under Sessions.'] },
    { t: 'First-visit question', sub: 'Is this the right warehouse?', view: 'hostkey',
      plain: 'The first time, MobaXterm asks: "I have never seen this warehouse. Do you trust it?" Say yes if the address is yours.',
      tech: 'SSH host key verification (known_hosts). Exact wording varies by MobaXterm version.',
      watch: 'A key packet travels laptop, internet, gate, EC2.',
      why: 'It protects you from connecting to an impostor server.',
      clicks: ['Type yes and press Enter (or click Accept if a dialog appears).', 'Choosing no stops the connection.'] },
    mod(OLD[7], { plain: 'You are in. The black area is the warehouse itself. The panel on the left (SFTP) shows its files automatically. The prompt tells you who you are and where you stand.', watch: 'Typed commands (envelopes) go in, answers (ticks) come back. The SFTP panel lists the server files.', clicks: ['Nothing to type. Read the info box, the logo and the prompt.'] }),
    OLD[8],
    { t: 'File trolley', sub: 'SFTP side panel',
      plain: 'Instead of typing, drag a file from your laptop into the left panel. It rides the SSH line like a trolley and lands in the warehouse.',
      tech: 'MobaXterm SSH-browser (SFTP): drag and drop upload to /home/ec2-user.',
      watch: 'A floppy disk travels laptop, internet, gate, EC2.',
      why: 'No extra tool or command is needed to copy files.',
      cmds: [C('ls -l', '-rw-r--r-- 1 ec2-user ec2-user 41 Jan  1 10:55 index.html', 'The file you dragged into the SFTP panel is here.'),
        C('mkdir ~/site && mv ~/index.html ~/site/', '', 'Make a folder and move the file into it. No output means success.'),
        C('cat ~/site/index.html', "<h1>Hello from Ravi's warehouse</h1>", 'Shows the file content.')] },
    OLD[9],
    mod(OLD[10], { extra: 'Tip: the MultiExec button runs one command on several servers at once, and Tunneling reaches private servers through this one. Try them later.' }),
    OLD[11]
  ];
  var TROUBLE = [
    ['Network error: Connection timed out', 'Security Group blocks port 22, your IP changed, or the instance is stopped.', 'Check the inbound rule for My IP and the instance state.'],
    ['Network error: Connection refused', 'sshd is not running or the port is wrong.', 'Use port 22 and check the instance status checks.'],
    ['Authentication failed / Permission denied (publickey)', 'Wrong user or wrong key.', 'Use ec2-user and tick Use private key with the right .pem.'],
    ['Server refused our key', 'The key pair does not match this instance.', 'Check the key pair name on the instance.'],
    ['Access denied', 'Wrong user (root, ubuntu).', 'Amazon Linux uses ec2-user.'],
    ['Disconnected after idle', 'No keep-alive set.', 'Settings > Configuration > SSH > SSH keepalive.']
  ];
  var LEGEND = [['\uD83D\uDD11', 'SSH key / login'], ['\u2709\uFE0F', 'Typed command'], ['\uD83D\uDCBE', 'File'],
    ['\uD83D\uDCE6', 'Software update'], ['\u2705', 'Success response'], ['\uD83D\uDE08', 'Intruder']];

  /* ---------- SVG helpers ---------- */
  var svg = document.getElementById('diagram');
  function el(tag, a, parent) { var n = document.createElementNS(NS, tag); for (var k in a) { n.setAttribute(k, a[k]); } if (parent) { parent.appendChild(n); } return n; }
  function text(parent, x, y, s, cls, anchor) { var t = el('text', { x: x, y: y, 'class': cls, 'text-anchor': anchor || 'middle' }, parent); t.textContent = s; return t; }
  var W = {
    w1: 'M180 210 L260 210', w2: 'M380 210 L452 210', w3: 'M508 210 L700 210',
    kp: 'M430 300 L105 300 L105 260', bad: 'M320 150 C 320 95, 720 75, 790 150'
  };
  var defs = el('defs', {}, svg), gW = el('g', {}, svg), gB = el('g', {}, svg), gP = el('g', {}, svg), pieces = [];
  Object.keys(W).forEach(function (id) { el('path', { id: 'w-' + id, d: W[id] }, defs); });
  function piece(layer, from, until, cls) { var g = el('g', { 'class': 'piece ' + (cls || '') }, layer); pieces.push({ g: g, from: from, until: until || 99 }); return g; }
  function wire(id, from, cls) { el('path', { d: W[id], 'class': 'wire ' + (cls || '') }, piece(gW, from)); }
  function box(from, cls, x, y, w, h, title, sub) {
    var g = piece(gB, from, 0, cls);
    el('rect', { x: x, y: y, width: w, height: h, rx: 10, 'class': 'box' }, g);
    text(g, x + w / 2, y + 24, title, 'bt'); text(g, x + w / 2, y + 40, sub, 'bs');
  }
  function area(from, cls, x, y, w, h, title, tx, ty) {
    var g = piece(gB, from, 0, cls);
    el('rect', { x: x, y: y, width: w, height: h, rx: 14, 'class': 'band' }, g);
    text(g, tx, ty, title, 'bandT', 'start');
  }
  function label(from, until, x, y, s, cls, anchor) { text(piece(gB, from, until, cls), x, y, s, 'lbl', anchor); }
  function pkt(from, emoji, wid, start, dur, o) {
    o = o || {}; var f = dur / P, g = piece(gP, from, o.until), p = el('g', { 'class': 'pkt', opacity: 0 }, g);
    text(p, 0, 6, emoji, '');
    var m = el('animateMotion', { dur: P + 's', begin: start + 's', repeatCount: 'indefinite', calcMode: 'linear', keyPoints: o.rev ? '1;0;0' : '0;1;1', keyTimes: '0;' + f + ';1' }, p);
    el('mpath', { href: '#w-' + wid }, m);
    el('animate', { attributeName: 'opacity', dur: P + 's', begin: start + 's', repeatCount: 'indefinite', values: '1;1;0;0', keyTimes: '0;' + f + ';' + (f + 0.001) + ';1' }, p);
  }

  /* ---------- Diagram ---------- */
  area(1, 'blue', 430, 20, 640, 320, 'AWS Cloud', 446, 46);
  area(1, 'teal', 450, 56, 600, 270, 'VPC 10.0.0.0/16', 466, 78);
  area(1, 'gold', 520, 92, 510, 210, 'Public subnet 10.0.1.0/24', 536, 290);
  box(1, 'blue', 30, 150, 150, 110, 'Windows laptop', 'MobaXterm');
  box(1, 'blue', 260, 150, 120, 80, 'Internet', 'public road');
  box(1, 'blue', 452, 150, 56, 80, 'IGW', 'gate');
  box(1, 'teal', 700, 150, 220, 120, 'EC2 instance', 'Amazon Linux 2023');
  wire('w1', 1, 'allow'); wire('w2', 1, 'allow'); wire('w3', 1, 'allow');
  // 2-4: key
  wire('kp', 2); label(2, 0, 270, 290, 'my-key.pem', 'gold');
  pkt(2, '\uD83D\uDD11', 'kp', 0, 3);
  // 3: security group
  var sg = piece(gB, 3, 0, 'red');
  el('rect', { x: 779, y: 274, width: 62, height: 16, rx: 8, 'class': 'tagbox' }, sg); text(sg, 810, 286, 'SG guard', 'tagtxt');
  label(3, 0, 930, 205, 'port 22', 'green', 'start'); label(3, 0, 930, 220, 'My IP only', 'green', 'start');
  wire('bad', 3, 'deny'); pkt(3, '\uD83D\uDE08', 'bad', 0, 5);
  var xg = el('g', { opacity: 0 }, piece(gB, 3, 0, 'red'));
  el('line', { x1: 792, y1: 120, x2: 808, y2: 136, 'class': 'xline' }, xg); el('line', { x1: 808, y1: 120, x2: 792, y2: 136, 'class': 'xline' }, xg);
  text(xg, 816, 134, 'Blocked!', 'xtxt', 'start');
  if (reduced) { xg.setAttribute('opacity', 1); } else { el('animate', { attributeName: 'opacity', dur: P + 's', repeatCount: 'indefinite', values: '0;0;1;1;0', keyTimes: '0;0.62;0.66;0.95;1' }, xg); }
  // 5-6: laptop tags
  label(4, 0, 105, 140, 'ravi-warehouse', 'blue'); label(5, 0, 105, 128, 'key: my-key.pem', 'blue');
  // 7: SSH login
  pkt(6, '\uD83D\uDD11', 'w1', 0, 1, { until: 6 }); pkt(6, '\uD83D\uDD11', 'w2', 1, 1, { until: 6 }); pkt(6, '\uD83D\uDD11', 'w3', 2, 1, { until: 6 });
  // 8+: commands and answers
  pkt(7, '\u2709\uFE0F', 'w1', 0, 1); pkt(7, '\u2709\uFE0F', 'w2', 1, 1); pkt(7, '\u2709\uFE0F', 'w3', 2, 1);
  pkt(7, '\u2705', 'w3', 3.5, 1, { rev: true }); pkt(7, '\u2705', 'w2', 4.5, 1, { rev: true }); pkt(7, '\u2705', 'w1', 5.5, 1, { rev: true });
  // 9: file trolley
  pkt(9, '\uD83D\uDCBE', 'w1', 6.5, 1); pkt(9, '\uD83D\uDCBE', 'w2', 7.5, 1); pkt(9, '\uD83D\uDCBE', 'w3', 8.5, 1);
  // 10: package
  pkt(10, '\uD83D\uDCE6', 'w2', 6, 1); pkt(10, '\uD83D\uDCE6', 'w3', 7, 1);
  // 11: disk and memory bars
  var bars = piece(gB, 11, 0, 'teal');
  [['Disk 23%', 214, 23], ['Memory 38%', 238, 38]].forEach(function (b) {
    text(bars, 716, b[1] + 9, b[0], 'bs', 'start');
    el('rect', { x: 800, y: b[1], width: 100, height: 10, rx: 5, 'class': 'barbg' }, bars);
    el('rect', { x: 800, y: b[1], width: b[2], height: 10, rx: 5, 'class': 'bar' }, bars);
  });

  /* ---------- PuTTY window mocks ---------- */
  var puttyEl = document.getElementById('putty'), tm = null;
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function chrome(title, body) {
    return '<div class="tb"><span>' + esc(title) + '</span><i>&#8211;</i><i>&#9633;</i><i>&#10005;</i></div>' + body;
  }
  var FILES = ['.ssh/', '.bash_logout', '.bash_profile', '.bashrc'];
  function moba(tab, inner, n) {
    var files = n >= 7 ? FILES.concat(n >= 9 ? ['index.html  (new)'] : []).map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') : '<li>No session yet</li>';
    var tools = ['Session', 'Servers', 'Tools', 'Games', 'Sessions', 'View', 'Split', 'MultiExec', 'Tunneling', 'Packages', 'Settings', 'Help'].map(function (t) { return '<span>' + t + '</span>'; }).join('');
    return chrome('MobaXterm', '<div class="mmenu">Terminal &nbsp; Sessions &nbsp; View &nbsp; X server &nbsp; Tools &nbsp; Games &nbsp; Settings &nbsp; Macros &nbsp; Help</div><div class="mtool">' + tools + '</div>' +
      '<div class="mbody"><aside class="sftp"><h5>SFTP: /home/ec2-user/</h5><ul>' + files + '</ul></aside><div class="mmain"><div class="mtabs"><span class="mtab">' + esc(tab) + '</span></div>' + inner + '</div></div>');
  }
  function sdialog(active, rows) {
    var types = ['SSH', 'Telnet', 'Rsh', 'Xdmcp', 'RDP', 'VNC', 'FTP', 'SFTP', 'Serial'].map(function (t) { return '<span' + (t === 'SSH' ? ' class="on"' : '') + '>' + t + '</span>'; }).join('');
    var tabs = ['Basic SSH settings', 'Advanced SSH settings', 'Terminal settings', 'Network settings', 'Bookmark settings'].map(function (t, i) { return '<span' + (i === active ? ' class="on"' : '') + '>' + t + '</span>'; }).join('');
    var rs = rows.map(function (r) { return '<div class="row"><span>' + esc(r[0]) + '</span><div class="fld">' + esc(r[1]) + '</div></div>'; }).join('');
    return chrome('Session settings', '<div class="mtypes">' + types + '</div><div class="mtabs2">' + tabs + '</div><div class="panel">' + rs + '</div><div class="btns"><button class="btn" tabindex="-1">OK</button><button class="btn" tabindex="-1">Cancel</button></div>');
  }
  var VIEWS = {
    idle: function () { return moba('(no session yet)', '<pre class="term">Nothing is connected yet.\nFollow the steps on the left: key, door, session, key file, then OK.</pre>', 0); },
    session: function () { return sdialog(0, [['Remote host *', '<EC2_PUBLIC_IP>'], ['[x] Specify username', 'ec2-user'], ['Port', '22']]); },
    adv: function () { return sdialog(1, [['[x] Use private key', 'my-key.pem'], ['SSH-browser type', 'SFTP protocol'], ['[x] Compression', 'on']]); },
    hostkey: function () {
      return moba('ec2-user@<EC2_PUBLIC_IP>', '<pre class="term">' + esc("The authenticity of host '<EC2_PUBLIC_IP>' can't be established.\nED25519 key fingerprint is SHA256:xxxxxxxxxxxxxxxx.\nAre you sure you want to continue connecting (yes/no/[fingerprint])? yes\nWarning: Permanently added '<EC2_PUBLIC_IP>' (ED25519) to the list of known hosts.") + '</pre>', 0);
    }
  };
  function addLine(pre, l) {
    var d = document.createElement('div');
    if (l.k === 'cmd') { var p = document.createElement('span'); p.className = 'pr'; p.textContent = PROMPT; d.appendChild(p); var c = document.createElement('span'); c.textContent = reduced ? l.t : ''; d.appendChild(c); pre.appendChild(d); return c; }
    d.textContent = l.t; pre.appendChild(d); pre.scrollTop = pre.scrollHeight; return null;
  }
  function termLines(from, to) {
    var out = [];
    for (var i = from; i <= to; i++) {
      var s = STEPS[i - 1];
      if (s.banner) { BANNER.forEach(function (b) { out.push({ t: b, k: 'out' }); }); }
      (s.cmds || []).forEach(function (c) { out.push({ t: c.c, k: 'cmd' }); (c.out ? c.out.split('\n') : []).forEach(function (o) { out.push({ t: o, k: 'out' }); }); });
    }
    return out;
  }
  function renderTerm(n) {
    puttyEl.innerHTML = moba(n === 12 ? '1. ec2-user@<EC2_PUBLIC_IP> (ended)' : '1. ec2-user@<EC2_PUBLIC_IP>', '<pre class="term" id="term"></pre>', n);
    var pre = document.getElementById('term');
    var oldL = n > 7 ? termLines(7, n - 1) : [], fresh = termLines(n, n), i = 0;
    clearTimeout(tm);
    oldL.forEach(function (l) { var c = addLine(pre, l); if (c) { c.textContent = l.t; } });
    (function next() {
      if (i >= fresh.length) {
        if (n < 12) { var d = document.createElement('div'); d.innerHTML = '<span class="pr"></span><span class="cur"></span>'; d.firstChild.textContent = PROMPT; pre.appendChild(d); }
        pre.scrollTop = pre.scrollHeight; return;
      }
      var l = fresh[i++], c = addLine(pre, l);
      if (l.k === 'cmd' && !reduced) {
        var j = 0; (function type() { c.textContent = l.t.slice(0, ++j); if (j < l.t.length) { tm = setTimeout(type, 35); } else { tm = setTimeout(next, 250); } })();
      } else { if (reduced) { next(); } else { tm = setTimeout(next, 70); } }
    })();
  }

  /* ---------- UI ---------- */
  var nav = document.getElementById('steps'), playBtn = document.getElementById('play'), btns = [], cur = 0, timer = null;
  STEPS.forEach(function (s, i) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'step';
    b.innerHTML = '<span class="num">' + (i + 1) + '</span><span><b></b><small></small></span>';
    b.querySelector('b').textContent = s.t; b.querySelector('small').textContent = s.sub;
    b.addEventListener('click', function () { stopPlay(); show(i + 1); });
    nav.appendChild(b); btns.push(b);
  });
  LEGEND.forEach(function (l) { var li = document.createElement('li'), sp = document.createElement('span'); sp.textContent = l[0]; li.appendChild(sp); li.appendChild(document.createTextNode(l[1])); document.getElementById('legend').appendChild(li); });
  var tc = document.getElementById('tcards');
  TROUBLE.forEach(function (t) { var d = document.createElement('div'); d.className = 'tc'; d.innerHTML = '<b></b><br>Cause: <span></span><br><i>Fix:</i> <span></span>'; d.querySelector('b').textContent = t[0]; var sp = d.querySelectorAll('span'); sp[0].textContent = t[1]; sp[1].textContent = t[2]; tc.appendChild(d); });

  function renderCmds(s) {
    var box = document.getElementById('cmds'); box.textContent = '';
    document.getElementById('cmd-head').textContent = s.cmds ? 'Commands' : 'What to click';
    if (!s.cmds) { var ol = document.createElement('ol'); ol.className = 'clicks'; (s.clicks || []).forEach(function (c) { var li = document.createElement('li'); li.textContent = c; ol.appendChild(li); }); box.appendChild(ol); return; }
    s.cmds.forEach(function (c) {
      var d = document.createElement('div'); d.className = 'cmd';
      d.innerHTML = '<div class="cmdtop"><code></code><button class="cpy" type="button">Copy</button></div><pre class="out"></pre><p class="mean"><b>What this means:</b> <span></span></p>';
      d.querySelector('code').textContent = c.c; d.querySelector('.out').textContent = c.out; d.querySelector('.mean span').textContent = c.mean;
      d.querySelector('.cpy').addEventListener('click', function (e) { var b = e.currentTarget; if (navigator.clipboard) { navigator.clipboard.writeText(c.c); } b.textContent = 'Copied'; setTimeout(function () { b.textContent = 'Copy'; }, 1200); });
      box.appendChild(d);
    });
    if (s.extra) { var p = document.createElement('p'); p.className = 'mean'; p.textContent = s.extra; box.appendChild(p); }
  }
  function show(n) {
    var fwd = n > cur; cur = n; var s = STEPS[n - 1];
    pieces.forEach(function (p) {
      var on = p.from <= n && n <= p.until; p.g.classList.toggle('hid', !on); p.g.classList.remove('new');
      if (on && p.from === n && (fwd || n === 1)) { void p.g.getBoundingClientRect(); p.g.classList.add('new'); }
    });
    svg.classList.toggle('s3', n >= 3);
    btns.forEach(function (b, i) { if (i + 1 === n) { b.setAttribute('aria-current', 'step'); } else { b.removeAttribute('aria-current'); } b.classList.toggle('done', i + 1 < n); });
    document.getElementById('cap-title').textContent = 'Step ' + n + ': ' + s.t;
    document.getElementById('cap-plain').textContent = s.plain; document.getElementById('cap-tech').textContent = s.tech;
    document.getElementById('cap-watch').textContent = s.watch; document.getElementById('cap-why').textContent = s.why;
    if (n >= 7) { renderTerm(n); } else { clearTimeout(tm); puttyEl.innerHTML = VIEWS[s.view || 'idle'](); }
    var co = document.getElementById('callouts'); co.hidden = n !== 7;
    if (n === 7) { co.innerHTML = '<span><code>ec2-user</code> who you are</span><span><code>@</code> at</span><span><code>ip-10-0-1-25</code> this server</span><span><code>~</code> your home folder</span><span><code>$</code> normal user (root shows #)</span>'; }
    document.getElementById('trouble').hidden = n !== 12;
    renderCmds(s);
  }
  function stopPlay() { if (timer) { clearInterval(timer); timer = null; } playBtn.setAttribute('aria-pressed', 'false'); playBtn.textContent = 'Auto-play'; }
  function startPlay() {
    if (cur >= STEPS.length) { show(1); }
    playBtn.setAttribute('aria-pressed', 'true'); playBtn.textContent = 'Pause';
    timer = setInterval(function () { if (cur >= STEPS.length) { stopPlay(); } else { show(cur + 1); } }, 6000);
  }
  playBtn.addEventListener('click', function () { if (timer) { stopPlay(); } else { startPlay(); } });
  document.getElementById('reset').addEventListener('click', function () { stopPlay(); show(1); });
  if (reduced && svg.pauseAnimations) { svg.pauseAnimations(); }
  show(1);
})();
