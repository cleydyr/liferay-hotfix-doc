'use strict';

const base64 = require('base-64');
const rp = require('request-promise-native');
const xml2js = require('xml2js');
const parser = new xml2js.Parser({
	emptyTag: undefined,
	explicitArray: false,
});

const ps = parser.parseString;

const debug = require('debug')('hotifx-doc');

const parseString_ = xml => {
	debug(`parseString called with xml ${xml}`);
	return new Promise((resolve, reject) =>
		ps(xml, (err, result) => {
			if (err) {
				debug(`there's an error: ${err}`);
				reject(err);
			} else if (!xml) {
				debug(`no xml`);
				const messageObj = {
					code: 404,
					message: `Metadata for hotfix can't be found. Verify the id and version and try again.`,
				};
				reject(new Error(JSON.stringify(messageObj)));
			} else {
				debug(`response is okay`);
				resolve(result);
			}
		})
	);
};

const proceed_ = (id, version, config) => {
	debug(`proceed_ called with args (${id}, ${version})`);
	const url = `${config.server}${version[0]}.${version[1]}.${version.slice(
		2,
		4
	)}/${id}-${version}`;
	const options = {
		url: url,
		headers: {
			Auth: `${base64.encode(`${config.user}:${config.password}`)}`,
		},
	};
	return rp(options).then(parseString_);
};

class HotfixDoc {
	constructor(config) {
		this.config = config;
	}

	getDocumentation(...args) {
		debug(`getDocumentation called with args ${args}`);
		if (args.length == 1) {
			const hotfixId = args[0];
			const hotfixIdMatches = /(\d+)-(\d+)/g.exec(hotfixId);
			if (hotfixIdMatches) {
				return proceed_(hotfixIdMatches[1], hotfixIdMatches[2],
					this.config);
			} else {
				return Promise.reject(`Argument ${hotfixId} can't be parsed.`);
			}
		} else if (args.length == 2) {
			return proceed_(args[0], args[1], this.config);
		} else {
			return Promise.reject(`Too many arguments`);
		}
	}
}

module.exports = HotfixDoc;
