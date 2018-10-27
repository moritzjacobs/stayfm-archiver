const debug = require('debug')('stayfm:parseEnv')

if (process.env.MIXCLOUD_USER === undefined) {
	throw new Error('MIXCLOUD_USER is undefined')
} else {
	debug(`MIXCLOUD_USER is ${process.env.MIXCLOUD_USER}`)
}

if (process.env.SHOW_FOLDER === undefined) {
	throw new Error('SHOW_FOLDER is undefined')
} else {
	debug(`SHOW_FOLDER is ${process.env.SHOW_FOLDER}`)
}
