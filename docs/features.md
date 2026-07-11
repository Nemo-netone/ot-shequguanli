# 功能说明

## 项目定位

覆盖业主、楼房、车位、费用、访客、公告和统计的社区管理演示系统。

## 功能树

| 模块 | 责任 | 数据归属 |
|---|---|---|
| 业主信息 | 业主账号、房号、联系方式和入住状态 | `items.module_key = owner` |
| 楼房信息 | 楼栋、单元、房屋和社区区域 | `items.module_key = building` |
| 车位信息 | 车位编号、类别、价格和预订状态 | `items.module_key = parking` |
| 费用信息 | 物业费、水电费、缴费状态和金额 | `items.module_key = fee` |
| 访客管理 | 访客登记、来访事由和放行状态 | `items.module_key = visitor` |
| 社区公告 | 公告、留言、统计和社区资讯 | `items.module_key = notice` |

## 使用场景

1. 访客打开 `https://ot-shequguanli.pages.dev`，先浏览项目定位、核心模块和演示账号。
2. 使用公开账号登录，进入工作台查看统计数据。
3. 通过模块侧边栏进入业务表，进行列表浏览、关键词搜索、新增、编辑和删除。
4. 管理员可完整演示数据维护流程；普通用户和工作人员账号用于展示不同角色入口。

## 调用链和数据流

```text
浏览器
  -> site/app.js
  -> /api/login 或 /api/items/*
  -> site/_worker.js
  -> Supabase RPC public.ot_shequguanli_demo_rest
  -> ot_shequguanli.accounts / ot_shequguanli.items
```

## 推荐演示路径

```text
登录 -> 工作台统计 -> 业主信息 -> 楼房信息 -> 车位信息 -> 费用信息 -> 新增一条记录 -> 编辑状态 -> 删除测试记录
```

## 演示边界

- 已实现：登录、统计、业务模块列表、搜索、新增、编辑、删除。
- 部分实现：原项目的复杂权限、文件上传、第三方服务以作品集展示为主。
- 未接入：真实支付、短信、地图、邮件、生产级文件存储。
