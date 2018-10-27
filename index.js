const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '/.env') })
require('./parseEnv')

const mcdl = require('./mcdl')
let tool = process.argv[2]
if (tool === undefined) {
	tool = 'mcdl'
}

const cli = {
	mcdl: () => mcdl(process.env.MIXCLOUD_USER, process.env.SHOW_FOLDER)
}

;(async () => {
	try {
		await cli[tool]()
	} catch (error) {
		console.error(`"${tool} is not a tool...`)
	}
})()
