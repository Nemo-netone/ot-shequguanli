export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders(request, env) });
      const legacyPrefix = "/springboot224bf/";
      if (env.ASSETS && !url.pathname.startsWith("/api/") && !url.pathname.startsWith(legacyPrefix) && url.pathname !== "/health") return env.ASSETS.fetch(request);

      if (url.pathname === "/health") {
        return json(request, env, result(true, "ok", { service: `${schema(env)}-api`, schema: schema(env), time: new Date().toISOString() }));
      }

      if (url.pathname.startsWith(legacyPrefix)) return json(request, env, await legacyApi(request, url, env));
      if (!url.pathname.startsWith("/api/")) return json(request, env, result(false, "API path not found", null), 404);
      const body = await parseBody(request);
      const parts = url.pathname.replace(/^\/api\/?/, "").split("/").filter(Boolean);

      if (parts[0] === "login") return json(request, env, await login(body, env));
      if (parts[0] === "summary") return json(request, env, await summary(env));

      const [resource, action = "list"] = parts;
      if (resource !== "items") return json(request, env, result(false, "业务模块不存在", null), 404);
      return json(request, env, await items(action, body, env));
    } catch (error) {
      return json(request, env, result(false, error.message || "服务异常", null), 500);
    }
  },
};


const legacyModules = { yezhu: "owner", yezhuxinxi: "owner", loufang: "building", loufangxinxi: "building", chewei: "parking", cheweixinxi: "parking", feiyong: "fee", fangke: "visitor", xiaoqufangke: "visitor", gonggao: "notice", news: "notice", shequxinxi: "building", gonggongsheshi: "building", huzhuxuqiu: "fee", messages: "complaint" };

async function legacyApi(request, url, env) {
  const parts = url.pathname.replace(/^\/springboot224bf\/?/, "").split("/").filter(Boolean);
  const [table = "", action = "", id = ""] = parts;
  const body = await parseBody(request);
  const params = Object.fromEntries(url.searchParams.entries());
  if (action === "login") return legacyLogin(table, params, env);
  if (action === "session") return legacySession(table, env);
  if (table === "dictionary" && action === "page") return legacyDictionary(params.dicCode);
  const moduleKey = legacyModules[table] || table;
  if (action === "page" || action === "list") return legacyPage(moduleKey, params, env);
  if (action === "info") return legacyInfo(id, env);
  if (action === "save" || action === "add") return legacySave(moduleKey, body, env);
  if (action === "update") return legacyUpdate(moduleKey, body, env);
  if (action === "delete") return legacyDelete(body, env);
  return legacyResult(0, null, {});
}

async function legacyLogin(table, params, env) {
  const roleMap = { users: "admin", yonghu: "user", laoshi: "staff" };
  const role = roleMap[table] || "admin";
  const rows = await requestSupabase(env, "accounts", "GET", { role: `eq.${role}`, username: `eq.${params.username || ""}`, password: `eq.${params.password || ""}`, limit: "1" });
  if (!rows.length) return legacyResult(1, "Invalid demo account", null);
  return { code: 0, msg: "ok", token: `demo-${role}-${rows[0].id}` };
}

async function legacySession(table, env) {
  const roleMap = { users: "admin", yonghu: "user", laoshi: "staff" };
  const rows = await requestSupabase(env, "accounts", "GET", { role: `eq.${roleMap[table] || "admin"}`, limit: "1" });
  const account = rows[0] || { id: 1, username: "admin", display_name: "Demo Admin" };
  return legacyResult(0, null, { id: account.id, username: account.username, name: account.display_name, yonghuName: account.display_name, laoshiName: account.display_name });
}

async function legacyPage(moduleKey, params, env) {
  const rows = await requestSupabase(env, "items", "GET", { module_key: `eq.${moduleKey}`, order: "updated_at.desc" });
  const list = rows.map((row) => legacyRow(row, moduleKey));
  const page = Math.max(Number(params.page || 1), 1), limit = Math.max(Number(params.limit || 10), 1), start = (page - 1) * limit;
  return legacyResult(0, null, { list: list.slice(start, start + limit), total: list.length, currPage: page, pageSize: limit, totalPage: Math.ceil(list.length / limit) });
}

