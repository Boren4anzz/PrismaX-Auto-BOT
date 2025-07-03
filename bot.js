const axios = require("axios");
const fs = require("fs");
const { HttpsProxyAgent } = require("https-proxy-agent");
const path = require("path");

const colors = {
  reset: "\x1b[0m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  white: "\x1b[37m",
  bold: "\x1b[1m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
};

const logger = {
  info: (msg) => console.log(`${colors.cyan}${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}${msg}${colors.reset}`),
  banner: () => {
    console.log(`${colors.cyan}${colors.bold}╔═══════════════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.cyan}${colors.bold}║                                                           ║${colors.reset}`);
    console.log(`${colors.cyan}${colors.bold}║  ██████╗ ██████╗ ██╗███████╗███╗   ███╗ █████╗ ██╗  ██╗   ║${colors.reset}`);
    console.log(`${colors.cyan}${colors.bold}║  ██╔══██╗██╔══██╗██║██╔════╝████╗ ████║██╔══██╗╚██╗██╔╝   ║${colors.reset}`);
    console.log(`${colors.cyan}${colors.bold}║  ██████╔╝██████╔╝██║███████╗██╔████╔██║███████║ ╚███╔╝    ║${colors.reset}`);
    console.log(`${colors.cyan}${colors.bold}║  ██╔═══╝ ██╔══██╗██║╚════██║██║╚██╔╝██║██╔══██║ ██╔██╗    ║${colors.reset}`);
    console.log(`${colors.cyan}${colors.bold}║  ██║     ██║  ██║██║███████║██║ ╚═╝ ██║██║  ██║██╔╝ ██╗   ║${colors.reset}`);
    console.log(`${colors.cyan}${colors.bold}║  ╚═╝     ╚═╝  ╚═╝╚═╝╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ║${colors.reset}`);
    console.log(`${colors.cyan}${colors.bold}║                                              @ByDontol    ║${colors.reset}`);
    console.log(`${colors.cyan}${colors.bold}╚═══════════════════════════════════════════════════════════╝${colors.reset}`);
    console.log();
  },
  separator: () => {
    console.log(`${colors.green}─────────────────────────────────────────────────────────────${colors.reset}`);
  },
  label: (label, value) => {
    console.log(`${colors.cyan}  ${label.padEnd(17)}: ${colors.green}${value}${colors.reset}`);
  },
};

function getRandomUserAgent() {
  const userAgents = [
    '"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"',
    '"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"',
    '"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0"',
    '"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15"',
    '"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/91.0.864.59 Safari/537.36"',
    '"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"',
  ];
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

class PrismaxDailyLoginBot {
  constructor(email, proxy) {
    this.email = email;
    this.proxy = proxy;
    this.baseUrl = "https://app-prismax-backend-1053158761087.us-west2.run.app/api/daily-login-points";
    this.headers = {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.7",
      "content-type": "application/json",
      priority: "u=1, i",
      "sec-ch-ua": getRandomUserAgent(),
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "sec-gpc": "1",
      Referer: "https://app.prismax.ai/",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    };
  }

  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  async dailyLogin(date) {
    try {
      const dateString = this.formatDate(date);
      const payload = {
        email: this.email,
        user_local_date: dateString,
      };

      // Proxy config
      let axiosConfig = { headers: this.headers };
      if (this.proxy) {
        let proxyUrl = this.proxy;
        if (!/^http(s)?:\/\//.test(proxyUrl)) {
          proxyUrl = "http://" + proxyUrl;
        }
        proxyUrl = proxyUrl.replace(/\/\/(.+?):(.+?)@/, (match, user, pass) => {
          return "//" + encodeURIComponent(user) + ":" + encodeURIComponent(pass) + "@";
        });
        try {
          const agent = new HttpsProxyAgent(proxyUrl);
          axiosConfig.httpsAgent = agent;
          axiosConfig.proxy = false;
        } catch (e) {
          console.log(`${colors.red}  Proxy Error      : Failed to create proxy agent${colors.reset}`);
        }
      }

      const response = await axios.post(this.baseUrl, payload, axiosConfig);

      if (response.data.success) {
        const data = response.data.data;
        logger.label("Date", dateString);
        logger.label("Result", "Success");
        logger.label("Today's Points", data.points_awarded_today);
        logger.label("Total Points", data.total_points);
        logger.label("Claim Status", data.already_claimed_daily ? "Already claimed" : "Newly claimed");
        logger.label("Membership", data.user_class);
        return {
          success: true,
          date: dateString,
          data: data,
        };
      } else {
        logger.label("Date", dateString);
        logger.label("Result", "Failed");
        return {
          success: false,
          date: dateString,
          error: "Response not successful",
        };
      }
    } catch (error) {
      logger.label("Date", this.formatDate(date));
      logger.label("Result", "Error");
      logger.label("Error", error.message);
      return {
        success: false,
        date: this.formatDate(date),
        error: error.message,
      };
    }
  }

  getAllDatesInRange(startDate, endDate) {
    const dates = [];
    let current = new Date(startDate);
    const end = new Date(endDate);
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }

  async runLoginForDateRange(startDate, endDate, delayMs = 2000) {
    const dates = this.getAllDatesInRange(new Date(startDate), new Date(endDate));
    const results = [];

    console.log(`${colors.cyan}  Login session    : Started${colors.reset}`);
    console.log();
    console.log(`${colors.cyan}Executing daily login tasks...${colors.reset}`);
    console.log();

    for (const date of dates) {
      const result = await this.dailyLogin(date);
      results.push(result);

      if (date.getTime() !== dates[dates.length - 1].getTime()) {
        await this.sleep(delayMs);
      }
    }

    return results;
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

function loadAccounts() {
  const accountPath = path.join(__dirname, "account.txt");
  if (!fs.existsSync(accountPath)) {
    return [];
  }

  try {
    const content = fs.readFileSync(accountPath, "utf-8");
    const lines = content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    const emails = lines.filter((line) => line.includes("@"));
    return emails;
  } catch (error) {
    return [];
  }
}

function loadProxies() {
  const proxyPath = path.join(__dirname, "proxy.txt");
  if (!fs.existsSync(proxyPath)) {
    return [];
  }

  try {
    const content = fs.readFileSync(proxyPath, "utf-8");
    const lines = content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    return lines;
  } catch (error) {
    return [];
  }
}

function loadConfig() {
  const configPath = path.join(__dirname, "config.json");

  const defaultConfig = {
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    delayBetweenRequests: 2000,
    delayBetweenAccounts: 3000,
    autoDateRange: true,
    daysBack: 7,
  };

  if (!fs.existsSync(configPath)) {
    try {
      fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
    } catch (error) {
      // Silent error
    }
    return defaultConfig;
  }

  try {
    const content = fs.readFileSync(configPath, "utf-8");
    const config = JSON.parse(content);
    const mergedConfig = { ...defaultConfig, ...config };
    return mergedConfig;
  } catch (error) {
    return defaultConfig;
  }
}

function getDateRange(config) {
  if (config.autoDateRange) {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - config.daysBack);

    const startDateStr = startDate.toISOString().split("T")[0];
    const endDateStr = today.toISOString().split("T")[0];

    return { startDate: startDateStr, endDate: endDateStr };
  } else {
    return { startDate: config.startDate, endDate: config.endDate };
  }
}

async function main() {
  logger.banner();

  const config = loadConfig();
  const emails = loadAccounts();
  const proxies = loadProxies();

  // Display config info
  logger.label("Config loaded", "config.json");
  logger.label("Accounts loaded", `${emails.length} (from account.txt)`);

  if (proxies.length === 0) {
    logger.label("Proxy file not found", "(proxy.txt) - running without proxy");
  } else {
    logger.label("Proxies loaded", `${proxies.length} (from proxy.txt)`);
  }

  console.log();

  if (emails.length === 0) {
    logger.error("No emails found in account.txt file. Please add email addresses, one per line.");
    return;
  }

  const { startDate, endDate } = getDateRange(config);

  // Display settings
  logger.label("Date Range", `${startDate} to ${endDate}`);
  logger.label("Accounts", emails.length);
  logger.label("Request Delay", `${config.delayBetweenRequests} ms`);
  logger.label("Account Delay", `${config.delayBetweenAccounts} ms`);

  console.log();
  logger.separator();

  for (let i = 0; i < emails.length; i++) {
    const email = emails[i];
    const proxy = proxies[i] || null;

    console.log(`${colors.cyan}${colors.bold}[ Account ${i + 1} of ${emails.length} ]${colors.reset}`);
    console.log();
    logger.label("Email", email);
    logger.label("Proxy", proxy || "None");

    const bot = new PrismaxDailyLoginBot(email, proxy);
    try {
      await bot.runLoginForDateRange(startDate, endDate, config.delayBetweenRequests);
    } catch (error) {
      logger.label("Error", error.message);
    }

    logger.separator();

    if (i < emails.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, config.delayBetweenAccounts));
    }
  }

  console.log(`${colors.green}Task completed.${colors.reset}`);
}

if (require.main === module) {
  main();
}

module.exports = PrismaxDailyLoginBot;
