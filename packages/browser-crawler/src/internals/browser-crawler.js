"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserCrawler = void 0;
exports.browserCrawlerEnqueueLinks = browserCrawlerEnqueueLinks;
exports.extractUrlsFromPage = extractUrlsFromPage;
var basic_1 = require("@crawlee/basic");
var browser_pool_1 = require("@crawlee/browser-pool");
var utils_1 = require("@crawlee/utils");
var ow_1 = require("ow");
var timeout_1 = require("@apify/timeout");
/**
 * Provides a simple framework for parallel crawling of web pages
 * using headless browsers with [Puppeteer](https://github.com/puppeteer/puppeteer)
 * and [Playwright](https://github.com/microsoft/playwright).
 * The URLs to crawl are fed either from a static list of URLs
 * or from a dynamic queue of URLs enabling recursive crawling of websites.
 *
 * Since `BrowserCrawler` uses headless (or even headful) browsers to download web pages and extract data,
 * it is useful for crawling of websites that require to execute JavaScript.
 * If the target website doesn't need JavaScript, we should consider using the {@apilink CheerioCrawler},
 * which downloads the pages using raw HTTP requests and is about 10x faster.
 *
 * The source URLs are represented by the {@apilink Request} objects that are fed from the {@apilink RequestList} or {@apilink RequestQueue} instances
 * provided by the {@apilink BrowserCrawlerOptions.requestList|`requestList`} or {@apilink BrowserCrawlerOptions.requestQueue|`requestQueue`}
 * constructor options, respectively. If neither `requestList` nor `requestQueue` options are provided,
 * the crawler will open the default request queue either when the {@apilink BrowserCrawler.addRequests|`crawler.addRequests()`} function is called,
 * or if `requests` parameter (representing the initial requests) of the {@apilink BrowserCrawler.run|`crawler.run()`} function is provided.
 *
 * If both {@apilink BrowserCrawlerOptions.requestList|`requestList`} and {@apilink BrowserCrawlerOptions.requestQueue|`requestQueue`} options are used,
 * the instance first processes URLs from the {@apilink RequestList} and automatically enqueues all of them
 * to the {@apilink RequestQueue} before it starts their processing. This ensures that a single URL is not crawled multiple times.
 *
 * The crawler finishes when there are no more {@apilink Request} objects to crawl.
 *
 * `BrowserCrawler` opens a new browser page (i.e. tab or window) for each {@apilink Request} object to crawl
 * and then calls the function provided by user as the {@apilink BrowserCrawlerOptions.requestHandler|`requestHandler`} option.
 *
 * New pages are only opened when there is enough free CPU and memory available,
 * using the functionality provided by the {@apilink AutoscaledPool} class.
 * All {@apilink AutoscaledPool} configuration options can be passed to the {@apilink BrowserCrawlerOptions.autoscaledPoolOptions|`autoscaledPoolOptions`}
 * parameter of the `BrowserCrawler` constructor.
 * For user convenience, the {@apilink AutoscaledPoolOptions.minConcurrency|`minConcurrency`} and
 * {@apilink AutoscaledPoolOptions.maxConcurrency|`maxConcurrency`} options of the
 * underlying {@apilink AutoscaledPool} constructor are available directly in the `BrowserCrawler` constructor.
 *
 * > *NOTE:* the pool of browser instances is internally managed by the {@apilink BrowserPool} class.
 *
 * @category Crawlers
 */