async function legacyInfo(id, env) { const rows = await requestSupabase(env, "items", "GET", { id: `eq.${id}`, limit: "1" }); return legacyResult(0, null, rows[0] ? legacyRow(rows[0], rows[0].module_key) : {}); }
async function legacySave(moduleKey, body, env) { const rows = await requestSupabase(env, "items", "POST", {}, legacyPayload(moduleKey, body)); return legacyResult(0, "created", rows[0] ? legacyRow(rows[0], moduleKey) : null); }
async function legacyUpdate(moduleKey, body, env) { if (!body.id) return legacyResult(1, "Missing id", null); const rows = await requestSupabase(env, "items", "PATCH", { id: `eq.${body.id}` }, legacyPayload(moduleKey, body)); return legacyResult(0, "updated", rows[0] ? legacyRow(rows[0], moduleKey) : null); }
async function legacyDelete(body, env) { const ids = Array.isArray(body) ? body : [body.id].filter(Boolean); for (const id of ids) await requestSupabase(env, "items", "DELETE", { id: `eq.${id}` }); return legacyResult(0, "deleted", null); }
function legacyPayload(moduleKey, body) { const title = body.yezhuName || body.loufangName || body.cheweiName || body.name || body.title || body.gonggaoName || "Demo record"; return { module_key: moduleKey, title: String(title), subtitle: String(body.subtitle || body.kechengTypes || "Legacy UI data"), status: String(body.status || "active"), owner: String(body.owner || "admin"), amount: Number(body.amount || 0), description: String(body.description || body.kechengContent || body.content || ""), extra: body, updated_at: new Date().toISOString() }; }
function legacyRow(row, moduleKey) { const extra = row.extra && typeof row.extra === "object" ? row.extra : {}; return { ...extra, id: row.id, title: row.title, name: row.title, yezhuName: extra.yezhuName || row.title, loufangName: extra.loufangName || row.title, cheweiName: extra.cheweiName || row.title, gonggaoName: extra.gonggaoName || row.title, zuoyeName: extra.zuoyeName || row.title, status: row.status, owner: row.owner, createTime: row.created_at, moduleKey }; }
function legacyDictionary(dicCode) { const labels = ["General", "Core", "Practice"]; return legacyResult(0, null, { list: labels.map((label, index) => ({ id: index + 1, codeIndex: index + 1, indexName: label, dicCode })), total: labels.length }); }
function legacyResult(code, msg, data) { return { code, msg: msg || "", data }; }

async function login(body, env) {
  const role = String(body.role || "").trim();
  const username = String(body.username || "").trim();
  const password = String(body.password || "").trim();
  if (!role || !username || !password) return result(false, "请输入角色、账号和密码", null);
  const rows = await requestSupabase(env, "accounts", "GET", { role: `eq.${role}`, username: `eq.${username}`, password: `eq.${password}`, limit: "1" });
  if (!rows.length) return result(false, "登录失败，请检查演示账号", null);
  const account = { ...rows[0] };
  delete account.password;
  return result(true, null, account);
}

async function summary(env) {
  const [accounts, rows] = await Promise.all([
    requestSupabase(env, "accounts", "GET", { order: "id.asc" }),
    requestSupabase(env, "items", "GET", { order: "updated_at.desc" }),
  ]);
  const modules = {};
  for (const row of rows) modules[row.module_key] = (modules[row.module_key] || 0) + 1;
  return result(true, null, {
    totalAccounts: accounts.length,
    totalItems: rows.length,
    modules,
    latest: rows.slice(0, 6),
  });
}

async function items(action, body, env) {
  if (action === "list") {
    const query = { order: "updated_at.desc" };
    if (body.module_key) query.module_key = `eq.${body.module_key}`;
    return result(true, null, await requestSupabase(env, "items", "GET", query));
  }
  if (action === "add") {
    const payload = normalizeItem(body);
    const rows = await requestSupabase(env, "items", "POST", {}, payload);
    return result(true, "新增成功", rows[0] || null);
  }
  if (action === "update") {
    if (!body.id) return result(false, "缺少记录编号", null);
    const payload = normalizeItem(body);
    delete payload.id;
    const rows = await requestSupabase(env, "items", "PATCH", { id: `eq.${body.id}` }, payload);
    return result(true, "更新成功", rows[0] || null);
  }
  if (action === "delete") {
    if (!body.id) return result(false, "缺少记录编号", null);
    await requestSupabase(env, "items", "DELETE", { id: `eq.${body.id}` });
    return result(true, "删除成功", null);
  }
  return result(false, "动作不存在", null);
}

function normalizeItem(body) {
  return {
    module_key: String(body.module_key || "general").trim(),
    title: String(body.title || "未命名记录").trim(),
    subtitle: String(body.subtitle || "").trim(),
    status: String(body.status || "进行中").trim(),
    owner: String(body.owner || "").trim(),
    amount: Number(body.amount || 0),
    description: String(body.description || "").trim(),
    extra: body.extra || {},
    updated_at: new Date().toISOString(),
  };
}

async function requestSupabase(env, table, method, query = {}, payload = {}) {
  const base = cleanEnv(env.SUPABASE_URL);
  const key = cleanEnv(env.SUPABASE_ANON_KEY || env.SUPABASE_SERVICE_ROLE_KEY);
  if (!base || !key) throw new Error("Worker 缺少 Supabase 环境变量");
  const response = await fetch(`${base.replace(/\/$/, "")}/rest/v1/rpc/${schema(env)}_demo_rest`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ p_table_name: table, p_method: method, p_query: query, p_payload: payload }),
  });
  if (!response.ok) throw new Error(`Supabase 请求失败: ${response.status} ${await response.text()}`);
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

function schema(env) {
  return cleanEnv(env.SUPABASE_SCHEMA);
}

function cleanEnv(value) {
  return String(value || "").replace(/^\uFEFF/, "").trim();
}

async function parseBody(request) {
  if (request.method === "GET" || request.method === "HEAD") return {};
  const text = await request.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

function result(status, message, data) {
  return { status, message, data };
}

function json(request, env, payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders(request, env) },
  });
}

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = String(env.CORS_ALLOWED_ORIGINS || "").split(",").map((item) => item.trim()).filter(Boolean);
  const allowOrigin = allowed.includes(origin) ? origin : allowed[0] || "*";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Max-Age": "86400",
  };
}
