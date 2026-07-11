# 社区物业管理平台

覆盖业主、楼房、车位、费用、访客、公告和统计的社区管理演示系统。

![Demo Online](https://img.shields.io/badge/Demo%20Online-pages.dev-brightgreen)
![License](https://img.shields.io/badge/License-Noncommercial-orange)
![Frontend](https://img.shields.io/badge/Frontend-Cloudflare%20Pages-blue)
![Backend](https://img.shields.io/badge/Backend-Cloudflare%20Workers-purple)
![Database](https://img.shields.io/badge/Database-Supabase-3FCF8E)

## 在线演示

| 项目 | 地址 |
|---|---|
| GitHub 仓库 | https://github.com/Nemo-netone/ot-shequguanli |
| 演示地址 | https://ot-shequguanli.pages.dev |
| 生产分支 | `main` |
| Cloudflare Pages | `ot-shequguanli` |
| Supabase schema | `ot_shequguanli` |

## 演示账号

| 类型 | 用户名 | 密码 | 权限 |
|---|---|---|---|
| 平台管理员 | `abo` | `abo` | admin |
| 社区业主 | `张三` | `123456` | user |
| 物业人员 | `物业01` | `123456` | staff |

这些账号只用于公开演示。请不要在演示系统里录入真实手机号、身份证、地址、订单或支付信息。

## 截图

| 首页 / 工作台 | 管理视图 | 移动端 |
|---|---|---|
| ![home](docs/screenshots/home.png) | ![admin](docs/screenshots/admin.png) | ![mobile](docs/screenshots/mobile.png) |

## 功能模块

- **业主信息**：业主账号、房号、联系方式和入住状态
- **楼房信息**：楼栋、单元、房屋和社区区域
- **车位信息**：车位编号、类别、价格和预订状态
- **费用信息**：物业费、水电费、缴费状态和金额
- **访客管理**：访客登记、来访事由和放行状态
- **社区公告**：公告、留言、统计和社区资讯

## 技术栈

- 原始项目：Spring Boot + Vue + MySQL，原始工程位于 springboot224bf(2)/springboot224bf。
- 线上演示：Cloudflare Pages + Pages Functions + Supabase
- 数据隔离：所有演示数据写入 `ot_shequguanli`，不覆盖 Supabase `public` 或其他项目 schema
- API 形态：同域 `/api/*`，由 `site/_worker.js` 处理

## 本地预览

```powershell
npx wrangler@3 pages dev site
```

如需连接真实 Supabase，需要在 Cloudflare Pages 或本机临时环境中配置：

```text
SUPABASE_URL=<supabase-url>
SUPABASE_ANON_KEY=<supabase-anon-key>
SUPABASE_SCHEMA=ot_shequguanli
CORS_ALLOWED_ORIGINS=https://ot-shequguanli.pages.dev
```

## 部署说明

详细部署记录见 [docs/deployment.md](docs/deployment.md)。功能树和使用场景见 [docs/features.md](docs/features.md)。演示账号范围见 [docs/accounts.md](docs/accounts.md)。

## 已知限制

- 这是作品集可演示版本，重点保证浏览、登录、统计、增删改查流程稳定。
- 原始 Java/Vue/MySQL 项目源码保留在仓库中，线上不直接运行 Tomcat/Spring Boot。
- 文件上传、真实支付、短信、地图、AI 或第三方平台能力在演示版中不接入真实服务。

## 许可协议

本项目使用 PolyForm Noncommercial License 1.0.0。允许非商业学习、使用和修改；商业使用需要单独授权。