var BrowserCrawler = /** @class */ (function (_super) {
    __extends(BrowserCrawler, _super);
    /**
     * All `BrowserCrawler` parameters are passed via an options object.
     */
    function BrowserCrawler(options, config) {
        if (options === void 0) { options = {}; }
        if (config === void 0) { config = basic_1.Configuration.getGlobalConfig(); }
        var _this = this;
        var _a;
        var _b;
        (0, ow_1.default)(options, 'BrowserCrawlerOptions', ow_1.default.object.exactShape(BrowserCrawler.optionsShape));
        var _c = options.navigationTimeoutSecs, navigationTimeoutSecs = _c === void 0 ? 60 : _c, _d = options.requestHandlerTimeoutSecs, requestHandlerTimeoutSecs = _d === void 0 ? 60 : _d, persistCookiesPerSession = options.persistCookiesPerSession, proxyConfiguration = options.proxyConfiguration, _e = options.launchContext, launchContext = _e === void 0 ? {} : _e, browserPoolOptions = options.browserPoolOptions, _f = options.preNavigationHooks, preNavigationHooks = _f === void 0 ? [] : _f, _g = options.postNavigationHooks, postNavigationHooks = _g === void 0 ? [] : _g, requestHandler = options.requestHandler, headless = options.headless, ignoreShadowRoots = options.ignoreShadowRoots, ignoreIframes = options.ignoreIframes, basicCrawlerOptions = __rest(options, ["navigationTimeoutSecs", "requestHandlerTimeoutSecs", "persistCookiesPerSession", "proxyConfiguration", "launchContext", "browserPoolOptions", "preNavigationHooks", "postNavigationHooks", "requestHandler", "headless", "ignoreShadowRoots", "ignoreIframes"]);
        _this = _super.call(this, __assign(__assign({}, basicCrawlerOptions), { requestHandler: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, this._runRequestHandler.apply(this, args)];
                }); });
            }, requestHandlerTimeoutSecs: navigationTimeoutSecs + requestHandlerTimeoutSecs + basic_1.BASIC_CRAWLER_TIMEOUT_BUFFER_SECS }), config) || this;
        _this.config = config;
        _this.userProvidedRequestHandler = requestHandler !== null && requestHandler !== void 0 ? requestHandler : _this.router;
        // Cookies should be persisted per session only if session pool is used
        if (!_this.useSessionPool && persistCookiesPerSession) {
            throw new Error('You cannot use "persistCookiesPerSession" without "useSessionPool" set to true.');
        }
        _this.launchContext = launchContext;
        _this.navigationTimeoutMillis = navigationTimeoutSecs * 1000;
        _this.requestHandlerTimeoutInnerMillis = requestHandlerTimeoutSecs * 1000;
        _this.proxyConfiguration = proxyConfiguration;
        _this.preNavigationHooks = preNavigationHooks;
        _this.postNavigationHooks = postNavigationHooks;
        if (headless != null) {
            (_a = (_b = _this.launchContext).launchOptions) !== null && _a !== void 0 ? _a : (_b.launchOptions = {});
            _this.launchContext.launchOptions.headless = headless;
        }
        if (_this.useSessionPool) {
            _this.persistCookiesPerSession = persistCookiesPerSession !== undefined ? persistCookiesPerSession : true;
        }
        else {
            _this.persistCookiesPerSession = false;
        }
        if (launchContext === null || launchContext === void 0 ? void 0 : launchContext.userAgent) {
            if (browserPoolOptions.useFingerprints)
                _this.log.info('Custom user agent provided, disabling automatic browser fingerprint injection!');
            browserPoolOptions.useFingerprints = false;
        }
        var _h = browserPoolOptions.preLaunchHooks, preLaunchHooks = _h === void 0 ? [] : _h, _j = browserPoolOptions.postLaunchHooks, postLaunchHooks = _j === void 0 ? [] : _j, rest = __rest(browserPoolOptions, ["preLaunchHooks", "postLaunchHooks"]);
        _this.browserPool = new browser_pool_1.BrowserPool(__assign(__assign({}, rest), { preLaunchHooks: __spreadArray([_this._extendLaunchContext.bind(_this)], preLaunchHooks, true), postLaunchHooks: __spreadArray([_this._maybeAddSessionRetiredListener.bind(_this)], postLaunchHooks, true) }));
        return _this;
    }
    BrowserCrawler.prototype._cleanupContext = function (crawlingContext) {
        return __awaiter(this, void 0, void 0, function () {
            var page;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        page = crawlingContext.page;
                        if (!page) return [3 /*break*/, 2];
                        return [4 /*yield*/, page.close().catch(function (error) { return _this.log.debug('Error while closing page', { error: error }); })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    BrowserCrawler.prototype.containsSelectors = function (page, selectors) {
        return __awaiter(this, void 0, void 0, function () {
            var foundSelectors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(selectors.map(function (selector) { return page.$(selector); }))];
                    case 1:
                        foundSelectors = (_a.sent())
                            .map(function (x, i) { return [x, selectors[i]]; })
                            .filter(function (_a) {
                            var x = _a[0];
                            return x !== null;
                        })
                            .map(function (_a) {
                            var selector = _a[1];
                            return selector;
                        });
                        return [2 /*return*/, foundSelectors.length > 0 ? foundSelectors : null];
                }
            });
        });
    };
    BrowserCrawler.prototype.isRequestBlocked = function (crawlingContext) {
        return __awaiter(this, void 0, void 0, function () {
            var page, response, blockedStatusCodes, foundSelectors_1, foundSelectors, blockedStatusCode;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        page = crawlingContext.page, response = crawlingContext.response;
                        blockedStatusCodes = 
                        // eslint-disable-next-line dot-notation
                        ((_b = (_a = this.sessionPool) === null || _a === void 0 ? void 0 : _a['blockedStatusCodes'].length) !== null && _b !== void 0 ? _b : 0) > 0
                            ? // eslint-disable-next-line dot-notation
                                this.sessionPool['blockedStatusCodes']
                            : basic_1.BLOCKED_STATUS_CODES;
                        return [4 /*yield*/, this.containsSelectors(page, utils_1.CLOUDFLARE_RETRY_CSS_SELECTORS)];
                    case 1:
                        if (!((_c.sent()) && (response === null || response === void 0 ? void 0 : response.status()) === 403)) return [3 /*break*/, 4];
                        return [4 /*yield*/, (0, utils_1.sleep)(5000)];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, this.containsSelectors(page, utils_1.RETRY_CSS_SELECTORS)];
                    case 3:
                        foundSelectors_1 = _c.sent();
                        if (!foundSelectors_1)
                            return [2 /*return*/, false];
                        return [2 /*return*/, "Cloudflare challenge failed, found selectors: ".concat(foundSelectors_1.join(', '))];
                    case 4: return [4 /*yield*/, this.containsSelectors(page, utils_1.RETRY_CSS_SELECTORS)];
                    case 5:
                        foundSelectors = _c.sent();
                        blockedStatusCode = blockedStatusCodes.find(function (x) { var _a; return x === ((_a = response === null || response === void 0 ? void 0 : response.status()) !== null && _a !== void 0 ? _a : 0); });
                        if (foundSelectors)
                            return [2 /*return*/, "Found selectors: ".concat(foundSelectors.join(', '))];
                        if (blockedStatusCode)
                            return [2 /*return*/, "Received blocked status code: ".concat(blockedStatusCode)];
                        return [2 /*return*/, false];
                }
            });
        });
    };
    /**
     * Wrapper around requestHandler that opens and closes pages etc.
     */
    BrowserCrawler.prototype._runRequestHandler = function (crawlingContext) {
        return __awaiter(this, void 0, void 0, function () {
            var newPageOptions, useIncognitoPages, session_1, proxyInfo, page, request, session, cookies, error, e_1;
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        newPageOptions = {
                            id: crawlingContext.id,
                        };
                        useIncognitoPages = (_a = this.launchContext) === null || _a === void 0 ? void 0 : _a.useIncognitoPages;
                        if (!this.proxyConfiguration) return [3 /*break*/, 2];
                        session_1 = crawlingContext.session;
                        return [4 /*yield*/, this.proxyConfiguration.newProxyInfo(session_1 === null || session_1 === void 0 ? void 0 : session_1.id, {
                                request: crawlingContext.request,
                            })];
                    case 1:
                        proxyInfo = _b.sent();
                        crawlingContext.proxyInfo = proxyInfo;
                        newPageOptions.proxyUrl = proxyInfo === null || proxyInfo === void 0 ? void 0 : proxyInfo.url;
                        newPageOptions.proxyTier = proxyInfo === null || proxyInfo === void 0 ? void 0 : proxyInfo.proxyTier;
                        if (this.proxyConfiguration.isManInTheMiddle) {
                            /**
                             * @see https://playwright.dev/docs/api/class-browser/#browser-new-context
                             * @see https://github.com/puppeteer/puppeteer/blob/main/docs/api.md
                             */
                            newPageOptions.pageOptions = {
                                ignoreHTTPSErrors: true,
                                acceptInsecureCerts: true,
                            };
                        }
                        _b.label = 2;
                    case 2: return [4 /*yield*/, this.browserPool.newPage(newPageOptions)];
                    case 3:
                        page = (_b.sent());
                        (0, timeout_1.tryCancel)();
                        this._enhanceCrawlingContextWithPageInfo(crawlingContext, page, useIncognitoPages);
                        request = crawlingContext.request, session = crawlingContext.session;
                        if (!!request.skipNavigation) return [3 /*break*/, 7];
                        return [4 /*yield*/, this._handleNavigation(crawlingContext)];
                    case 4:
                        _b.sent();
                        (0, timeout_1.tryCancel)();
                        return [4 /*yield*/, this._responseHandler(crawlingContext)];
                    case 5:
                        _b.sent();
                        (0, timeout_1.tryCancel)();
                        if (!this.persistCookiesPerSession) return [3 /*break*/, 7];
                        return [4 /*yield*/, crawlingContext.browserController.getCookies(page)];
                    case 6:
                        cookies = _b.sent();
                        (0, timeout_1.tryCancel)();
                        session === null || session === void 0 ? void 0 : session.setCookies(cookies, request.loadedUrl);
                        _b.label = 7;
                    case 7:
                        if (!this.requestMatchesEnqueueStrategy(request)) {
                            this.log.debug(
                            // eslint-disable-next-line dot-notation
                            "Skipping request ".concat(request.id, " (starting url: ").concat(request.url, " -> loaded url: ").concat(request.loadedUrl, ") because it does not match the enqueue strategy (").concat(request['enqueueStrategy'], ")."));
                            request.noRetry = true;
                            request.state = basic_1.RequestState.SKIPPED;
                            return [2 /*return*/];
                        }
                        if (!this.retryOnBlocked) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.isRequestBlocked(crawlingContext)];
                    case 8:
                        error = _b.sent();
                        if (error)
                            throw new basic_1.SessionError(error);
                        _b.label = 9;
                    case 9:
                        request.state = basic_1.RequestState.REQUEST_HANDLER;
                        _b.label = 10;
                    case 10:
                        _b.trys.push([10, 12, , 13]);
                        return [4 /*yield*/, (0, timeout_1.addTimeoutToPromise)(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, Promise.resolve(this.userProvidedRequestHandler(crawlingContext))];
                            }); }); }, this.requestHandlerTimeoutInnerMillis, "requestHandler timed out after ".concat(this.requestHandlerTimeoutInnerMillis / 1000, " seconds."))];
                    case 11:
                        _b.sent();
                        request.state = basic_1.RequestState.DONE;
                        return [3 /*break*/, 13];
                    case 12:
                        e_1 = _b.sent();
                        request.state = basic_1.RequestState.ERROR;
                        throw e_1;
                    case 13:
                        (0, timeout_1.tryCancel)();
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowserCrawler.prototype._enhanceCrawlingContextWithPageInfo = function (crawlingContext, page, createNewSession) {
        var _this = this;
        crawlingContext.page = page;
        // This switch is because the crawlingContexts are created on per request basis.
        // However, we need to add the proxy info and session from browser, which is created based on the browser-pool configuration.
        // We would not have to do this switch if the proxy and configuration worked as in CheerioCrawler,
        // which configures proxy and session for every new request
        var browserControllerInstance = this.browserPool.getBrowserControllerByPage(page);
        crawlingContext.browserController = browserControllerInstance;
        if (!createNewSession) {
            crawlingContext.session = browserControllerInstance.launchContext.session;
        }
        if (!crawlingContext.proxyInfo) {
            crawlingContext.proxyInfo = browserControllerInstance.launchContext.proxyInfo;
        }
        crawlingContext.enqueueLinks = function (enqueueOptions) { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = browserCrawlerEnqueueLinks;
                        _b = {
                            options: enqueueOptions,
                            page: page
                        };
                        return [4 /*yield*/, this.getRequestQueue()];
                    case 1:
                        _b.requestQueue = _c.sent();
                        return [4 /*yield*/, this.getRobotsTxtFileForUrl(crawlingContext.request.url)];
                    case 2: return [2 /*return*/, _a.apply(void 0, [(_b.robotsTxtFile = _c.sent(),
                                _b.onSkippedRequest = this.onSkippedRequest,
                                _b.originalRequestUrl = crawlingContext.request.url,
                                _b.finalRequestUrl = crawlingContext.request.loadedUrl,
                                _b)])];
                }
            });
        }); };
    };
    BrowserCrawler.prototype._handleNavigation = function (crawlingContext) {
        return __awaiter(this, void 0, void 0, function () {
            var gotoOptions, preNavigationHooksCookies, postNavigationHooksCookies, _a, error_1;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        gotoOptions = { timeout: this.navigationTimeoutMillis };
                        preNavigationHooksCookies = this._getCookieHeaderFromRequest(crawlingContext.request);
                        crawlingContext.request.state = basic_1.RequestState.BEFORE_NAV;
                        return [4 /*yield*/, this._executeHooks(this.preNavigationHooks, crawlingContext, gotoOptions)];
                    case 1:
                        _c.sent();
                        (0, timeout_1.tryCancel)();
                        postNavigationHooksCookies = this._getCookieHeaderFromRequest(crawlingContext.request);
                        return [4 /*yield*/, this._applyCookies(crawlingContext, preNavigationHooksCookies, postNavigationHooksCookies)];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _c.trys.push([3, 5, , 7]);
                        _a = crawlingContext;
                        return [4 /*yield*/, this._navigationHandler(crawlingContext, gotoOptions)];
                    case 4:
                        _a.response = (_b = (_c.sent())) !== null && _b !== void 0 ? _b : undefined;
                        return [3 /*break*/, 7];
                    case 5:
                        error_1 = _c.sent();
                        return [4 /*yield*/, this._handleNavigationTimeout(crawlingContext, error_1)];
                    case 6:
                        _c.sent();
                        crawlingContext.request.state = basic_1.RequestState.ERROR;
                        this._throwIfProxyError(error_1);
                        throw error_1;
                    case 7:
                        (0, timeout_1.tryCancel)();
                        crawlingContext.request.state = basic_1.RequestState.AFTER_NAV;
                        return [4 /*yield*/, this._executeHooks(this.postNavigationHooks, crawlingContext, gotoOptions)];
                    case 8:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowserCrawler.prototype._applyCookies = function (_a, preHooksCookies_1, postHooksCookies_1) {
        return __awaiter(this, arguments, void 0, function (_b, preHooksCookies, postHooksCookies) {
            var sessionCookie, parsedPreHooksCookies, parsedPostHooksCookies;
            var _c;
            var session = _b.session, request = _b.request, page = _b.page, browserController = _b.browserController;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        sessionCookie = (_c = session === null || session === void 0 ? void 0 : session.getCookies(request.url)) !== null && _c !== void 0 ? _c : [];
                        parsedPreHooksCookies = preHooksCookies.split(/ *; */).map(function (c) { return (0, basic_1.cookieStringToToughCookie)(c); });
                        parsedPostHooksCookies = postHooksCookies.split(/ *; */).map(function (c) { return (0, basic_1.cookieStringToToughCookie)(c); });
                        return [4 /*yield*/, browserController.setCookies(page, __spreadArray(__spreadArray(__spreadArray([], sessionCookie, true), parsedPreHooksCookies, true), parsedPostHooksCookies, true).filter(function (c) { return typeof c !== 'undefined' && c !== null; })
                                .map(function (c) { return (__assign(__assign({}, c), { url: c.domain ? undefined : request.url })); }))];
                    case 1:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Marks session bad in case of navigation timeout.
     */
    BrowserCrawler.prototype._handleNavigationTimeout = function (crawlingContext, error) {
        return __awaiter(this, void 0, void 0, function () {
            var session;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        session = crawlingContext.session;
                        if (error && error.constructor.name === 'TimeoutError') {
                            (0, basic_1.handleRequestTimeout)({ session: session, errorMessage: error.message });
                        }
                        return [4 /*yield*/, crawlingContext.page.close()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Transforms proxy-related errors to `SessionError`.
     */
    BrowserCrawler.prototype._throwIfProxyError = function (error) {
        if (this.isProxyError(error)) {
            throw new basic_1.SessionError(this._getMessageFromError(error));
        }
    };
    /**
     * Should be overridden in case of different automation library that does not support this response API.
     */
    BrowserCrawler.prototype._responseHandler = function (crawlingContext) {
        return __awaiter(this, void 0, void 0, function () {
            var response, session, request, page, status_1, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        response = crawlingContext.response, session = crawlingContext.session, request = crawlingContext.request, page = crawlingContext.page;
                        if (typeof response === 'object' && typeof response.status === 'function') {
                            status_1 = response.status();
                            this.stats.registerStatusCode(status_1);
                        }
                        if (this.sessionPool && response && session) {
                            if (typeof response === 'object' && typeof response.status === 'function') {
                                this._throwOnBlockedRequest(session, response.status());
                            }
                            else {
                                this.log.debug('Got a malformed Browser response.', { request: request, response: response });
                            }
                        }
                        _a = request;
                        return [4 /*yield*/, page.url()];
                    case 1:
                        _a.loadedUrl = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowserCrawler.prototype._extendLaunchContext = function (_pageId, launchContext) {
        return __awaiter(this, void 0, void 0, function () {
            var launchContextExtends, _a, proxyInfo;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        launchContextExtends = {};
                        if (!this.sessionPool) return [3 /*break*/, 2];
                        _a = launchContextExtends;
                        return [4 /*yield*/, this.sessionPool.getSession()];
                    case 1:
                        _a.session = _d.sent();
                        _d.label = 2;
                    case 2:
                        if (!(this.proxyConfiguration && !launchContext.proxyUrl)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.proxyConfiguration.newProxyInfo((_b = launchContextExtends.session) === null || _b === void 0 ? void 0 : _b.id, {
                                proxyTier: (_c = launchContext.proxyTier) !== null && _c !== void 0 ? _c : undefined,
                            })];
                    case 3:
                        proxyInfo = _d.sent();
                        launchContext.proxyUrl = proxyInfo === null || proxyInfo === void 0 ? void 0 : proxyInfo.url;
                        launchContextExtends.proxyInfo = proxyInfo;
                        // Disable SSL verification for MITM proxies
                        if (this.proxyConfiguration.isManInTheMiddle) {
                            /**
                             * @see https://playwright.dev/docs/api/class-browser/#browser-new-context
                             * @see https://github.com/puppeteer/puppeteer/blob/main/docs/api.md
                             */
                            launchContext.launchOptions.ignoreHTTPSErrors = true;
                            launchContext.launchOptions.acceptInsecureCerts = true;
                        }
                        _d.label = 4;
                    case 4:
                        launchContext.extend(launchContextExtends);
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowserCrawler.prototype._maybeAddSessionRetiredListener = function (_pageId, browserController) {
        var _this = this;
        if (this.sessionPool) {
            var listener_1 = function (session) {
                var launchContext = browserController.launchContext;
                if (session.id === launchContext.session.id) {
                    _this.browserPool.retireBrowserController(browserController);
                }
            };
            this.sessionPool.on(basic_1.EVENT_SESSION_RETIRED, listener_1);
            browserController.on(browser_pool_1.BROWSER_CONTROLLER_EVENTS.BROWSER_CLOSED, function () {
                return _this.sessionPool.removeListener(basic_1.EVENT_SESSION_RETIRED, listener_1);
            });
        }
    };
    /**
     * Function for cleaning up after all requests are processed.
     * @ignore
     */
    BrowserCrawler.prototype.teardown = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.browserPool.destroy()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, _super.prototype.teardown.call(this)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowserCrawler.optionsShape = __assign(__assign({}, basic_1.BasicCrawler.optionsShape), { navigationTimeoutSecs: ow_1.default.optional.number.greaterThan(0), preNavigationHooks: ow_1.default.optional.array, postNavigationHooks: ow_1.default.optional.array, launchContext: ow_1.default.optional.object, headless: ow_1.default.optional.any(ow_1.default.boolean, ow_1.default.string), browserPoolOptions: ow_1.default.object, sessionPoolOptions: ow_1.default.optional.object, persistCookiesPerSession: ow_1.default.optional.boolean, useSessionPool: ow_1.default.optional.boolean, proxyConfiguration: ow_1.default.optional.object.validate(basic_1.validators.proxyConfiguration), ignoreShadowRoots: ow_1.default.optional.boolean, ignoreIframes: ow_1.default.optional.boolean });
    return BrowserCrawler;
}(basic_1.BasicCrawler));
exports.BrowserCrawler = BrowserCrawler;
/** @internal */
function browserCrawlerEnqueueLinks(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var baseUrl, urls;
        var _c, _d, _e;
        var options = _b.options, page = _b.page, requestQueue = _b.requestQueue, robotsTxtFile = _b.robotsTxtFile, onSkippedRequest = _b.onSkippedRequest, originalRequestUrl = _b.originalRequestUrl, finalRequestUrl = _b.finalRequestUrl;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    baseUrl = (0, basic_1.resolveBaseUrlForEnqueueLinksFiltering)({
                        enqueueStrategy: options === null || options === void 0 ? void 0 : options.strategy,
                        finalRequestUrl: finalRequestUrl,
                        originalRequestUrl: originalRequestUrl,
                        userProvidedBaseUrl: options === null || options === void 0 ? void 0 : options.baseUrl,
                    });
                    return [4 /*yield*/, extractUrlsFromPage(page, (_c = options === null || options === void 0 ? void 0 : options.selector) !== null && _c !== void 0 ? _c : 'a', (_e = (_d = options === null || options === void 0 ? void 0 : options.baseUrl) !== null && _d !== void 0 ? _d : finalRequestUrl) !== null && _e !== void 0 ? _e : originalRequestUrl)];
                case 1:
                    urls = _f.sent();
                    return [2 /*return*/, (0, basic_1.enqueueLinks)(__assign({ requestQueue: requestQueue, robotsTxtFile: robotsTxtFile, onSkippedRequest: onSkippedRequest, urls: urls, baseUrl: baseUrl }, options))];
            }
        });
    });
}
/**
 * Extracts URLs from a given page.
 * @ignore
 */
function extractUrlsFromPage(
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
page, selector, baseUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var urls, base, absoluteBaseUrl;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, page.$$eval(selector, function (linkEls) {
                        return linkEls.map(function (link) { return link.getAttribute('href'); }).filter(function (href) { return !!href; });
                    })];
                case 1:
                    urls = (_a = (_b.sent())) !== null && _a !== void 0 ? _a : [];
                    return [4 /*yield*/, page.$$eval('base', function (els) { return els.map(function (el) { return el.getAttribute('href'); }); })];
                case 2:
                    base = (_b.sent())[0];
                    absoluteBaseUrl = base && (0, basic_1.tryAbsoluteURL)(base, baseUrl);
                    if (absoluteBaseUrl) {
                        baseUrl = absoluteBaseUrl;
                    }
                    return [2 /*return*/, urls
                            .map(function (href) {
                            // Throw a meaningful error when only a relative URL would be extracted instead of waiting for the Request to fail later.
                            var isHrefAbsolute = /^[a-z][a-z0-9+.-]*:/.test(href); // Grabbed this in 'is-absolute-url' package.
                            if (!isHrefAbsolute && !baseUrl) {
                                throw new Error("An extracted URL: ".concat(href, " is relative and options.baseUrl is not set. ") +
                                    'Use options.baseUrl in enqueueLinks() to automatically resolve relative URLs.');
                            }
                            return baseUrl ? (0, basic_1.tryAbsoluteURL)(href, baseUrl) : href;
                        })
                            .filter(function (href) { return !!href; })];
            }
        });
    });
}
