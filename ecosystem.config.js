const watch = process.env.NODE_ENV === 'production' ? false : true;
const ignore_watch = ['logs', 'node_modules', 'tools', 'storage', './test'];
const max_memory_restart = '4000M';
const node_args = ['--max_old_space_size=4096'];
const mode = process.env.DEPLOYMENT_MODE || 'all';
const initializeMode = (modeString = '') => {
	let modes = [];
	modeString.split(',').forEach((mode = '') => {
		modes.push(mode.toLowerCase().trim());
	});
	return modes;
};


const api = {
	name      : 'api',
	script    : 'app.js',
	error_file: '/dev/null',
	out_file: '/dev/null',
	watch,
	ignore_watch,
	exec_mode : 'cluster',
	instance_var: 'INSTANCE_ID',
	instances : '1',
	max_memory_restart,
	node_args,
	env: {
		COMMON_VARIABLE: 'true',
		PORT: process.env.PORT || 10010,
	}
};

const jobs = {
	// jobs application
	name      : 'jobs',
	script    : 'jobs/index.js',
	error_file: '/dev/null',
	out_file: '/dev/null',
	watch,
	ignore_watch,
	instances : '1',
	max_memory_restart,
	node_args,
	env: {
		COMMON_VARIABLE: 'true'
	}
};

var apps = [];
const modes = initializeMode(mode);
for (let m of modes) {
	if (m === 'all') {
		apps = [api, jobs];
		break;
	} else if (m === 'api') {
		apps.push(api);
	} else if (m === 'jobs') {
		apps.push(jobs);
	}
}

module.exports = {
	/**
		* Application configuration section
		* http://pm2.keymetrics.io/docs/usage/application-declaration/
	*/
	apps
};
