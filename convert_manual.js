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
            --emerald: #00D084;
            --gold: #F59E0B; /* More vibrant gold for better contrast */
            --dark-bg: #0F172A;
            --text-light: #F1F5F9;
            --accent-green: #34D399;
            --card-bg: #1E293B;
        }

        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.7;
            color: var(--text-light);
            background-color: var(--dark-bg);
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
            border-bottom: 1px solid #334155;
            padding-bottom: 10px;
        }

        p, li {
            font-size: 1.15em;
            margin-bottom: 1.2em;
            color: #CBD5E1;
        }

        /* Highlighted text readability */
        strong {
            color: #FFFFFF;
            background-color: rgba(0, 208, 132, 0.15);
            padding: 0 4px;
            border-radius: 2px;
            font-weight: 600;
        }

        /* Tags and Code Blocks */
        code {
            background-color: #020617;
            padding: 3px 8px;
            border-radius: 6px;
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
            color: #10B981; /* Brighter emerald for small text */
            font-size: 0.95em;
            border: 1px solid #334155;
        }

        pre {
            background-color: #020617;
            padding: 24px;
            border-radius: 12px;
            overflow-x: auto;
            border: 1px solid var(--gold);
            margin: 2em 0;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
        }

        pre code {
            padding: 0;
            background-color: transparent;
            color: #F8FAFC;
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
            padding: 1em 2em;
            background-color: #1E293B;
            font-style: italic;
            border-radius: 0 8px 8px 0;
        }

        /* PDF Optimization */
        @media print {
            body {
                background-color: white;
                color: #0F172A;
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
                border: 2px solid #000;
                background-color: #f8fafc;
                color: #000;
            }
            code {
                color: #065F46;
                background-color: #f1f5f9;
                border: 1px solid #cbd5e1;
            }
            strong {
                color: #000;
                background-color: #ecfdf5;
            }
            h1 { color: #065F46; border-bottom-color: #B45309; }
            h2 { color: #B45309; border-left-color: #065F46; }
            h3 { color: #047857; }
        }

        .hero {
            text-align: center;
            padding: 120px 20px;
            background: radial-gradient(circle at top, #064E3B 0%, #0F172A 100%);
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
