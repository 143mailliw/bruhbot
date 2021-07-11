// create a function to generate a status object
// include memory and cpu usages
// include the status of the process
// include the process id
// include the uptime of the process

function getStatus() {
    var status = {};
    status.memory = getMemory();
    status.cpu = getCpu();
    status.process = getProcess();
    status.pid = getPid();
    status.uptime = getUptime();
    return status;
}

function getMemory() {
    var mem = {};
    mem.total = process.memoryUsage().heapTotal;
    mem.used = process.memoryUsage().heapUsed;
    mem.free = process.memoryUsage().heapFree;
    return mem;
}

function getCpu() {
    var cpu = {};
    cpu.user = process.cpuUsage().user;
    cpu.system = process.cpuUsage().system;
    return cpu;
}

function getPid() {
    return process.pid;
}

function getUptime() {
    return process.uptime();
}

function getProcess() {
    return process.title;
}

module.exports = {
  getStatus
};