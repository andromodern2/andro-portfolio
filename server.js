const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const PROJECTS_FILE = path.join(PUBLIC_DIR, 'projects.json');
const ADMIN_CONFIG_FILE = path.join(PUBLIC_DIR, 'admin-config.json');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'assets', 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function getPasscode() {
  if (process.env.ADMIN_PASSCODE) {
    return process.env.ADMIN_PASSCODE;
  }
  try {
    if (fs.existsSync(ADMIN_CONFIG_FILE)) {
      const data = JSON.parse(fs.readFileSync(ADMIN_CONFIG_FILE, 'utf8'));
      return data.passcode || 'owner2026';
    }
  } catch (e) {}
  return 'owner2026';
}

function setPasscode(newPasscode) {
  fs.writeFileSync(ADMIN_CONFIG_FILE, JSON.stringify({ passcode: newPasscode }, null, 2));
}

function getProjects() {
  try {
    if (fs.existsSync(PROJECTS_FILE)) {
      return JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf8'));
    }
  } catch (e) {}
  return [];
}

function saveProjects(projects) {
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 50 * 1024 * 1024) { // 50MB max upload
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const urlParts = req.url.split('?');
  let reqPath = decodeURI(urlParts[0]);

  // Dynamic API endpoint to automatically discover homepage portrait frames
  if (reqPath === '/api/frames') {
    const dir = path.join(PUBLIC_DIR, 'ezgif-1e0c0c9ff8d5094e-jpg');
    fs.readdir(dir, (err, files) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
        return;
      }
      const jpgs = files
        .filter(f => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg') || f.toLowerCase().endsWith('.webp') || f.toLowerCase().endsWith('.png'))
        .sort((a, b) => a.localeCompare(undefined, { numeric: true, sensitivity: 'base' }))
        .map(f => 'ezgif-1e0c0c9ff8d5094e-jpg/' + f);

      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify(jpgs));
    });
    return;
  }

  // Dynamic API endpoint to discover project section frames
  if (reqPath === '/api/project-frames' || reqPath === '/api/frames/projects') {
    const candidateDirs = ['jpgs for the project section', 'jpgs for project section', 'project-frames'];
    let targetDirName = candidateDirs.find(d => fs.existsSync(path.join(PUBLIC_DIR, d))) || 'jpgs for the project section';
    const dir = path.join(PUBLIC_DIR, targetDirName);

    fs.readdir(dir, (err, files) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
        return;
      }
      const jpgs = files
        .filter(f => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg') || f.toLowerCase().endsWith('.webp') || f.toLowerCase().endsWith('.png'))
        .sort((a, b) => a.localeCompare(undefined, { numeric: true, sensitivity: 'base' }))
        .map(f => encodeURI(targetDirName + '/' + f));

      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify(jpgs));
    });
    return;
  }

  // API: Get all projects
  if (reqPath === '/api/projects' && req.method === 'GET') {
    const projects = getProjects();
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(projects));
    return;
  }

  // API: Owner Authentication
  if (reqPath === '/api/auth' && req.method === 'POST') {
    const body = await parseBody(req);
    const validPasscode = getPasscode();
    if (body.passcode === validPasscode) {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ success: true, token: 'auth-' + Date.now() }));
    } else {
      res.writeHead(401, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ success: false, message: 'Incorrect passcode' }));
    }
    return;
  }

  // API: Change Passcode
  if (reqPath === '/api/change-passcode' && req.method === 'POST') {
    const body = await parseBody(req);
    const validPasscode = getPasscode();
    if (body.currentPasscode !== validPasscode) {
      res.writeHead(401, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ success: false, message: 'Current passcode is incorrect' }));
      return;
    }
    if (!body.newPasscode || body.newPasscode.trim().length < 3) {
      res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ success: false, message: 'New passcode must be at least 3 characters' }));
      return;
    }
    setPasscode(body.newPasscode.trim());
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ success: true, message: 'Passcode updated successfully' }));
    return;
  }

  // API: Add or Update Project
  if (reqPath === '/api/projects' && req.method === 'POST') {
    const body = await parseBody(req);
    const validPasscode = getPasscode();
    if (body.passcode !== validPasscode) {
      res.writeHead(401, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ success: false, message: 'Unauthorized. Passcode required.' }));
      return;
    }

    const projects = getProjects();
    const newProject = {
      id: body.id || 'proj-' + Date.now(),
      title: body.title || 'Untitled Project',
      category: body.category || 'Web Applications',
      description: body.description || '',
      image: body.image || 'assets/card1.jpg',
      liveUrl: body.liveUrl || '#',
      tags: Array.isArray(body.tags) ? body.tags : (body.tags ? body.tags.split(',').map(t => t.trim()) : []),
      year: body.year || String(new Date().getFullYear()),
      featured: !!body.featured
    };

    const existingIndex = projects.findIndex(p => p.id === newProject.id);
    if (existingIndex >= 0) {
      projects[existingIndex] = newProject;
    } else {
      projects.unshift(newProject);
    }

    saveProjects(projects);
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ success: true, project: newProject, projects }));
    return;
  }

  // API: Delete Project
  if (reqPath.startsWith('/api/projects/') && req.method === 'DELETE') {
    const projId = reqPath.replace('/api/projects/', '');
    const body = await parseBody(req);
    const validPasscode = getPasscode();
    if (body.passcode !== validPasscode) {
      res.writeHead(401, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
      return;
    }

    let projects = getProjects();
    projects = projects.filter(p => p.id !== projId);
    saveProjects(projects);
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ success: true, projects }));
    return;
  }

  // API: Upload Project Image (base64)
  if (reqPath === '/api/upload' && req.method === 'POST') {
    const body = await parseBody(req);
    const validPasscode = getPasscode();
    if (body.passcode !== validPasscode) {
      res.writeHead(401, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
      return;
    }

    if (!body.data || !body.filename) {
      res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ success: false, message: 'Missing data or filename' }));
      return;
    }

    const matches = body.data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const buffer = matches ? Buffer.from(matches[2], 'base64') : Buffer.from(body.data, 'base64');
    const safeFilename = Date.now() + '-' + body.filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const destPath = path.join(UPLOADS_DIR, safeFilename);

    fs.writeFileSync(destPath, buffer);
    const relativeUrl = 'assets/uploads/' + safeFilename;
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ success: true, url: relativeUrl }));
    return;
  }

  // Static files
  if (reqPath === '/') {
    reqPath = '/index.html';
  }

  const safePath = path.normalize(path.join(PUBLIC_DIR, reqPath));

  if (!safePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    const headers = {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Access-Control-Allow-Origin': '*'
    };

    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.js' || ext === '.css') {
      headers['Cache-Control'] = 'public, max-age=86400';
    } else {
      headers['Cache-Control'] = 'no-cache';
    }

    res.writeHead(200, headers);
    const stream = fs.createReadStream(safePath);
    stream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at:`);
  console.log(`- Local:   http://localhost:${PORT}`);
  console.log(`- Network: http://127.0.0.1:${PORT}`);
});
