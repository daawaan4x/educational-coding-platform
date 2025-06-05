import readline from 'readline'

let input = ''

function main() {
    console.log("Hello World!")
}



// Helper to read from STDIN

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
})

rl.on('line', (line) => {
    input += line + '\n'
})

rl.on('close', main)