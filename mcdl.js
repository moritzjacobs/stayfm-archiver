const fs = require('fs')
const { promisify } = require('util')
const writeFile = promisify(fs.writeFile)
const unlinkFile = promisify(fs.unlink)

const axios = require('axios')
const debug = require('debug')('stayfm:mcdl')
const path = require('path')
const shortHash = require('short-hash')
const ytdl = require('ytdl-run')
const log = console.log

module.exports = async (account, showDir) => {
	let shows = await getShowsFromApi(account)
	shows.map(show => makeShowData(show, showDir))

	for (const show of shows) {
		debug(`Found "${show.name}" ...`)

		// download all new shows
		if (fs.existsSync(show.outputFile)) {
			debug(`Skipped "${show.name}" (${show.outputFile})`)
		} else {
			if (await downloadShow(show.url, show.outputFile)) {
				await writeJson(show.meta, show.hash, showDir)
				log(`Downloaded "${show.name}" to ${show.outputFile}`)
			} else {
				log(`Failed downloading "${show.name}" to ${show.outputFile}`)
			}
		}
	}
	await purgeFailedDownloads(showDir)
}

async function downloadShow (url, outputFile) {
	try {
		await ytdl(['-o', outputFile, url])
		return true
	} catch (error) {
		console.error(error)
		return false
	}
}

function parseMeta (str, seperator = ' - ') {
	const pieces = str.split(seperator)
	return {
		title: pieces[0],
		host: pieces[2],
		date: pieces[1]
	}
}

async function writeJson (obj, hash, to) {
	const jsonFile = path.resolve(to, `${hash}.json`)
	await writeFile(jsonFile, JSON.stringify(obj, null, 4), 'utf-8')
}

function makeShowData (show, to) {
	show.hash = shortHash(show.key)
	show.meta = parseMeta(show.name)
	show.outputFile = path.resolve(to, `${show.hash}.m4a`)
	return show
}

async function getShowsFromApi (account) {
	const { data } = await axios.get(
		`https://api.mixcloud.com/${account}/cloudcasts/?limit=100`
	)
	return data.data
}

async function purgeFailedDownloads (dir, ext = '.part') {
	const allFiles = fs.readdirSync(dir)
	const filesToPurge = allFiles.filter(file => {
		return file.indexOf(ext) === file.length - ext.length
	})
	for (const file of filesToPurge) {
		log(`Deleting failed download: ${file}`)
		await unlinkFile(path.join(dir, file))
	}
}
