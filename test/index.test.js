const { expect } = require('chai'),
    fs = require('fs'),
    os = require('os'),
    path = require('path'),
    sinon = require('sinon');
describe('std-pour', function () {
    const { pour, pourFile } = require(path.join('..', 'index.js')),
        stdoutCmd = 'node',
        stdoutArgs = ['-v'],
        stderrCmd = 'dir',
        stderrArgs = ['does.not.exist'],
        opts = {

        };
    describe('pour', function () {
        let stdout, stderr;
        beforeEach(() => {
            stdout = sinon.stub({
                write: Function(),
            });
            stderr = sinon.stub({
                write: Function(),
            });
        });
        it('should write to stdout', function () {
            return pour(stdoutCmd, stdoutArgs, opts, stdout, stderr).then(code => {
                expect(stdout.write.args.toString().trim()).to.be.eq(process.version);
                expect(stderr.write.args.toString().trim()).to.be.empty;
            });
        });
        it('should write to stderr', function () {
            const _cmd = 'dir'
            const _args = ['does.not.exist'];
            return pour(stderrCmd, stderrArgs, opts, stdout, stderr).then(code => {
                expect(stdout.write.args.toString().trim()).to.be.empty;
                expect(stderr.write.args.toString().trim()).to.not.be.empty;
            });
        });
        it('should return error code', function () {
            return pour(stdoutCmd, stdoutArgs, opts, stdout, stderr).then(code => {
                expect(code).to.be.eq(0);
            });
        });
    });
    describe('pourFile', function () {
        const stdout = path.join(os.tmpdir(), 'std-pour.test.stdout'),
            stderr = path.join(os.tmpdir(), 'std-pour.test.stderr');
        beforeEach(() => {
            return Promise.all([
                new Promise((resolve, reject) => {
                    fs.stat(stdout, (existsErr, stats) => {
                        if (existsErr === null) {
                            fs.unlink(stdout, err => {
                                if (err) {
                                    reject(err);
                                }
                                resolve();
                            })
                        } else {
                            resolve();
                        }
                    });
                }),
                new Promise((resolve, reject) => {
                    fs.stat(stderr, (existsErr, stats) => {
                        if (existsErr === null) {
                            fs.unlink(stderr, err => {
                                if (err) {
                                    reject(err);
                                }
                                resolve();
                            })
                        } else {
                            resolve();
                        }
                    });
                })
            ]);
        });
        it('should save stdout to file', function () {
            return pourFile(stdoutCmd, stdoutArgs, opts, stdout, stderr).then(code => {
                return new Promise((resolve, reject) => {
                    fs.stat(stdout, (stdoutExistsErr, stdoutStats) => {
                        expect(stdoutExistsErr).to.be.eq(null);
                        fs.stat(stderr, (stderrExistsErr, stderrStats) => {
                            expect(stderrExistsErr).to.be.eq(null);
                            fs.readFile(stdout, (err, data) => {
                                expect(data.toString().trim()).to.be.eq(process.version);
                                resolve();
                            })
                        });
                    });
                });
            });
        });
        it('should save stderr to file', function () {
            return pourFile(stderrCmd, stderrArgs, opts, stdout, stderr).then(code => {
                return new Promise((resolve, reject) => {
                    fs.stat(stdout, (stdoutExistsErr, stdoutStats) => {
                        expect(stdoutExistsErr).to.be.eq(null);
                        fs.stat(stderr, (stderrExistsErr, stderrStats) => {
                            expect(stderrExistsErr).to.be.eq(null);
                            fs.readFile(stderr, (err, data) => {
                                expect(data.toString().trim()).to.not.be.empty;
                                resolve();
                            })
                        });
                    });
                });
            });
        });
        it('should save stdout & stderr to same file if stderrFile not supplied', function () {
            return pourFile(stdoutCmd, stdoutArgs, opts, stdout).then(code => {
                return new Promise((resolve, reject) => {
                    fs.stat(stdout, (stdoutExistsErr, stdoutStats) => {
                        expect(stdoutExistsErr).to.be.eq(null);
                        fs.stat(stderr, (stderrExistsErr, stderrStats) => {
                            expect(stderrExistsErr).to.exist;
                            expect(stderrExistsErr.code).to.be.eq('ENOENT');
                            fs.readFile(stdout, (err, data) => {
                                expect(data.toString().trim()).to.be.eq(process.version);
                                resolve();
                            })
                        });
                    });
                });
            });
        });
        it('should return error code', function () {
            return pourFile(stdoutCmd, stdoutArgs, opts, stdout, stderr).then(code => {
                expect(code).to.be.eq(0);
            });
        });
    });
});