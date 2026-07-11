window.PROJECT_CONFIG = {
  "title": "社区物业管理平台",
  "positioning": "覆盖业主、楼房、车位、费用、访客、公告和统计的社区管理演示系统。",
  "repo": "ot-shequguanli",
  "demoUrl": "https://ot-shequguanli.pages.dev",
  "githubUrl": "https://github.com/Nemo-netone/ot-shequguanli",
  "schema": "ot_shequguanli",
  "colors": {
    "primary": "#0f766e",
    "secondary": "#4338ca",
    "accent": "#ca8a04"
  },
  "accounts": [
    {
      "role": "admin",
      "username": "abo",
      "password": "abo",
      "label": "平台管理员"
    },
    {
      "role": "user",
      "username": "张三",
      "password": "123456",
      "label": "社区业主"
    },
    {
      "role": "staff",
      "username": "物业01",
      "password": "123456",
      "label": "物业人员"
    }
  ],
  "modules": [
    {
      "key": "owner",
      "name": "业主信息",
      "summary": "业主账号、房号、联系方式和入住状态"
    },
    {
      "key": "building",
      "name": "楼房信息",
      "summary": "楼栋、单元、房屋和社区区域"
    },
    {
      "key": "parking",
      "name": "车位信息",
      "summary": "车位编号、类别、价格和预订状态"
    },
    {
      "key": "fee",
      "name": "费用信息",
      "summary": "物业费、水电费、缴费状态和金额"
    },
    {
      "key": "visitor",
      "name": "访客管理",
      "summary": "访客登记、来访事由和放行状态"
    },
    {
      "key": "notice",
      "name": "社区公告",
      "summary": "公告、留言、统计和社区资讯"
    }
  ]
};
