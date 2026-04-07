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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');

        :root {
            --emerald: #059669; /* Slightly deeper emerald for white background */
            --gold: #B45309; /* Deeper gold for contrast */
            --bg-light: #FFFFFF;
            --text-dark: #1E293B;
            --accent-green: #10B981;
            --code-bg: #ECFDF5;
            --pre-bg: #F8FAFC;
            --hero-bg: #0F172A;
        }

        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.7;
            color: var(--text-dark);
            background-color: var(--bg-light);
            margin: 0;
            padding: 0;
            font-size: 16px;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 60px 40px;
        }

        h1, h2, h3, h4 {
            font-family: 'Playfair Display', serif;
            color: var(--emerald);
            margin-top: 2em;
            letter-spacing: -0.02em;
        }

        h1 {
            font-size: 3.5em;
            font-weight: 800;
            border-bottom: 3px solid var(--gold);
            padding-bottom: 0.5em;
            text-align: center;
            color: #FFFFFF;
        }

        h2 {
            font-size: 2.2em;
            color: var(--gold);
            border-left: 6px solid var(--emerald);
            padding-left: 20px;
            margin-bottom: 1em;
        }

        h3 {
            font-size: 1.6em;
            color: var(--accent-green);
            border-bottom: 1px solid #E2E8F0;
            padding-bottom: 10px;
        }

        p, li {
            font-size: 1.15em;
            margin-bottom: 1.2em;
            color: #334155;
        }

        /* Highlighted text readability */
        strong {
            color: #064E3B;
            background-color: rgba(16, 185, 129, 0.1);
            padding: 0 4px;
            border-radius: 2px;
            font-weight: 600;
        }

        /* Tags and Code Blocks */
        code {
            background-color: var(--code-bg);
            padding: 3px 8px;
            border-radius: 4px;
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
            color: #065F46;
            font-size: 0.9em;
            border: 1px solid #A7F3D0;
        }

        pre {
            background-color: var(--pre-bg);
            padding: 24px;
            border-radius: 8px;
            overflow-x: auto;
            border: 1px solid #E2E8F0;
            margin: 2em 0;
        }

        pre code {
            padding: 0;
            background-color: transparent;
            color: #1E293B;
            border: none;
            line-height: 1.5;
        }

        hr {
            border: 0;
            height: 2px;
            background: linear-gradient(to right, transparent, var(--gold), transparent);
            margin: 60px 0;
        }

        ul, ol {
            padding-left: 1.5em;
            margin-bottom: 2em;
        }

        li::marker {
            color: var(--gold);
        }

        blockquote {
            border-left: 4px solid var(--gold);
            margin: 2em 0;
            padding: 1.5em 2em;
            background-color: #FDFCFB;
            font-style: italic;
            border-radius: 0 8px 8px 0;
            color: #475569;
            border-top: 1px solid #F1F5F9;
            border-right: 1px solid #F1F5F9;
            border-bottom: 1px solid #F1F5F9;
        }

        /* PDF Optimization */
        @media print {
            body {
                background-color: white;
                color: #000000;
            }
            .container {
                max-width: 100%;
                padding: 0;
            }
            pre, blockquote {
                page-break-inside: avoid;
            }
        }

        .hero {
            text-align: center;
            padding: 120px 20px;
            background: radial-gradient(circle at top, #064E3B 0%, var(--hero-bg) 100%);
            margin-bottom: 0;
            border-bottom: 8px solid var(--gold);
        }

        .hero h1 {
            font-size: 4.5em;
            margin: 0;
            text-shadow: 0 4px 6px rgba(0,0,0,0.5);
        }

        .hero p {
            color: var(--gold);
            font-size: 1.8em;
            font-weight: 700;
            font-family: 'Playfair Display', serif;
            margin-top: 10px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }
    </style>
</head>
<body>
    <div class="hero">
        <h1>Emerald Sonic Architecture</h1>
        <p>Professional Masterclass: Suno AI v5.5</p>
    </div>
    <div class="container">
        ${marked.parse(markdown)}
    </div>
</body>
</html>
`;

// Save the HTML file
fs.writeFileSync('emerald_suno_manual/emerald_suno_v55_course.html', html);
console.log('Final Cleaned HTML Manual generated successfully.');
