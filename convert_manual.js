const fs = require('fs');
const marked = require('marked');

// Read the Master Markdown file
const markdown = fs.readFileSync('emerald_suno_manual/emerald_suno_v55_master_manual.md', 'utf8');

// HTML Template with CSS
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Emerald Sonic Architecture: Suno AI v5.5 Professional Course</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@700&display=swap');

        :root {
            --emerald: #00D084;
            --gold: #D4AF37;
            --dark-bg: #0F172A;
            --text-light: #F8FAFC;
            --accent-green: #10B981;
        }

        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: var(--text-light);
            background-color: var(--dark-bg);
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 40px 20px;
        }

        h1, h2, h3 {
            font-family: 'Playfair Display', serif;
            color: var(--emerald);
            margin-top: 1.5em;
        }

        h1 {
            font-size: 3em;
            border-bottom: 2px solid var(--gold);
            padding-bottom: 0.5em;
            text-align: center;
        }

        h2 {
            font-size: 2em;
            color: var(--gold);
            border-left: 5px solid var(--emerald);
            padding-left: 15px;
        }

        h3 {
            font-size: 1.5em;
            color: var(--accent-green);
        }

        p, li {
            font-size: 1.1em;
            margin-bottom: 1em;
        }

        strong {
            color: var(--gold);
        }

        code {
            background-color: #1E293B;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', Courier, monospace;
            color: var(--emerald);
        }

        pre {
            background-color: #1E293B;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            border-left: 3px solid var(--gold);
        }

        pre code {
            padding: 0;
            background-color: transparent;
        }

        hr {
            border: 0;
            height: 1px;
            background: linear-gradient(to right, transparent, var(--gold), transparent);
            margin: 40px 0;
        }

        /* PDF Optimization */
        @media print {
            body {
                background-color: white;
                color: black;
            }
            .container {
                max-width: 100%;
                padding: 0;
            }
            h1, h2, h3 {
                page-break-after: avoid;
            }
            pre {
                page-break-inside: avoid;
                border: 1px solid #ccc;
                background-color: #f9f9f9;
                color: black;
            }
            code {
                color: #065F46;
            }
            h1 { color: #059669; }
            h2 { color: #B45309; }
            h3 { color: #047857; }
        }

        .chapter-start {
            page-break-before: always;
        }

        .hero {
            text-align: center;
            padding: 100px 0;
            background: linear-gradient(135deg, #0F172A 0%, #064E3B 100%);
            margin-bottom: 50px;
            border-bottom: 5px solid var(--gold);
        }

        .hero h1 {
            color: white;
            border: none;
        }

        .hero p {
            color: var(--gold);
            font-size: 1.5em;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="hero">
        <h1>Emerald Sonic Architecture</h1>
        <p>The Definitive Professional Guide to Suno AI v5.5</p>
    </div>
    <div class="container">
        ${marked.parse(markdown)}
    </div>
</body>
</html>
`;

// Save the HTML file
fs.writeFileSync('emerald_suno_manual/emerald_suno_v55_course.html', html);
console.log('HTML Manual generated successfully at emerald_suno_manual/emerald_suno_v55_course.html');
