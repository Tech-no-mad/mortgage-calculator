const puppeteer = require('puppeteer');

(async () => {
    console.log("Starting server...");
    const { spawn } = require('child_process');
    const server = spawn('npm', ['run', 'dev'], { shell: true });
    
    server.stdout.on('data', (data) => {
        if (data.toString().includes('Local')) {
            console.log("Server is running. Launching puppeteer...");
            runTest();
        }
    });
    
    async function runTest() {
        try {
            const browser = await puppeteer.launch({ headless: 'new' });
            const page = await browser.newPage();
            
            page.on('console', msg => console.log('PAGE LOG:', msg.text()));
            page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
            
            await page.goto('http://localhost:4321', { waitUntil: 'networkidle0' });
            
            console.log("Page loaded. Clicking chat toggle...");
            
            // Wait a sec for scripts to execute
            await new Promise(r => setTimeout(r, 1000));
            
            const chatToggle = await page.$('#chat-toggle');
            if (chatToggle) {
                console.log("Found chat toggle. Clicking...");
                await chatToggle.click();
                
                await new Promise(r => setTimeout(r, 500));
                
                // test typing
                await page.type('#chat-input', 'western');
                await new Promise(r => setTimeout(r, 1000));
                
                const html = await page.$eval('#chat-autocomplete', el => el.innerHTML);
                console.log("Autocomplete HTML:", html.trim() ? "Has Content" : "Empty");
                
                await browser.close();
                server.kill();
                process.exit(0);
            } else {
                console.log("Could not find chat toggle!");
                await browser.close();
                server.kill();
                process.exit(1);
            }
        } catch(e) {
            console.error(e);
            server.kill();
            process.exit(1);
        }
    }
})();
