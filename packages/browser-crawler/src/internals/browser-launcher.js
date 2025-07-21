"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserLauncher = void 0;
var node_fs_1 = require("node:fs");
var node_module_1 = require("node:module");
var node_os_1 = require("node:os");
var basic_1 = require("@crawlee/basic");
var ow_1 = require("ow");
var DEFAULT_VIEWPORT = {
    width: 1366,
    height: 768,
};
var require = (0, node_module_1.createRequire)(import.meta.url);
/**
 * Abstract class for creating browser launchers, such as `PlaywrightLauncher` and `PuppeteerLauncher`.
 * @ignore
 */
var BrowserLauncher = /** @class */ (function () {
    /**
     * All `BrowserLauncher` parameters are passed via an launchContext object.
     */
    function BrowserLauncher(launchContext, config) {
        if (config === void 0) { config = basic_1.Configuration.getGlobalConfig(); }
        this.config = config;
        var launcher = launchContext.launcher, proxyUrl = launchContext.proxyUrl, useChrome = launchContext.useChrome, userAgent = launchContext.userAgent, _a = launchContext.launchOptions, launchOptions = _a === void 0 ? {} : _a, otherLaunchContextProps = __rest(launchContext, ["launcher", "proxyUrl", "useChrome", "userAgent", "launchOptions"]);
        this._validateProxyUrlProtocol(proxyUrl);
        // those need to be reassigned otherwise they are {} in types
        this.launcher = launcher;
        this.proxyUrl = proxyUrl;
        this.useChrome = useChrome;
        this.userAgent = userAgent;
        this.launchOptions = launchOptions;
        this.otherLaunchContextProps = otherLaunchContextProps;
    }
    BrowserLauncher.requireLauncherOrThrow = function (launcher, apifyImageName) {
        try {
            return require(launcher); // eslint-disable-line
        }
        catch (err) {
            var e = err;
            if (e.code === 'MODULE_NOT_FOUND') {
                var msg = "Cannot find module '".concat(launcher, "'. Did you you install the '").concat(launcher, "' package?\n") +
                    "Make sure you have '".concat(launcher, "' in your package.json dependencies and in your package-lock.json, if you use it.");
                if (process.env.APIFY_IS_AT_HOME) {
                    e.message = "".concat(msg, "\nOn the Apify platform, '").concat(launcher, "' can only be used with the ").concat(apifyImageName, " Docker image.");
                }
            }
            throw err;
        }
    };
    /**
     * @ignore
     */
    BrowserLauncher.prototype.createBrowserPlugin = function () {
        return new this.Plugin(this.launcher, __assign({ proxyUrl: this.proxyUrl, launchOptions: this.createLaunchOptions() }, this.otherLaunchContextProps));
    };
    /**
     * Launches a browser instance based on the plugin.
     * @returns Browser instance.
     */
    BrowserLauncher.prototype.launch = function () {
        var plugin = this.createBrowserPlugin();
        var context = plugin.createLaunchContext();
        return plugin.launch(context);
    };
    BrowserLauncher.prototype.createLaunchOptions = function () {
        var launchOptions = __assign({ args: [], defaultViewport: DEFAULT_VIEWPORT }, this.launchOptions);
        if (this.config.get('disableBrowserSandbox')) {
            launchOptions.args.push('--no-sandbox');
        }
        if (this.userAgent) {
            launchOptions.args.push("--user-agent=".concat(this.userAgent));
        }
        if (launchOptions.headless == null) {
            launchOptions.headless = this._getDefaultHeadlessOption();
        }
        if (this.useChrome && !launchOptions.executablePath) {
            launchOptions.executablePath = this._getChromeExecutablePath();
        }
        return launchOptions;
    };
    BrowserLauncher.prototype._getDefaultHeadlessOption = function () {
        return this.config.get('headless') && !this.config.get('xvfb', false);
    };
    BrowserLauncher.prototype._getChromeExecutablePath = function () {
        return this.config.get('chromeExecutablePath', this._getTypicalChromeExecutablePath());
    };
    /**
     * Gets a typical path to Chrome executable, depending on the current operating system.
     */
    BrowserLauncher.prototype._getTypicalChromeExecutablePath = function () {
        /**
         * Returns path of Chrome executable by its OS environment variable to deal with non-english language OS.
         * Taking also into account the old [chrome 380177 issue](https://bugs.chromium.org/p/chromium/issues/detail?id=380177).
         *
         * @ignore
         */
        var getWin32Path = function () {
            var chromeExecutablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
            var path00 = "".concat(process.env.ProgramFiles, "\\Google\\Chrome\\Application\\chrome.exe");
            var path86 = "".concat(process.env['ProgramFiles(x86)'], "\\Google\\Chrome\\Application\\chrome.exe");
            if (node_fs_1.default.existsSync(path00)) {
                chromeExecutablePath = path00;
            }
            else if (node_fs_1.default.existsSync(path86)) {
                chromeExecutablePath = path86;
            }
            return chromeExecutablePath;
        };
        switch (node_os_1.default.platform()) {
            case 'darwin':
                return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
            case 'win32':
                return getWin32Path();
            default:
                return '/usr/bin/google-chrome';
        }
    };
    BrowserLauncher.prototype._validateProxyUrlProtocol = function (proxyUrl) {
        if (!proxyUrl)
            return;
        if (!/^(http|https|socks4|socks5)/i.test(proxyUrl)) {
            throw new Error("Invalid \"proxyUrl\". Unsupported protocol: ".concat(proxyUrl, "."));
        }
        var url = new URL(proxyUrl);
        if (url.username || url.password) {
            if (url.protocol !== 'http:' && url.protocol !== 'https:') {
                throw new Error('Invalid "proxyUrl" option: authentication is only supported for HTTP proxy type.');
            }
        }
    };
    BrowserLauncher.optionsShape = {
        proxyUrl: ow_1.default.optional.string.url,
        useChrome: ow_1.default.optional.boolean,
        useIncognitoPages: ow_1.default.optional.boolean,
        browserPerProxy: ow_1.default.optional.boolean,
        userDataDir: ow_1.default.optional.string,
        launchOptions: ow_1.default.optional.object,
        userAgent: ow_1.default.optional.string,
    };
    return BrowserLauncher;
}());
exports.BrowserLauncher = BrowserLauncher;
