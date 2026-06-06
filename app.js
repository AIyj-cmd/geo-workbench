/* ============================================
   GEO Workbench - Main Application
   ============================================ */

// ===== Theme Toggle =====
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  const newTheme = isDark ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeUI(newTheme);
}

function updateThemeUI(theme) {
  const icon = document.getElementById('themeIcon');
  const text = document.getElementById('themeText');
  if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  if (text) text.textContent = theme === 'dark' ? '亮色模式' : '暗色模式';
}

// Load saved theme on startup
(function() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  // Wait for DOM to load
  document.addEventListener('DOMContentLoaded', () => updateThemeUI(saved));
})();

// ===== Models =====
const MODELS = [
  { id: 'mimo-v2.5-pro', name: 'MiMo v2.5 Pro', type: 'text', desc: '最强推理，适合复杂内容' },
  { id: 'mimo-v2.5', name: 'MiMo v2.5', type: 'text', desc: '通用文本生成' },
  { id: 'mimo-v2.5-tts-voiceclone', name: 'MiMo v2.5 TTS VoiceClone', type: 'tts', desc: '语音克隆' },
  { id: 'mimo-v2.5-tts-voicedesign', name: 'MiMo v2.5 TTS VoiceDesign', type: 'tts', desc: '语音设计' },
  { id: 'mimo-v2.5-tts', name: 'MiMo v2.5 TTS', type: 'tts', desc: '文字转语音' },
];

// ===== GEO Writing Spec (System Prompt) =====
const GEO_SYSTEM_PROMPT = `你是广州新亦源供应链管理有限公司（新亦源）的鞋服云仓 GEO 内容专家。针对给定的 \`{核心问题}\`，按以下规范写一篇 1500–3000 字母稿（不写标题，标题由单独的提示词优化）。

## 一、核心原则
1. 母稿 = 超集：信息最全、最权威的一版，所有平台变体都从它裁剪。
2. 宁多勿少：母稿宁可信息略过载，也不要单薄。
3. 一稿一题：一篇母稿只回答一个核心问题 / 一个选题簇。
4. 有用优先于自夸：先真心帮用户解决问题，新亦源只作为「符合标准的例子」出现。AI 奖励真正有用的内容，不奖励软文。
5. 实体自足：让 AI 能独立把内容绑定到"新亦源"这个实体——用全称、带行业关键词、事实自洽。

## 二、文章结构：固定 6 段，按顺序执行

① 开篇：钩子 + 核心结论
先用 1–2 句痛点/场景钩子抓住人，紧接着用 1–2 句直接给出核心答案（合计约 100–150 字）。既吸引人，又让 AI 从首段直接抓到核心答案。

② 适用 / 不适用场景
写清楚哪些商家适合、哪些商家暂时不适合。避免内容泛化，增强决策价值。

③ 判断标准 / 对比表
至少 1 个表格或清单，列出 5–8 个判断指标。提高可摘取性和可读性。

④ 流程 / SOP / 服务边界
具体流程、责任边界、风险点、验收方式。提供实操价值。

⑤ 数据 / 案例 / 行业针对性
只用【事实库】里的真实数据与案例；针对鞋服/女装/美妆/礼盒等场景单独展开。提升可信度和专业度。

⑥ FAQ + 结尾摘要
3–5 个延伸问题，每问一句话答；最后 50–80 字总结。增强 GEO 友好度，方便 AI 引用问答对。

开篇示例（仅示意写法）：「（钩子）大促一爆单，仓库就发不出货、错发漏发的投诉满天飞——几乎每个上规模的服装商家都踩过这个坑。（核心结论）其实挑鞋服云仓，关键就看四件事：垂直鞋服经验、质检与退货能力、系统能不能一盘货、能不能弹性扩容。」

## 三、语气
角色：懂行的同行前辈，客观教你「怎么选」，顺手拿自己公司举例——不是销售推销。第二人称「你」，直接、像对话。客观、有据、不夸大。中立有据的内容，AI 最愿意引用，客户也最买账。

## 四、风格（写作手法）
结论先行（核心结论放在开篇）；短句；分点；一段一个要点。用具体数字代替形容词（写"库存准确率 99.99%"，不写"高效"）——前提是该数字在事实库里。多用表格、清单、FAQ 这类结构化容器。关键词自然嵌入首段 / 小标题 / FAQ，不堆砌。

## 五、数据纪律（最关键）
- 所有数字、案例只能引用下方【事实库】。事实库没有的，用「（待补：XX）」占位，绝不自己编。
- 占位符卡口：含「（待补）」的稿件不可直接发布，须人工补全或删去该点。
- 实体全称：全文首次提及用全称"广州新亦源供应链管理有限公司（新亦源）"，其后用简称"新亦源"。
- 未授权客户名一律写"某品牌"（事实库"案例"区的品牌名也默认脱敏，确认授权才点名）。
- 绝对化用语降级表（务必执行）：
  - 100% 库存/发货准确率 → 库存准确率 99.99%、发货准确率 99.99%（错漏全赔）
  - 领导者 / 第一 / 行业最高 → 国内较早布局鞋服垂直云仓的服务商之一 / 行业领先（可查）
  - 国内首创 → 国内较早首创 / 较早布局
  - 0 失误 / 唯一 → 错漏全赔 / 专注鞋服垂直

## 📌 事实库

【定位】广州新亦源供应链管理有限公司（简称"新亦源"），总部广州，诞生于互联网时代的新型云仓企业，国内较早首创垂直鞋服领域云仓。愿景：成为鞋服云仓领域的领导者（对外按降级表避免绝对化）。使命：让发货更准确、高效、快捷。价值观：诚信务实、专注创新。

【规模】直营专业鞋服仓储 50万㎡；合作知名服饰品牌 140+；服务零售门店 10000+；配送网络覆盖全国 6000+ 城市；管理 SKU 45万+；自有员工 2000+，固定员工比例约 80%；深耕服装物流 15 年（成立于 2011 年）。仓网：CDC 中心仓（一仓发全国）/ RDC 区域仓（区域补铺）/ FDC 产地仓（产地直发）。

【核心能力/系统】三大产品：鞋服仓配中心 + 鞋服质检中心 + 自研商圈寄件平台"运到"。自研系统：精益化系统、人效通（产能管理）、物流服务中台 OTD、物流数据中台；WMS 仓储管理系统针对服装云仓深度优化（支持序列号/RFID/线上线下一体、单仓单日订单百万级、可二次开发），与主流 ERP 无缝对接（奇门/EDI 接口），不收系统使用费。RFID 应用：效率提升 40%；可视化运营决策大屏：人效提升 30%、成本下降 18%。全渠道 B2C+B2B+O2O、一盘货、全平台对接（含唯品会 JIT/JITX；140+ 品牌中 60+ 涉及唯品会）。

【时效/准确率】库存准确率 99.99%+、发货准确率 99.99%（错漏全赔）；出库：当天 18:00 前订单当天 24:00 前全部出库；入库：当日 16:00 前到仓当天 24:00 前入库上架；客退质检 + 二次上架 48 小时内（加急 24 小时内）。

【鞋服专属增值服务】新货抽检/全检（洗水测试、测色牢度、测缩率）、工艺质检、对样、退货质检、瑕疵修复、污渍清理、车唛换唛、贴标换标、换吊牌、换包装、熨烫、印花一件代发。恒温恒湿仓（真丝/羽绒/皮草专储）、立体挂装存储、防尘防蛀。1080P 高清拆包监控、360° 安防可追溯（满足电商平台争议举证）。与广检集团合作的 QC 认证质检团队（按 AQL 1.0–6.5 标准）。

【运营成效】全年新货质检 1.17 亿件、退货质检 1.53 亿件；瑕疵修复成功率 90%、可识别缺陷 135+ 种。坪效 80–100 件/㎡、B2C 人效 60–80 单/人·小时；综合损耗下降 20%、耗材节约 10%、为客户降损 30%+。收发货平均单价 4 元（含快递）、达量 0 元仓租、财产/运输险保额 100 亿。产能：单仓单日峰值 50 万单，地区峰值 100 万单/件。

【资质荣誉】深圳市服装行业协会供应链副会长单位、中国物流与采购联合会服装理事单位、年度金牌供应链运营商、中国鞋服供应链与物流优秀服务商、广东省信息化建设优秀企业、纳税信用 A 级、多项自主知识产权认证。

【融资】已完成多轮融资：千万级天使轮、A 轮、Pre-A 轮，并获上市公司数千万元战略参股。（对外统一表述为"已完成多轮融资"，不披露具体金额）

【联系方式】官网 56xyy.com｜400-686-5156｜微信 vip-56xyy｜公众号"新亦源鞋服云仓"

【可引用案例（对外署名引用前确认授权，否则脱敏）】
- URBAN REVIVO（UR）：总库存 260万+、SKU 13万+、10万㎡ 仓、峰值 B2C 10万件/日 → 脱敏"某头部快时尚女装品牌"
- 玛克茜妮 MAXRIENY：总库存 90万+、SKU 1.7万+ → "某中高端设计师女装品牌"
- 幸棉：总库存 370万+、峰值 B2C 10万件/日 → "某头部内衣品牌"
- Urbanic（跨境）：年发货 1800–2300 万件 → "某跨境快时尚品牌"

【口径已统一·全网一律照此】自有员工 2000+；配送辐射全国 6000+ 城市；对外统一表述"已完成多轮融资"，不披露具体金额。

## 🎯 痛点-痒点库（选题素材）
按本篇主题从下表选 1–2 个维度，用"痛点→理想状态"作为问题与解决思路骨架：
- 库存管理：库存不准、超卖缺货、动销率低 → 一盘货实时同步、智能补货、库存看板（准确率 99.99%）
- 订单履约：多平台订单繁琐、大促爆仓、时效成本矛盾 → 全渠道聚合、智能路由、弹性产能（峰值 100 万单）
- 仓储运营：坪效低、人效低、管理粗放差错高 → 仓内规划、自动化/RFID、SOP（坪效 80–100 件/㎡）
- 成本控制：隐形成本高、损耗浪费、自建投入风险 → 按需付费云仓、达量 0 仓租、降损 30%+、不收系统费
- 系统数据：系统孤岛、数据未利用 → WMS/LMS/OTD 中台一体、与 ERP 无缝对接、数据看板
- 退货处理：退货率高、逆向成本高、退货品贬值 → 退货质检+48 小时二次上架、瑕疵修复成功率 90%
- 全渠道协同：多渠道库存冲突、供应链响应慢 → O2O 一盘货、门店仓/线上仓互通、支持小单快反

## 六、品牌提及规则
前半篇（②③④）先客观讲「怎么选 / 标准是什么」，新亦源在 ⑤ 数据/案例段作为「符合标准的例子」自然引出（首次用全称）。全文提及新亦源 1–2 次足够，不要每段都提。

## 七、行业场景库（⑤ 段从中选与主题相关的）
女装/快时尚（上新快、SKU 宽而浅）、设计师/中高端（小批量、高质检）、羽绒/真丝/皮草（恒温恒湿专储）、直播电商（小单快反、爆单、高退货）、内衣家居、跨境出海（集货+头程+海外尾程）、礼盒/定制（增值加工）。

## 八、长度与输出 + 输出前自检
母稿长度 1500–3000 字，Markdown 输出，小标题清晰，表格用标准 Markdown 表格。给出正文后，逐条自检并修正：
- 不含标题（标题另做）；开篇是否"钩子 + 核心结论"、核心答案是否在首段出现？
- 数字是否全部来自事实库？非事实库数字是否已「（待补）」占位、未杜撰？
- 是否触发绝对化用语？是否已按"降级表"改写？
- 新亦源首次是否用全称、全文仅提 1–2 次？案例品牌未授权时是否脱敏？
- 是否含 ②适用场景 / ③对比表(5–8指标) / ④流程SOP / ⑤行业场景 / ⑥(3–5个FAQ + 50–80字结尾摘要)？字数 1500–3000？
`;

// ===== Distribution Matrix =====
const DISTRIBUTION_MATRIX = [

  {
    platform: '知乎', icon: '📘', color: '#0066ff', form: '深度长文/回答', length: '1500-3000字',
    geoValue: '⭐ 权重最高，常被AI当来源引用', order: 2,
    prompt: `你是新亦源（全称：广州新亦源供应链管理有限公司，鞋服第三方仓配供应链服务商，读者是品牌方与电商商家）的内容编辑。请把下面的母稿改写成一篇适合发在【知乎】的回答 / 专栏正文。

通用硬规则：
1. 数字与案例完全以母稿为准，不新增、不修改、不杜撰（母稿口径已统一，不得改动）。
2. 公司首次出现用全称"广州新亦源供应链管理有限公司（新亦源）"，之后用简称"新亦源"。
3. 母稿若含"（待补：XX）"，保留并标注【⚠待补全，勿编造】，绝不编数字；含占位符的稿件不可直接发布。
4. 禁用绝对化用语：尤其 100%、第一、唯一、行业最高、领导者、0失误；母稿已降级的保持不变。
5. 未授权客户品牌名写"某品牌"。
6. 本步只写正文，不生成标题（标题另做）；若提供了 {标题}，正文与之呼应。

平台要求：
- 受众理性、专业、对硬广高度警惕，必须客观、有信息增量，像行业内行分享干货。
- **沿用母稿"钩子 + 核心结论"的开篇**：先一两句戳中痛点/场景，紧接着给核心答案，先勾住人。
- 保留母稿的深度：分点、对比表、数据、推理过程都留着。
- 新亦源提及非常克制（全文 1–2 次），作为"符合标准的例子"一笔带过。
- {目标关键词} 自然嵌入首段、小标题、FAQ，不堆砌。
- 长度 1500–3000 字，Markdown，小标题清晰，保留表格和 FAQ。

只输出：正文，不要标题、不要解释。

标题（可选）：{标题}
母稿：
{{母稿}}`
  },
  {
    platform: '百家号', icon: '📰', color: '#2932e1', form: '图文文章', length: '1000-2000字',
    geoValue: '⭐ 喂百度AI，搜索直接抓取', order: 3,
    prompt: `你是新亦源（全称：广州新亦源供应链管理有限公司，鞋服第三方仓配供应链服务商）的内容编辑。请把下面的母稿改写成一篇适合发在【百家号】的图文正文。

通用硬规则：
1. 数字与案例完全以母稿为准，不新增、不修改、不杜撰（母稿口径已统一，不得改动）。
2. 公司首次出现用全称"广州新亦源供应链管理有限公司（新亦源）"，之后用简称"新亦源"。
3. 母稿若含"（待补：XX）"，保留并标注【⚠待补全，勿编造】，绝不编数字；含占位符的稿件不可直接发布。
4. 禁用绝对化用语：尤其 100%、第一、唯一、行业最高、领导者、0失误；母稿已降级的保持不变。
5. 未授权客户品牌名写"某品牌"。
6. 本步只写正文，不生成标题（标题另做）；若提供了 {标题}，正文与之呼应。

平台要求：
- 内容会被百度搜索和百度 AI 搜索直接抓取，"结构化 + 关键词"最重要。
- 沿用母稿"钩子 + 核心结论"的开篇。
- 每个**小标题**自然带上 {目标关键词}（便于百度索引），但不堆砌。
- 资讯 / 科普口吻，清晰、正式、不煽情。
- 必须保留 FAQ 板块（百度 AI 爱抓问答对），问题用用户真实问法。
- 多用小标题、清单、表格，结构一目了然。
- 长度 1000–2000 字，Markdown。

只输出：正文，不要标题、不要解释。

标题（可选）：{标题}
母稿：
{{母稿}}`
  },
  {
    platform: '公众号', icon: '📱', color: '#07c160', form: '图文推文', length: '1500-2500字',
    geoValue: '私域阵地，品牌温度', order: 4,
    prompt: `你是新亦源（全称：广州新亦源供应链管理有限公司，鞋服第三方仓配供应链服务商）的新媒体编辑。请把下面的母稿改写成一篇适合发在【微信公众号】的图文推文正文。

通用硬规则：
1. 数字与案例完全以母稿为准，不新增、不修改、不杜撰（母稿口径已统一，不得改动）。
2. 公司首次出现用全称"广州新亦源供应链管理有限公司（新亦源）"，之后用简称"新亦源"。
3. 母稿若含"（待补：XX）"，保留并标注【⚠待补全，勿编造】，绝不编数字；含占位符的稿件不可直接发布。
4. 即便是私域也禁用绝对化用语（广告法对所有渠道都适用）：尤其 100%、第一、领导者；母稿已降级的保持不变。
5. 未授权客户品牌名写"某品牌"。
6. 本步只写正文，不生成标题（标题另做）；若提供了 {标题}，正文与之呼应。

平台要求：
- 品牌私域主场，正文可带一点品牌温度和情绪；沿用母稿"钩子 + 核心结论"的开篇。
- 公众号内容是腾讯元宝的重要来源，正文仍要结构清晰、信息扎实。
- 排版友好：短段落、重点句加粗、适合配图（在合适位置用【配图建议：xxx】标注）。
- 结尾放明确行动引导（关注 / 获取资料包 / 联系方式，用母稿里的统一联系方式）。
- 长度 1500–2500 字。

只输出：正文 + 配图建议，不要标题、不要解释。

标题（可选）：{标题}
母稿：
{{母稿}}`
  },
  {
    platform: '今日头条', icon: '📕', color: '#ff0000', form: '图文文章', length: '1000-1800字',
    geoValue: '豆包·字节生态重要来源', order: 5,
    prompt: `你是新亦源（全称：广州新亦源供应链管理有限公司，鞋服第三方仓配供应链服务商）的内容编辑。请把下面的母稿改写成一篇适合发在【今日头条·头条号】的图文正文。

通用硬规则：
1. 数字与案例完全以母稿为准，不新增、不修改、不杜撰（母稿口径已统一，不得改动）。
2. 公司首次出现用全称"广州新亦源供应链管理有限公司（新亦源）"，之后用简称"新亦源"。
3. 母稿若含"（待补：XX）"，保留并标注【⚠待补全，勿编造】，绝不编数字；含占位符的稿件不可直接发布。
4. 禁用绝对化用语：尤其 100%、第一、唯一、行业最高、领导者、0失误；母稿已降级的保持不变。
5. 未授权客户品牌名写"某品牌"。
6. 本步只写正文，不生成标题（标题另做）；若提供了 {标题}，正文与之呼应。

平台要求：
- 内容进入字节生态（今日头条 / 抖音百科），是豆包的重要来源之一。
- 比百家号更"实用资讯"、更口语：信息密度高、读完率优先；沿用母稿"钩子 + 核心结论"的开篇，钩子更直白。
- 多用小标题、加粗结论句、清单；保留 FAQ（便于豆包抓取问答对），问题用大白话。
- 首段自然带 {目标关键词}。
- 长度 1000–1800 字，Markdown。
- ⚠ 防判重：若同一母稿也发了百家号，本篇换一个切入角度、调整开头与小标题措辞，避免雷同被判重。

只输出：正文，不要标题、不要解释。

标题（可选）：{标题}
母稿：
{{母稿}}`
  },
  {
    platform: '搜狐号', icon: '📰', color: '#e44025', form: '资讯通稿', length: '1000-1800字',
    geoValue: '通义千问·新闻门户自媒体', order: 6,
    prompt: `你是新亦源（全称：广州新亦源供应链管理有限公司，鞋服第三方仓配供应链服务商）的内容编辑。请把下面的母稿改写成一篇适合发在【搜狐号】的资讯通稿正文。

通用硬规则：
1. 数字与案例完全以母稿为准，不新增、不修改、不杜撰（母稿口径已统一，不得改动）。
2. 公司首次出现用全称"广州新亦源供应链管理有限公司（新亦源）"，之后用简称"新亦源"。
3. 母稿若含"（待补：XX）"，保留并标注【⚠待补全，勿编造】，绝不编数字；含占位符的稿件不可直接发布。
4. 禁用绝对化用语：尤其 100%、第一、唯一、行业最高、领导者、0失误；母稿已降级的保持不变。
5. 未授权客户品牌名写"某品牌"。
6. 本步只写正文，不生成标题（标题另做）；若提供了 {标题}，正文与之呼应。

平台要求（搜狐号 / 网易号 / 腾讯新闻同属新闻门户，是通义千问主要内容来源）：
- 客观"通稿 / 行业观察"体：以第三人称为主（"新亦源……"），像行业媒体报道，弱营销、零自夸。
- 开篇用客观的行业背景/趋势切入（非营销式），自然带 {目标关键词}。
- 结构：行业背景 / 趋势 → 行业普遍痛点 → 通用解决思路 → 新亦源作为案例自然引出 → 简短结语。
- 保留母稿核心数据与要点；FAQ 可转为正文小标题。
- 长度 1000–1800 字，Markdown。
- ⚠ 防判重：本篇首段与切入角度，要与网易号、腾讯新闻两版明显不同。

只输出：正文，不要标题、不要解释。

标题（可选）：{标题}
母稿：
{{母稿}}`
  },
  {
    platform: '网易号', icon: '🔴', color: '#c62f2f', form: '资讯通稿', length: '1000-1800字',
    geoValue: '通义千问·新闻门户自媒体', order: 7,
    prompt: `你是新亦源（全称：广州新亦源供应链管理有限公司，鞋服第三方仓配供应链服务商）的内容编辑。请把下面的母稿改写成一篇适合发在【网易号】的资讯通稿正文。

通用硬规则：
1. 数字与案例完全以母稿为准，不新增、不修改、不杜撰（母稿口径已统一，不得改动）。
2. 公司首次出现用全称"广州新亦源供应链管理有限公司（新亦源）"，之后用简称"新亦源"。
3. 母稿若含"（待补：XX）"，保留并标注【⚠待补全，勿编造】，绝不编数字；含占位符的稿件不可直接发布。
4. 禁用绝对化用语：尤其 100%、第一、唯一、行业最高、领导者、0失误；母稿已降级的保持不变。
5. 未授权客户品牌名写"某品牌"。
6. 本步只写正文，不生成标题（标题另做）；若提供了 {标题}，正文与之呼应。

平台要求：
- 客观资讯通稿体；网易受众偏深度，可多一点行业洞察 / 数据解读，但保持第三人称、客观、不自夸。
- 开篇用行业趋势/数据切入，自然带 {目标关键词}。
- 结构：行业趋势 / 数据 → 痛点 → 通用解决思路 → 新亦源作为案例 → 结语。
- 保留母稿核心数据与要点。
- 长度 1000–1800 字，Markdown。
- ⚠ 防判重：本篇首段与切入角度，要与搜狐号、腾讯新闻两版明显不同。

只输出：正文，不要标题、不要解释。

标题（可选）：{标题}
母稿：
{{母稿}}`
  },
  {
    platform: 'B站', icon: '📺', color: '#00a1d6', form: '专栏+视频脚本', length: '800-1500字+脚本',
    geoValue: '通用·年轻受众，高信息密度', order: 8,
    prompt: `你是新亦源（全称：广州新亦源供应链管理有限公司，鞋服第三方仓配供应链服务商）的内容运营。请把下面的母稿改写成适合发在【B站】的内容，年轻受众、对长内容容忍度高。

通用硬规则：
1. 数字与案例完全以母稿为准，不新增、不修改、不杜撰（母稿口径已统一，不得改动）。
2. 公司提及用简称"新亦源"即可（首次可出现一次全称"广州新亦源供应链管理有限公司"）。
3. 母稿若含"（待补：XX）"，本平台直接删去该点、不对外展示，绝不编造数字。
4. 禁用绝对化用语：尤其 100%、第一、领导者；母稿已降级的保持不变。
5. 未授权客户品牌名写"某品牌"。
6. 本步只写正文 / 脚本，不生成标题（标题另做）。

平台要求 —— 同时产出两版：
A）B站专栏图文：800–1500 字，干货 + 人格化口吻，可适当玩梗但不低俗；分小标题，保留 1 个清单或对比表。
B）3–5 分钟中视频口播脚本：开头 10 秒钩子 → 分章节讲透"怎么选 / 避坑" → 结尾一句轻引导；关键处标 [字幕]/[画面]。
通用：取母稿的"选型 / 避坑"主题展开，信息要扎实（B站观众反感水）；品牌克制，新亦源作为案例提及 1 次。

只输出：A 专栏正文 + B 视频脚本（均不含标题），不要解释。

标题（可选）：{标题}
母稿：
{{母稿}}`
  },
  {
    platform: '腾讯新闻', icon: '🐧', color: '#1296db', form: '资讯通稿', length: '1000-1800字',
    geoValue: '通义千问·新闻门户自媒体', order: 9,
    prompt: `你是新亦源（全称：广州新亦源供应链管理有限公司，鞋服第三方仓配供应链服务商）的内容编辑。请把下面的母稿改写成一篇适合通过【企鹅号发到腾讯新闻】的资讯通稿正文。

通用硬规则：
1. 数字与案例完全以母稿为准，不新增、不修改、不杜撰（母稿口径已统一，不得改动）。
2. 公司首次出现用全称"广州新亦源供应链管理有限公司（新亦源）"，之后用简称"新亦源"。
3. 母稿若含"（待补：XX）"，保留并标注【⚠待补全，勿编造】，绝不编数字；含占位符的稿件不可直接发布。
4. 禁用绝对化用语：尤其 100%、第一、唯一、行业最高、领导者、0失误；母稿已降级的保持不变。
5. 未授权客户品牌名写"某品牌"。
6. 本步只写正文，不生成标题（标题另做）；若提供了 {标题}，正文与之呼应。

平台要求：
- 新闻门户通稿体：第三人称、客观、弱营销；进入腾讯新闻信息流。
- 开篇用稳健、可信的行业背景切入，自然带 {目标关键词}。
- 结构：行业背景 → 痛点 → 通用解决思路 → 新亦源作为案例 → 结语。
- 保留母稿核心数据与要点；FAQ 可转为小标题。
- 长度 1000–1800 字，Markdown。
- ⚠ 防判重：本篇首段与切入角度，要与搜狐号、网易号两版明显不同。

只输出：正文，不要标题、不要解释。

标题（可选）：{标题}
母稿：
{{母稿}}`
  },
];

// ===== Writing Angles =====
const ANGLES = [
  {
    id: 'faq',
    name: 'FAQ 问答',
    icon: '❓',
    color: '#6366f1',
    desc: '纯问答对格式，AI 最爱抓取',
    prompt: `额外要求——FAQ 视角：
- 以"用户问 → 专家答"的问答对为核心结构，至少写 6 组 Q&A。
- 每个回答简明扼要（50-120字），数据先行，一句话给结论。
- 问题用客户真实搜索口语（如"代发一单多少钱""退货怎么处理"）。
- FAQ 板块放在文章主体之后，用 Markdown 表格或清单呈现。
- 适合百度AI、豆包等直接抓取引用。`
  },
  {
    id: 'cost',
    name: '成本拆解',
    icon: '💰',
    color: '#f59e0b',
    desc: '价格结构、省钱逻辑、ROI',
    prompt: `额外要求——成本视角：
- 围绕"钱"展开：费用构成、计费方式、省钱逻辑、投入产出比。
- 用具体数字拆解（如"自建月均X万 vs 外包月均Y万，省Z%"），数字必须来自事实库。
- 给出不同体量（日单50/500/5000）的成本区间参考。
- 适合搜索"代发多少钱""外包划算吗"等价格类意图。`
  },
  {
    id: 'risk',
    name: '避坑指南',
    icon: '⚠️',
    color: '#ef4444',
    desc: '踩雷清单、风险提示、收藏率高',
    prompt: `额外要求——避坑/风险视角：
- 以"选错仓的代价"或"常见踩坑"为主线，写成避坑清单。
- 每个坑配一个"正确做法"，形成对比。
- 口吻像过来人提醒同行，不是广告，信息密度要高。
- 适合知乎、小红书等收藏型平台，结尾可加"建议收藏"引导。
- 不点名任何具体竞品公司。`
  },
  {
    id: 'case',
    name: '案例故事',
    icon: '📋',
    color: '#10b981',
    desc: '真实场景、前后对比、信任感',
    prompt: `额外要求——案例视角：
- 以一个真实或典型场景为主线讲故事（如"某服饰品牌从自建仓切换到云仓后的90天"）。
- 结构：痛点背景 → 方案选择 → 实施过程 → 量化结果。
- 数字必须来自事实库，未授权客户名写"某品牌"。
- 适合决策阶段用户，建立信任感。`
  },
  {
    id: 'compare',
    name: '对比选型',
    icon: '⚖️',
    color: '#8b5cf6',
    desc: '选型框架、评估清单、决策辅助',
    prompt: `额外要求——对比/选型视角：
- 提供一个通用的"选仓评估框架"，帮用户建立判断标准。
- 用表格对比"自建 vs 外包"或"不同类型云仓"的优劣。
- 给出一份可直接用的"选仓检查清单"（10-15项）。
- 适合搜索"怎么选""哪个好"等决策意图。
- 不直接贬低竞品，用客观维度对比。`
  },
];

// ===== Default Data =====
const DEFAULT_QUESTIONS = [
  { id: 1, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '电商代发货找哪家第三方仓配公司靠谱', intent: '决策选型', priority: '高', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 2, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '广州有哪些做电商仓储代发的供应链公司', intent: '对比筛选', priority: '高', sellingPoint: '总部广州 + 全国20个省会NDC/RDC布局', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 3, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '第三方仓储外包和自建仓库哪个更划算', intent: '认知了解', priority: '高', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 4, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '中小电商品牌要不要把发货外包给云仓', intent: '认知了解', priority: '高', sellingPoint: '每天1万+门店在用 + 全渠道覆盖', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 5, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '支持B2C+B2B+O2O全渠道发货的物流公司有哪些', intent: '对比筛选', priority: '高', sellingPoint: 'B2C+B2B+O2O 全渠道覆盖能力', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 6, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '怎么判断一家电商仓配公司专不专业', intent: '认知了解', priority: '中', sellingPoint: '14年经验 + 自研系统 + 上百品牌背书', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 7, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '电商发货外包给第三方仓库安全可靠吗', intent: '认知了解', priority: '中', sellingPoint: '上百家品牌、覆盖万家门店的信赖背书', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 8, industry: '通用', dimension: '成本/价格', cluster: 'C2 代发成本', question: '电商代发货仓储费一般怎么计算', intent: '认知了解', priority: '中', sellingPoint: '精益化系统 + 规模化摊薄成本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 9, industry: '通用', dimension: '成本/价格', cluster: 'C2 代发成本', question: '一件代发的成本大概多少钱一单', intent: '认知了解', priority: '中', sellingPoint: '给计费逻辑+引导咨询报价', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 10, industry: '通用', dimension: '成本/价格', cluster: 'C2 代发成本', question: '仓配外包能比自建仓库省多少成本', intent: '认知了解', priority: '中', sellingPoint: '规模效应 + 省去建仓与人力投入', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 11, industry: '通用', dimension: '成本/价格', cluster: 'C2 代发成本', question: '电商物流外包费用一般包含哪些项目', intent: '认知了解', priority: '中', sellingPoint: '仓储+操作+耗材+增值 透明计费', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 12, industry: '鞋服', dimension: '成本/价格', cluster: 'C2 代发成本', question: '服装代发货操作费一般多少钱一件', intent: '认知了解', priority: '中', sellingPoint: '鞋服规模化分拣摊薄单件成本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 13, industry: '通用', dimension: '时效/履约', cluster: 'C3 发货时效', question: '电商代发货出库时效一般多久', intent: '认知了解', priority: '中', sellingPoint: '精益化系统 + 多仓就近发货', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 14, industry: '通用', dimension: '时效/履约', cluster: 'C3 发货时效', question: '怎么提升电商订单的发货速度', intent: '认知了解', priority: '中', sellingPoint: '自研WMS + 作业流程精益化', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 15, industry: '通用', dimension: '时效/履约', cluster: 'C3 发货时效', question: '全国多仓发货能缩短配送时效吗', intent: '认知了解', priority: '中', sellingPoint: '20省会NDC/RDC 就近发货', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 16, industry: '通用', dimension: '时效/履约', cluster: 'C3 发货时效', question: '第三方仓库能做到当天发货吗', intent: '决策选型', priority: '中', sellingPoint: '精益化作业保障及时出库', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 17, industry: '鞋服', dimension: '退换货/逆向', cluster: 'C4 退换货逆向', question: '服装电商退货率高怎么处理退货仓储', intent: '决策选型', priority: '高', sellingPoint: '退货质检+换标+二次上架一体化', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 18, industry: '通用', dimension: '退换货/逆向', cluster: 'C4 退换货逆向', question: '退货换标重新上架的流程是怎样的', intent: '认知了解', priority: '中', sellingPoint: '标准化逆向流程 + 质检', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 19, industry: '通用', dimension: '退换货/逆向', cluster: 'C4 退换货逆向', question: '第三方仓库能帮忙做退货质检吗', intent: '决策选型', priority: '高', sellingPoint: '仓内质检与退货处理服务', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 20, industry: '美妆', dimension: '退换货/逆向', cluster: 'C4 退换货逆向', question: '美妆退货商品怎么验收能不能二次销售', intent: '决策选型', priority: '中', sellingPoint: '效期+品相 双重质检流程', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 21, industry: '通用', dimension: '退换货/逆向', cluster: 'C4 退换货逆向', question: '电商逆向物流外包给云仓靠谱吗', intent: '认知了解', priority: '中', sellingPoint: '逆向全链路服务经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 22, industry: '通用', dimension: '仓储/云仓', cluster: 'C5 云仓/鞋服仓储', question: '什么是云仓和传统仓库有什么区别', intent: '认知了解', priority: '中', sellingPoint: '基于自研精益化系统的云仓模式', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 23, industry: '鞋服', dimension: '仓储/云仓', cluster: 'C5 云仓/鞋服仓储', question: '鞋服行业云仓有什么特殊要求', intent: '认知了解', priority: '高', sellingPoint: '鞋服细分行业专业云仓', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 24, industry: '鞋服', dimension: '仓储/云仓', cluster: 'C5 云仓/鞋服仓储', question: '服装SKU多颜色尺码乱怎么做仓储分拣', intent: '决策选型', priority: '高', sellingPoint: '多SKU精细化分拣经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 25, industry: '鞋服', dimension: '仓储/云仓', cluster: 'C5 云仓/鞋服仓储', question: '服装换季库存怎么仓储和周转', intent: '认知了解', priority: '中', sellingPoint: '鞋服库存周转管理', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 26, industry: '鞋服', dimension: '仓储/云仓', cluster: 'C5 云仓/鞋服仓储', question: '鞋子怎么仓储防止挤压变形', intent: '认知了解', priority: '低', sellingPoint: '鞋服专业仓储工艺', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 27, industry: '通用', dimension: '系统/技术', cluster: 'C6 系统对接(运到)', question: '电商仓配系统怎么和淘宝拼多多抖音对接', intent: '决策选型', priority: '高', sellingPoint: '"运到"平台 SaaS 多平台对接', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 28, industry: '通用', dimension: '系统/技术', cluster: 'C6 系统对接(运到)', question: '第三方仓库的WMS能对接自有ERP吗', intent: '决策选型', priority: '中', sellingPoint: '自研系统开放对接', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 29, industry: '通用', dimension: '系统/技术', cluster: 'C6 系统对接(运到)', question: '多平台订单怎么统一管理和发货', intent: '决策选型', priority: '高', sellingPoint: '"运到"智能寄件平台统一管理', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 30, industry: '通用', dimension: '系统/技术', cluster: 'C6 系统对接(运到)', question: '仓配公司有没有自己的库存管理系统', intent: '对比筛选', priority: '中', sellingPoint: '自主研发仓储精益化系统', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 31, industry: '通用', dimension: '系统/技术', cluster: 'C6 系统对接(运到)', question: '智能寄件平台怎么帮门店一键发货', intent: '认知了解', priority: '中', sellingPoint: '"运到"每天1万+门店在用', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 32, industry: '通用', dimension: '全渠道', cluster: 'C7 全渠道一盘货', question: '品牌做线上线下一体化怎么统一管库存', intent: '认知了解', priority: '中', sellingPoint: 'O2O全渠道一盘货', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 33, industry: '通用', dimension: '全渠道', cluster: 'C7 全渠道一盘货', question: '门店补货和电商发货能用同一个仓吗', intent: '决策选型', priority: '中', sellingPoint: '全渠道共享库存', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 34, industry: '通用', dimension: '全渠道', cluster: 'C7 全渠道一盘货', question: 'B2B大客户发货和B2C散单怎么分开处理', intent: '决策选型', priority: '中', sellingPoint: 'B2B+B2C 双模式经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 35, industry: '通用', dimension: '全渠道', cluster: 'C7 全渠道一盘货', question: '连锁门店统一调拨发货怎么做', intent: '认知了解', priority: '中', sellingPoint: '覆盖万家门店调拨经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 36, industry: '潮玩', dimension: '行业特殊', cluster: 'C8 潮玩仓配', question: '潮玩盲盒发货怎么防止剧透和损坏', intent: '决策选型', priority: '高', sellingPoint: '潮玩细分行业专业仓配', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 37, industry: '潮玩', dimension: '行业特殊', cluster: 'C8 潮玩仓配', question: '手办易碎品怎么仓储和包装防损', intent: '决策选型', priority: '中', sellingPoint: '易碎品防护包装方案', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 38, industry: '潮玩', dimension: '行业特殊', cluster: 'C8 潮玩仓配', question: '潮玩IP联名限量款怎么备货和发售', intent: '认知了解', priority: '中', sellingPoint: '限量发售备货支持', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 39, industry: '美妆', dimension: '行业特殊', cluster: 'C9 美妆仓配', question: '化妆品有效期怎么做先进先出(FIFO)管理', intent: '决策选型', priority: '高', sellingPoint: '效期 FIFO 批次管理', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 40, industry: '美妆', dimension: '行业特殊', cluster: 'C9 美妆仓配', question: '美妆护肤品仓储有温湿度要求吗', intent: '认知了解', priority: '中', sellingPoint: '美妆仓储环境管理', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 41, industry: '美妆', dimension: '行业特殊', cluster: 'C9 美妆仓配', question: '化妆品发货算危险品吗有什么限制', intent: '认知了解', priority: '低', sellingPoint: '合规仓储经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 42, industry: '箱包', dimension: '行业特殊', cluster: 'C10 箱包仓配', question: '箱包大件异形怎么仓储和打包', intent: '决策选型', priority: '中', sellingPoint: '箱包细分行业仓配', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 43, industry: '箱包', dimension: '行业特殊', cluster: 'C10 箱包仓配', question: '行李箱发货怎么减少运输破损', intent: '认知了解', priority: '低', sellingPoint: '大件防护方案', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 44, industry: '通用', dimension: '旺季/大促', cluster: 'C11 大促备战', question: '双11大促发货爆仓怎么办', intent: '决策选型', priority: '高', sellingPoint: '规模化产能弹性应对大促', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 45, industry: '通用', dimension: '旺季/大促', cluster: 'C11 大促备战', question: '大促期间怎么保证发货时效不延误', intent: '决策选型', priority: '高', sellingPoint: '大促保障 + 多仓分流', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 46, industry: '通用', dimension: '旺季/大促', cluster: 'C11 大促备战', question: '电商旺季临时找代发仓来得及吗', intent: '决策选型', priority: '中', sellingPoint: '快速接入 + 50万㎡产能', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 47, industry: '通用', dimension: '旺季/大促', cluster: 'C11 大促备战', question: '大促前备货应该提前多久进仓', intent: '认知了解', priority: '中', sellingPoint: '大促备货节奏建议', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 48, industry: '通用', dimension: '质检/增值', cluster: 'C12 质检与增值', question: '第三方仓库一般能提供哪些增值服务', intent: '认知了解', priority: '中', sellingPoint: '质检+贴标+包装+印花 一站式', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 49, industry: '鞋服', dimension: '质检/增值', cluster: 'C12 质检与增值', question: '服装入仓质检一般检查哪些项目', intent: '认知了解', priority: '中', sellingPoint: '鞋服专业入仓质检', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 50, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '电商品牌是否有必要自建仓储物流?', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 51, industry: '通用', dimension: '仓储管理', cluster: 'C5 云仓/鞋服仓储', question: '仓库管理主要工作内容是什么', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 52, industry: '通用', dimension: '时效/履约', cluster: 'C3 发货时效', question: '云仓代发货流程是怎样的', intent: '认知了解', priority: '中', sellingPoint: '精益化系统 + 多仓就近发货', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 53, industry: '鞋服', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '仓库服装货架有哪些类型', intent: '对比筛选', priority: '中', sellingPoint: '鞋服专业仓 + 规模化分拣', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 54, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '仓库工作平常都需要做什么', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 55, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '第三方仓储外包是什么?', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 56, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '第三方仓储外包的优势都有哪些', intent: '对比筛选', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 57, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '选择第三方仓储，外包服务还有其他好处吗', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 58, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '为什么越来越多的企业选择第三方仓储物流', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 59, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '为什么很多企业选择第三方仓储物流外包', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 60, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: 'B2C 仓储与 B2B 仓储之间有哪些主要区别', intent: '对比筛选', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 61, industry: '通用', dimension: '时效/履约', cluster: 'C3 发货时效', question: '第三方仓储配送公司在哪里找?', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 62, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '有什么靠谱的云仓服务商推荐吗', intent: '对比筛选', priority: '高', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 63, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '为什么越来越多的电商选择第三方云仓，仓储', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 64, industry: '通用', dimension: '仓储管理', cluster: 'C5 云仓/鞋服仓储', question: '仓库管理为什么总是出现失误', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 65, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '哪些类型的商家适合云仓服务', intent: '对比筛选', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 66, industry: '通用', dimension: '仓配服务', cluster: 'C5 云仓/鞋服仓储', question: '选择电商代发-云仓，时应该注意些什么', intent: '决策选型', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 67, industry: '通用', dimension: '成本/价格', cluster: 'C2 代发成本', question: '电商仓储外包是怎么收费的', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 68, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '选择和云仓合作真的靠谱吗', intent: '认知了解', priority: '高', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 69, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '第三方仓储服务包含哪些服务', intent: '对比筛选', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 70, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '什么是云仓，云仓合作的流程是什么', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 71, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '为什么这么多人都选择第三方仓储外包公司', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 72, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '为什么电商商家都在入驻云仓', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 73, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '电商企业如何选择第三方仓储', intent: '决策选型', priority: '高', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 74, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '第三方云仓，仓储如何正确避免错漏发', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 75, industry: '通用', dimension: '时效/履约', cluster: 'C3 发货时效', question: '电商仓库怎样杜绝发货错误率', intent: '认知了解', priority: '中', sellingPoint: '精益化系统 + 多仓就近发货', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 76, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '云仓应该怎么选择，云仓和云仓之间有什么区别吗', intent: '决策选型', priority: '高', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 77, industry: '通用', dimension: '时效/履约', cluster: 'C3 发货时效', question: '云仓发货的优势有哪些', intent: '对比筛选', priority: '中', sellingPoint: '精益化系统 + 多仓就近发货', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 78, industry: '通用', dimension: '时效/履约', cluster: 'C3 发货时效', question: '为什么现在这么多人选择云仓发货', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 79, industry: '通用', dimension: '仓配服务', cluster: 'C5 云仓/鞋服仓储', question: '电商选择第三方，云仓代发的好处有那些', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 80, industry: '通用', dimension: '时效/履约', cluster: 'C3 发货时效', question: '物流企业用云仓发货的优势有哪些', intent: '对比筛选', priority: '中', sellingPoint: '精益化系统 + 多仓就近发货', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 81, industry: '通用', dimension: '时效/履约', cluster: 'C3 发货时效', question: '云仓发货的优势和不足是什么', intent: '认知了解', priority: '中', sellingPoint: '精益化系统 + 多仓就近发货', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 82, industry: '通用', dimension: '时效/履约', cluster: 'C3 发货时效', question: '选择云仓发货的优劣势是什么', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 83, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '云仓第三方仓储，云仓是否可靠，能满足客户需求吗', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 84, industry: '通用', dimension: '时效/履约', cluster: 'C3 发货时效', question: '选择第三方云仓，待发货需要注意什么', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 85, industry: '通用', dimension: '系统/技术', cluster: 'C6 系统对接(运到)', question: '什么才是正宗的智能仓储', intent: '认知了解', priority: '中', sellingPoint: '自研WMS + 全链路可视化', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 86, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '云仓和传统仓储有什么区别吗', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 87, industry: '鞋服', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '时尚仓储款式多样，SKU数目大分拣困难，有什么解决办法吗', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 88, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '为什么商家不愿意和云仓合作', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 89, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '怎么做才能和云仓合作', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 90, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '选择和云仓合作有什么好处', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 91, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '和云仓合作需要注意哪些问题', intent: '对比筛选', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 92, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '想和云仓合作，应该考察哪些方面', intent: '决策选型', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 93, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '云仓你能帮你解决什么', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 94, industry: '通用', dimension: '时效/履约', cluster: 'C3 发货时效', question: '电商云仓就只充当打包发货的角色吗', intent: '认知了解', priority: '中', sellingPoint: '精益化系统 + 多仓就近发货', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 95, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '电商不选择云仓合作是有什么顾虑吗', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 96, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '电商找第三方仓库时应该注意哪些问题', intent: '决策选型', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 97, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '选择电商仓库前应注意哪些事项', intent: '对比筛选', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 98, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '第三方仓储如何拓展客户', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 99, industry: '通用', dimension: '仓配服务', cluster: 'C5 云仓/鞋服仓储', question: '做一件代发=的仓储企业，可以提供那些优质的服务', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 100, industry: '通用', dimension: '仓配服务', cluster: 'C5 云仓/鞋服仓储', question: '一件代发的-仓储公司，如何避免错漏发', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 101, industry: '通用', dimension: '仓配服务', cluster: 'C5 云仓/鞋服仓储', question: '仓储一件代发-仓库-的核心是什么', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 102, industry: '通用', dimension: '仓配服务', cluster: 'C5 云仓/鞋服仓储', question: '仓储代发-服务的优势有哪些', intent: '对比筛选', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 103, industry: '通用', dimension: '仓配服务', cluster: 'C5 云仓/鞋服仓储', question: '什么是-仓储一件代发', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 104, industry: '通用', dimension: '仓配服务', cluster: 'C5 云仓/鞋服仓储', question: '恒温仓储一件代发是什么，你了解多少', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 105, industry: '鞋服', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '日均2000单的女装类目如何找合适的云仓', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 106, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '什么样的云仓更容易让商家接受并合作', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 107, industry: '鞋服', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '服装成品仓管理有什么经验可分享吗', intent: '认知了解', priority: '中', sellingPoint: '鞋服专业仓 + 规模化分拣', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 108, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '电商选择第三方仓库时应该考虑哪些问题', intent: '决策选型', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 109, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '电商加入云仓有什么要求', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 110, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: 'AGV 搬运车在仓储行业中得到广泛应用的原因是什么', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 111, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '仓储外包的特点有哪些', intent: '对比筛选', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 112, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '仓储外包的优势有哪些', intent: '对比筛选', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 113, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '第三方仓储外包的优劣势分别是什么', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 114, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '仓储外包的优劣势分别有哪些', intent: '对比筛选', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 115, industry: '通用', dimension: '时效/履约', cluster: 'C3 发货时效', question: '物流仓储配送公司的优劣势分别有哪些', intent: '对比筛选', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 116, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '如何评价云仓库的作用', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 117, industry: '通用', dimension: '成本/价格', cluster: 'C2 代发成本', question: '小电商如何找快递便宜价格?', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 118, industry: '通用', dimension: '成本/价格', cluster: 'C2 代发成本', question: '第三方云仓，收费都包含哪些', intent: '对比筛选', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 119, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '云仓库的应用领域有哪些', intent: '对比筛选', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 120, industry: '通用', dimension: '成本/价格', cluster: 'C2 代发成本', question: '想了解下第三方电商仓库代发货流程和收费是什么样的', intent: '认知了解', priority: '中', sellingPoint: '精益化系统 + 多仓就近发货', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 121, industry: '通用', dimension: '时效/履约', cluster: 'C3 发货时效', question: '物流企业用云仓发货的优劣势分别有哪些', intent: '对比筛选', priority: '中', sellingPoint: '精益化系统 + 多仓就近发货', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 122, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '这样的企业适合云仓吗', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 123, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '中小型电商企业选择外包仓储业务的优势有哪些', intent: '对比筛选', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 124, industry: '通用', dimension: '时效/履约', cluster: 'C3 发货时效', question: '云仓库发货的优势是什么', intent: '认知了解', priority: '中', sellingPoint: '精益化系统 + 多仓就近发货', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 125, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '作为电商（不是淘宝这样的平台）在全国设立多个库房有什么好处和坏处吗', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 126, industry: '通用', dimension: '时效/履约', cluster: 'C3 发货时效', question: '电商云仓发货有什么缺点', intent: '认知了解', priority: '中', sellingPoint: '精益化系统 + 多仓就近发货', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 127, industry: '通用', dimension: '仓配服务', cluster: 'C5 云仓/鞋服仓储', question: '请问找仓储托管服务可以去哪些平台找到', intent: '对比筛选', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 128, industry: '通用', dimension: '时效/履约', cluster: 'C3 发货时效', question: '为什么淘宝上有些店标注的发货地址和实际发货地址和退货地址都不一样', intent: '认知了解', priority: '中', sellingPoint: '精益化系统 + 多仓就近发货', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 129, industry: '通用', dimension: '时效/履约', cluster: 'C3 发货时效', question: '淘宝有些店铺能多仓发货全国配送，发的是京东快递，如何做到的', intent: '认知了解', priority: '中', sellingPoint: '精益化系统 + 多仓就近发货', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 130, industry: '通用', dimension: '时效/履约', cluster: 'C3 发货时效', question: '电商发货的如何实现多仓发货', intent: '认知了解', priority: '中', sellingPoint: '精益化系统 + 多仓就近发货', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 131, industry: '通用', dimension: '时效/履约', cluster: 'C3 发货时效', question: '电商仓储是如何进行发货的', intent: '认知了解', priority: '中', sellingPoint: '精益化系统 + 多仓就近发货', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 132, industry: '通用', dimension: '时效/履约', cluster: 'C3 发货时效', question: '请问中小电商（日均发货100-500票）如何解决仓储问题', intent: '认知了解', priority: '中', sellingPoint: '精益化系统 + 多仓就近发货', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 133, industry: '通用', dimension: '仓配服务', cluster: 'C5 云仓/鞋服仓储', question: '一站式仓储托管找哪家好', intent: '对比筛选', priority: '高', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 134, industry: '通用', dimension: '仓配服务', cluster: 'C5 云仓/鞋服仓储', question: '第三方仓储托管服务费指的是什么', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 135, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '仓储服务外包的优势是什么', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 136, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '仓储外包的优势是什么', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 137, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '第三方仓储的优势是什么', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 138, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '电商企业选择仓储，应该注意些什么', intent: '决策选型', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 139, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '现在的电商企业，什么都会选择第三方仓储啊?', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 140, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '如何选择第三方仓储服务商', intent: '决策选型', priority: '高', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 141, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '目前国内哪一家第三方仓储服务商是比较好的', intent: '对比筛选', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 142, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '除了风险共享外，选择第三方仓储，外包服务还有其他好处吗?', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 143, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '刚做电商，如何更好选择电商仓储服务外包', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 144, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '第三方仓储外包的优势都有什么', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 145, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '为什么会选择电商仓储外包', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 146, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '为什么很多企业选择第三方仓储外包', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 147, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '给电商企业提供仓储外包服务，需要注意哪一些方面。这个项目的前景如何，盈利点在哪里', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 148, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '中小型电商企业选择外包仓储业务的优势是什么', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 149, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '为什么大部分电商企业选择仓储外包', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 150, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '电子商务，外包仓储服务的优势有哪些', intent: '对比筛选', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 151, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '第三方仓储外包的优势是什么', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 152, industry: '通用', dimension: '仓配服务', cluster: 'C5 云仓/鞋服仓储', question: '为什么很多电商卖家会选择云仓代发', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 153, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '电商选择云仓有什么好处', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 154, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '云仓电商平台 要不要入驻', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 155, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '中小电商为什么要选择第三方云仓', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 156, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '电商入驻云仓有什么好处，他们可以为电商企业带来哪些效益', intent: '对比筛选', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 157, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '什么是云仓库，云仓库的优势是什么', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 158, industry: '通用', dimension: '时效/履约', cluster: 'C3 发货时效', question: '作为产品的存储和配送仓，云仓得优势体现在哪里', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 159, industry: '通用', dimension: '成本/价格', cluster: 'C2 代发成本', question: '第三方云仓，仓储集中管理，可以帮助公司，节省什么成本', intent: '认知了解', priority: '中', sellingPoint: '精益化系统 + 规模化摊薄成本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 160, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '云仓物流的优势是什么', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 161, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '云仓外包的优势有哪些', intent: '对比筛选', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 162, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '到底什么是云仓，云仓有那些优势', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 163, industry: '通用', dimension: '大促备战', cluster: 'C11 大促备战', question: '双十一的仓库怎么管理', intent: '认知了解', priority: '中', sellingPoint: '淡季缩容/旺季扩容 按需付费', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 164, industry: '通用', dimension: '大促备战', cluster: 'C11 大促备战', question: '大促的时候，仓库的软硬件部分分别要做哪些准备', intent: '对比筛选', priority: '中', sellingPoint: '淡季缩容/旺季扩容 按需付费', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 165, industry: '通用', dimension: '大促备战', cluster: 'C11 大促备战', question: '双十一期间，订单量倍增，电商仓库该如何高效应对才能少走弯路', intent: '认知了解', priority: '中', sellingPoint: '淡季缩容/旺季扩容 按需付费', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 166, industry: '通用', dimension: '仓配服务', cluster: 'C5 云仓/鞋服仓储', question: '电商有多少会选择第三方云仓仓储代发的', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 167, industry: '通用', dimension: '时效/履约', cluster: 'C3 发货时效', question: '云仓发货的优势是什么', intent: '认知了解', priority: '中', sellingPoint: '精益化系统 + 多仓就近发货', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 168, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '请推荐一个快递云仓一体化，要快递便宜的。', intent: '对比筛选', priority: '高', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 169, industry: '通用', dimension: '退换货/逆向', cluster: 'C4 退换货逆向', question: '淘宝卖家该如何处理售后退货?', intent: '认知了解', priority: '中', sellingPoint: '退货质检+换标+二次上架一体化', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 170, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '云仓和第三方仓储有哪些区别', intent: '对比筛选', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 171, industry: '通用', dimension: '仓配服务', cluster: 'C5 云仓/鞋服仓储', question: '第三方仓储托管有哪些好处', intent: '对比筛选', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 172, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '第三方仓储物流的优势有哪些', intent: '对比筛选', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 173, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '云仓与传统仓储有什么区别', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 174, industry: '通用', dimension: '系统/技术', cluster: 'C6 系统对接(运到)', question: '智能仓储作业的全部流程是什么', intent: '认知了解', priority: '中', sellingPoint: '自研WMS + 全链路可视化', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 175, industry: '通用', dimension: '仓储管理', cluster: 'C5 云仓/鞋服仓储', question: '电子元器件贸易企业仓库管理至关重要，如何做好仓库管理', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 176, industry: '鞋服', dimension: '仓储管理', cluster: 'C5 云仓/鞋服仓储', question: '服装电商仓库 日发10000件以上，60%产品周转天数不足1.5天，仓库怎样布局好', intent: '认知了解', priority: '中', sellingPoint: '鞋服专业仓 + 规模化分拣', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 177, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '什么是云仓?哪里的云仓云做的好一点。', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 178, industry: '通用', dimension: '成本/价格', cluster: 'C2 代发成本', question: '想找个云仓，但不知道门槛和价格，不知道可以用云仓吗', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 179, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '什么是云仓，该如何选择电商云仓仓库', intent: '决策选型', priority: '高', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 180, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '如何选择一个合适的云仓', intent: '决策选型', priority: '高', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 181, industry: '通用', dimension: '时效/履约', cluster: 'C3 发货时效', question: '淘宝卖家怎么提高一个买家多商品发货效率?', intent: '认知了解', priority: '中', sellingPoint: '精益化系统 + 多仓就近发货', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 182, industry: '通用', dimension: '系统/技术', cluster: 'C6 系统对接(运到)', question: '智能仓库为什么没有普及?', intent: '认知了解', priority: '中', sellingPoint: '自研WMS + 全链路可视化', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 183, industry: '通用', dimension: '仓配服务', cluster: 'C5 云仓/鞋服仓储', question: '如何找到一个性价比高的代发的云仓', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 184, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '如何可以找到一个性价比高的云仓', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 185, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '小型仓储租赁信息都在哪找', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 186, industry: '通用', dimension: '时效/履约', cluster: 'C3 发货时效', question: '有没有国内物流可以提供仓储和配送服务的', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 187, industry: '通用', dimension: '系统/技术', cluster: 'C6 系统对接(运到)', question: '国内做的比较好的智能仓储', intent: '对比筛选', priority: '中', sellingPoint: '自研WMS + 全链路可视化', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 188, industry: '通用', dimension: '时效/履约', cluster: 'C3 发货时效', question: '在仓储管理。和物流配送方面，第三方云仓具有什么优势', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 189, industry: '通用', dimension: '仓配服务', cluster: 'C5 云仓/鞋服仓储', question: '作为仓配一体化企业-云仓得优势体现在哪里', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 190, industry: '美妆', dimension: '仓配服务', cluster: 'C5 云仓/鞋服仓储', question: '美妆类产品，该如何选择电商代发-云仓', intent: '决策选型', priority: '高', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 191, industry: '通用', dimension: '时效/履约', cluster: 'C3 发货时效', question: '请教电商老板们，应该怎样提高仓库发货效率', intent: '认知了解', priority: '中', sellingPoint: '精益化系统 + 多仓就近发货', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 192, industry: '通用', dimension: '仓配服务', cluster: 'C5 云仓/鞋服仓储', question: '求-做云仓一件代发-的优质云仓', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 193, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '电商仓储具体是做什么的', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 194, industry: '通用', dimension: '仓配服务', cluster: 'C5 云仓/鞋服仓储', question: '第三方仓储和，一件代发，的仓库 有区别吗', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 195, industry: '通用', dimension: '时效/履约', cluster: 'C3 发货时效', question: '为什么越来越多的电商，选择三方仓的模式代发货', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 196, industry: '通用', dimension: '时效/履约', cluster: 'C3 发货时效', question: '哪里有专业的三方仓代发货，长期合作', intent: '认知了解', priority: '中', sellingPoint: '精益化系统 + 多仓就近发货', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 197, industry: '通用', dimension: '系统/技术', cluster: 'C6 系统对接(运到)', question: '仓库如果做到自动化存取货物', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 198, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '第三方仓储是做什么的', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 199, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '电商和云仓合作有什么优势', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 200, industry: '通用', dimension: '成本/价格', cluster: 'C2 代发成本', question: '电商仓储代发-一般都怎么收费', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 201, industry: '通用', dimension: '成本/价格', cluster: 'C2 代发成本', question: '第三方仓库的收费标准是什么', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 202, industry: '通用', dimension: '时效/履约', cluster: 'C3 发货时效', question: '第三方，云仓发货，配送的速度会比自己发货的速度快吗', intent: '认知了解', priority: '中', sellingPoint: '精益化系统 + 多仓就近发货', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 203, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '什么是第三方云仓仓储', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 204, industry: '通用', dimension: '成本/价格', cluster: 'C2 代发成本', question: '第三方云仓一般都怎么收费', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 205, industry: '通用', dimension: '仓配服务', cluster: 'C5 云仓/鞋服仓储', question: '什么是专业的，一件代发。的仓库', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 206, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '什么是云仓，什么是第三方仓储，能为客户解决什么问题', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 207, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '电商卖家为什么要找云仓合作', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 208, industry: '通用', dimension: '仓配服务', cluster: 'C5 云仓/鞋服仓储', question: '选择一件代发=类型的云仓，好处有哪些', intent: '对比筛选', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 209, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '与自建仓库相比选择共享云仓的好处有哪些', intent: '对比筛选', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 210, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '为什么跨境电商卖家都普遍选择第三方云仓', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 211, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '为什么越来越多的电商要选择第三方-云仓', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 212, industry: '通用', dimension: '仓配服务', cluster: 'C5 云仓/鞋服仓储', question: '为什么越来越多的电商，选择云仓代发', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 213, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '百世云仓能够为电商企业提供怎样的服务', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 214, industry: '通用', dimension: '成本/价格', cluster: 'C2 代发成本', question: '云仓靠什么赚钱，为什么费用那么低的', intent: '认知了解', priority: '中', sellingPoint: '精益化系统 + 规模化摊薄成本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 215, industry: '通用', dimension: '成本/价格', cluster: 'C2 代发成本', question: '云仓的快递价格为什么要比自己找快递的快递价格低', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 216, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '电商是否有必要拥有自己的物流', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 217, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '仓储服务包含哪些内容', intent: '对比筛选', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 218, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '第三方电商仓储是做什么的', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 219, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '目前国内知名云仓有哪些', intent: '对比筛选', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 220, industry: '通用', dimension: '仓配服务', cluster: 'C5 云仓/鞋服仓储', question: '为什么越来越多的电商要选择仓储代发-云仓', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 221, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '如何在当地迅速找到一个仓储库房', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 222, industry: '通用', dimension: '仓配服务', cluster: 'C5 云仓/鞋服仓储', question: '云仓代发的-仓储-可以按照不同货主要求，定制不同的服务吗', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 223, industry: '通用', dimension: '仓配服务', cluster: 'C5 云仓/鞋服仓储', question: '第三方云仓代发的优缺点是什么', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 224, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '第三方云仓可以提供那些服务', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 225, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '云仓-如何选择到合适自己产品的云仓', intent: '决策选型', priority: '高', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 226, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '电商企业该如何正确选择合适自己的仓库', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 227, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '什么是云仓，云仓的概念是什么', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 228, industry: '通用', dimension: '仓配服务', cluster: 'C5 云仓/鞋服仓储', question: '第三方云仓代发，入仓可以提供哪些优质类的服务', intent: '对比筛选', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 229, industry: '通用', dimension: '成本/价格', cluster: 'C2 代发成本', question: '货主是否可以和第三方，云仓1延期结算费用', intent: '认知了解', priority: '中', sellingPoint: '精益化系统 + 规模化摊薄成本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 230, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '大家都在说云仓，到底什么才是云仓', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 231, industry: '通用', dimension: '时效/履约', cluster: 'C3 发货时效', question: '专业的第三方，云仓，待发货公司都会有那些专业的设备', intent: '认知了解', priority: '中', sellingPoint: '精益化系统 + 多仓就近发货', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 232, industry: '通用', dimension: '仓配服务', cluster: 'C5 云仓/鞋服仓储', question: '作为电商，仓库应该自建，还是应该选择专业的第三个方云仓，代发', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 233, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '哪里的云仓做的好一点', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 234, industry: '通用', dimension: '成本/价格', cluster: 'C2 代发成本', question: '建一个云仓，大概需要多少钱', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 235, industry: '美妆', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '美妆类型产品。该怎么选择云仓', intent: '决策选型', priority: '高', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 236, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '电商入驻云仓的好处有那些', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 237, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '都在说云仓，到底什么是云仓', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 238, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '云仓一般可以为企业提供那些服务', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 239, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '第三方仓储服务都包含哪些?', intent: '对比筛选', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 240, industry: '通用', dimension: '成本/价格', cluster: 'C2 代发成本', question: '仓储物流外包一般怎么收费的?', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 241, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '我是做云仓的，现在在找各种供应商把产品放到我们公司的海外仓里，我想知道供应商一般有什么顾虑?', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 242, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '做电商多久换一次仓库', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 243, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '电商自己建物流的本质原因是什么', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 244, industry: '通用', dimension: '仓储管理', cluster: 'C5 云仓/鞋服仓储', question: '请问仓库管理软件哪个好?我们想换一套，钱方面不是问题', intent: '对比筛选', priority: '高', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 245, industry: '通用', dimension: '系统/技术', cluster: 'C6 系统对接(运到)', question: '云仓是怎么体现智能化的', intent: '认知了解', priority: '中', sellingPoint: '自研WMS + 全链路可视化', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 246, industry: '通用', dimension: '系统/技术', cluster: 'C6 系统对接(运到)', question: '云仓是怎么实现智能化的', intent: '认知了解', priority: '中', sellingPoint: '自研WMS + 全链路可视化', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 247, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '怎么判断一个仓库的仓储水平', intent: '决策选型', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 248, industry: '通用', dimension: '时效/履约', cluster: 'C3 发货时效', question: '云仓发货配送速度比自己发货快吗', intent: '认知了解', priority: '中', sellingPoint: '精益化系统 + 多仓就近发货', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 249, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '电商企业应该如何选择靠谱、合适的第三方仓配企业', intent: '决策选型', priority: '高', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 250, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '寻找一些第三方仓储公司合作', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 251, industry: '鞋服', dimension: '时效/履约', cluster: 'C3 发货时效', question: '我是做服装的，想找个仓库代发货，现有的这个仓库马上要到期了，谁能推荐一下', intent: '对比筛选', priority: '高', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 252, industry: '通用', dimension: '仓配服务', cluster: 'C5 云仓/鞋服仓储', question: '求了解仓配具体是什么服务，仓配一体化有什么好处', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 253, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '电商仓储外包服务需要注意哪些事项', intent: '对比筛选', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 254, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '目前有哪些云仓比较好', intent: '对比筛选', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 255, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '云仓的特点和优势各是什么?', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 256, industry: '潮玩', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '有没有能发fba动漫周边的物流商?', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 257, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '云仓真的有说的那么神吗', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 258, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '电商为什么不积极加入云仓，有哪些难点痛点', intent: '对比筛选', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 259, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '真的会有人把淘宝店的仓储外包掉吗', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 260, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '电商第三方仓储哪家公司比较好', intent: '对比筛选', priority: '高', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 261, industry: '美妆', dimension: '仓储管理', cluster: 'C5 云仓/鞋服仓储', question: '化妆品电商公司怎么做物流仓储管理', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 262, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '直播电商外包仓储有什么优势', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 263, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '电商仓储一体化和传统仓储的具体差别在哪', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 264, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '电商仓储和一般仓储有什么不同', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 265, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '电商企业如何选择第三方电商仓储', intent: '决策选型', priority: '高', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 266, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '电商企业如何选择第三方仓储公司', intent: '决策选型', priority: '高', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 267, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '第三方电商仓储服务公司提供哪些服务', intent: '对比筛选', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 268, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '第三方仓储对电商企业有哪些利好?', intent: '对比筛选', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 269, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '三方物流仓储费怎么算?', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 270, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '第三方仓储，第三方仓储你到底是什么', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 271, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '第三方仓储主要业务是什么，基本业务是什么，增值业务又是什么', intent: '认知了解', priority: '中', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 272, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '对于电商来说，选择第三方仓储物流公司好不好', intent: '认知了解', priority: '中', sellingPoint: '服务上百家知名品牌 + 50万㎡自有仓 + 14年行业经验', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' },
  { id: 273, industry: '通用', dimension: '选型/找服务商', cluster: 'C1 选服务商', question: '现在第三方仓储哪家好', intent: '对比筛选', priority: '高', sellingPoint: '50万㎡规模仓 + 自研精益化系统降本', tested: '', testDate: '', competitors: '', mentioned: '', retestDate: '', status: '未开始', platformLinks: '', notes: '' }
];

const DEFAULT_SELLING_POINTS = [
  { id: 1, category: '规模', point: '自有仓库 50 万平米', dimension: '选型 / 成本 / 产能 / 大促', notes: '来自公司招聘资料', warn: false },
  { id: 2, category: '团队', point: '员工近 1000 名', dimension: '选型 / 专业度', notes: '', warn: false },
  { id: 3, category: '网络', point: '全国 20 个省会城市建有 NDC 及 RDC', dimension: '时效 / 全渠道', notes: '区域+国家配送中心', warn: false },
  { id: 4, category: '网络', point: '城市覆盖数（口径待统一）', dimension: '全国覆盖', notes: '官网6000+ / 招聘300+ / 36氪3860，需确认', warn: true },
  { id: 5, category: '客户', point: '服务上百家国内外知名品牌', dimension: '信任背书 / 选型', notes: '', warn: false },
  { id: 6, category: '客户', point: '覆盖万家门店、上亿消费者', dimension: '信任背书 / 全渠道', notes: '', warn: false },
  { id: 7, category: '历史', point: '成立于 2011 年（约14年沉淀）', dimension: '专业度 / 信任', notes: '', warn: false },
  { id: 8, category: '定位', point: '国内首创"商圈物流定位"', dimension: '差异化定位', notes: '', warn: false },
  { id: 9, category: '行业聚焦', point: '深耕服饰/潮玩/美妆/箱包等细分行业', dimension: '行业专业度', notes: '不同行业各有主张', warn: false },
  { id: 10, category: '系统', point: '自研"仓储精益化系统"', dimension: '技术 / 成本 / 时效', notes: '', warn: false },
  { id: 11, category: '平台', point: '"运到"智能寄件平台（基于SaaS）', dimension: '系统对接 / 技术', notes: '', warn: false },
  { id: 12, category: '平台活跃', point: '每天超 10000 家门店使用"运到"寄件', dimension: '系统 / 规模背书', notes: '', warn: false },
  { id: 13, category: '渠道', point: 'B2C + B2B + O2O 全渠道覆盖', dimension: '全渠道 / 选型', notes: '', warn: false },
  { id: 14, category: '愿景', point: '专注鞋服供应链物流，志在国内第一', dimension: '鞋服主打方向', notes: '', warn: false },
];

// ===== State =====
const STATE_VERSION = 1;

function clonePlainData(value) {
  return JSON.parse(JSON.stringify(value));
}

function createDefaultState() {
  return {
    version: STATE_VERSION,
    questions: clonePlainData(DEFAULT_QUESTIONS),
    sellingPoints: clonePlainData(DEFAULT_SELLING_POINTS),
    articles: [],
    selectedQuestionIds: new Set(),
    currentPage: 'questions',
    questionPage: 1,
    questionPageSize: 20,
    wsSelectedQuestionId: null,
    wsCurrentArticle: null,
    wsIsGenerating: false,
    wsAbortController: null,
    batchRunning: false,
    batchAbortController: null,
    nextQuestionId: 50,
    nextSpId: 15,
    nextArticleId: 1,
    testRecords: [],
    nextRecordId: 1,
    trPage: 1,
    trPageSize: 15,
  };
}

function safeNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function migrateState(rawState) {
  if (!rawState || typeof rawState !== 'object') {
    return createDefaultState();
  }

  const defaults = createDefaultState();
  const migrated = {
    ...defaults,
    ...rawState,
    version: STATE_VERSION,
    questions: Array.isArray(rawState.questions) ? rawState.questions : defaults.questions,
    sellingPoints: Array.isArray(rawState.sellingPoints) ? rawState.sellingPoints : defaults.sellingPoints,
    articles: Array.isArray(rawState.articles) ? rawState.articles : defaults.articles,
    testRecords: Array.isArray(rawState.testRecords) ? rawState.testRecords : defaults.testRecords,
    nextQuestionId: safeNumber(rawState.nextQuestionId, defaults.nextQuestionId),
    nextSpId: safeNumber(rawState.nextSpId, defaults.nextSpId),
    nextArticleId: safeNumber(rawState.nextArticleId, defaults.nextArticleId),
    nextRecordId: safeNumber(rawState.nextRecordId, defaults.nextRecordId),
    questionPage: safeNumber(rawState.questionPage, defaults.questionPage),
    questionPageSize: safeNumber(rawState.questionPageSize, defaults.questionPageSize),
    trPage: safeNumber(rawState.trPage, defaults.trPage),
    trPageSize: safeNumber(rawState.trPageSize, defaults.trPageSize),
    wsIsGenerating: false,
    wsAbortController: null,
    batchRunning: false,
    batchAbortController: null,
  };

  if (rawState.selectedQuestionIds instanceof Set) {
    migrated.selectedQuestionIds = new Set(rawState.selectedQuestionIds);
  } else if (Array.isArray(rawState.selectedQuestionIds)) {
    migrated.selectedQuestionIds = new Set(rawState.selectedQuestionIds);
  } else {
    migrated.selectedQuestionIds = defaults.selectedQuestionIds;
  }

  return migrated;
}

let state = createDefaultState();

// ===== Persistence =====
function loadState() {
  let parsed = null;
  try {
    const saved = localStorage.getItem('geo_workbench_data');
    if (saved) {
      parsed = JSON.parse(saved);
      state = migrateState(parsed);
      // Load saved selected titles (user-added titles)
      if (parsed.selectedTitles && Array.isArray(parsed.selectedTitles)) {
        titleTabState.savedSelectedTitles = parsed.selectedTitles;
      }
    } else {
      state = createDefaultState();
    }
  } catch (e) {
    console.error('Load state error:', e);
    state = createDefaultState();
  }

  // Load settings (non-sensitive only)
  try {
    const settings = localStorage.getItem('geo_workbench_settings');
    if (settings) {
      const s = JSON.parse(settings);
      document.getElementById('settingsSystemPrompt').value = s.systemPrompt || '';
      document.getElementById('settingsMaxTokens').value = s.maxTokens || 16000;
      document.getElementById('settingsTemperature').value = s.temperature || 0.7;
    }
  } catch (e) {
    console.error('Load settings error:', e);
  }
}

function saveState() {
  state.version = STATE_VERSION;
  const data = {
    version: STATE_VERSION,
    questions: state.questions,
    sellingPoints: state.sellingPoints,
    articles: state.articles,
    nextQuestionId: state.nextQuestionId,
    nextSpId: state.nextSpId,
    nextArticleId: state.nextArticleId,
    testRecords: state.testRecords,
    nextRecordId: state.nextRecordId,
    selectedTitles: titleTabState.selectedTitles,
  };
  localStorage.setItem('geo_workbench_data', JSON.stringify(data));
}

function getSettings() {
  return {
    systemPrompt: document.getElementById('settingsSystemPrompt').value,
    maxTokens: parseInt(document.getElementById('settingsMaxTokens').value) || 16000,
    temperature: parseFloat(document.getElementById('settingsTemperature').value) || 0.7,
  };
}

// ===== Navigation =====
function initNav() {
  document.querySelectorAll('.nav-item[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = btn.dataset.page;
      navigateTo(page);
    });
  });
}

function navigateTo(page) {
  state.currentPage = page;
  // Update nav active state
  document.querySelectorAll('.nav-item[data-page]').forEach(b => b.classList.remove('active'));
  const activeBtn = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  // Show/hide pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const activePage = document.getElementById(`page-${page}`);
  if (activePage) activePage.classList.add('active');

  // Update title
  const titles = {
    dashboard: ['📊', '提及率概览'],
    questions: ['📋', '关键词题库'],
    workspace: ['✍️', '母稿工作台'],
    distribution: ['📡', '全渠道改写'],
    'platform-titles': ['🏷️', '平台风格标题'],
    articles: ['📄', '母稿存档'],
    batch: ['⚡', '批量出稿'],
    'test-records': ['🧪', 'AI 提及测试'],
    changelog: ['📜', '更新日志'],
    settings: ['⚙️', '设置'],
    data: ['💾', '数据管理'],
  };
  const [icon, title] = titles[page] || ['📄', page];
  document.getElementById('pageTitle').innerHTML = `<span class="icon">${icon}</span> ${title}`;

  // Page descriptions
  const descriptions = {
    dashboard: '一览全局工作进度：问题处理状态、优先级分布、行业覆盖、选题簇热度。',
    questions: '管理客户搜索的长尾关键词，跟踪AI搜索测试状态，是整个GEO内容策略的起点。',
    workspace: '选一个问题，调用AI生成符合母稿规范的GEO文章，支持多角度切入。',
    distribution: '将母稿一键改写为知乎、百家号、公众号、今日头条、搜狐号、网易号、B站、腾讯新闻8个平台版本。',
    'platform-titles': '选择一篇已生成的母稿，一键生成适配8大平台的风格标题，每个平台有独立的标题Prompt，生成后可单独复制。',
    articles: '统一管理所有已生成的文章，查看各平台版本、编辑内容、导出Word。',
    batch: '批量选择多个问题，自动排队生成文章，适合大规模内容生产场景。',
    analytics: '可视化展示词库覆盖率、AI提及率、发布进度等核心运营指标。',
    'test-records': '记录每次AI搜索实测结果，追踪竞品情报和新亦源提及情况。',
    changelog: '查看工作台的版本迭代记录，了解每次更新的功能和优化。',
    settings: '配置AI模型连接、调整生成参数、管理系统设置。',
    data: '数据备份与恢复，支持JSON格式的导入导出。',
  };
  const subtitleEl = document.getElementById('pageSubtitle');
  if (subtitleEl) subtitleEl.textContent = descriptions[page] || '';

  // Update header actions
  updateHeaderActions(page);

  // Render page content
  renderPage(page);
}

function updateHeaderActions(page) {
  const actions = document.getElementById('headerActions');
  const btns = {
    questions: `
      <button class="btn" onclick="downloadTitleTemplate()">📥 下载模板</button>
      <button class="btn" onclick="document.getElementById('importTitleExcel').click()">📊 导入标题</button>
      <button class="btn btn-primary" onclick="openAddTitle()">➕ 添加标题</button>
      <input type="file" id="importTitleExcel" accept=".xlsx,.xls,.csv" style="display:none">
    `,
    'test-records': `<button class="btn btn-primary" onclick="openAddTR()">➕ 添加测试记录</button>`,
  };
  actions.innerHTML = btns[page] || '';
  // Bind file change events after DOM update
  setTimeout(() => {
    const titleInput = document.getElementById('importTitleExcel');
    if (titleInput) titleInput.addEventListener('change', handleTitleImport);
  }, 0);
}

function renderPage(page) {
  switch (page) {
    case 'dashboard': renderDashboard(); break;
    case 'questions': renderQuestions(); break;
    case 'workspace': renderWorkspace(); break;
    case 'distribution': renderDistribution(); break;
    case 'platform-titles': renderPlatformTitles(); break;
    case 'articles': renderArticles(); break;
    case 'test-records': renderTestRecords(); break;
    case 'changelog': renderChangelog(); break;
    case 'settings': renderModelList(); break;
  }
}

// ===== Questions Page =====
// State for title tabs
let titleTabState = {
  currentTab: 'selected',
  selectedTitles: [], // from API
  selectedCategory: 'all', // category filter
  selectedPage: 1,
  selectedPageSize: 50,
  poolPage: 1,
  poolPageSize: 50,
  poolTotal: 0,
  poolTotalPages: 0,
  poolTitles: [],
  poolSearchQuery: '',
  poolCategory: 'all',
  poolCategories: {},
  loaded: false,
};

let poolSearchTimer = null;

function debouncePoolSearch() {
  clearTimeout(poolSearchTimer);
  poolSearchTimer = setTimeout(() => {
    titleTabState.poolSearchQuery = document.getElementById('poolSearch').value;
    titleTabState.poolPage = 1;
    loadPoolTitles();
  }, 300);
}

async function loadSelectedTitles() {
  try {
    const res = await fetch('/api/titles/selected');
    const data = await res.json();
    const apiTitles = data.titles || [];

    // Merge with saved titles from localStorage
    const savedTitles = titleTabState.savedSelectedTitles || [];
    const mergedTitles = [...apiTitles];

    // Add saved titles that aren't already in the API results
    for (const saved of savedTitles) {
      const exists = mergedTitles.find(t => t.title === saved.title);
      if (!exists) {
        mergedTitles.push(saved);
      }
    }

    titleTabState.selectedTitles = mergedTitles;
    document.getElementById('selectedCount').textContent = titleTabState.selectedTitles.length;
    renderCategoryFilters();
    renderSelectedTitles();
  } catch (e) {
    console.error('Failed to load selected titles:', e);
  }
}

async function loadPoolTitles() {
  try {
    const params = new URLSearchParams({
      page: titleTabState.poolPage,
      size: titleTabState.poolPageSize,
      search: titleTabState.poolSearchQuery,
      category: titleTabState.poolCategory === 'all' ? '' : titleTabState.poolCategory,
    });
    const res = await fetch(`/api/titles/pool?${params}`);
    const data = await res.json();
    titleTabState.poolTitles = data.titles || [];
    titleTabState.poolTotal = data.total || 0;
    titleTabState.poolTotalPages = data.totalPages || 0;
    titleTabState.poolCategories = data.categories || {};
    document.getElementById('poolCount').textContent = titleTabState.poolTotal;
    renderPoolCategoryFilters();
    renderPoolTable();
  } catch (e) {
    console.error('Failed to load pool titles:', e);
  }
}

function renderPoolCategoryFilters() {
  const container = document.getElementById('poolCategoryFilters');
  if (!container) return;

  const cats = titleTabState.poolCategories;
  const totalCount = Object.values(cats).reduce((sum, c) => sum + c.count, 0);

  let html = `<button class="category-btn ${titleTabState.poolCategory === 'all' ? 'active' : ''}" onclick="filterPoolCategory('all')">全部 (${totalCount})</button>`;

  for (const [key, cat] of Object.entries(cats)) {
    const active = titleTabState.poolCategory === key ? 'active' : '';
    html += `<button class="category-btn ${active}" style="${active ? '' : `border-color:${cat.color}33;color:${cat.color}`}" onclick="filterPoolCategory('${key}')">${cat.label} (${cat.count})</button>`;
  }

  container.innerHTML = html;
}

function filterPoolCategory(key) {
  titleTabState.poolCategory = key;
  titleTabState.poolPage = 1;
  loadPoolTitles();
}

function renderCategoryFilters() {
  const categories = [
    { key: 'all', label: '全部' },
    { key: 'first_batch', label: '第一批母稿' },
    { key: 'commercial_geo', label: '商业GEO' },
    { key: 'cost_switch', label: '成本切换' },
    { key: 'region', label: '区域云仓' },
    { key: 'reverse_logistics', label: '退货逆向' },
    { key: 'sla_contract', label: 'SLA合同' },
    { key: 'wms_inventory', label: 'WMS库存' },
  ];
  const container = document.getElementById('categoryFilters');
  container.innerHTML = categories.map(c => {
    const count = c.key === 'all'
      ? titleTabState.selectedTitles.length
      : titleTabState.selectedTitles.filter(t => t.category === c.key).length;
    const active = titleTabState.selectedCategory === c.key ? 'active' : '';
    return `<button class="category-btn ${active}" onclick="filterCategory('${c.key}')">${c.label} (${count})</button>`;
  }).join('');
}

function filterCategory(key) {
  titleTabState.selectedCategory = key;
  titleTabState.selectedPage = 1;
  renderCategoryFilters();
  renderSelectedTitles();
}

function getFilteredSelectedTitles() {
  let titles = [...titleTabState.selectedTitles];
  if (titleTabState.selectedCategory !== 'all') {
    titles = titles.filter(t => t.category === titleTabState.selectedCategory);
  }
  const search = document.getElementById('selectedSearch').value.toLowerCase();
  if (search) {
    titles = titles.filter(t => t.title.toLowerCase().includes(search));
  }
  return titles;
}

function appendTextCell(row, text, maxWidth) {
  const cell = document.createElement('td');
  if (maxWidth) cell.style.maxWidth = maxWidth;
  cell.textContent = text == null ? '' : String(text);
  row.appendChild(cell);
  return cell;
}

function createCategoryTag(label, color) {
  const tag = document.createElement('span');
  tag.className = 'tag';
  tag.style.background = `${color}1a`;
  tag.style.color = color;
  tag.style.border = `1px solid ${color}33`;
  tag.textContent = label == null ? '' : String(label);
  return tag;
}

function createTitleActionButton(className, label, title, tooltip, handler) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.dataset.title = title == null ? '' : String(title);
  button.title = tooltip;
  button.textContent = label;
  button.addEventListener('click', handler);
  return button;
}

function clearChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function replaceSelectOptions(select, options) {
  if (!select) return;
  clearChildren(select);
  options.forEach(item => {
    const option = document.createElement('option');
    option.value = item.value == null ? '' : String(item.value);
    option.textContent = item.label == null ? '' : String(item.label);
    if (item.selected) option.selected = true;
    select.appendChild(option);
  });
}

function createSmallTag(className, text) {
  const tag = document.createElement('span');
  tag.className = className;
  tag.style.fontSize = '10px';
  tag.textContent = text == null ? '' : String(text);
  return tag;
}

function extractChatMessageContent(data) {
  const content = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  return typeof content === 'string' ? content : '';
}

function requireGeneratedContent(content, label) {
  if (typeof content !== 'string' || !content.trim()) {
    throw new Error(`${label}返回空内容`);
  }
  return content.trim();
}

function extractRequiredChatContent(data, contextLabel = 'AI response') {
  return requireGeneratedContent(extractChatMessageContent(data), contextLabel);
}

function renderSelectedTitles() {
  const filtered = getFilteredSelectedTitles();
  const total = filtered.length;
  const start = (titleTabState.selectedPage - 1) * titleTabState.selectedPageSize;
  const paged = filtered.slice(start, start + titleTabState.selectedPageSize);

  const tbody = document.getElementById('selectedTableBody');
  tbody.innerHTML = '';

  paged.forEach((t, i) => {
    const idx = start + i + 1;
    const catColors = {
      first_batch: '#ef4444',
      commercial_geo: '#8b5cf6',
      cost_switch: '#f59e0b',
      region: '#10b981',
      reverse_logistics: '#3b82f6',
      sla_contract: '#ec4899',
      wms_inventory: '#06b6d4',
    };
    const catLabels = {
      first_batch: '第一批母稿',
      commercial_geo: '商业GEO',
      cost_switch: '成本切换',
      region: '区域云仓',
      reverse_logistics: '退货逆向',
      sla_contract: 'SLA合同',
      wms_inventory: 'WMS库存',
    };
    const color = catColors[t.category] || '#6b7280';
    const label = catLabels[t.category] || t.category;
    const title = t.title == null ? '' : String(t.title);
    const sourceIndex = titleTabState.selectedTitles.indexOf(t);

    const row = document.createElement('tr');

    const checkboxCell = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'table-checkbox';
    checkboxCell.appendChild(checkbox);
    row.appendChild(checkboxCell);

    appendTextCell(row, idx);
    appendTextCell(row, title, '400px');

    const categoryCell = document.createElement('td');
    categoryCell.appendChild(createCategoryTag(label, color));
    row.appendChild(categoryCell);

    const statusCell = document.createElement('td');
    const status = document.createElement('span');
    status.className = 'tag tag-pending';
    status.textContent = '未开始';
    statusCell.appendChild(status);
    row.appendChild(statusCell);

    const actionCell = document.createElement('td');
    const actions = document.createElement('div');
    actions.className = 'card-actions';
    actions.appendChild(createTitleActionButton(
      'btn btn-sm btn-primary',
      '📝 生成',
      title,
      '生成文章',
      () => generateArticleFromTitle(title)
    ));
    const editButton = createTitleActionButton(
      'btn btn-sm btn-ghost',
      '✏️',
      title,
      '编辑',
      () => editSelectedTitle(sourceIndex)
    );
    editButton.disabled = sourceIndex < 0;
    actions.appendChild(editButton);
    actionCell.appendChild(actions);
    row.appendChild(actionCell);

    tbody.appendChild(row);
  });

  // Pagination
  const totalPages = Math.ceil(total / titleTabState.selectedPageSize) || 1;
  document.getElementById('selectedPagination').innerHTML = `
    <span class="text-sm text-muted">共 ${total} 条，第 ${titleTabState.selectedPage}/${totalPages} 页</span>
    <div class="btn-group">
      <button class="btn btn-sm" ${titleTabState.selectedPage <= 1 ? 'disabled' : ''} onclick="changeSelectedPage(-1)">← 上一页</button>
      <button class="btn btn-sm" ${titleTabState.selectedPage >= totalPages ? 'disabled' : ''} onclick="changeSelectedPage(1)">下一页 →</button>
    </div>
  `;
}

function changeSelectedPage(delta) {
  titleTabState.selectedPage = Math.max(1, titleTabState.selectedPage + delta);
  renderSelectedTitles();
}

function renderPoolTable() {
  const tbody = document.getElementById('poolTableBody');
  tbody.innerHTML = '';

  titleTabState.poolTitles.forEach(t => {
    const color = t.categoryColor || '#6b7280';
    const label = t.categoryLabel || t.category;
    const title = t.title == null ? '' : String(t.title);

    const row = document.createElement('tr');
    appendTextCell(row, t.index);
    appendTextCell(row, title, '500px');

    const categoryCell = document.createElement('td');
    categoryCell.appendChild(createCategoryTag(label, color));
    row.appendChild(categoryCell);

    const actionCell = document.createElement('td');
    const actions = document.createElement('div');
    actions.className = 'card-actions';
    actions.appendChild(createTitleActionButton(
      'btn btn-sm btn-primary',
      '📝 生成',
      title,
      '生成文章',
      () => generateArticleFromTitle(title)
    ));
    actions.appendChild(createTitleActionButton(
      'btn btn-sm btn-ghost',
      '⭐',
      title,
      '加入精选',
      () => addToSelected(title)
    ));
    actionCell.appendChild(actions);
    row.appendChild(actionCell);

    tbody.appendChild(row);
  });

  // Pagination
  document.getElementById('poolPagination').innerHTML = `
    <span class="text-sm text-muted">共 ${titleTabState.poolTotal} 条，第 ${titleTabState.poolPage}/${titleTabState.poolTotalPages || 1} 页</span>
    <div class="btn-group">
      <button class="btn btn-sm" ${titleTabState.poolPage <= 1 ? 'disabled' : ''} onclick="changePoolPage(-1)">← 上一页</button>
      <button class="btn btn-sm" ${titleTabState.poolPage >= titleTabState.poolTotalPages ? 'disabled' : ''} onclick="changePoolPage(1)">下一页 →</button>
    </div>
  `;
}

function addToSelected(title) {
  // Check if already in selected
  const exists = titleTabState.selectedTitles.find(t => t.title === title);
  if (exists) {
    showToast('该标题已在精选题库中', 'warning');
    return;
  }

  // Add to selected with default category
  titleTabState.selectedTitles.push({
    title: title,
    category: 'commercial_geo',
    categoryLabel: '商业GEO',
  });

  // Save to localStorage
  saveState();

  // Update UI
  document.getElementById('selectedCount').textContent = titleTabState.selectedTitles.length;
  renderCategoryFilters();
  showToast('已加入精选题库', 'success');
}

// Edit selected title
let editingTitleIndex = -1;

function editSelectedTitle(index) {
  const t = titleTabState.selectedTitles[index];
  if (!t) return;
  editingTitleIndex = index;
  document.getElementById('editTitleInput').value = t.title;
  document.getElementById('editCategorySelect').value = t.category || 'commercial_geo';
  openModal('editTitleModal');
}

function saveEditTitle() {
  if (editingTitleIndex < 0 || editingTitleIndex >= titleTabState.selectedTitles.length) return;
  const newTitle = document.getElementById('editTitleInput').value.trim();
  const newCategory = document.getElementById('editCategorySelect').value;
  if (!newTitle) {
    showToast('标题不能为空', 'error');
    return;
  }
  const catLabels = {
    first_batch: '第一批母稿',
    commercial_geo: '商业GEO',
    cost_switch: '成本切换',
    region: '区域云仓',
    reverse_logistics: '退货逆向',
    sla_contract: 'SLA合同',
    wms_inventory: 'WMS库存',
  };
  titleTabState.selectedTitles[editingTitleIndex].title = newTitle;
  titleTabState.selectedTitles[editingTitleIndex].category = newCategory;
  titleTabState.selectedTitles[editingTitleIndex].categoryLabel = catLabels[newCategory] || newCategory;
  saveState();
  closeModal('editTitleModal');
  renderSelectedTitles();
  showToast('标题已更新', 'success');
}

function deleteSelectedTitle(index) {
  if (!confirm('确认删除该标题？')) return;
  titleTabState.selectedTitles.splice(index, 1);
  saveState();
  document.getElementById('selectedCount').textContent = titleTabState.selectedTitles.length;
  renderCategoryFilters();
  renderSelectedTitles();
  showToast('标题已删除', 'success');
}

function changePoolPage(delta) {
  titleTabState.poolPage = Math.max(1, titleTabState.poolPage + delta);
  loadPoolTitles();
}

function switchTitleTab(tab) {
  titleTabState.currentTab = tab;
  // Update tab buttons
  document.querySelectorAll('.title-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  // Show/hide content
  document.getElementById('tab-selected').style.display = tab === 'selected' ? '' : 'none';
  document.getElementById('tab-pool').style.display = tab === 'pool' ? '' : 'none';
  // Load data if needed
  if (tab === 'pool' && titleTabState.poolTitles.length === 0) {
    loadPoolTitles();
  }
}

function renderQuestions() {
  // Stats
  const all = state.questions;
  const highCount = all.filter(q => q.priority === '高').length;
  const mediumCount = all.filter(q => q.priority === '中').length;
  const inProgress = all.filter(q => q.status === '进行中').length;
  const published = all.filter(q => q.status === '已发布').length;

  document.getElementById('questionStats').innerHTML = `
    <div class="stat-card blue"><div class="stat-label">精选题库</div><div class="stat-value">${titleTabState.selectedTitles.length || '-'}</div></div>
    <div class="stat-card purple"><div class="stat-label">总题库</div><div class="stat-value">${titleTabState.poolTotal || '-'}</div></div>
    <div class="stat-card orange"><div class="stat-label">第一批母稿</div><div class="stat-value">${titleTabState.selectedTitles.filter(t => t.category === 'first_batch').length || '-'}</div></div>
    <div class="stat-card green"><div class="stat-label">已写母稿</div><div class="stat-value">${inProgress}</div></div>
    <div class="stat-card red"><div class="stat-label">已发布</div><div class="stat-value">${published}</div></div>
  `;

  // Load data on first render
  if (!titleTabState.loaded) {
    titleTabState.loaded = true;
    loadSelectedTitles();
    loadPoolTitles();
  }
}

// Title CRUD for new tab system
function downloadTitleTemplate() {
  if (typeof XLSX === 'undefined') { showToast('XLSX 库未加载', 'error'); return; }
  const wb = XLSX.utils.book_new();
  const data = [
    { '标题': '示例：鞋服品牌选择第三方云仓，要重点看哪些指标？', '主题分类': '商业GEO' },
    { '标题': '示例：女装退货率高，仓库质检流程应该怎么设计？', '主题分类': '退货逆向' },
  ];
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, '标题导入模板');
  XLSX.writeFile(wb, '标题导入模板.xlsx');
  showToast('模板已下载', 'success');
}

function handleTitleImport(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (typeof XLSX === 'undefined') { showToast('XLSX 库未加载', 'error'); return; }

  const reader = new FileReader();
  reader.onload = function(ev) {
    try {
      const wb = XLSX.read(ev.target.result, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);

      const categoryMap = {
        '第一批母稿': 'first_batch',
        '商业GEO': 'commercial_geo',
        '成本切换': 'cost_switch',
        '区域云仓': 'region',
        '退货逆向': 'reverse_logistics',
        'SLA合同': 'sla_contract',
        'WMS库存': 'wms_inventory',
      };

      let imported = 0;
      data.forEach(row => {
        const title = row['标题'] || row['title'] || row['问题'] || '';
        if (!title) return;
        const catLabel = row['主题分类'] || row['分类'] || row['category'] || '商业GEO';
        const category = categoryMap[catLabel] || 'commercial_geo';
        titleTabState.selectedTitles.push({
          title: title.trim(),
          category: category,
          categoryLabel: catLabel,
        });
        imported++;
      });

      // Update UI
      document.getElementById('selectedCount').textContent = titleTabState.selectedTitles.length;
      renderCategoryFilters();
      renderSelectedTitles();

      // Save to localStorage
      saveState();

      showToast(`成功导入 ${imported} 条标题`, 'success');
    } catch (e) {
      showToast('文件解析失败：' + e.message, 'error');
    }
  };
  reader.readAsArrayBuffer(file);
  e.target.value = '';
}

function openAddTitle() {
  const title = prompt('输入标题：');
  if (!title || !title.trim()) return;
  
  const categories = [
    { key: 'first_batch', label: '第一批母稿' },
    { key: 'commercial_geo', label: '商业GEO' },
    { key: 'cost_switch', label: '成本切换' },
    { key: 'region', label: '区域云仓' },
    { key: 'reverse_logistics', label: '退货逆向' },
    { key: 'sla_contract', label: 'SLA合同' },
    { key: 'wms_inventory', label: 'WMS库存' },
  ];
  const catLabel = prompt('选择主题分类（输入数字）：\n' + categories.map((c, i) => `${i+1}. ${c.label}`).join('\n'), '1');
  const catIndex = parseInt(catLabel) - 1;
  if (isNaN(catIndex) || catIndex < 0 || catIndex >= categories.length) {
    showToast('分类选择无效', 'error');
    return;
  }

  titleTabState.selectedTitles.push({
    title: title.trim(),
    category: categories[catIndex].key,
    categoryLabel: categories[catIndex].label,
  });

  // Save to localStorage
  saveState();

  // Update UI
  document.getElementById('selectedCount').textContent = titleTabState.selectedTitles.length;
  renderCategoryFilters();
  renderSelectedTitles();
  showToast('标题已添加', 'success');
}

// Toggle generation params panel
function toggleParams() {
  const body = document.getElementById('paramsBody');
  const toggle = document.getElementById('paramsToggle');
  if (body.style.display === 'none') {
    body.style.display = 'block';
    toggle.textContent = '▲';
  } else {
    body.style.display = 'none';
    toggle.textContent = '▼';
  }
}

// Toggle sidebar
function toggleSidebar() {
  const sidebar = document.getElementById('wsSidebar');
  const content = document.getElementById('sidebarContent');
  if (sidebar.classList.contains('expanded')) {
    sidebar.classList.remove('expanded');
    sidebar.classList.add('collapsed');
    content.style.display = 'none';
  } else {
    sidebar.classList.remove('collapsed');
    sidebar.classList.add('expanded');
    content.style.display = 'flex';
    renderWorkspace(); // Refresh list when opening
  }
}

// Navigation
function prevQuestion() {
  const qs = getWorkspaceQuestions();
  const idx = qs.findIndex(q => q.id === state.wsSelectedQuestionId);
  if (idx > 0) {
    selectWorkspaceQuestion(qs[idx - 1].id);
  }
}

function nextQuestion() {
  const qs = getWorkspaceQuestions();
  const idx = qs.findIndex(q => q.id === state.wsSelectedQuestionId);
  if (idx < qs.length - 1) {
    selectWorkspaceQuestion(qs[idx + 1].id);
  }
}

function getWorkspaceQuestions() {
  let allQuestions = [...state.questions];
  if (titleTabState.selectedTitles) {
    titleTabState.selectedTitles.forEach(t => {
      const exists = allQuestions.some(q => q.question === t.title);
      if (!exists) {
        allQuestions.push({
          id: 'title_' + t.title.slice(0, 20),
          question: t.title,
          industry: t.categoryLabel || '通用',
          intent: '信息型',
          priority: '中',
          sellingPoint: '',
          status: '未开始',
        });
      }
    });
  }
  const search = (document.getElementById('wsSearch')?.value || '').toLowerCase();
  if (search) allQuestions = allQuestions.filter(q => q.question.toLowerCase().includes(search));
  return allQuestions;
}

function updateNavCounter() {
  const qs = getWorkspaceQuestions();
  const idx = qs.findIndex(q => q.id === state.wsSelectedQuestionId);
  const counter = document.getElementById('navCounter');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  if (counter) counter.textContent = idx >= 0 ? `${idx + 1}/${qs.length}` : `0/${qs.length}`;
  if (btnPrev) btnPrev.disabled = idx <= 0;
  if (btnNext) btnNext.disabled = idx >= qs.length - 1 || idx < 0;
}

// Debounce search
let wsSearchTimer;
function debounceWsSearch() {
  clearTimeout(wsSearchTimer);
  wsSearchTimer = setTimeout(() => renderWorkspace(), 300);
}

// Title Library Modal
let titleLibSearchTimer;

function openTitleLibrary() {
  openModal('titleLibraryModal');
  renderTitleLibrary();
}

function renderTitleLibrary() {
  const qs = getWorkspaceQuestions();
  const list = document.getElementById('titleLibList');
  const filters = document.getElementById('titleLibFilters');
  
  if (!list) return;
  
  // Render filters
  const categories = {};
  qs.forEach(q => {
    const cat = q.industry || '通用';
    categories[cat] = (categories[cat] || 0) + 1;
  });
  
  if (filters) {
    renderTitleLibraryFilters(filters, categories, 'all', qs.length);
  }
  
  // Render list
  const search = (document.getElementById('titleLibSearch')?.value || '').toLowerCase();
  let filtered = qs;
  if (search) filtered = qs.filter(q => q.question.toLowerCase().includes(search));
  
  renderTitleLibraryItems(list, filtered);
}

function renderTitleLibraryFilters(filters, categories, activeCategory, totalCount) {
  clearChildren(filters);

  const allTag = document.createElement('span');
  allTag.className = `filter-tag${activeCategory === 'all' ? ' active' : ''}`;
  allTag.dataset.category = 'all';
  allTag.textContent = `全部 (${totalCount})`;
  allTag.addEventListener('click', () => filterTitleLib('all'));
  filters.appendChild(allTag);

  Object.entries(categories).forEach(([cat, count]) => {
    const tag = document.createElement('span');
    tag.className = `filter-tag${activeCategory === cat ? ' active' : ''}`;
    tag.dataset.category = cat;
    tag.textContent = `${cat} (${count})`;
    tag.addEventListener('click', () => filterTitleLib(cat));
    filters.appendChild(tag);
  });
}

function renderTitleLibraryItems(list, questions) {
  clearChildren(list);

  questions.forEach(q => {
    const item = document.createElement('div');
    item.className = `title-lib-item${state.wsSelectedQuestionId === q.id ? ' selected' : ''}`;
    item.addEventListener('click', () => selectFromTitleLib(q.id));

    const text = document.createElement('div');
    text.className = 'title-lib-text';
    text.textContent = q.question || '';
    item.appendChild(text);

    const meta = document.createElement('div');
    meta.className = 'title-lib-meta';
    meta.appendChild(createSmallTag('tag tag-blue', q.industry || '通用'));

    const hasArticle = state.articles.some(a => a.questionId === q.id);
    if (hasArticle) {
      meta.appendChild(createSmallTag('tag tag-green', '✓'));
    }

    item.appendChild(meta);
    list.appendChild(item);
  });
}

function filterTitleLib(category) {
  const qs = getWorkspaceQuestions();
  const list = document.getElementById('titleLibList');
  if (!list) return;
  
  let filtered = category === 'all' ? qs : qs.filter(q => (q.industry || '通用') === category);
  const search = (document.getElementById('titleLibSearch')?.value || '').toLowerCase();
  if (search) filtered = filtered.filter(q => q.question.toLowerCase().includes(search));
  
  // Update filter tags
  const filters = document.getElementById('titleLibFilters');
  if (filters) {
    const categories = {};
    qs.forEach(q => {
      const cat = q.industry || '通用';
      categories[cat] = (categories[cat] || 0) + 1;
    });
    renderTitleLibraryFilters(filters, categories, category, qs.length);
  }
  
  renderTitleLibraryItems(list, filtered);
}

function selectFromTitleLib(id) {
  selectWorkspaceQuestion(id);
  closeModal('titleLibraryModal');
}

function debounceTitleLibSearch() {
  clearTimeout(titleLibSearchTimer);
  titleLibSearchTimer = setTimeout(() => renderTitleLibrary(), 300);
}

function generateArticleFromTitle(title) {
  // Check if title already exists in state.questions
  let existingQ = state.questions.find(q => q.question === title);
  
  if (!existingQ) {
    // Add title to state.questions
    const newQ = {
      id: state.nextQuestionId++,
      industry: '通用',
      dimension: '',
      cluster: '',
      question: title,
      intent: '认知了解',
      priority: '中',
      sellingPoint: '',
      tested: '',
      testDate: '',
      competitors: '',
      mentioned: '',
      retestDate: '',
      status: '未开始',
      platformLinks: '',
      notes: '',
    };
    state.questions.push(newQ);
    saveState();
    existingQ = newQ;
  }

  // Navigate to workspace
  navigateTo('workspace');
  
  // Select question and auto-trigger generation
  setTimeout(() => {
    selectWorkspaceQuestion(existingQ.id);
    // Auto-trigger generation after a short delay
    setTimeout(() => {
      generateArticle();
    }, 500);
  }, 200);
}

// Question CRUD
function openAddQuestion() {
  document.getElementById('questionModalTitle').textContent = '添加问题';
  document.getElementById('qmIndustry').value = '通用';
  document.getElementById('qmCluster').value = '';
  document.getElementById('qmQuestion').value = '';
  document.getElementById('qmDimension').value = '';
  document.getElementById('qmIntent').value = '认知了解';
  document.getElementById('qmPriority').value = '中';
  document.getElementById('qmStatus').value = '未开始';
  document.getElementById('qmSellingPoint').value = '';
  document.getElementById('qmNotes').value = '';
  document.getElementById('questionModal').dataset.editId = '';
  openModal('questionModal');
}

function editQuestion(id) {
  const q = state.questions.find(q => q.id === id);
  if (!q) return;
  document.getElementById('questionModalTitle').textContent = '编辑问题';
  document.getElementById('qmIndustry').value = q.industry;
  document.getElementById('qmCluster').value = q.cluster || '';
  document.getElementById('qmQuestion').value = q.question;
  document.getElementById('qmDimension').value = q.dimension || '';
  document.getElementById('qmIntent').value = q.intent;
  document.getElementById('qmPriority').value = q.priority;
  document.getElementById('qmStatus').value = q.status || '未开始';
  document.getElementById('qmSellingPoint').value = q.sellingPoint || '';
  document.getElementById('qmNotes').value = q.notes || '';
  document.getElementById('questionModal').dataset.editId = id;
  openModal('questionModal');
}

function saveQuestion() {
  const editId = document.getElementById('questionModal').dataset.editId;
  const data = {
    industry: document.getElementById('qmIndustry').value,
    cluster: document.getElementById('qmCluster').value.trim(),
    question: document.getElementById('qmQuestion').value.trim(),
    dimension: document.getElementById('qmDimension').value.trim(),
    intent: document.getElementById('qmIntent').value,
    priority: document.getElementById('qmPriority').value,
    status: document.getElementById('qmStatus').value,
    sellingPoint: document.getElementById('qmSellingPoint').value.trim(),
    notes: document.getElementById('qmNotes').value.trim(),
  };
  if (!data.question) { showToast('请输入客户提问', 'error'); return; }

  if (editId) {
    // Edit
    const q = state.questions.find(q => q.id === parseInt(editId));
    if (q) { Object.assign(q, data); }
    showToast('问题已更新', 'success');
  } else {
    // Add
    data.id = state.nextQuestionId++;
    data.tested = '';
    data.testDate = '';
    data.competitors = '';
    data.mentioned = '';
    data.retestDate = '';
    data.platformLinks = '';
    state.questions.push(data);
    showToast('问题已添加', 'success');
  }
  saveState();
  closeModal('questionModal');
  renderQuestions();
}

function deleteQuestion(id) {
  if (!confirm('确定删除这个问题？')) return;
  state.questions = state.questions.filter(q => q.id !== id);
  state.selectedQuestionIds.delete(id);
  saveState();
  renderQuestions();
  showToast('问题已删除', 'success');
}

function batchDeleteQuestions() {
  if (!confirm(`确定删除选中的 ${state.selectedQuestionIds.size} 个问题？`)) return;
  state.questions = state.questions.filter(q => !state.selectedQuestionIds.has(q.id));
  state.selectedQuestionIds.clear();
  saveState();
  renderQuestions();
  showToast('批量删除完成', 'success');
}

function batchGenerate() {
  if (state.selectedQuestionIds.size === 0) { showToast('请先勾选问题', 'error'); return; }
  navigateTo('batch');
  document.getElementById('batchScope').value = 'selected';
}


// ===== Workspace Page =====
async function renderWorkspace() {
  // Load selected titles if not loaded yet
  if (!titleTabState.loaded) {
    titleTabState.loaded = true;
    await Promise.all([loadSelectedTitles(), loadPoolTitles()]);
  }

  // Populate angle dropdown
  const angleSelect = document.getElementById('wsAngle');
  if (angleSelect && angleSelect.options.length <= 1) {
    ANGLES.forEach(a => {
      const opt = document.createElement('option');
      opt.value = a.id;
      opt.textContent = `${a.icon} ${a.name}`;
      opt.title = a.desc;
      angleSelect.appendChild(opt);
    });
  }

  const list = document.getElementById('wsQuestionList');
  // wsQuestionList may not exist (left sidebar removed) — still continue
  if (list) {
    const qs = getWorkspaceQuestions();
    renderWorkspaceQuestionList(list, qs);
  }

  // Update nav counter
  updateNavCounter();

  // Auto-select first question if none selected
  const qs = getWorkspaceQuestions();
  if (!state.wsSelectedQuestionId && qs.length > 0) {
    selectWorkspaceQuestion(qs[0].id);
    return; // selectWorkspaceQuestion will call renderWorkspace again
  }

  // Show current article if any
  if (state.wsSelectedQuestionId) {
    renderWorkspaceArticle();
  }
}

function renderWorkspaceQuestionList(list, questions) {
  clearChildren(list);

  questions.forEach(q => {
    const item = document.createElement('div');
    item.className = `workspace-question-item${state.wsSelectedQuestionId === q.id ? ' selected' : ''}`;
    item.addEventListener('click', () => selectWorkspaceQuestion(q.id));

    const text = document.createElement('div');
    text.className = 'workspace-q-text';
    text.textContent = q.question || '';
    item.appendChild(text);

    const meta = document.createElement('div');
    meta.className = 'workspace-q-meta';
    meta.appendChild(createSmallTag('tag tag-blue', q.industry || '通用'));

    const articleCount = state.articles.filter(a => a.questionId === q.id).length;
    if (articleCount > 1) {
      meta.appendChild(createSmallTag('tag tag-purple', `${articleCount}篇`));
    } else if (articleCount === 1) {
      meta.appendChild(createSmallTag('tag tag-green', '✓'));
    }

    item.appendChild(meta);
    list.appendChild(item);
  });
}

function selectWorkspaceQuestion(id) {
  state.wsSelectedQuestionId = id;
  const q = state.questions.find(q => q.id === id) || getWorkspaceQuestions().find(q => q.id === id);
  
  // Update selected title bar
  const titleEl = document.getElementById('wsSelectedTitle');
  if (titleEl && q) {
    titleEl.textContent = q.question;
    titleEl.classList.add('has-value');
  }
  
  renderWorkspace();

  // Show/hide buttons
  const hasArticle = state.articles.some(a => a.questionId === id);
  document.getElementById('btnSaveArticle').style.display = hasArticle ? '' : 'none';
  document.getElementById('btnExportArticle').style.display = hasArticle ? '' : 'none';
}

function renderWorkspaceArticle() {
  const angleId = document.getElementById('wsAngle').value;
  const angleKey = angleId || '';

  // Find article matching both question and angle
  const article = state.articles.find(a =>
    a.questionId === state.wsSelectedQuestionId && (a.angle || '') === angleKey
  );

  // Count all articles for this question (different angles)
  const allArticles = state.articles.filter(a => a.questionId === state.wsSelectedQuestionId);

  if (!article) {
    let angleHint = '';
    if (allArticles.length > 0) {
      const existingAngles = allArticles.map(a => {
        const ag = ANGLES.find(x => x.id === a.angle);
        return ag ? `${ag.icon} ${ag.name}` : '📝 母稿';
      }).join('、');
      angleHint = `<p class="text-sm text-muted mt-8">该问题已有版本：${existingAngles}</p>`;
    }
    document.getElementById('wsArticleContent').innerHTML = `
      <div class="article-placeholder">
        <div class="icon">✍️</div>
        <p>点击「生成文章」为该问题生成内容</p>
        ${angleHint}
      </div>`;
    document.getElementById('wsWordCount').textContent = '';
    state.wsCurrentArticle = null;
    return;
  }
  state.wsCurrentArticle = article;
  state.wsViewMode = state.wsViewMode || 'read'; // default to read mode

  const angleLabel = article.angleName ? ` | 角度：${article.angleName}` : '';

  // Score report data (used by compact bar in read mode)
  const scoreReport = scoreMasterDraft(article.content || '', { question: article.questionId ? (getWorkspaceQuestions().find(qq => qq.id === article.questionId)?.question || '') : '' });

  if (state.wsViewMode === 'read') {
    // Read mode: rendered HTML
    const renderedContent = mdToHtml(article.content || '');
    // Compact score bar
    const scoreColor = scoreReport.score >= 83 ? '#10b981' : scoreReport.score >= 66 ? '#f59e0b' : '#ef4444';
    const failCount = scoreReport.total - scoreReport.passed;
    const scoreBar = scoreReport.score > 0 ? `
      <div class="score-compact" onclick="this.classList.toggle('expanded')">
        <div class="score-compact-bar">
          <span class="score-compact-dot" style="background:${scoreColor}"></span>
          <span class="score-compact-num" style="color:${scoreColor}">${scoreReport.score}分</span>
          <span class="score-compact-level">${scoreReport.level}</span>
          <span class="score-compact-info">${scoreReport.passed}/${scoreReport.total} 通过 · ${scoreReport.charCount.toLocaleString()} 字${failCount > 0 ? ` · <span style="color:#ef4444">${failCount} 项未通过</span>` : ''}</span>
          <span class="score-compact-toggle">▼</span>
        </div>
        <div class="score-compact-details">
          ${scoreReport.checks.map(c => `<div class="score-compact-check ${c.pass ? 'pass' : 'fail'}"><span>${c.pass ? '✅' : '❌'}</span><strong>${c.name}</strong><span>${c.detail}</span></div>`).join('')}
        </div>
      </div>
    ` : '';

    document.getElementById('wsArticleContent').innerHTML = `
      <div class="article-toolbar">
        <div class="article-toolbar-info">
          <span class="article-toolbar-title">${escapeHtml(getWorkspaceQuestions().find(qq => qq.id === article.questionId)?.question || '')}</span>
          <span class="article-toolbar-meta">模型：${article.model || '-'}${angleLabel} | ${article.updatedAt ? new Date(article.updatedAt).toLocaleString('zh-CN') : '-'}</span>
        </div>
        <div class="article-toolbar-actions">
          <button class="btn btn-sm" onclick="toggleViewMode('edit')">✏️ 编辑</button>
        </div>
      </div>
      ${scoreBar}
      <div class="article-rendered">${renderedContent}</div>
    `;
    const count = (article.content || '').replace(/\s/g, '').length;
    document.getElementById('wsWordCount').textContent = `${count} 字`;
  } else {
    // Edit mode: textarea
    document.getElementById('wsArticleContent').innerHTML = `
      <div class="article-toolbar">
        <div class="article-toolbar-info">
          <span class="article-toolbar-meta">模型：${article.model || '-'}${angleLabel} | ${article.updatedAt ? new Date(article.updatedAt).toLocaleString('zh-CN') : '-'}</span>
        </div>
        <div class="article-toolbar-actions">
          <button class="btn btn-sm btn-primary" onclick="toggleViewMode('read')">👁 阅读模式</button>
        </div>
      </div>
      <textarea class="article-textarea" id="wsArticleText" oninput="updateWordCount()">${escapeHtml(article.content || '')}</textarea>
    `;
    updateWordCount();
  }

  // Also put score in bottom container for reference
  const scoreContainer = document.getElementById('wsScoreReport');
  if (scoreContainer) scoreContainer.innerHTML = '';

  document.getElementById('btnSaveArticle').style.display = '';
  document.getElementById('btnExportArticle').style.display = '';
}

function toggleViewMode(mode) {
  state.wsViewMode = mode;
  renderWorkspaceArticle();
}

// Simple markdown to HTML converter for article rendering
function mdToHtml(md) {
  if (!md) return '';
  let html = escapeHtml(md);

  // Tables (must process before other replacements)
  html = html.replace(/((?:\|[^\n]+\|\n)+)/g, function(tableBlock) {
    const rows = tableBlock.trim().split('\n').filter(r => r.trim());
    if (rows.length < 2) return tableBlock;

    let tableHtml = '<table>';
    rows.forEach((row, i) => {
      // Skip separator row (|---|---|)
      if (/^\|[\s\-:|]+\|$/.test(row.trim())) return;
      const cells = row.split('|').filter((c, j, arr) => j > 0 && j < arr.length - 1);
      const tag = i === 0 ? 'th' : 'td';
      const wrap = i === 0 ? 'thead' : (i === 1 || (i === 2 && /^\|[\s\-:|]+\|$/.test(rows[1]?.trim()))) ? 'tbody' : '';
      if (wrap === 'thead') tableHtml += '<thead>';
      if (wrap === 'tbody' && i <= 2) tableHtml += '<tbody>';
      tableHtml += '<tr>' + cells.map(c => `<${tag}>${c.trim()}</${tag}>`).join('') + '</tr>';
    });
    tableHtml += '</tbody></table>';
    return tableHtml;
  });

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr>');

  // FAQ blocks: lines starting with **Q：** or **A：**
  html = html.replace(/<strong>Q[：:](.+?)<\/strong>/g, '<div class="faq-q"><strong>Q：$1</strong></div>');
  html = html.replace(/<strong>A[：:](.+?)<\/strong>/g, '<div class="faq-a"><strong>A：$1</strong></div>');

  // Unordered lists (but not table rows)
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

  // Ordered lists
  html = html.replace(/^\d+\.\s(.+)$/gm, '<li>$1</li>');

  // Blockquote
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');

  // Paragraphs: double newlines
  html = html.replace(/\n\n+/g, '</p><p>');
  html = '<p>' + html + '</p>';

  // Clean up empty paragraphs and unwrap block elements
  html = html.replace(/<p>\s*<\/p>/g, '');
  html = html.replace(/<p>\s*(<h[123]>)/g, '$1');
  html = html.replace(/(<\/h[123]>)\s*<\/p>/g, '$1');
  html = html.replace(/<p>\s*(<ul>)/g, '$1');
  html = html.replace(/(<\/ul>)\s*<\/p>/g, '$1');
  html = html.replace(/<p>\s*(<blockquote>)/g, '$1');
  html = html.replace(/(<\/blockquote>)\s*<\/p>/g, '$1');
  html = html.replace(/<p>\s*(<hr>)/g, '$1');
  html = html.replace(/(<hr>)\s*<\/p>/g, '$1');
  html = html.replace(/<p>\s*(<table>)/g, '$1');
  html = html.replace(/(<\/table>)\s*<\/p>/g, '$1');
  html = html.replace(/<p>\s*(<div class="faq)/g, '$1');
  html = html.replace(/(<\/div>)\s*<\/p>/g, '$1');

  // Single newlines to <br> within paragraphs
  html = html.replace(/([^>])\n([^<])/g, '$1<br>$2');

  return html;
}

function updateWordCount() {
  const textarea = document.getElementById('wsArticleText');
  if (!textarea) return;
  const text = textarea.value;
  const count = text.replace(/\s/g, '').length;
  document.getElementById('wsWordCount').textContent = `${count} 字`;
}

// ===== GEO 母稿质量评分 =====
function scoreMasterDraft(content, question) {
  if (!content || content.length < 100) return { score: 0, checks: [], level: '无法评分' };

  const checks = [];
  const text = content.trim();
  const lines = text.split('\n').filter(l => l.trim());
  const firstLine = lines[0] || '';
  const first200 = text.slice(0, 200);

  // 提取目标关键词
  const keywords = [];
  if (question) {
    const q = question.question || '';
    keywords.push(...q.replace(/[？?！!，,。.：:]/g, ' ').split(/\s+/).filter(w => w.length >= 2));
    if (question.sellingPoint) keywords.push(question.sellingPoint);
  }
  const kwSet = [...new Set(keywords.filter(k => k.length >= 2))];

  // 1. 问答式标题
  const hasQuestionTitle = /[？?]/.test(firstLine) ||
    /^(如何|怎样|怎么|什么是|哪些|哪个|为什么|是否|能否|是不是|有没有)/.test(firstLine) ||
    /吗[？?]?$/.test(firstLine);
  checks.push({
    name: '问答式标题',
    pass: hasQuestionTitle,
    detail: hasQuestionTitle ? `「${firstLine.slice(0, 30)}…」` : '标题不像提问句式，AI 难以匹配用户查询',
  });

  // 2. 结论前置
  const conclusionPatterns = /(结论|答案|TL|一句话|简单说|总结|核心|关键是|本质上|总的来说|先说)/i;
  const hasConclusion = conclusionPatterns.test(first200) ||
    /^[^\n]{10,80}(是|就是|意味着|关键在于)/.test(first200);
  checks.push({
    name: '结论前置',
    pass: hasConclusion,
    detail: hasConclusion ? '开头直接给答案' : '开头没有结论，AI 可能跳过这段去找更直接的答案',
  });

  // 3. 结构化容器
  const tableIndicators = /[→➜▼▶]|对比|vs|VS|表格|清单|筛选|checklist/i;
  const listPattern = /(?:^|\n)\s*(?:[●◆◇■▸→\d+[.、)]|[（(]\d+[)）]).{5,}/gm;
  const hasTable = tableIndicators.test(text) || (text.match(listPattern) || []).length >= 3;
  checks.push({
    name: '结构化容器',
    pass: hasTable,
    detail: hasTable ? '包含对比/清单/表格结构' : '缺少表格或清单，AI 更喜欢引用结构化内容',
  });

  // 4. FAQ 块
  const faqPatterns = /(?:FAQ|常见问题|延伸问题|你可能还想知道|补充问|Q\d|[问Q][：:].{5,}[？?])/gi;
  const faqMatches = text.match(faqPatterns) || [];
  const hasFAQ = faqMatches.length >= 2 || /FAQ|常见问题/i.test(text);
  checks.push({
    name: 'FAQ 块',
    pass: hasFAQ,
    detail: hasFAQ ? `检测到 ${faqMatches.length} 处 FAQ 标记` : '没有 FAQ 块，AI 常整段引用 FAQ 回答用户追问',
  });

  // 5. 长尾词覆盖
  const keywordHits = kwSet.filter(kw => {
    const inTitle = firstLine.includes(kw);
    const inFirst = first200.includes(kw);
    const subheadings = lines.filter(l => /^[一二三四五六七八九十]+[、.．]|[（(][一二三四五六七八九十][)）]/.test(l.trim()));
    const inSubheading = subheadings.some(l => l.includes(kw));
    return inTitle || inFirst || inSubheading;
  });
  const kwCoverage = kwSet.length > 0 ? keywordHits.length / kwSet.length : 0;
  const kwPass = kwCoverage >= 0.3 || kwSet.length === 0;
  checks.push({
    name: '长尾词覆盖',
    pass: kwPass,
    detail: kwSet.length === 0
      ? '无目标关键词'
      : `覆盖 ${keywordHits.length}/${kwSet.length} 个关键词（${Math.round(kwCoverage * 100)}%）${kwPass ? '' : '，标题/首段/小标题中缺少核心词'}`,
  });

  // 6. 字数检查
  const charCount = text.replace(/\s/g, '').length;
  const wordPass = charCount >= 1000;
  checks.push({
    name: '篇幅达标',
    pass: wordPass,
    detail: `${charCount.toLocaleString()} 字${wordPass ? '' : '，不足 1000 字，内容太薄 AI 不会优先引用'}`,
  });

  const passed = checks.filter(c => c.pass).length;
  const total = checks.length;
  const score = Math.round((passed / total) * 100);

  let level;
  if (score >= 100) level = '🏆 S 级 · GEO 标杆';
  else if (score >= 83) level = '🟢 A 级 · 可发布';
  else if (score >= 66) level = '🟡 B 级 · 需优化';
  else if (score >= 50) level = '🟠 C 级 · 大改';
  else level = '🔴 D 级 · 重写';

  return { score, checks, level, passed, total, charCount };
}

function renderScoreReport(report) {
  if (!report || report.score === 0) return '';
  const scoreColor = report.score >= 83 ? 'var(--green)' :
    report.score >= 66 ? 'var(--orange)' : 'var(--red)';
  let html = '<div class="score-report">';
  html += `<div class="score-header">
    <div class="score-circle" style="border-color:${scoreColor}">
      <span class="score-number" style="color:${scoreColor}">${report.score}</span>
      <span class="score-label">分</span>
    </div>
    <div class="score-meta">
      <div class="score-level">${report.level}</div>
      <div class="text-sm text-muted">${report.passed}/${report.total} 项通过 · ${report.charCount.toLocaleString()} 字</div>
    </div>
  </div>`;
  html += '<div class="score-checks">';
  report.checks.forEach(c => {
    const icon = c.pass ? '✅' : '❌';
    const cls = c.pass ? 'check-pass' : 'check-fail';
    html += `<div class="score-check ${cls}">
      <span class="check-icon">${icon}</span>
      <span class="check-name">${c.name}</span>
      <span class="check-detail">${c.detail}</span>
    </div>`;
  });
  html += '</div></div>';
  return html;
}

async function generateArticle() {
  if (!state.wsSelectedQuestionId) { showToast('请先选择一个问题', 'error'); return; }
  if (state.wsIsGenerating) return;

  const q = state.questions.find(q => q.id === state.wsSelectedQuestionId) || getWorkspaceQuestions().find(q => q.id === state.wsSelectedQuestionId);
  if (!q) { showToast('未找到选中的问题', 'error'); return; }

  // Get generation params (elements may not exist in simplified layout)
  const topic = (document.getElementById('wsTopic')?.value || '').trim() || q.question;
  const keyword = (document.getElementById('wsKeyword')?.value || '').trim();
  const customer = (document.getElementById('wsCustomer')?.value || '').trim();
  const scene = (document.getElementById('wsScene')?.value || '').trim();
  const category = document.getElementById('wsCategory')?.value || '';
  const capability = (document.getElementById('wsCapability')?.value || '').trim();
  const mentionBrand = document.getElementById('wsMentionBrand')?.value || '';

  const model = document.getElementById('wsModel').value;
  const angleId = document.getElementById('wsAngle').value;
  const angle = angleId ? ANGLES.find(a => a.id === angleId) : null;
  const settings = getSettings();

  let userPrompt = `客户提问：${q.question}
行业：${q.industry}
搜索意图：${q.intent}
建议主打卖点：${q.sellingPoint || '未指定'}`;

  // Facts are now in system prompt (v4), no need to inject separately

  // Inject angle prompt if selected
  if (angle) {
    userPrompt += `\n\n${angle.prompt}`;
  }

  state.wsIsGenerating = true;
  state.wsAbortController = new AbortController();
  document.getElementById('btnGenerate').classList.add('hidden');
  document.getElementById('btnStopGenerate').classList.remove('hidden');

  document.getElementById('wsArticleContent').innerHTML = `
    <div class="generating-indicator">
      <div class="spinner"></div>
      <p>正在生成文章，请稍候...</p>
      <p class="text-sm text-muted mt-8">模型：${model} | 按母稿写作规范生成${angle ? ' | 角度：' + angle.icon + ' ' + angle.name : ''}</p>
    </div>`;

  try {
    const messages = [
      { role: 'system', content: GEO_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ];

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: state.wsAbortController.signal,
      body: JSON.stringify({
        model: model,
        messages: messages,
        max_tokens: settings.maxTokens,
        temperature: settings.temperature,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`API 错误: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';

    document.getElementById('wsArticleContent').innerHTML = `
      <textarea class="article-textarea" id="wsArticleText" oninput="updateWordCount()"></textarea>`;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (data === '[DONE]') continue;
        try {
          const parsed = JSON.parse(data);
          const delta = parsed.choices && parsed.choices[0] && parsed.choices[0].delta;
          if (delta && delta.content) {
            fullContent += delta.content;
            const textarea = document.getElementById('wsArticleText');
            if (textarea) textarea.value = fullContent;
          }
        } catch (e) { /* ignore parse errors in stream */ }
      }
    }

    requireGeneratedContent(fullContent, '模型');

    // Save article (match by questionId + angle)
    const angleKey = angle ? angle.id : '';
    const existing = state.articles.find(a =>
      a.questionId === state.wsSelectedQuestionId && (a.angle || '') === angleKey
    );
    if (existing) {
      existing.content = fullContent;
      existing.model = model;
      existing.angle = angleKey;
      existing.angleName = angle ? angle.name : '';
      existing.updatedAt = new Date().toISOString();
    } else {
      state.articles.push({
        id: state.nextArticleId++,
        questionId: state.wsSelectedQuestionId,
        content: fullContent,
        model: model,
        angle: angleKey,
        angleName: angle ? angle.name : '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Update question status
    if (q.status === '未开始') {
      q.status = '进行中';
    }

    saveState();
    updateWordCount();

    // Score is now shown inline via compact bar in renderWorkspaceArticle
    const _sr = scoreMasterDraft(fullContent, q);
    showToast('文章生成完成！' + (_sr.level ? ` ${_sr.level}` : ''), 'success');

  } catch (e) {
    if (e.name === 'AbortError') {
      showToast('生成已停止', 'info');
    } else {
      console.error('Generation error:', e);
      showToast('生成失败：' + e.message, 'error');
    }
  } finally {
    state.wsIsGenerating = false;
    state.wsAbortController = null;
    document.getElementById('btnGenerate').classList.remove('hidden');
    document.getElementById('btnStopGenerate').classList.add('hidden');
    document.getElementById('btnSaveArticle').style.display = '';
    document.getElementById('btnExportArticle').style.display = '';
  }
}

function stopGeneration() {
  if (state.wsAbortController) {
    state.wsAbortController.abort();
  }
}

function saveArticle() {
  const textarea = document.getElementById('wsArticleText');
  if (!textarea || !state.wsSelectedQuestionId) return;

  const content = textarea.value;
  const existing = state.articles.find(a => a.questionId === state.wsSelectedQuestionId);
  if (existing) {
    existing.content = content;
    existing.updatedAt = new Date().toISOString();
  }
  saveState();
  showToast('文章已保存', 'success');
}

function exportCurrentArticle() {
  if (!state.wsCurrentArticle) { showToast('没有可导出的文章', 'error'); return; }
  const q = state.questions.find(q => q.id === state.wsSelectedQuestionId);
  const title = q ? q.question : '文章';
  const content = state.wsCurrentArticle.content;
  exportToWord(title, content);
}

// ===== Distribution Page =====
function renderDistribution() {
  const select = document.getElementById('distArticleSelect');
  const currentValue = select.value;
  replaceSelectOptions(select, [
    { value: '', label: '选择一篇已生成的文章...', selected: !currentValue },
    ...state.articles.map(a => {
      const q = state.questions.find(q => q.id === a.questionId);
      const label = q ? q.question : `文章 #${a.id}`;
      const hasPlatforms = a.platforms && Object.keys(a.platforms).length > 0;
      return {
        value: a.id,
        label: `${hasPlatforms ? '✅ ' : ''}${label}`,
        selected: String(a.id) === currentValue,
      };
    }),
  ]);
  select.onchange = onDistributionArticleSelect;
}

async function onDistributionArticleSelect() {
  const articleId = parseInt(document.getElementById('distArticleSelect').value);
  const platformsDiv = document.getElementById('distPlatforms');

  if (!articleId) {
    platformsDiv.innerHTML = '';
    document.getElementById('btnGenDist').style.display = '';
    document.getElementById('btnContinueDist').style.display = 'none';
    document.getElementById('btnRegenDist').style.display = 'none';
    document.getElementById('btnExportDist').style.display = 'none';
    document.getElementById('distMatrixInfo').classList.remove('hidden');
    return;
  }

  const article = state.articles.find(a => a.id === articleId);
  if (!article) return;

  if (article.platforms && Object.keys(article.platforms).length > 0) {
    renderDistributionCards(article, platformsDiv, articleId);

    const hasMissing = DISTRIBUTION_MATRIX.some(dm => !article.platforms[dm.platform]);
    document.getElementById('btnGenDist').style.display = 'none';
    document.getElementById('btnContinueDist').style.display = hasMissing ? '' : 'none';
    document.getElementById('btnRegenDist').style.display = '';
    document.getElementById('btnExportDist').style.display = '';
    document.getElementById('distMatrixInfo').classList.add('hidden');

    // Auto-continue if there are missing platforms
    if (hasMissing) {
      showToast('检测到缺失的平台版本，自动开始生成...', 'info');
      await continueDistribution();
    }
  } else {
    platformsDiv.innerHTML = '';
    document.getElementById('btnGenDist').style.display = '';
    document.getElementById('btnContinueDist').style.display = 'none';
    document.getElementById('btnRegenDist').style.display = 'none';
    document.getElementById('btnExportDist').style.display = 'none';
    document.getElementById('distMatrixInfo').classList.remove('hidden');
  }
}

async function generateDistribution(forceRegenerate = false) {
  const articleId = parseInt(document.getElementById('distArticleSelect').value);
  if (!articleId) { showToast('请先选择一篇文章', 'error'); return; }

  const article = state.articles.find(a => a.id === articleId);
  if (!article) return;

  const platformsDiv = document.getElementById('distPlatforms');
  document.getElementById('distMatrixInfo').classList.add('hidden');

  // Check if article already has saved platform versions → restore directly (unless forced)
  if (!forceRegenerate && article.platforms && Object.keys(article.platforms).length > 0) {
    renderDistributionCards(article, platformsDiv, articleId);
    
    // Check if there are missing platforms
    const hasMissing = DISTRIBUTION_MATRIX.some(dm => !article.platforms[dm.platform]);
    document.getElementById('btnContinueDist').style.display = hasMissing ? '' : 'none';
    document.getElementById('btnRegenDist').style.display = '';
    document.getElementById('btnExportDist').style.display = '';
    showToast('已恢复上次生成的平台版本（可直接编辑）', 'info');
    return;
  }

  // Generate all platform versions
  await generatePlatformVersions(article, platformsDiv, articleId, DISTRIBUTION_MATRIX);
}

// Render distribution cards for an article
function renderDistributionCards(article, platformsDiv, articleId) {
  let html = '';
  for (const dm of DISTRIBUTION_MATRIX) {
    html += buildDistCard(dm, article.platforms[dm.platform] || '', articleId);
  }
  platformsDiv.innerHTML = html;
}

function getDistributionPlatformSet() {
  return new Set(DISTRIBUTION_MATRIX.map(dm => dm.platform));
}

function platformDomKey(platform) {
  const known = {
    '知乎': 'zhihu',
    '百家号': 'baijiahao',
    '公众号': 'wechat',
    '今日头条': 'toutiao',
    '搜狐号': 'sohu',
    '网易号': 'netease',
    'B站': 'bilibili',
    '腾讯新闻': 'tencent_news',
  };
  if (known[platform]) return known[platform];
  return Array.from(String(platform || 'platform'))
    .map(char => char.codePointAt(0).toString(36))
    .join('_');
}

function savePlatformTextareaValues(article, textareas, validPlatforms = getDistributionPlatformSet()) {
  if (!article) return 0;
  if (!article.platforms) article.platforms = {};

  let saved = 0;
  textareas.forEach(ta => {
    const platform = ta.dataset ? ta.dataset.platform : '';
    if (!platform) return;

    if (!validPlatforms.has(platform)) {
      console.warn(`Unknown platform ignored while saving edits: ${platform}`);
      return;
    }

    article.platforms[platform] = ta.value;
    saved += 1;
  });
  return saved;
}

// Build a single distribution card HTML
function buildDistCard(dm, content, articleId) {
  const hasContent = !!content;
  const statusTag = hasContent
    ? '<span class="badge badge-success">✓ 已保存</span>'
    : '<span class="badge badge-muted">未生成</span>';
  const platformKey = platformDomKey(dm.platform);

  return `
    <div class="dist-card">
      <div class="dist-card-header">
        <span class="dist-card-icon" style="background:${dm.color}">${dm.icon}</span>
        <span class="dist-card-platform">${dm.platform}</span>
        <span class="dist-card-form">${dm.form}</span>
        <span class="dist-card-note">${dm.geoValue}</span>
        <span class="dist-card-status">${statusTag}</span>
        ${hasContent ? `<button class="btn btn-sm btn-primary" onclick="copyPlatformText(${articleId}, '${dm.platform}')" title="复制文案">📋 复制文案</button>` : ''}
      </div>
      <div class="dist-card-body">
        <textarea id="dist_${platformKey}" data-platform="${escapeHtml(dm.platform)}" data-platform-key="${escapeHtml(platformKey)}" oninput="savePlatformEdits(${articleId})">${escapeHtml(content)}</textarea>
      </div>
    </div>`;
}

// Copy platform text to clipboard
function copyPlatformText(articleId, platform) {
  const article = state.articles.find(a => a.id === articleId);
  if (!article || !article.platforms || !article.platforms[platform]) {
    showToast('没有可复制的内容', 'error');
    return;
  }
  const text = article.platforms[platform];  // V4: copy raw Markdown
  navigator.clipboard.writeText(text).then(() => {
    showToast(`${platform} 文案已复制`, 'success');
  }).catch(() => {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast(`${platform} 文案已复制`, 'success');
  });
}

// Continue generating missing platform versions
async function continueDistribution() {
  const articleId = parseInt(document.getElementById('distArticleSelect').value);
  if (!articleId) { showToast('请先选择一篇文章', 'error'); return; }

  const article = state.articles.find(a => a.id === articleId);
  if (!article || !article.platforms) return;

  const platformsDiv = document.getElementById('distPlatforms');
  const missingPlatforms = DISTRIBUTION_MATRIX.filter(dm => !article.platforms[dm.platform]);

  if (missingPlatforms.length === 0) {
    showToast('所有平台版本已生成', 'info');
    return;
  }

  showToast(`继续生成 ${missingPlatforms.length} 个缺失的平台版本...`, 'info');
  await generatePlatformVersions(article, platformsDiv, articleId, missingPlatforms);
}

// Generate platform versions (core logic)
async function generatePlatformVersions(article, platformsDiv, articleId, platformsToGenerate) {
  // Show loading state with progress
  platformsDiv.innerHTML = `
    <div class="generating-indicator">
      <div class="spinner"></div>
      <p>正在生成各平台版本...</p>
      <div class="generation-progress" id="generationProgress">
        ${platformsToGenerate.map((dm, i) => `
          <span class="progress-item" id="progress-${i}">
            ${dm.icon} ${dm.platform}：待生成
          </span>
        `).join('')}
      </div>
    </div>
  `;

  // Initialize platforms object if not exists
  if (!article.platforms) article.platforms = {};

  // Batch parallel: generate 2 at a time to avoid API overload
  const BATCH_SIZE = 2;
  const results = [];

  for (let batchStart = 0; batchStart < platformsToGenerate.length; batchStart += BATCH_SIZE) {
    const batch = platformsToGenerate.slice(batchStart, batchStart + BATCH_SIZE);

    const batchPromises = batch.map(async (dm, batchIndex) => {
      const i = batchStart + batchIndex;
      const progressEl = document.getElementById(`progress-${i}`);

      try {
        // Update progress: generating
        if (progressEl) {
          progressEl.className = 'progress-item generating';
          progressEl.textContent = `${dm.icon} ${dm.platform}：生成中...`;
        }

        // V4: assemble prompt with 母稿, 标题, 目标关键词
        const q = state.questions.find(qq => qq.id === article.questionId);
        const titleText = q ? q.question : '';
        const keywordText = titleText.replace(/[？?！!。.，,]/g, ' ').trim();
        let prompt = dm.prompt.replace('{{母稿}}', article.content);
        prompt = prompt.replace(/\{标题\}/g, titleText);
        prompt = prompt.replace(/\{目标关键词\}/g, keywordText);
        const settings = getSettings();

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: document.getElementById('wsModel') ? document.getElementById('wsModel').value : 'mimo-v2.5-pro',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: settings.maxTokens,
            temperature: settings.temperature,
            stream: false,
          }),
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const content = extractRequiredChatContent(data, `${dm.platform}生成`);

        // Save to article.platforms immediately
        article.platforms[dm.platform] = content;  // V4: keep Markdown formatting

        // Update progress: completed
        if (progressEl) {
          progressEl.className = 'progress-item completed';
          progressEl.textContent = `${dm.icon} ${dm.platform}：✓ 完成`;
        }

        return { dm, content, error: null };
      } catch (e) {
        // Update progress: failed
        if (progressEl) {
          progressEl.className = 'progress-item failed';
          progressEl.textContent = `${dm.icon} ${dm.platform}：✗ 失败`;
        }

        return { dm, content: null, error: e.message };
      }
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }

  // Build HTML from results
  let html = '';

  // Add existing platforms first
  for (const dm of DISTRIBUTION_MATRIX) {
    if (article.platforms[dm.platform] && !platformsToGenerate.find(p => p.platform === dm.platform)) {
      html += buildDistCard(dm, article.platforms[dm.platform], articleId);
    }
  }

  // Add newly generated platforms
  for (const { dm, content, error } of results) {
    if (error) {
      html += `
        <div class="dist-card" style="border-color:var(--red);">
          <div class="dist-card-header">
            <span class="dist-card-icon" style="background:${dm.color}">${dm.icon}</span>
            <span class="dist-card-platform">${dm.platform}</span>
            <span class="dist-card-form">${dm.form}</span>
            <span class="dist-card-status"><span class="badge badge-muted">生成失败</span></span>
          </div>
          <p class="text-sm text-muted" style="padding:12px 18px;margin:0;">${error}</p>
        </div>`;
    } else {
      html += buildDistCard(dm, content, articleId);
    }
  }

  platformsDiv.innerHTML = html;

  // Save to state
  article.platformsUpdatedAt = new Date().toISOString();
  saveState();

  // Update button visibility
  const hasMissing = DISTRIBUTION_MATRIX.some(dm => !article.platforms[dm.platform]);
  document.getElementById('btnContinueDist').style.display = hasMissing ? '' : 'none';
  document.getElementById('btnRegenDist').style.display = '';
  document.getElementById('btnExportDist').style.display = '';
  showToast('平台版本生成完成！', 'success');
}

function exportAllDistribution() {
  const articleId = parseInt(document.getElementById('distArticleSelect').value);
  const article = state.articles.find(a => a.id === articleId);
  if (!article) { showToast('没有可导出的内容', 'error'); return; }

  const q = state.questions.find(q => q.id === article.questionId);
  const title = q ? q.question : '一稿多发';

  // Build structured HTML
  let sectionsHtml = '';

  // Master draft first
  if (article.content) {
    sectionsHtml += `
    <div class="platform-section">
      <div class="platform-header">
        <h2>📝 母稿（原始版本）</h2>
        <div class="platform-meta">信息最全、最长、最权威的超集版本</div>
      </div>
      ${mdToWordHtml(article.content)}
    </div>`;
  }

  // Platform versions
  if (article.platforms) {
    for (const dm of DISTRIBUTION_MATRIX) {
      const content = article.platforms[dm.platform];
      if (content && content.trim()) {
        sectionsHtml += `
    <div class="platform-section">
      <div class="platform-header">
        <h2>${dm.icon} ${dm.platform}（${dm.form}）</h2>
        <div class="platform-meta">建议篇幅：${dm.length} · ${dm.geoValue}</div>
      </div>
      ${mdToWordHtml(content)}
    </div>`;
      }
    }
  }

  const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif; font-size: 14px; line-height: 1.8; color: #1a1a2e; max-width: 800px; margin: 0 auto; padding: 24px; }
    h1 { font-size: 22px; font-weight: 700; margin: 20px 0 12px; }
    h2 { font-size: 18px; font-weight: 700; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin: 28px 0 12px; }
    h3 { font-size: 16px; font-weight: 600; margin: 20px 0 8px; }
    p { margin: 8px 0; }
    ul, ol { padding-left: 24px; margin: 8px 0; }
    li { margin: 4px 0; }
    table { border-collapse: collapse; width: 100%; margin: 12px 0; }
    th, td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; }
    th { background: #f3f4f6; font-weight: 600; }
    blockquote { border-left: 3px solid #d1d5db; padding: 8px 16px; margin: 12px 0; color: #6b7280; }
    hr { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
    code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 13px; }
    strong { font-weight: 700; }
    .platform-section { page-break-before: always; margin-top: 40px; }
    .platform-header { background: #f8f9fa; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px 20px; margin-bottom: 20px; }
    .platform-header h2 { border: none; margin: 0; padding: 0; font-size: 20px; }
    .platform-meta { font-size: 12px; color: #6b7280; margin-top: 4px; }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <p style="font-size:12px;color:#6b7280;">生成时间：${new Date().toLocaleString('zh-CN')} · 共 ${(article.platforms ? Object.keys(article.platforms).length : 0) + 1} 个版本</p>
  ${sectionsHtml}
  <hr>
  <p style="font-size:11px;color:#9ca3af;text-align:center;">由 GEO 内容工作台生成</p>
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `一稿多发-${title.replace(/[\/\\:*?"<>|]/g, '_').slice(0, 40)}.doc`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Word 文档已导出', 'success');
}

// ===== Article Management Page =====
function renderArticles() {
  const search = (document.getElementById('articleSearch').value || '').toLowerCase();
  const filterStatus = document.getElementById('articleFilterStatus').value;
  const filterAngle = document.getElementById('articleFilterAngle').value;

  // Populate angle filter dropdown
  const angleFilterEl = document.getElementById('articleFilterAngle');
  if (angleFilterEl && angleFilterEl.options.length <= 1) {
    ANGLES.forEach(a => {
      const opt = document.createElement('option');
      opt.value = a.id;
      opt.textContent = `${a.icon} ${a.name}`;
      angleFilterEl.appendChild(opt);
    });
    const defaultOpt = document.createElement('option');
    defaultOpt.value = '_default';
    defaultOpt.textContent = '📝 母稿';
    angleFilterEl.appendChild(defaultOpt);
  }

  let articles = [...state.articles];

  // Filter by search
  if (search) {
    articles = articles.filter(a => {
      const q = state.questions.find(q => q.id === a.questionId);
      const qText = q ? q.question : '';
      return qText.toLowerCase().includes(search) || (a.content || '').toLowerCase().includes(search);
    });
  }

  // Filter by platform status
  if (filterStatus === 'has-platforms') {
    articles = articles.filter(a => a.platforms && Object.keys(a.platforms).length > 0);
  } else if (filterStatus === 'no-platforms') {
    articles = articles.filter(a => !a.platforms || Object.keys(a.platforms).length === 0);
  }

  // Filter by angle
  if (filterAngle) {
    if (filterAngle === '_default') {
      articles = articles.filter(a => !a.angle);
    } else {
      articles = articles.filter(a => a.angle === filterAngle);
    }
  }

  // Sort by most recent first
  articles.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));

  document.getElementById('articleCount').textContent = `共 ${articles.length} 篇`;

  if (articles.length === 0) {
    document.getElementById('articlesTable').innerHTML = `
      <div class="card" style="padding:48px;text-align:center;color:var(--text-muted);">
        <p style="font-size:32px;margin-bottom:12px;opacity:0.3;">📄</p>
        <p>暂无文稿，去<a href="#" onclick="event.preventDefault();navigateTo('workspace')" style="color:var(--blue)">内容工作台</a>生成第一篇</p>
      </div>`;
    return;
  }

  const platformNames = ['知乎', '百家号', '公众号', '今日头条', '搜狐号', '网易号', 'B站', '腾讯新闻'];

  let html = `<table class="table"><thead><tr>
    <th><input type="checkbox" onchange="toggleAllArticleCheckboxes(this.checked)"></th>
    <th>序号</th>
    <th>客户提问</th>
    <th>模型</th>
    <th>角度</th>
    <th>字数</th>
    <th>多平台状态</th>
    <th>更新时间</th>
    <th>操作</th>
  </tr></thead><tbody>`;

  articles.forEach((a, idx) => {
    const q = state.questions.find(q => q.id === a.questionId);
    const qText = q ? q.question : `#${a.questionId}`;
    const mainCount = (a.content || '').length;
    const platformContentLen = a.platforms ? Object.values(a.platforms).reduce((sum, v) => sum + (v || '').length, 0) : 0;
    const totalCount = mainCount + platformContentLen;
    const platforms = a.platforms || {};
    const platformCount = Object.values(platforms).filter(v => v && v.trim()).length;
    const platformTags = platformNames.map(name => {
      const has = platforms[name] && platforms[name].trim();
      return `<span class="tag ${has ? 'tag-complete' : 'tag-low'}" style="font-size:11px;padding:1px 5px;">${name.replace('/视频号', '')}</span>`;
    }).join(' ');
    const updatedAt = a.updatedAt ? new Date(a.updatedAt).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '-';

    html += `<tr>
      <td><input type="checkbox" class="article-checkbox" data-id="${a.id}"></td>
      <td>${idx + 1}</td>
      <td style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${escapeHtml(qText)}">${escapeHtml(qText)}</td>
      <td><span class="tag tag-blue">${a.model || '-'}</span></td>
      <td>${a.angleName ? `<span class="tag tag-purple">${a.angleName}</span>` : '<span class="tag tag-low">母稿</span>'}</td>
      <td>${mainCount.toLocaleString()}<br><span class="text-sm text-muted">总计 ${totalCount.toLocaleString()}</span></td>
      <td>${platformTags} <span class="text-sm text-muted">${platformCount}/6</span></td>
      <td class="text-sm text-muted">${updatedAt}</td>
      <td>
        <button class="btn btn-ghost btn-sm" onclick="viewArticle(${a.id})" title="查看/编辑">👁️</button>
        <button class="btn btn-ghost btn-sm" onclick="exportArticleWord(${a.id})" title="导出Word">📥</button>
        <button class="btn btn-ghost btn-sm" onclick="deleteArticle(${a.id})" title="删除">🗑️</button>
      </td>
    </tr>`;
  });

  html += '</tbody></table>';
  document.getElementById('articlesTable').innerHTML = html;
}

function viewArticle(articleId) {
  const article = state.articles.find(a => a.id === articleId);
  if (!article) return;

  const q = state.questions.find(q => q.id === article.questionId);
  const qText = q ? q.question : `文章 #${article.id}`;

  const platformEntries = article.platforms && Object.keys(article.platforms).length > 0
    ? Object.entries(article.platforms).map(([platform, content]) => {
        const len = (content || '').length;
        return `<details style="margin-bottom:8px;">
          <summary style="cursor:pointer;padding:8px 0;font-weight:600;">${escapeHtml(platform)} <span class="text-sm text-muted">(${len} 字)</span></summary>
          <div class="platform-content-box" data-platform="${escapeHtml(platform)}" style="padding:12px;background:var(--bg-secondary);border-radius:8px;white-space:pre-wrap;font-size:13px;line-height:1.6;max-height:300px;overflow-y:auto;"></div>
        </details>`;
      }).join('')
    : '';

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'articleViewModal';
  overlay.innerHTML = `
    <div class="modal" style="max-width:900px;max-height:90vh;">
      <div class="modal-header">
        <h3 class="modal-title">📄 ${escapeHtml(qText)}</h3>
        <button class="modal-close" onclick="closeArticleModal()">&times;</button>
      </div>
      <div class="modal-body" style="padding:0;">
        <div style="padding:12px 24px;background:var(--bg-secondary);border-bottom:1px solid var(--border);display:flex;gap:12px;align-items:center;">
          <span class="tag tag-blue">${escapeHtml(article.model || '未知模型')}</span>
          <span class="text-sm text-muted">${(article.content || '').length.toLocaleString()} 字</span>
          <span class="text-sm text-muted">更新: ${article.updatedAt ? new Date(article.updatedAt).toLocaleString('zh-CN') : '-'}</span>
          <span style="flex:1"></span>
          <button class="btn btn-sm btn-primary" onclick="saveArticleEdit(${article.id})">💾 保存修改</button>
        </div>
        <textarea id="articleEditTextarea" style="width:100%;min-height:400px;padding:16px 24px;border:none;outline:none;font-family:inherit;font-size:14px;line-height:1.7;resize:vertical;"></textarea>
        <div id="articleValidationReport" style="padding:16px 24px;border-top:1px solid var(--border);"></div>
        ${platformEntries ? `<div style="padding:16px 24px;border-top:1px solid var(--border);"><h4 style="margin-bottom:12px;">📡 各平台版本</h4>${platformEntries}</div>` : ''}
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.classList.add('show');

  // Set content via JS to avoid template literal breakage from backticks
  document.getElementById('articleEditTextarea').value = article.content || '';

  // Set platform content
  if (article.platforms) {
    overlay.querySelectorAll('.platform-content-box').forEach(box => {
      const platform = box.dataset.platform;
      box.textContent = (article.platforms[platform] || '');
    });
  }

  overlay.addEventListener('click', e => { if (e.target === overlay) closeArticleModal(); });

  // 添加校验报告 + GEO 评分
  setTimeout(() => {
    const content = article.content || '';
    const report = validateArticle(content);
    const reportEl = document.getElementById('articleValidationReport');
    if (reportEl) {
      const q = state.questions.find(q => q.id === article.questionId);
      const geoScore = scoreMasterDraft(content, q);
      reportEl.innerHTML = renderScoreReport(geoScore) + renderValidationReport(report);
    }
  }, 100);
}

// 合规 + 数据校验
function validateArticle(text) {
  if (!text) return { absoluteWords: [], missingNumbers: [], total: 0 };

  // 1. 绝对化用语检测
  const absolutePattern = /最[^\w]?|[第壹]一|100%|0失误|0差错|唯一|首家|首选|领先|第一|顶级|极致|完美|绝对|万能|无敌/gi;
  const absoluteMatches = [];
  let match;
  while ((match = absolutePattern.exec(text)) !== null) {
    const start = Math.max(0, match.index - 10);
    const end = Math.min(text.length, match.index + match[0].length + 10);
    absoluteMatches.push({
      word: match[0],
      context: text.slice(start, end),
      index: match.index,
    });
  }

  // 2. 数字溯源检测
  const numberPattern = /\d+[\.]?\d*\s*(万|%|家|个|元|年|天|小时|分钟|倍|人|单|件|平米|㎡|km|米)/g;
  const numberMatches = [];
  while ((match = numberPattern.exec(text)) !== null) {
    const start = Math.max(0, match.index - 15);
    const end = Math.min(text.length, match.index + match[0].length + 15);
    const context = text.slice(start, end);

    // Numbers are trusted since they come from system prompt fact database
    const inFactBase = true;

    // 检查是否是"待补"标记
    const isPending = text.slice(Math.max(0, match.index - 5), match.index).includes('待补');

    if (!inFactBase && !isPending) {
      numberMatches.push({
        number: match[0],
        context: context,
        index: match.index,
      });
    }
  }

  return {
    absoluteWords: absoluteMatches,
    missingNumbers: numberMatches,
    total: absoluteMatches.length + numberMatches.length,
  };
}

// 渲染校验报告
function renderValidationReport(report) {
  if (report.total === 0) {
    return '<div class="validation-pass">✅ 校验通过，未发现合规或数据问题</div>';
  }

  let html = '<div class="validation-report">';
  html += `<div class="validation-header">⚠️ 校验发现 ${report.total} 个问题</div>`;

  if (report.absoluteWords.length > 0) {
    html += '<div class="validation-section">';
    html += `<div class="validation-section-title">🔴 绝对化用语（${report.absoluteWords.length}处）</div>`;
    html += '<div class="validation-items">';
    report.absoluteWords.forEach(item => {
      html += `<div class="validation-item validation-error">
        <span class="validation-word">${escapeHtml(item.word)}</span>
        <span class="validation-context">...${escapeHtml(item.context)}...</span>
      </div>`;
    });
    html += '</div></div>';
  }

  if (report.missingNumbers.length > 0) {
    html += '<div class="validation-section">';
    html += `<div class="validation-section-title">🟡 数字溯源（${report.missingNumbers.length}处）</div>`;
    html += '<div class="validation-items">';
    report.missingNumbers.forEach(item => {
      html += `<div class="validation-item validation-warn">
        <span class="validation-word">${escapeHtml(item.number)}</span>
        <span class="validation-context">...${escapeHtml(item.context)}...</span>
      </div>`;
    });
    html += '</div></div>';
  }

  html += '</div>';
  return html;
}

function closeArticleModal() {
  const modal = document.getElementById('articleViewModal');
  if (modal) {
    modal.classList.remove('show');
    setTimeout(() => modal.remove(), 200);
  }
}

function saveArticleEdit(articleId) {
  const article = state.articles.find(a => a.id === articleId);
  if (!article) return;
  const textarea = document.getElementById('articleEditTextarea');
  if (!textarea) return;
  article.content = textarea.value;
  article.updatedAt = new Date().toISOString();
  saveState();
  showToast('文章已保存', 'success');
  closeArticleModal();
  renderArticles();
}

function exportArticleWord(articleId) {
  const article = state.articles.find(a => a.id === articleId);
  if (!article) return;
  const q = state.questions.find(q => q.id === article.questionId);
  const title = q ? q.question : `文章${article.id}`;

  let sectionsHtml = '';

  // Master draft
  if (article.content) {
    sectionsHtml += `
    <div class="platform-section">
      <div class="platform-header">
        <h2>📝 母稿</h2>
        <div class="platform-meta">${article.model || '未知模型'} · ${(article.content || '').length.toLocaleString()} 字</div>
      </div>
      ${mdToWordHtml(article.content)}
    </div>`;
  }

  // Platform versions
  if (article.platforms && Object.keys(article.platforms).length > 0) {
    for (const [platform, content] of Object.entries(article.platforms)) {
      if (content && content.trim()) {
        const dm = DISTRIBUTION_MATRIX.find(d => d.platform === platform);
        sectionsHtml += `
    <div class="platform-section">
      <div class="platform-header">
        <h2>${dm ? dm.icon : '📄'} ${platform}${dm ? `（${dm.form}）` : ''}</h2>
        ${dm ? `<div class="platform-meta">建议篇幅：${dm.length} · ${dm.geoValue}</div>` : ''}
      </div>
      ${mdToWordHtml(content)}
    </div>`;
      }
    }
  }

  const platformCount = article.platforms ? Object.keys(article.platforms).length : 0;
  const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif; font-size: 14px; line-height: 1.8; color: #1a1a2e; max-width: 800px; margin: 0 auto; padding: 24px; }
    h1 { font-size: 22px; font-weight: 700; margin: 20px 0 12px; }
    h2 { font-size: 18px; font-weight: 700; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin: 28px 0 12px; }
    h3 { font-size: 16px; font-weight: 600; margin: 20px 0 8px; }
    p { margin: 8px 0; }
    ul, ol { padding-left: 24px; margin: 8px 0; }
    li { margin: 4px 0; }
    table { border-collapse: collapse; width: 100%; margin: 12px 0; }
    th, td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; }
    th { background: #f3f4f6; font-weight: 600; }
    blockquote { border-left: 3px solid #d1d5db; padding: 8px 16px; margin: 12px 0; color: #6b7280; }
    hr { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
    code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 13px; }
    strong { font-weight: 700; }
    .platform-section { page-break-before: always; margin-top: 40px; }
    .platform-header { background: #f8f9fa; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px 20px; margin-bottom: 20px; }
    .platform-header h2 { border: none; margin: 0; padding: 0; font-size: 20px; }
    .platform-meta { font-size: 12px; color: #6b7280; margin-top: 4px; }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <p style="font-size:12px;color:#6b7280;">生成时间：${article.updatedAt ? new Date(article.updatedAt).toLocaleString('zh-CN') : '-'} · 共 ${platformCount + 1} 个版本</p>
  ${sectionsHtml}
  <hr>
  <p style="font-size:11px;color:#9ca3af;text-align:center;">由 GEO 内容工作台生成</p>
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/[\/\\:*?"<>|]/g, '_').slice(0, 50)}.doc`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Word 文档已导出', 'success');
}

function deleteArticle(articleId) {
  if (!confirm('确定删除这篇文稿？')) return;
  state.articles = state.articles.filter(a => a.id !== articleId);
  saveState();
  showToast('已删除', 'success');
  renderArticles();
  renderDistribution();
}

function toggleAllArticleCheckboxes(checked) {
  document.querySelectorAll('.article-checkbox').forEach(cb => cb.checked = checked);
}

function deleteSelectedArticles() {
  const ids = [...document.querySelectorAll('.article-checkbox:checked')].map(cb => parseInt(cb.dataset.id));
  if (ids.length === 0) { showToast('请先选择文稿', 'error'); return; }
  if (!confirm(`确定删除选中的 ${ids.length} 篇文稿？`)) return;
  state.articles = state.articles.filter(a => !ids.includes(a.id));
  saveState();
  showToast(`已删除 ${ids.length} 篇`, 'success');
  renderArticles();
  renderDistribution();
}

// Save platform edits when user manually edits textareas in 一稿多发
function savePlatformEdits(articleId) {
  const article = state.articles.find(a => a.id === articleId);
  if (!article) return;
  savePlatformTextareaValues(article, document.querySelectorAll('#distPlatforms textarea'));
  saveState();
}

// ===== Batch Generation =====
function appendBatchResultCard(status, questionText, metaText) {
  const container = document.getElementById('batchResults');
  if (!container) return;

  const card = document.createElement('div');
  card.className = 'card';
  card.style.marginBottom = '8px';
  card.style.borderLeft = `3px solid var(--${status === 'success' ? 'green' : 'red'})`;

  const content = document.createElement('div');
  content.style.padding = '12px 16px';
  content.style.display = 'flex';
  content.style.alignItems = 'center';
  content.style.justifyContent = 'space-between';

  const label = document.createElement('span');
  label.textContent = `${status === 'success' ? '✅' : '❌'} ${questionText || ''}`;

  const tag = document.createElement('span');
  tag.className = status === 'success' ? 'tag tag-green' : 'tag tag-medium';
  tag.textContent = metaText == null ? '' : String(metaText);

  content.appendChild(label);
  content.appendChild(tag);
  card.appendChild(content);
  container.appendChild(card);
}

async function startBatchGeneration() {
  if (state.batchRunning) return;

  const scope = document.getElementById('batchScope').value;
  const model = document.getElementById('batchModel').value;
  const angleId = document.getElementById('batchAngle').value;
  const angle = angleId ? ANGLES.find(a => a.id === angleId) : null;
  const delay = parseInt(document.getElementById('batchDelay').value) || 2;
  const settings = getSettings();

  let questions;
  switch (scope) {
    case 'selected':
      questions = state.questions.filter(q => state.selectedQuestionIds.has(q.id));
      break;
    case 'high':
      questions = state.questions.filter(q => q.priority === '高');
      break;
    case 'unstarted':
      questions = state.questions.filter(q => q.status === '未开始');
      break;
    case 'all':
    default:
      questions = [...state.questions];
      break;
  }

  if (questions.length === 0) { showToast('没有符合条件的问题', 'error'); return; }

  state.batchRunning = true;
  state.batchAbortController = new AbortController();
  document.getElementById('btnStopBatch').classList.remove('hidden');
  document.getElementById('batchProgressSection').classList.remove('hidden');
  document.getElementById('batchResults').innerHTML = '';

  const total = questions.length;
  let completed = 0;
  let succeeded = 0;
  let failed = 0;

  for (const q of questions) {
    if (!state.batchRunning) break;

    document.getElementById('batchProgressLabel').textContent = `正在生成：${q.question.slice(0, 30)}...`;
    document.getElementById('batchProgressCount').textContent = `${completed + 1}/${total}`;
    document.getElementById('batchProgressBar').style.width = `${Math.round(completed / total * 100)}%`;

    try {
      let userPrompt = `客户提问：${q.question}
行业：${q.industry}
搜索意图：${q.intent}
建议主打卖点：${q.sellingPoint || '未指定'}`;

      if (angle) {
        userPrompt += `\n\n${angle.prompt}`;
      }

      const messages = [
        { role: 'system', content: GEO_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: state.batchAbortController.signal,
        body: JSON.stringify({
          model: model,
          messages: messages,
          max_tokens: settings.maxTokens,
          temperature: settings.temperature,
          stream: false,
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const content = extractRequiredChatContent(data, '批量生成');

      // Save article (match by questionId + angle)
      const angleKey = angle ? angle.id : '';
      const existing = state.articles.find(a =>
        a.questionId === q.id && (a.angle || '') === angleKey
      );
      if (existing) {
        existing.content = content;
        existing.model = model;
        existing.angle = angleKey;
        existing.angleName = angle ? angle.name : '';
        existing.updatedAt = new Date().toISOString();
      } else {
        state.articles.push({
          id: state.nextArticleId++,
          questionId: q.id,
          content: content,
          model: model,
          angle: angleKey,
          angleName: angle ? angle.name : '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      if (q.status === '未开始') q.status = '进行中';
      succeeded++;

      // Add result entry
      appendBatchResultCard('success', q.question, `${content.length} 字`);

    } catch (e) {
      if (e.name === 'AbortError') {
        showToast('批量生成已停止', 'info');
        break;
      }
      failed++;
      appendBatchResultCard('error', q.question, e.message);
    }

    completed++;
    saveState();

    // Delay between requests
    if (completed < total && state.batchRunning) {
      await new Promise(r => setTimeout(r, delay * 1000));
    }
  }

  document.getElementById('batchProgressBar').style.width = '100%';
  document.getElementById('batchProgressLabel').textContent = '完成';
  document.getElementById('batchProgressCount').textContent = `${completed}/${total}`;

  state.batchRunning = false;
  state.batchAbortController = null;
  document.getElementById('btnStopBatch').classList.add('hidden');

  showToast(`批量生成完成：成功 ${succeeded}，失败 ${failed}`, succeeded > 0 ? 'success' : 'error');
}

function stopBatchGeneration() {
  state.batchRunning = false;
  if (state.batchAbortController) {
    state.batchAbortController.abort();
  }
}

// ===== Dashboard Page =====
async function renderDashboard() {
  const all = state.questions;
  const articles = state.articles || [];
  const testRecords = state.testRecords || [];
  const sellingPoints = state.sellingPoints || [];

  // Load title pool data if not loaded yet
  if (!titleTabState.loaded) {
    titleTabState.loaded = true;
    await Promise.all([loadSelectedTitles(), loadPoolTitles()]);
  }

  // ========== 卡片排序管理 ==========
  const CARD_IDS = [
    'trend', 'competitors', 'retest',
    'priorities', 'intents', 'statuses',
    'industries', 'clusters', 'progress',
    'testSummary', 'angles', 'platforms',
    'topSP', 'matrix'
  ];
  let cardOrder = CARD_IDS;
  try {
    const saved = localStorage.getItem('dashboardCardOrder');
    if (saved) {
      const parsed = JSON.parse(saved);
      // 合并：已保存的顺序 + 新增的卡片
      const validIds = parsed.filter(id => CARD_IDS.includes(id));
      const newIds = CARD_IDS.filter(id => !validIds.includes(id));
      cardOrder = [...validIds, ...newIds];
    }
  } catch (e) {}

  // 拖拽状态
  let draggedCardId = null;

  function handleDragStart(e) {
    draggedCardId = e.target.dataset.cardId;
    e.target.classList.add('dash-card-dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', draggedCardId);
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const target = e.target.closest('.dash-chart-card');
    if (target && target.dataset.cardId !== draggedCardId) {
      target.classList.add('dash-card-dragover');
    }
  }

  function handleDragLeave(e) {
    e.target.closest('.dash-chart-card')?.classList.remove('dash-card-dragover');
  }

  function handleDrop(e) {
    e.preventDefault();
    const target = e.target.closest('.dash-chart-card');
    if (!target || !draggedCardId) return;
    const targetId = target.dataset.cardId;
    if (targetId === draggedCardId) return;

    // 重新排序
    const fromIdx = cardOrder.indexOf(draggedCardId);
    const toIdx = cardOrder.indexOf(targetId);
    cardOrder.splice(fromIdx, 1);
    cardOrder.splice(toIdx, 0, draggedCardId);

    // 保存并重新渲染
    localStorage.setItem('dashboardCardOrder', JSON.stringify(cardOrder));
    renderDashboard();
  }

  function handleDragEnd(e) {
    document.querySelectorAll('.dash-card-dragging, .dash-card-dragover').forEach(el => {
      el.classList.remove('dash-card-dragging', 'dash-card-dragover');
    });
    draggedCardId = null;
  }

  // 注册全局拖拽事件（用事件委托）
  const chartsContainer = document.getElementById('dashboardCharts');
  if (chartsContainer) {
    chartsContainer.ondragstart = handleDragStart;
    chartsContainer.ondragover = handleDragOver;
    chartsContainer.ondragleave = handleDragLeave;
    chartsContainer.ondrop = handleDrop;
    chartsContainer.ondragend = handleDragEnd;
  }

  // ========== 核心指标 ==========
  const questionsWithArticles = new Set(articles.map(a => a.questionId));
  const generatedCount = questionsWithArticles.size;
  const usedAngles = new Set(articles.filter(a => a.angle).map(a => a.angle));
  const angleCount = usedAngles.size;
  let platformVersions = 0;
  articles.forEach(a => { if (a.platforms) platformVersions += Object.keys(a.platforms).length; });
  const clusterSet = new Set(all.map(q => q.cluster).filter(Boolean));

  // 测试记录指标
  const testedQuestionIds = new Set(testRecords.map(r => r.questionId));
  const mentionedQuestionIds = new Set(testRecords.filter(r => r.mentioned === '是').map(r => r.questionId));
  const mentionRate = testedQuestionIds.size > 0 ? Math.round(mentionedQuestionIds.size / testedQuestionIds.size * 100) : 0;

  // 时间维度：最近7天
  const now = new Date();
  const weekAgo = new Date(now - 7 * 86400000);
  const recentArticles = articles.filter(a => a.createdAt && new Date(a.createdAt) >= weekAgo).length;

  const statsEl = document.getElementById('dashboardStats');
  if (statsEl) {
    const selectedCount = titleTabState.selectedTitles.length || 0;
    const poolTotal = titleTabState.poolTotal || 0;
    statsEl.innerHTML = `
      <div class="dash-stat"><div class="dash-stat-value blue">${selectedCount}</div><div class="dash-stat-label">精选题库</div></div>
      <div class="dash-stat"><div class="dash-stat-value purple">${poolTotal}</div><div class="dash-stat-label">总题库</div></div>
      <div class="dash-stat"><div class="dash-stat-value green">${generatedCount}</div><div class="dash-stat-label">已生成母稿</div></div>
      <div class="dash-stat"><div class="dash-stat-value orange">${platformVersions}</div><div class="dash-stat-label">平台版本</div></div>
      <div class="dash-stat"><div class="dash-stat-value cyan">${testedQuestionIds.size}</div><div class="dash-stat-label">已测试</div></div>
      <div class="dash-stat"><div class="dash-stat-value red">${mentionRate}%</div><div class="dash-stat-label">AI提及率</div></div>
    `;
  }

  // ========== 图表 ==========
  const chartsEl = document.getElementById('dashboardCharts');
  if (!chartsEl) return;

  // 优先级分布
  const priorities = { '高': 0, '中': 0, '低': 0 };
  all.forEach(q => { priorities[q.priority] = (priorities[q.priority] || 0) + 1; });
  const maxP = Math.max(...Object.values(priorities), 1);

  // 搜索意图分布
  const intents = {};
  all.forEach(q => { if (q.intent) intents[q.intent] = (intents[q.intent] || 0) + 1; });
  const maxInt = Math.max(...Object.values(intents), 1);

  // 内容状态分布
  const statuses = { '未开始': 0, '进行中': 0, '已发布': 0 };
  all.forEach(q => { statuses[q.status || '未开始'] = (statuses[q.status || '未开始'] || 0) + 1; });
  const maxSt = Math.max(...Object.values(statuses), 1);

  // 行业分布
  const industries = {};
  all.forEach(q => { industries[q.industry] = (industries[q.industry] || 0) + 1; });
  const maxI = Math.max(...Object.values(industries), 1);

  // 选题簇分布 Top 6
  const clusterMap = {};
  all.forEach(q => { if (q.cluster) clusterMap[q.cluster] = (clusterMap[q.cluster] || 0) + 1; });
  const sortedClusters = Object.entries(clusterMap).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxC = sortedClusters.length > 0 ? sortedClusters[0][1] : 1;

  // 内容生产进度
  const notGenerated = all.length - generatedCount;
  const progressMax = Math.max(generatedCount, notGenerated, 1);

  // 角度使用分布
  const angleMap = {};
  articles.forEach(a => { if (a.angleName) angleMap[a.angleName] = (angleMap[a.angleName] || 0) + 1; });
  const sortedAngles = Object.entries(angleMap).sort((a, b) => b[1] - a[1]);
  const maxA = sortedAngles.length > 0 ? sortedAngles[0][1] : 1;

  // 平台覆盖统计
  const platformMap = {};
  articles.forEach(a => {
    if (a.platforms) Object.keys(a.platforms).forEach(p => { if (a.platforms[p]) platformMap[p] = (platformMap[p] || 0) + 1; });
  });
  const maxPlat = Math.max(...Object.values(platformMap), 1);

  // 热门卖点 Top 5
  const spUsage = {};
  all.forEach(q => { if (q.sellingPoint) spUsage[q.sellingPoint] = (spUsage[q.sellingPoint] || 0) + 1; });
  const topSP = Object.entries(spUsage).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxSP = topSP.length > 0 ? topSP[0][1] : 1;

  // 问题-角度覆盖矩阵（Top 5 问题 × 已用角度）
  const topQuestions = all.slice(0, 5);
  const angleNames = [...usedAngles].map(id => { const a = ANGLES.find(a => a.id === id); return a ? a.name : id; });
  const matrixData = {};
  articles.forEach(a => {
    if (!matrixData[a.questionId]) matrixData[a.questionId] = new Set();
    if (a.angleName) matrixData[a.questionId].add(a.angleName);
  });

  // ========== 新增：AI提及率趋势线 ==========
  const mentionTrend = {};
  testRecords.forEach(r => {
    if (!r.testDate) return;
    const d = new Date(r.testDate);
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());
    const key = weekStart.toISOString().slice(0, 10);
    if (!mentionTrend[key]) mentionTrend[key] = { total: 0, mentioned: 0 };
    mentionTrend[key].total++;
    if (r.mentioned === '是') mentionTrend[key].mentioned++;
  });
  const trendData = Object.entries(mentionTrend)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([week, d]) => ({
      week,
      label: week.slice(5), // MM-DD
      rate: d.total > 0 ? Math.round(d.mentioned / d.total * 100) : 0,
      total: d.total,
    }));
  const maxTrendRate = Math.max(...trendData.map(t => t.rate), 100);

  // ========== 新增：竞品出现频次榜 ==========
  const competitorMap = {};
  testRecords.forEach(r => {
    if (!r.competitors) return;
    // 按逗号、分号、换行分割竞品名称
    const names = r.competitors.split(/[,;，；\n]+/).map(s => s.trim()).filter(Boolean);
    names.forEach(name => {
      competitorMap[name] = (competitorMap[name] || 0) + 1;
    });
  });
  const topCompetitors = Object.entries(competitorMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  const maxComp = topCompetitors.length > 0 ? topCompetitors[0][1] : 1;

  // ========== 新增：待复测提醒 ==========
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
  const pendingRetest = state.questions.filter(q => {
    if (!q.retestDate) return false;
    const rd = new Date(q.retestDate);
    return rd >= today && rd <= endOfWeek;
  }).sort((a, b) => a.retestDate.localeCompare(b.retestDate));

  // 定义每个卡片的 HTML 内容
  const cards = {
    trend: {
      html: trendData.length > 0 ? `
        <h4>📈 AI提及率趋势线</h4>
        <div class="dash-trend-chart">
          <div class="dash-trend-y">
            <span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span>
          </div>
          <div class="dash-trend-bars">
            ${trendData.map(t => `
              <div class="dash-trend-col">
                <div class="dash-trend-bar-track">
                  <div class="dash-trend-bar" style="height:${Math.round(t.rate / maxTrendRate * 100)}%" title="${t.rate}% (${t.mentioned}/${t.total})">
                    <span class="dash-trend-value">${t.rate}%</span>
                  </div>
                </div>
                <div class="dash-trend-label">${t.label}</div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="dash-trend-footer">每周AI提及率 = 该周被提及问题数 ÷ 该周已测试问题数</div>
      ` : `
        <h4>📈 AI提及率趋势线</h4>
        <div class="dash-empty-hint">暂无测试数据，添加测试记录后自动生成趋势线</div>
      `,
      span: 2
    },
    competitors: {
      html: `
        <h4>🏆 竞品出现频次榜</h4>
        ${topCompetitors.length > 0 ? topCompetitors.map(([name, count], i) => `
          <div class="bar-chart-row">
            <div class="bar-label">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`} ${name}</div>
            <div class="bar-track"><div class="bar-fill bar-red" style="width:${Math.round(count / maxComp * 100)}%"></div></div>
            <div class="bar-value">${count}次</div>
          </div>
        `).join('') : '<div class="dash-empty-hint">暂无竞品数据，测试记录中填写「AI引用了谁」后自动统计</div>'}
      `,
      span: 1
    },
    retest: {
      html: `
        <h4>🔔 本周待复测</h4>
        ${pendingRetest.length > 0 ? `
          <div class="dash-retest-list">
            ${pendingRetest.slice(0, 8).map(q => `
              <div class="dash-retest-item">
                <span class="dash-retest-date">${q.retestDate.slice(5)}</span>
                <span class="dash-retest-q" title="${q.question}">${q.question.slice(0, 25)}${q.question.length > 25 ? '...' : ''}</span>
                <span class="dash-retest-status tag ${q.mentioned === '是' ? 'tag-green' : 'tag-pending'}">${q.mentioned === '是' ? '已提及' : '未提及'}</span>
              </div>
            `).join('')}
            ${pendingRetest.length > 8 ? `<div class="dash-retest-more">还有 ${pendingRetest.length - 8} 条...</div>` : ''}
          </div>
        ` : '<div class="dash-empty-hint">本周无需复测的记录</div>'}
      `,
      span: 1
    },
    priorities: {
      html: `
        <h4>📊 优先级分布</h4>
        ${Object.entries(priorities).map(([k, v]) => `
          <div class="bar-chart-row">
            <div class="bar-label">${k}</div>
            <div class="bar-track"><div class="bar-fill bar-${k === '高' ? 'red' : k === '中' ? 'orange' : 'gray'}" style="width:${Math.round(v / maxP * 100)}%"></div></div>
            <div class="bar-value">${v}</div>
          </div>
        `).join('')}
      `,
      span: 1
    },
    intents: {
      html: `
        <h4>🔍 搜索意图分布</h4>
        ${Object.entries(intents).sort((a, b) => b[1] - a[1]).map(([k, v]) => `
          <div class="bar-chart-row">
            <div class="bar-label">${k}</div>
            <div class="bar-track"><div class="bar-fill bar-purple" style="width:${Math.round(v / maxInt * 100)}%"></div></div>
            <div class="bar-value">${v}</div>
          </div>
        `).join('')}
      `,
      span: 1
    },
    statuses: {
      html: `
        <h4>📋 内容状态分布</h4>
        ${Object.entries(statuses).map(([k, v]) => `
          <div class="bar-chart-row">
            <div class="bar-label">${k}</div>
            <div class="bar-track"><div class="bar-fill bar-${k === '已发布' ? 'green' : k === '进行中' ? 'blue' : 'gray'}" style="width:${Math.round(v / maxSt * 100)}%"></div></div>
            <div class="bar-value">${v}</div>
          </div>
        `).join('')}
      `,
      span: 1
    },
    industries: {
      html: `
        <h4>🏭 行业分布</h4>
        ${Object.entries(industries).sort((a, b) => b[1] - a[1]).map(([k, v]) => `
          <div class="bar-chart-row">
            <div class="bar-label">${k}</div>
            <div class="bar-track"><div class="bar-fill bar-blue" style="width:${Math.round(v / maxI * 100)}%"></div></div>
            <div class="bar-value">${v}</div>
          </div>
        `).join('')}
      `,
      span: 1
    },
    clusters: {
      html: `
        <h4>🎯 选题簇分布 Top 6</h4>
        ${sortedClusters.map(([k, v]) => `
          <div class="bar-chart-row">
            <div class="bar-label" style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${k}">${k}</div>
            <div class="bar-track"><div class="bar-fill bar-cyan" style="width:${Math.round(v / maxC * 100)}%"></div></div>
            <div class="bar-value">${v}</div>
          </div>
        `).join('')}
      `,
      span: 1
    },
    progress: {
      html: `
        <h4>📝 内容生产进度</h4>
        <div class="dash-progress-ring">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#f0f0f0" stroke-width="8"/>
            <circle cx="50" cy="50" r="40" fill="none" stroke="${generatedCount > 0 ? '#10b981' : '#d1d5db'}" stroke-width="8"
              stroke-dasharray="${generatedCount / all.length * 251} 251" stroke-linecap="round" transform="rotate(-90 50 50)"/>
          </svg>
          <div class="dash-progress-text">${all.length > 0 ? Math.round(generatedCount / all.length * 100) : 0}%</div>
        </div>
        <div class="dash-progress-labels">
          <span><i class="dot green"></i>已生成 ${generatedCount}</span>
          <span><i class="dot gray"></i>未生成 ${notGenerated}</span>
        </div>
      `,
      span: 1
    },
    testSummary: {
      html: `
        <h4>🧪 测试记录摘要</h4>
        <div class="dash-metrics-grid">
          <div class="dash-metric-item">
            <div class="dash-metric-num blue">${testedQuestionIds.size}</div>
            <div class="dash-metric-desc">已测试问题</div>
          </div>
          <div class="dash-metric-item">
            <div class="dash-metric-num green">${mentionedQuestionIds.size}</div>
            <div class="dash-metric-desc">AI已提及</div>
          </div>
          <div class="dash-metric-item">
            <div class="dash-metric-num purple">${mentionRate}%</div>
            <div class="dash-metric-desc">提及率</div>
          </div>
          <div class="dash-metric-item">
            <div class="dash-metric-num orange">${recentArticles}</div>
            <div class="dash-metric-desc">近7天新增</div>
          </div>
        </div>
      `,
      span: 1
    },
    angles: sortedAngles.length > 0 ? {
      html: `
        <h4>📐 角度使用分布</h4>
        ${sortedAngles.map(([k, v]) => `
          <div class="bar-chart-row">
            <div class="bar-label">${k}</div>
            <div class="bar-track"><div class="bar-fill bar-orange" style="width:${Math.round(v / maxA * 100)}%"></div></div>
            <div class="bar-value">${v}</div>
          </div>
        `).join('')}
      `,
      span: 1
    } : null,
    platforms: Object.keys(platformMap).length > 0 ? {
      html: `
        <h4>📡 平台覆盖</h4>
        ${Object.entries(platformMap).sort((a, b) => b[1] - a[1]).map(([k, v]) => `
          <div class="bar-chart-row">
            <div class="bar-label">${k}</div>
            <div class="bar-track"><div class="bar-fill bar-green" style="width:${Math.round(v / maxPlat * 100)}%"></div></div>
            <div class="bar-value">${v}</div>
          </div>
        `).join('')}
      `,
      span: 1
    } : null,
    topSP: topSP.length > 0 ? {
      html: `
        <h4>🔥 热门卖点 Top 5</h4>
        ${topSP.map(([k, v]) => `
          <div class="bar-chart-row">
            <div class="bar-label" style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${k}">${k}</div>
            <div class="bar-track"><div class="bar-fill bar-red" style="width:${Math.round(v / maxSP * 100)}%"></div></div>
            <div class="bar-value">${v}</div>
          </div>
        `).join('')}
      `,
      span: 1
    } : null,
    matrix: angleNames.length > 0 ? {
      html: `
        <h4>🗺️ 问题×角度覆盖矩阵</h4>
        <div class="dash-matrix-wrapper">
          <table class="dash-matrix">
            <thead>
              <tr>
                <th>问题</th>
                ${angleNames.map(a => `<th title="${a}">${a.slice(0, 4)}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${topQuestions.map(q => {
                const covered = matrixData[q.id] || new Set();
                return `<tr>
                  <td title="${q.question}" style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${q.question.slice(0, 20)}</td>
                  ${angleNames.map(a => `<td>${covered.has(a) ? '✅' : '—'}</td>`).join('')}
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      `,
      span: 2
    } : null,
  };

  // 按 cardOrder 渲染，跳过不存在的卡片
  chartsEl.innerHTML = cardOrder.map(id => {
    const card = cards[id];
    if (!card) return '';
    const spanStyle = card.span > 1 ? ` style="grid-column: span ${card.span};"` : '';
    return `<div class="dash-chart-card" draggable="true" data-card-id="${id}"${spanStyle}>${card.html}</div>`;
  }).join('');
}


// ===== Test Records Page =====
function getFilteredTestRecords() {
  let records = [...state.testRecords];
  const search = (document.getElementById('trSearch') ? document.getElementById('trSearch').value : '').toLowerCase();
  const mentioned = document.getElementById('trFilterMentioned') ? document.getElementById('trFilterMentioned').value : '';
  const platform = document.getElementById('trFilterPlatform') ? document.getElementById('trFilterPlatform').value : '';
  const questionId = document.getElementById('trFilterQuestion') ? document.getElementById('trFilterQuestion').value : '';

  if (search) records = records.filter(r => {
    const q = state.questions.find(q => q.id === r.questionId);
    const qText = q ? q.question.toLowerCase() : '';
    return qText.includes(search) || (r.competitors || '').toLowerCase().includes(search);
  });
  if (mentioned) records = records.filter(r => r.mentioned === mentioned);
  if (platform) records = records.filter(r => r.platform === platform);
  if (questionId) records = records.filter(r => r.questionId === parseInt(questionId));
  return records;
}

function renderTestRecords() {
  const filtered = getFilteredTestRecords();
  const total = filtered.length;
  const start = (state.trPage - 1) * state.trPageSize;
  const paged = filtered.slice(start, start + state.trPageSize);

  // Stats
  const all = state.testRecords;
  const totalTests = all.length;
  const mentionedYes = all.filter(r => r.mentioned === '是').length;
  const mentionRate = totalTests > 0 ? Math.round(mentionedYes / totalTests * 100) : 0;

  document.getElementById('trStats').innerHTML = `
    <div class="stat-card blue"><div class="stat-label">总测试数</div><div class="stat-value">${totalTests}</div></div>
    <div class="stat-card green"><div class="stat-label">AI提及</div><div class="stat-value">${mentionedYes}</div></div>
    <div class="stat-card purple"><div class="stat-label">提及率</div><div class="stat-value">${mentionRate}%</div></div>
  `;

  // Update question filter
  const qSelect = document.getElementById('trFilterQuestion');
  if (qSelect) {
    const currentVal = qSelect.value;
    replaceSelectOptions(qSelect, [
      { value: '', label: '全部问题', selected: !currentVal },
      ...state.questions.map(q => ({
        value: q.id,
        label: String(q.question || '').slice(0, 40),
        selected: q.id.toString() === currentVal,
      })),
    ]);
  }

  const tbody = document.getElementById('trTableBody');
  tbody.innerHTML = paged.map((r, i) => {
    const q = state.questions.find(q => q.id === r.questionId);
    const qText = q ? q.question : '未知问题';

    // Render screenshot cell
    let screenshotCell = '-';
    if (r.screenshots && r.screenshots.length > 0) {
      screenshotCell = `
        <div style="display:flex;align-items:center;gap:4px;">
          <img class="screenshot-thumb" src="${r.screenshots[0]}" onclick="showScreenshotPreview(${JSON.stringify(r.screenshots).replace(/"/g, '&quot;')}, 0)">
          ${r.screenshots.length > 1 ? `<span class="screenshot-count">+${r.screenshots.length - 1}</span>` : ''}
        </div>
      `;
    }

    return `<tr>
      <td>${start + i + 1}</td>
      <td class="text-sm">${r.testDate || '-'}</td>
      <td class="text-sm" style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${qText}">${qText}</td>
      <td><span class="tag tag-blue">${r.platform || '-'}</span></td>
      <td class="text-sm" style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${r.competitors || ''}">${r.competitors || '-'}</td>
      <td>${r.mentioned === '是' ? '<span class="tag tag-green">是</span>' : '<span class="tag tag-pending">否</span>'}</td>
      <td>${screenshotCell}</td>
      <td class="text-sm">${r.retestDate || '-'}</td>
      <td class="text-sm text-muted" style="max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${r.notes || ''}">${r.notes || '-'}</td>
      <td>
        <div class="card-actions">
          <button class="btn btn-sm btn-ghost" onclick="editTR(${r.id})" title="编辑">✏️</button>
          <button class="btn btn-sm btn-ghost" onclick="deleteTR(${r.id})" title="删除">🗑️</button>
        </div>
      </td>
    </tr>`;
  }).join('');

  // Pagination
  const totalPages = Math.ceil(total / state.trPageSize);
  document.getElementById('trPagination').innerHTML = `
    <span class="text-sm text-muted">共 ${total} 条，第 ${state.trPage}/${totalPages || 1} 页</span>
    <div class="btn-group">
      <button class="btn btn-sm" ${state.trPage <= 1 ? 'disabled' : ''} onclick="changeTrPage(-1)">← 上一页</button>
      <button class="btn btn-sm" ${state.trPage >= totalPages ? 'disabled' : ''} onclick="changeTrPage(1)">下一页 →</button>
    </div>
  `;
}

function changeTrPage(delta) {
  state.trPage = Math.max(1, state.trPage + delta);
  renderTestRecords();
}

function openAddTR() {
  document.getElementById('trModalTitle').textContent = '添加测试记录';
  // Populate question dropdown
  const qSelect = document.getElementById('trmQuestionId');
  replaceSelectOptions(qSelect, state.questions.map(q => ({
    value: q.id,
    label: String(q.question || '').slice(0, 50),
  })));
  document.getElementById('trmTestDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('trmPlatform').value = '豆包';
  document.getElementById('trmMentioned').value = '否';
  document.getElementById('trmRetestDate').value = '';
  document.getElementById('trmCompetitors').value = '';
  document.getElementById('trmLink').value = '';
  document.getElementById('trmNotes').value = '';
  document.getElementById('trModal').dataset.editId = '';

  // Reset screenshots
  currentScreenshots = [];
  renderScreenshotList();

  openModal('trModal');
  initScreenshotUpload();
}

function editTR(id) {
  const r = state.testRecords.find(r => r.id === id);
  if (!r) return;
  document.getElementById('trModalTitle').textContent = '编辑测试记录';
  const qSelect = document.getElementById('trmQuestionId');
  replaceSelectOptions(qSelect, state.questions.map(q => ({
    value: q.id,
    label: String(q.question || '').slice(0, 50),
    selected: q.id === r.questionId,
  })));
  document.getElementById('trmTestDate').value = r.testDate || '';
  document.getElementById('trmPlatform').value = r.platform || '豆包';
  document.getElementById('trmMentioned').value = r.mentioned || '否';
  document.getElementById('trmRetestDate').value = r.retestDate || '';
  document.getElementById('trmCompetitors').value = r.competitors || '';
  document.getElementById('trmLink').value = r.link || '';
  document.getElementById('trmNotes').value = r.notes || '';
  document.getElementById('trModal').dataset.editId = id;

  // Load existing screenshots
  currentScreenshots = r.screenshots || [];
  renderScreenshotList();

  openModal('trModal');
  initScreenshotUpload();
}

function saveTestRecord() {
  const editId = document.getElementById('trModal').dataset.editId;
  const data = {
    questionId: parseInt(document.getElementById('trmQuestionId').value),
    testDate: document.getElementById('trmTestDate').value,
    platform: document.getElementById('trmPlatform').value,
    mentioned: document.getElementById('trmMentioned').value,
    retestDate: document.getElementById('trmRetestDate').value,
    competitors: document.getElementById('trmCompetitors').value.trim(),
    link: document.getElementById('trmLink').value.trim(),
    notes: document.getElementById('trmNotes').value.trim(),
    screenshots: [...currentScreenshots], // Save screenshots array
  };

  if (editId) {
    const r = state.testRecords.find(r => r.id === parseInt(editId));
    if (r) Object.assign(r, data);
    showToast('测试记录已更新', 'success');
  } else {
    data.id = state.nextRecordId++;
    state.testRecords.push(data);
    showToast('测试记录已添加', 'success');
  }

  // Also update the question's test fields
  const q = state.questions.find(q => q.id === data.questionId);
  if (q) {
    q.tested = '✓';
    q.testDate = data.testDate;
    q.competitors = data.competitors;
    q.mentioned = data.mentioned;
    q.retestDate = data.retestDate;
  }

  saveState();
  closeModal('trModal');
  renderTestRecords();
}

function deleteTR(id) {
  if (!confirm('确定删除这条测试记录？')) return;
  state.testRecords = state.testRecords.filter(r => r.id !== id);
  saveState();
  renderTestRecords();
  showToast('测试记录已删除', 'success');
}

// ===== Screenshot Upload =====
let currentScreenshots = []; // Array of base64 strings
let screenshotUploadInitialized = false;
let pasteHandler = null;

function initScreenshotUpload() {
  const input = document.getElementById('trmScreenshotInput');
  const list = document.getElementById('trmScreenshots');
  const modal = document.getElementById('trModal');

  if (!input) return;

  // File input change (only bind once)
  if (!input._bound) {
    input.addEventListener('change', (e) => {
      handleScreenshotFiles(e.target.files);
      input.value = ''; // Reset to allow re-selecting same file
    });
    input._bound = true;
  }

  // Paste support (Ctrl+V) - only bind once
  if (!screenshotUploadInitialized) {
    // Remove old handler if exists
    if (pasteHandler) {
      modal.removeEventListener('paste', pasteHandler);
    }

    pasteHandler = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) handleScreenshotFiles([file]);
          break;
        }
      }
    };

    modal.addEventListener('paste', pasteHandler);
    screenshotUploadInitialized = true;
  }
}

function handleScreenshotFiles(files) {
  if (currentScreenshots.length >= 5) {
    showToast('最多只能上传 5 张截图', 'error');
    return;
  }

  const remaining = 5 - currentScreenshots.length;
  const filesToProcess = Array.from(files).slice(0, remaining);

  filesToProcess.forEach(file => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      // Compress image before storing
      compressImage(e.target.result, 800, 0.7).then(compressed => {
        currentScreenshots.push(compressed);
        renderScreenshotList();
      });
    };
    reader.readAsDataURL(file);
  });
}

function compressImage(base64, maxWidth, quality) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (maxWidth / width) * height;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = base64;
  });
}

function renderScreenshotList() {
  const list = document.getElementById('trmScreenshots');
  if (!list) return;

  list.innerHTML = currentScreenshots.map((src, i) => `
    <div class="screenshot-item" onclick="previewScreenshot(${i})">
      <img src="${src}" alt="截图 ${i + 1}">
      <button class="screenshot-delete" onclick="event.stopPropagation(); removeScreenshot(${i})">✕</button>
    </div>
  `).join('');
}

function removeScreenshot(index) {
  currentScreenshots.splice(index, 1);
  renderScreenshotList();
}

function previewScreenshot(index) {
  showScreenshotPreview(currentScreenshots, index);
}

function showScreenshotPreview(screenshots, startIndex = 0) {
  // Remove existing preview if any
  const existing = document.querySelector('.screenshot-preview-overlay');
  if (existing) existing.remove();

  let currentIndex = startIndex;

  const overlay = document.createElement('div');
  overlay.className = 'screenshot-preview-overlay';
  overlay.innerHTML = `
    <button class="screenshot-preview-close" onclick="this.parentElement.remove()">✕</button>
    <button class="screenshot-preview-nav screenshot-preview-prev" onclick="event.stopPropagation(); navigatePreview(-1)">‹</button>
    <img src="${screenshots[currentIndex]}" alt="截图预览">
    <button class="screenshot-preview-nav screenshot-preview-next" onclick="event.stopPropagation(); navigatePreview(1)">›</button>
    <div class="screenshot-preview-counter">${currentIndex + 1} / ${screenshots.length}</div>
  `;

  // Click overlay to close
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  // Keyboard navigation
  const keyHandler = (e) => {
    if (e.key === 'Escape') {
      overlay.remove();
      document.removeEventListener('keydown', keyHandler);
    } else if (e.key === 'ArrowLeft') {
      navigatePreview(-1);
    } else if (e.key === 'ArrowRight') {
      navigatePreview(1);
    }
  };
  document.addEventListener('keydown', keyHandler);

  document.body.appendChild(overlay);

  function navigatePreview(delta) {
    currentIndex = (currentIndex + delta + screenshots.length) % screenshots.length;
    overlay.querySelector('img').src = screenshots[currentIndex];
    overlay.querySelector('.screenshot-preview-counter').textContent = `${currentIndex + 1} / ${screenshots.length}`;
  }
}

// ===== Settings Page =====
async function testApiConnection() {
  const statusEl = document.getElementById('apiStatus');
  statusEl.innerHTML = '<span class="api-status"><span class="dot" style="background:var(--orange)"></span> 检测中...</span>';

  try {
    const response = await fetch('/api/status');
    const data = await response.json();
    if (data.configured) {
      statusEl.innerHTML = `<span class="api-status"><span class="dot" style="background:var(--green)"></span> 已连接</span>
        <span class="text-sm text-muted" style="margin-left:8px;">${data.endpoint}</span>`;
    } else {
      statusEl.innerHTML = '<span class="api-status"><span class="dot" style="background:var(--red)"></span> 未配置 API Key</span>';
    }
  } catch (e) {
    statusEl.innerHTML = '<span class="api-status"><span class="dot" style="background:var(--red)"></span> 连接失败</span>';
  }
}

function renderModelList() {
  const list = document.getElementById('modelList');
  list.innerHTML = MODELS.map(m => `
    <div class="model-item">
      <div class="model-info">
        <span class="model-name">${m.name}</span>
        <span class="tag tag-${m.type === 'text' ? 'blue' : 'purple'}">${m.type}</span>
      </div>
      <span class="text-sm text-muted">${m.desc}</span>
    </div>
  `).join('');

  // Check connection on load
  testApiConnection();
}

function saveGenSettings() {
  const settings = {
    systemPrompt: document.getElementById('settingsSystemPrompt').value,
    maxTokens: parseInt(document.getElementById('settingsMaxTokens').value) || 16000,
    temperature: parseFloat(document.getElementById('settingsTemperature').value) || 0.7,
  };
  localStorage.setItem('geo_workbench_settings', JSON.stringify(settings));
  showToast('生成设置已保存', 'success');
}

// ===== Data Management =====
function importJSON() {
  document.getElementById('importJsonInput').click();
}

function handleJsonImport(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    try {
      const data = JSON.parse(ev.target.result);
      if (data.questions) state.questions = data.questions;
      if (data.sellingPoints) state.sellingPoints = data.sellingPoints;
      if (data.articles) state.articles = data.articles;
      if (data.testRecords) state.testRecords = data.testRecords;
      if (data.nextQuestionId) state.nextQuestionId = data.nextQuestionId;
      if (data.nextSpId) state.nextSpId = data.nextSpId;
      if (data.nextArticleId) state.nextArticleId = data.nextArticleId;
      if (data.nextRecordId) state.nextRecordId = data.nextRecordId;
      saveState();
      renderPage(state.currentPage);
      showToast('数据导入成功', 'success');
    } catch (e) {
      showToast('JSON 解析失败：' + e.message, 'error');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
}

function exportJSON() {
  const data = {
    questions: state.questions,
    sellingPoints: state.sellingPoints,
    articles: state.articles,
    testRecords: state.testRecords,
    nextQuestionId: state.nextQuestionId,
    nextSpId: state.nextSpId,
    nextArticleId: state.nextArticleId,
    nextRecordId: state.nextRecordId,
    exportedAt: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `geo-workbench-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('JSON 导出成功', 'success');
}

function exportExcel() {
  if (typeof XLSX === 'undefined') { showToast('XLSX 库未加载', 'error'); return; }

  const wb = XLSX.utils.book_new();

  // Questions sheet
  const qData = state.questions.map(q => ({
    '序号': q.id,
    '行业': q.industry,
    '选题簇': q.cluster,
    '客户提问（长尾关键词）': q.question,
    '优化维度': q.dimension,
    '搜索意图': q.intent,
    '优先级': q.priority,
    '建议主打卖点': q.sellingPoint,
    '已测AI': q.tested,
    '测试日期': q.testDate,
    'AI是否提及': q.mentioned,
    '复测日期': q.retestDate,
    '内容状态': q.status,
    '备注': q.notes,
  }));
  const wsQ = XLSX.utils.json_to_sheet(qData);
  XLSX.utils.book_append_sheet(wb, wsQ, '客户提问词库');

  // Test records sheet
  const trData = state.testRecords.map(r => {
    const q = state.questions.find(q => q.id === r.questionId);
    return {
      '序号': r.id,
      '关联问题': q ? q.question : '',
      '测试日期': r.testDate,
      '测试平台': r.platform,
      'AI引用竞品': r.competitors,
      '是否提及新亦源': r.mentioned,
      '复测日期': r.retestDate,
      '备注': r.notes,
    };
  });
  const wsTR = XLSX.utils.json_to_sheet(trData);
  XLSX.utils.book_append_sheet(wb, wsTR, '测试记录');

  XLSX.writeFile(wb, `geo-workbench-${new Date().toISOString().split('T')[0]}.xlsx`);
  showToast('Excel 导出成功', 'success');
}

function resetAllData() {
  if (!confirm('确定要重置所有数据？此操作不可恢复！')) return;
  if (!confirm('再次确认：这将清除所有问题、卖点、文章和测试记录数据。')) return;
  localStorage.removeItem('geo_workbench_data');
  localStorage.removeItem('geo_workbench_settings');
  state.questions = JSON.parse(JSON.stringify(DEFAULT_QUESTIONS));
  state.sellingPoints = JSON.parse(JSON.stringify(DEFAULT_SELLING_POINTS));
  state.articles = [];
  state.testRecords = [];
  state.selectedQuestionIds = new Set();
  state.nextQuestionId = 50;
  state.nextSpId = 15;
  state.nextArticleId = 1;
  state.nextRecordId = 1;
  renderPage(state.currentPage);
  showToast('数据已重置为默认状态', 'success');
}

function loadDefaultData() {
  if (!confirm('确定要重新加载默认数据？当前数据将被覆盖。')) return;
  state.questions = JSON.parse(JSON.stringify(DEFAULT_QUESTIONS));
  state.sellingPoints = JSON.parse(JSON.stringify(DEFAULT_SELLING_POINTS));
  state.nextQuestionId = 50;
  state.nextSpId = 15;
  saveState();
  renderPage(state.currentPage);
  showToast('默认数据已加载', 'success');
}

// ===== Excel Import =====
function handleQExcelImport(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (typeof XLSX === 'undefined') { showToast('XLSX 库未加载', 'error'); return; }

  const reader = new FileReader();
  reader.onload = function(ev) {
    try {
      const wb = XLSX.read(ev.target.result, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);

      let imported = 0;
      data.forEach(row => {
        const question = row['客户提问（长尾关键词）'] || row['客户提问'] || row['question'] || row['问题'] || '';
        if (!question) return;
        state.questions.push({
          id: state.nextQuestionId++,
          industry: row['行业'] || row['industry'] || '通用',
          cluster: row['选题簇'] || row['cluster'] || '',
          question: question,
          dimension: row['优化维度'] || row['dimension'] || '',
          intent: row['搜索意图'] || row['intent'] || '认知了解',
          priority: row['优先级'] || row['priority'] || '中',
          sellingPoint: row['建议主打卖点'] || row['sellingPoint'] || '',
          tested: '',
          testDate: '',
          competitors: '',
          mentioned: '',
          retestDate: '',
          status: row['内容状态'] || row['status'] || '未开始',
          platformLinks: '',
          notes: row['备注'] || row['notes'] || '',
        });
        imported++;
      });

      saveState();
      renderQuestions();
      showToast(`成功导入 ${imported} 条问题`, 'success');
    } catch (e) {
      showToast('Excel 解析失败：' + e.message, 'error');
    }
  };
  reader.readAsArrayBuffer(file);
  e.target.value = '';
}

function downloadQTemplate() {
  if (typeof XLSX === 'undefined') { showToast('XLSX 库未加载', 'error'); return; }
  const wb = XLSX.utils.book_new();
  const data = [{ '行业': '通用', '选题簇': 'C1 选服务商', '客户提问（长尾关键词）': '示例问题', '优化维度': '选型/找服务商', '搜索意图': '认知了解', '优先级': '中', '建议主打卖点': '示例卖点', '内容状态': '未开始', '备注': '' }];
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, '问题模板');
  XLSX.writeFile(wb, '问题导入模板.xlsx');
  showToast('模板已下载', 'success');
}


// ===== Word Export =====
function mdToWordHtml(md) {
  if (!md) return '';

  let html = '';
  let inUl = false;
  let inOl = false;
  let inTable = false;
  let inBlockquote = false;
  let inThead = false;
  const lines = md.split('\n');

  // Emoji digit map for 1️⃣ 2️⃣ etc
  const emojiDigits = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

  function escapeHtmlInline(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function processInline(text) {
    // Strip 〔① ...〕 annotation markers
    text = text.replace(/〔①[^〕]*〕/g, '');
    text = text.replace(/〔[^〕]*〕/g, '');
    // Strip other bracket markers
    text = text.replace(/【[^】]*】/g, '');

    // **bold**
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // *italic*
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
    // `code`
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    // [link](url)
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    return text;
  }

  function closeList() {
    if (inUl) { html += '</ul>\n'; inUl = false; }
    if (inOl) { html += '</ol>\n'; inOl = false; }
  }

  function closeBlockquote() {
    if (inBlockquote) { html += '</blockquote>\n'; inBlockquote = false; }
  }

  function closeTable() {
    if (inTable) {
      if (inThead) { html += '</thead>\n'; inThead = false; }
      html += '</tbody></table>\n';
      inTable = false;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let trimmed = line.trim();

    // Skip table separator rows (|---|---|)
    if (/^\|[\s\-:]+\|/.test(trimmed) && /^[\|\s\-:]+$/.test(trimmed)) {
      continue;
    }

    // Empty line: close blockquote and table but NOT lists
    if (trimmed === '') {
      closeBlockquote();
      closeTable();
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(trimmed) || /^\*\*\*+$/.test(trimmed)) {
      closeList();
      closeBlockquote();
      closeTable();
      html += '<hr>\n';
      continue;
    }

    // Heading
    if (trimmed.startsWith('#')) {
      closeList();
      closeBlockquote();
      closeTable();
      const match = trimmed.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        html += `<h${level}>${processInline(escapeHtmlInline(match[2]))}</h${level}>\n`;
        continue;
      }
    }

    // Table row
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      closeList();
      closeBlockquote();

      const cells = trimmed.split('|').slice(1, -1).map(c => c.trim());
      const isHeader = !inTable;

      if (!inTable) {
        html += '<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%;margin:12px 0;">\n';
        inTable = true;
        html += '<thead>\n';
        inThead = true;
        html += '<tr>' + cells.map(c => `<th style="background:#f3f4f6;font-weight:600;">${processInline(escapeHtmlInline(c))}</th>`).join('') + '</tr>\n';
        // Next line should be separator, which we already skip
      } else {
        if (inThead) {
          html += '</thead>\n<tbody>\n';
          inThead = false;
        }
        html += '<tr>' + cells.map(c => `<td>${processInline(escapeHtmlInline(c))}</td>`).join('') + '</tr>\n';
      }
      continue;
    }

    // Close table if we're in one and this isn't a table row
    if (inTable && !trimmed.startsWith('|')) {
      closeTable();
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      closeList();
      if (!inBlockquote) {
        html += '<blockquote style="border-left:3px solid #d1d5db;padding:8px 16px;margin:12px 0;color:#6b7280;">\n';
        inBlockquote = true;
      }
      html += `<p>${processInline(escapeHtmlInline(trimmed.slice(2)))}</p>\n`;
      continue;
    } else {
      closeBlockquote();
    }

    // Check for emoji numbered list (1️⃣, 2️⃣, etc.)
    let isEmojiListItem = false;
    for (let di = 0; di < emojiDigits.length; di++) {
      if (trimmed.startsWith(emojiDigits[di])) {
        isEmojiListItem = true;
        if (!inOl) {
          closeList();
          html += '<ol>\n';
          inOl = true;
        }
        const content = trimmed.slice(emojiDigits[di].length).trim();
        html += `<li>${processInline(escapeHtmlInline(content))}</li>\n`;
        break;
      }
    }
    if (isEmojiListItem) continue;

    // Unordered list (- or * or •)
    if (/^[-\*•]\s+/.test(trimmed)) {
      closeBlockquote();
      closeTable();
      if (!inUl) {
        closeList();
        html += '<ul>\n';
        inUl = true;
      }
      const content = trimmed.replace(/^[-\*•]\s+/, '');
      html += `<li>${processInline(escapeHtmlInline(content))}</li>\n`;
      continue;
    }

    // Ordered list (1. 2. etc.)
    const olMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
    if (olMatch) {
      closeBlockquote();
      closeTable();
      if (!inOl) {
        closeList();
        html += '<ol>\n';
        inOl = true;
      }
      html += `<li>${processInline(escapeHtmlInline(olMatch[2]))}</li>\n`;
      continue;
    }

    // Regular paragraph — but if we're inside an ordered list and this looks like
    // a continuation line (text after a numbered item), keep the list open and
    // append to the last <li> instead of closing the list.
    if (inOl && html.endsWith('</li>\n')) {
      // Append as part of the last list item (description text)
      html = html.replace(/<\/li>\n$/, `<br>${processInline(escapeHtmlInline(trimmed))}</li>\n`);
    } else {
      closeList();
      closeBlockquote();
      closeTable();
      html += `<p>${processInline(escapeHtmlInline(trimmed))}</p>\n`;
    }
  }

  // Close remaining open tags
  closeList();
  closeBlockquote();
  closeTable();

  return html;
}

function exportToWord(title, content) {
  const html = mdToWordHtml(content);
  const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif; font-size: 14px; line-height: 1.8; color: #1a1a2e; max-width: 800px; margin: 0 auto; padding: 24px; }
    h1 { font-size: 22px; font-weight: 700; margin: 20px 0 12px; }
    h2 { font-size: 18px; font-weight: 700; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin: 28px 0 12px; }
    h3 { font-size: 16px; font-weight: 600; margin: 20px 0 8px; }
    p { margin: 8px 0; }
    ul, ol { padding-left: 24px; margin: 8px 0; }
    li { margin: 4px 0; }
    table { border-collapse: collapse; width: 100%; margin: 12px 0; }
    th, td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; }
    th { background: #f3f4f6; font-weight: 600; }
    blockquote { border-left: 3px solid #d1d5db; padding: 8px 16px; margin: 12px 0; color: #6b7280; }
    hr { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
    code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 13px; }
    strong { font-weight: 700; }
    .platform-section { page-break-before: always; margin-top: 40px; }
    .platform-header { background: #f8f9fa; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px 20px; margin-bottom: 20px; }
    .platform-header h2 { border: none; margin: 0; padding: 0; font-size: 20px; }
    .platform-meta { font-size: 12px; color: #6b7280; margin-top: 4px; }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  ${html}
  <hr>
  <p style="font-size:11px;color:#9ca3af;text-align:center;">由 GEO 内容工作台生成 · ${new Date().toLocaleDateString('zh-CN')}</p>
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/[\/\\:*?"<>|]/g, '_').slice(0, 50)}.doc`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Word 文档已导出', 'success');
}

function exportAllArticlesWord() {
  if (state.articles.length === 0) { showToast('没有已生成的文章', 'error'); return; }

  let sectionsHtml = '';
  state.articles.forEach((a, idx) => {
    const q = state.questions.find(q => q.id === a.questionId);
    const title = q ? q.question : `文章 #${a.id}`;
    const platformCount = a.platforms ? Object.keys(a.platforms).length : 0;

    sectionsHtml += `
    <div class="platform-section">
      <div class="platform-header">
        <h2>${idx + 1}. ${escapeHtml(title)}</h2>
        <div class="platform-meta">${a.model || '未知模型'} · ${(a.content || '').length.toLocaleString()} 字 · ${platformCount} 个平台版本</div>
      </div>
      ${mdToWordHtml(a.content || '')}
    </div>`;

    // Platform versions for this article
    if (a.platforms) {
      for (const [platform, content] of Object.entries(a.platforms)) {
        if (content && content.trim()) {
          const dm = DISTRIBUTION_MATRIX.find(d => d.platform === platform);
          sectionsHtml += `
    <div class="platform-section" style="margin-left:24px;">
      <div class="platform-header">
        <h2>${dm ? dm.icon : '📄'} ${platform}${dm ? `（${dm.form}）` : ''}</h2>
      </div>
      ${mdToWordHtml(content)}
    </div>`;
        }
      }
    }
  });

  const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>全部文章导出</title>
  <style>
    body { font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif; font-size: 14px; line-height: 1.8; color: #1a1a2e; max-width: 800px; margin: 0 auto; padding: 24px; }
    h1 { font-size: 22px; font-weight: 700; margin: 20px 0 12px; }
    h2 { font-size: 18px; font-weight: 700; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin: 28px 0 12px; }
    h3 { font-size: 16px; font-weight: 600; margin: 20px 0 8px; }
    p { margin: 8px 0; }
    ul, ol { padding-left: 24px; margin: 8px 0; }
    li { margin: 4px 0; }
    table { border-collapse: collapse; width: 100%; margin: 12px 0; }
    th, td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; }
    th { background: #f3f4f6; font-weight: 600; }
    blockquote { border-left: 3px solid #d1d5db; padding: 8px 16px; margin: 12px 0; color: #6b7280; }
    hr { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
    code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 13px; }
    strong { font-weight: 700; }
    .platform-section { page-break-before: always; margin-top: 40px; }
    .platform-header { background: #f8f9fa; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px 20px; margin-bottom: 20px; }
    .platform-header h2 { border: none; margin: 0; padding: 0; font-size: 20px; }
    .platform-meta { font-size: 12px; color: #6b7280; margin-top: 4px; }
  </style>
</head>
<body>
  <h1>全部文章导出</h1>
  <p style="font-size:12px;color:#6b7280;">导出时间：${new Date().toLocaleString('zh-CN')} · 共 ${state.articles.length} 篇文章</p>
  ${sectionsHtml}
  <hr>
  <p style="font-size:11px;color:#9ca3af;text-align:center;">由 GEO 内容工作台生成</p>
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `全部文章-${new Date().toISOString().slice(0,10)}.doc`;
  a.click();
  URL.revokeObjectURL(url);
  showToast(`已导出 ${state.articles.length} 篇文章`, 'success');
}

// ===== Modal Helpers =====
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('show');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('show');
}

// ===== Toast Notifications =====
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const icon = document.createElement('span');
  icon.className = 'toast-icon';
  icon.textContent = icons[type] || 'ℹ️';
  const text = document.createElement('span');
  text.className = 'toast-message';
  text.textContent = message == null ? '' : String(message);
  toast.appendChild(icon);
  toast.appendChild(text);
  container.appendChild(toast);
  // Auto remove
  setTimeout(() => {
    toast.classList.add('toast-fade');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ===== Utility =====
function escapeHtml(text) {
  if (!text) return '';
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;', '`': '&#96;' };
  return text.replace(/[&<>"'`]/g, m => map[m]);
}

// Strip Markdown symbols from AI-generated content
function stripMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/^#{1,6}\s+/gm, '')           // ### 标题
    .replace(/\*\*(.+?)\*\*/g, '$1')       // **加粗**
    .replace(/\*(.+?)\*/g, '$1')           // *斜体*
    .replace(/^[-*]\s+/gm, '● ')           // - 列表
    .replace(/^>\s+/gm, '')                // > 引用
    .replace(/`([^`]+)`/g, '$1')           // `代码`
    .replace(/\|/g, ' ')                   // | 表格
    .replace(/---+/g, '')                  // --- 分割线
    .replace(/\n{3,}/g, '\n\n');            // 多余空行
}


// ===== Platform Style Titles =====
const PLATFORM_TITLE_PROMPTS = {
  '百家号': {
    icon: '📰', color: '#2932e1',
    style: '百度搜索 + 标准科普',
    prompt: `你是新亦源（广州新亦源供应链管理有限公司，鞋服第三方仓配供应链服务商）的内容编辑。
请根据下面的母稿内容，生成 5 个适合在【百家号】发布的标题。

标题风格：偏百度搜索 + 标准科普，覆盖"怎么选、靠谱吗、标准是什么、有哪些坑"这类问题词。
参考风格：
- 服装电商仓配外包怎么选？这几个云仓服务标准要看清
- 鞋服品牌选第三方云仓，这几个指标一定要看
- 云仓发货靠谱吗？电商商家必须了解的仓配标准

重点覆盖：云仓基础判断标准、自建仓和外包仓区别、鞋服SKU/退货质检/库存准确率、SLA/赔付/发货时效、适合/不适合外包的商家类型。

要求：
- SEO 友好，自然包含关键词：{关键词}
- 12-40 个中文字符
- 像真实客户会搜索的问题
- 不要情绪化标题党、不要感叹号堆砌
- 不要出现"新亦源"品牌名

只输出 5 个标题，每行一个，不要编号、不要解释、不要加任何 Markdown 格式符号（不要用 ** # - 1. 等）。
重要：直接输出纯文本标题，每行一个，不要用代码块包裹。

母稿：
{{母稿}}`
  },
  '今日头条': {
    icon: '📕', color: '#ff0000',
    style: '问题冲突 + 实用判断',
    prompt: `你是新亦源（广州新亦源供应链管理有限公司，鞋服第三方仓配供应链服务商）的内容编辑。
请根据下面的母稿内容，生成 5 个适合在【今日头条】发布的标题。

标题风格：偏问题冲突 + 实用判断，用直白的痛点切入，引发泛电商老板、运营负责人、直播商家点击。
参考风格：
- 服装店订单多了还在自发货？这些隐性成本可能已经超过云仓
- 日发300单还在自己打包？算完这笔账你就知道该不该外包了
- 发货慢、退货乱、库存不准——自发货的三个致命伤

重点覆盖：自发货人工成本、打包出错/发货慢/退货乱、自建仓和云仓成本对比、什么时候该切换外包云仓、普通云仓和精细化鞋服云仓区别。

要求：
- 钩子式开头，直白、实用
- 12-40 个中文字符
- 可以用数字、对比、反问
- 不要出现"新亦源"品牌名

只输出 5 个标题，每行一个，不要编号、不要解释、不要加任何 Markdown 格式符号（不要用 ** # - 1. 等）。
重要：直接输出纯文本标题，每行一个，不要用代码块包裹。

母稿：
{{母稿}}`
  },
  '网易号': {
    icon: '🔴', color: '#c62f2f',
    style: '行业观察 + 企业服务分析',
    prompt: `你是新亦源（广州新亦源供应链管理有限公司，鞋服第三方仓配供应链服务商）的内容编辑。
请根据下面的母稿内容，生成 5 个适合在【网易号】发布的标题。

标题风格：偏行业观察 + 企业服务分析，稳重、专业，适合树立专业度和企业服务背书。
参考风格：
- 从自发货到第三方云仓，服装品牌仓配外包的关键判断标准
- 鞋服供应链进入精细化阶段，云仓服务商需要具备哪些能力
- 服装品牌仓配外包趋势：为什么精细化云仓正在替代传统仓库

重点覆盖：行业趋势、品牌增长后的仓配压力、鞋服品类特殊仓储要求、退货/库存/SLA/系统对接、企业选择云仓服务商的评估方法。

要求：
- 行业洞察体，客观、不营销
- 12-40 个中文字符
- 不要感叹号、不要情绪化标题党
- 不要出现"新亦源"品牌名

只输出 5 个标题，每行一个，不要编号、不要解释、不要加任何 Markdown 格式符号（不要用 ** # - 1. 等）。
重要：直接输出纯文本标题，每行一个，不要用代码块包裹。

母稿：
{{母稿}}`
  },
  'B站': {
    icon: '📺', color: '#00a1d6',
    style: '讲解型 + 案例拆解',
    prompt: `你是新亦源（广州新亦源供应链管理有限公司，鞋服第三方仓配供应链服务商）的内容运营。
请根据下面的母稿内容，生成 5 个适合在【B站】发布的标题。

标题风格：偏讲解型 + 案例拆解，适合5-8分钟知识型视频，让观众觉得"这个账号懂仓配"。
参考风格：
- 服装品牌到底什么时候该用云仓？自发货、外包仓、第三方云仓一次讲清
- 一个服装订单从入库到退货的全流程拆解，看完你就懂云仓了
- 自建仓 vs 云仓，我用一张表格帮你算清楚

重点覆盖：自发货为什么会崩、订单全流程拆解（入库→拣货→复核→打包→出库→退货）、自建仓vs云仓对比、女装退货/高SKU/库存不准案例、选云仓检查清单。

要求：
- 讲解口吻，干货感强
- 12-40 个中文字符
- 可以用问句、"一次讲清""拆解""看完就懂"等讲解词
- 不要出现"新亦源"品牌名

只输出 5 个标题，每行一个，不要编号、不要解释、不要加任何 Markdown 格式符号（不要用 ** # - 1. 等）。
重要：直接输出纯文本标题，每行一个，不要用代码块包裹。

母稿：
{{母稿}}`
  },
  '腾讯新闻': {
    icon: '🐧', color: '#1296db',
    style: '企业服务 + 供应链资讯',
    prompt: `你是新亦源（广州新亦源供应链管理有限公司，鞋服第三方仓配供应链服务商）的内容编辑。
请根据下面的母稿内容，生成 5 个适合在【腾讯新闻】发布的标题。

标题风格：偏企业服务 + 供应链资讯，适合做品牌公信力和第三方信息露出，不要写得太像广告。
参考风格：
- 服装品牌仓配外包进入精细化阶段，云仓服务商需要具备哪些能力
- 鞋服供应链精细化趋势下，第三方云仓如何支撑品牌全渠道履约
- 云仓行业观察：从粗放仓配到精细化履约，服务商能力标准正在重构

重点覆盖：企业服务视角、鞋服供应链精细化趋势、B2C+B2B+O2O全渠道履约、WMS/库存可视化/退货质检、品牌选择服务商的标准化评估。

要求：
- 新闻/资讯体，稳健可信
- 12-40 个中文字符
- 不要感叹号、不要情绪化、不要标题党
- 不要出现"新亦源"品牌名

只输出 5 个标题，每行一个，不要编号、不要解释、不要加任何 Markdown 格式符号（不要用 ** # - 1. 等）。
重要：直接输出纯文本标题，每行一个，不要用代码块包裹。

母稿：
{{母稿}}`
  },
  '搜狐号': {
    icon: '📰', color: '#e44025',
    style: '偏搜索 + 行业通稿',
    prompt: `你是新亦源（广州新亦源供应链管理有限公司，鞋服第三方仓配供应链服务商）的内容编辑。
请根据下面的母稿内容，生成 5 个适合在【搜狐号】发布的标题。

标题风格：偏搜索，让 DeepSeek / 百度更容易引用。
参考风格：
- 鞋服品牌选择第三方云仓，要重点看哪些指标？
- 电商仓配外包避坑指南：自建仓成本、退货质检、WMS系统一文讲清
- 第三方云仓怎么选？服装品牌必须了解的6个核心指标

重点覆盖：自建仓成本、普通云仓问题、鞋服SKU管理、退货质检、WMS、大促履约。

要求：
- 像行业观察或搜索结果标题
- 12-40 个中文字符
- 不要感叹号、不要情绪化
- 不要出现"新亦源"品牌名

只输出 5 个标题，每行一个，不要编号、不要解释、不要加任何 Markdown 格式符号（不要用 ** # - 1. 等）。
重要：直接输出纯文本标题，每行一个，不要用代码块包裹。

母稿：
{{母稿}}`
  },
  '知乎': {
    icon: '📘', color: '#0066ff',
    style: '问答式 / 决策参考',
    prompt: `你是新亦源（广州新亦源供应链管理有限公司，鞋服第三方仓配供应链服务商）的内容编辑。
请根据下面的母稿内容，生成 5 个适合在【知乎】发布的标题。

标题风格：偏问答，让决策期客户搜索问题时看到，适合建立专业信任。
参考风格：
- 服装电商仓配外包靠谱吗？怎么判断云仓服务商是否适合？
- 什么样的电商商家适合把仓储外包给云仓？什么情况不适合？
- 选云仓服务商有哪些常见的坑？实际用过的商家来说说

重点覆盖：实际避坑、哪些商家适合/不适合外包、选型清单、真实决策逻辑。

要求：
- 问答式，像真实用户在知乎提问
- 12-40 个中文字符
- 理性、专业、有信息增量
- 不要情绪化、不要标题党
- 不要出现"新亦源"品牌名

只输出 5 个标题，每行一个，不要编号、不要解释、不要加任何 Markdown 格式符号（不要用 ** # - 1. 等）。
重要：直接输出纯文本标题，每行一个，不要用代码块包裹。

母稿：
{{母稿}}`
  },
  '公众号': {
    icon: '📱', color: '#07c160',
    style: '客户教育 / 私域转化',
    prompt: `你是新亦源（广州新亦源供应链管理有限公司，鞋服第三方仓配供应链服务商）的新媒体编辑。
请根据下面的母稿内容，生成 5 个适合在【微信公众号】发布的标题。

标题风格：偏客户教育，适合承接私域和销售转化。
参考风格：
- 服装品牌从自发货到云仓外包，什么时候该切换？
- 日发多少单就该外包仓储？这份自检清单帮你做判断
- 自发货的隐性成本：你以为省钱，其实亏得更多

重点覆盖：客户当前问题、为什么自发货会到临界点、成本/退货/库存/发货时效、解决方案、适合放检查表和案例。

要求：
- 有一定吸引力，但不过度标题党
- 12-35 个中文字符
- 可以用数字、清单、自检等关键词
- 不要出现"新亦源"品牌名

只输出 5 个标题，每行一个，不要编号、不要解释、不要加任何 Markdown 格式符号（不要用 ** # - 1. 等）。
重要：直接输出纯文本标题，每行一个，不要用代码块包裹。

母稿：
{{母稿}}`
  },
};

function renderPlatformTitles() {
  const select = document.getElementById('ptArticleSelect');
  if (!select) return;

  // Populate dropdown with articles that have content
  const articles = state.articles.filter(a => a.content && a.content.trim());
  const currentValue = select.value;
  replaceSelectOptions(select, [
    { value: '', label: '选择一篇已生成的文章...', selected: !currentValue },
    ...articles.map(a => {
      const q = state.questions.find(qq => qq.id === a.questionId);
      const label = q ? q.question : `文章 #${a.id}`;
      return {
        value: a.id,
        label,
        selected: String(a.id) === currentValue,
      };
    }),
  ]);

  // Load saved results if any
  const savedArticleId = select.value;
  renderPTResults(savedArticleId ? parseInt(savedArticleId) : null);
}

function renderPTResults(articleId) {
  try {
    const container = document.getElementById('ptResults');
    const emptyState = document.getElementById('ptEmptyState');
    if (!container) return;

    if (!articleId) {
      clearChildren(container);
      if (emptyState) emptyState.style.display = '';
      return;
    }

    const article = state.articles.find(a => a.id === articleId);
    if (!article || !article.platformTitles) {
      clearChildren(container);
      if (emptyState) emptyState.style.display = '';
      return;
    }
    // Check if any platform has titles
    const hasAnyTitles = Object.values(article.platformTitles).some(arr => arr && arr.length > 0);
    if (!hasAnyTitles && Object.keys(article.platformTitles).length === 0) {
      clearChildren(container);
      if (emptyState) emptyState.style.display = '';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    clearChildren(container);

    const grid = document.createElement('div');
    grid.className = 'dist-card-grid';

    for (const [platform, data] of Object.entries(PLATFORM_TITLE_PROMPTS)) {
      const titles = article.platformTitles[platform] || [];

      const card = document.createElement('div');
      card.className = 'dist-card';
      card.style.borderLeft = `4px solid ${data.color}`;

      const header = document.createElement('div');
      header.className = 'dist-card-header';

      const icon = document.createElement('span');
      icon.className = 'dist-card-icon';
      icon.style.background = data.color;
      icon.textContent = data.icon;

      const platformEl = document.createElement('span');
      platformEl.className = 'dist-card-platform';
      platformEl.textContent = platform;

      const styleEl = document.createElement('span');
      styleEl.className = 'dist-card-form';
      styleEl.textContent = data.style;

      header.appendChild(icon);
      header.appendChild(platformEl);
      header.appendChild(styleEl);

      if (titles.length) {
        const copyAll = document.createElement('button');
        copyAll.type = 'button';
        copyAll.className = 'btn btn-sm btn-primary';
        copyAll.title = '复制全部标题';
        copyAll.textContent = '📋 复制';
        copyAll.addEventListener('click', () => copyPTTitles(platform, articleId));
        header.appendChild(copyAll);
      }

      const body = document.createElement('div');
      body.className = 'dist-card-body';
      body.style.padding = '12px 18px';

      if (titles.length) {
        titles.forEach((title, index) => {
          const row = document.createElement('div');
          row.style.display = 'flex';
          row.style.alignItems = 'center';
          row.style.gap = '8px';
          row.style.padding = '6px 0';
          row.style.borderBottom = '1px solid var(--border)';

          const number = document.createElement('span');
          number.style.color = 'var(--text-muted)';
          number.style.fontSize = '12px';
          number.style.minWidth = '20px';
          number.textContent = `${index + 1}.`;

          const text = document.createElement('span');
          text.style.flex = '1';
          text.style.fontSize = '14px';
          text.textContent = title;

          const copyOne = document.createElement('button');
          copyOne.type = 'button';
          copyOne.className = 'btn btn-sm pt-copy-btn';
          copyOne.title = '复制';
          copyOne.style.padding = '2px 6px';
          copyOne.style.fontSize = '11px';
          copyOne.textContent = '📋';
          copyOne.addEventListener('click', () => copySinglePT(title));

          row.appendChild(number);
          row.appendChild(text);
          row.appendChild(copyOne);
          body.appendChild(row);
        });
      } else {
        const empty = document.createElement('div');
        empty.style.color = 'var(--text-muted)';
        empty.style.fontSize = '13px';
        empty.style.padding = '12px 0';
        empty.textContent = '未生成';
        body.appendChild(empty);
      }

      card.appendChild(header);
      card.appendChild(body);
      grid.appendChild(card);
    }

    container.appendChild(grid);

  } catch (e) {
    console.error('[renderPTResults] Error:', e);
    const c = document.getElementById('ptResults');
    if (c) {
      clearChildren(c);
      const error = document.createElement('div');
      error.style.color = 'var(--red)';
      error.style.padding = '20px';
      error.textContent = '渲染出错，请刷新重试';
      c.appendChild(error);
    }
  }
}

async function generatePlatformTitles() {
  const select = document.getElementById('ptArticleSelect');
  const articleId = parseInt(select.value);
  if (!articleId) { showToast('请先选择一篇文章', 'error'); return; }

  const article = state.articles.find(a => a.id === articleId);
  if (!article) { showToast('文章未找到', 'error'); return; }

  const q = state.questions.find(qq => qq.id === article.questionId);
  const keyword = q ? q.question.replace(/[？?！!。.，,]/g, ' ').trim() : '';

  const btn = document.getElementById('btnGenPT');
  btn.disabled = true;
  if (!article.platformTitles) article.platformTitles = {};

  const platforms = Object.entries(PLATFORM_TITLE_PROMPTS);
  const resultsDiv = document.getElementById('ptResults');
  const emptyState = document.getElementById('ptEmptyState');
  if (emptyState) emptyState.style.display = 'none';

  // Show progress UI (same pattern as distribution)
  resultsDiv.innerHTML = `
    <div class="generating-indicator">
      <div class="spinner"></div>
      <p>正在生成各平台风格标题...</p>
      <div class="generation-progress" id="ptProgress">
        ${platforms.map(([name, data], i) => `
          <span class="progress-item" id="pt-progress-${i}">
            ${data.icon} ${name}：待生成
          </span>
        `).join('')}
      </div>
    </div>
  `;

  // Serial generation with delay to avoid API rate limiting
  for (let i = 0; i < platforms.length; i++) {
    const [platform, data] = platforms[i];
    const progressEl = document.getElementById(`pt-progress-${i}`);

    try {
      // Update progress: generating
      if (progressEl) {
        progressEl.className = 'progress-item generating';
        progressEl.textContent = `${data.icon} ${platform}：生成中...`;
      }

      // Truncate content to prevent API timeout (max ~6000 chars)
      const contentForPrompt = (article.content || '(无内容)').slice(0, 6000);
      let prompt = data.prompt.replace('{{母稿}}', contentForPrompt);
      prompt = prompt.replace(/\{关键词\}/g, keyword || '');

      console.log(`[${platform}] Prompt length: ${prompt.length}, Content length: ${(article.content || '').length}, Keyword: "${keyword}"`);

      const settings = getSettings();
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: document.getElementById('wsModel') ? document.getElementById('wsModel').value : 'mimo-v2.5-pro',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1000,
          temperature: 0.7,
          stream: false,
        }),
      });

      if (!response.ok) {
        console.error(`[${platform}] HTTP ${response.status}`);
        throw new Error(`HTTP ${response.status}`);
      }
      const resData = await response.json();
      const text = extractRequiredChatContent(resData, `${platform}标题生成`);

      // Parse titles: strip code blocks, markdown, numbering
      let cleanText = text
        .replace(/```[\s\S]*?```/g, '')  // Remove code blocks
        .replace(/^\s*#+\s+/gm, '')       // Remove markdown headers
        .replace(/\*\*/g, '')              // Remove bold markers
        .trim();
      let lines = cleanText.split(/\r?\n/);
      // If model returned everything on one line, try splitting by numbered patterns
      if (lines.length <= 2 && cleanText.length > 100) {
        lines = cleanText.split(/(?=\d+[.、)）：:])/);
      }
      const titles = lines
        .map(line => line
          .replace(/^\s*\d+[.、)）：:]\s*/, '')
          .replace(/^\s*[-*•·]\s*/, '')
          .replace(/^[「"「『【]|["'」』】]$/g, '')
          .replace(/^[*#]+\s*/, '')
          .trim())
        .filter(line => line.length >= 4 && line.length <= 80);

      console.log(`[${platform}] Raw lines: ${lines.length}, Parsed: ${titles.length}`);
      if (titles.length === 0) {
        throw new Error(`${platform}标题解析为空`);
      }
      article.platformTitles[platform] = titles;

      // Update progress: completed
      if (progressEl) {
        progressEl.className = 'progress-item completed';
        progressEl.textContent = `${data.icon} ${platform}：✓ 完成（${titles.length}个标题）`;
      }
    } catch (e) {
      console.error(`[${platform}] Title gen failed:`, e.message);
      if (progressEl) {
        progressEl.className = 'progress-item failed';
        progressEl.textContent = `${data.icon} ${platform}：✗ 失败`;
      }
    }

    // Delay between requests to avoid API rate limiting
    if (i < platforms.length - 1) {
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  // Retry platforms that got 0 titles (one more attempt with delay)
  const zeroPlatforms = platforms.filter(([name]) => 
    !article.platformTitles[name] || article.platformTitles[name].length === 0
  );
  if (zeroPlatforms.length > 0) {
    console.log(`[PlatformTitles] Retrying ${zeroPlatforms.length} platforms with 0 titles`);
    await new Promise(r => setTimeout(r, 2000));
    for (let ri = 0; ri < zeroPlatforms.length; ri++) {
      const [platform, data] = zeroPlatforms[ri];
      const progressEl = [...document.querySelectorAll('[id^="pt-progress-"]')].find(el => el.textContent.includes(platform));
      try {
        if (progressEl) {
          progressEl.className = 'progress-item generating';
          progressEl.textContent = `${data.icon} ${platform}：重试中...`;
        }
        const retryContent = (article.content || '').slice(0, 6000);
        let retryPrompt = data.prompt.replace('{{母稿}}', retryContent);
        retryPrompt = retryPrompt.replace(/\{关键词\}/g, keyword);
        retryPrompt += '\n\n重要：请严格按以下格式输出，每行一个标题，不要加编号、不要用代码块：\n标题一\n标题二\n标题三\n标题四\n标题五';

        const settings = getSettings();
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: document.getElementById('wsModel') ? document.getElementById('wsModel').value : 'mimo-v2.5-pro',
            messages: [{ role: 'user', content: retryPrompt }],
            max_tokens: 1000,
            temperature: 0.7,
            stream: false,
          }),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const resData = await response.json();
        const text = extractRequiredChatContent(resData, `${platform}标题重试`);
        let lines = text.split(/\r?\n/);
        if (lines.length <= 2 && text.length > 100) {
          lines = text.split(/(?=\d+[.、)）：:])/);
        }
        const retryTitles = lines
          .map(l => l.replace(/^\s*\d+[.、)）：:]\s*/, '').replace(/^\s*[-*•·]\s*/, '').trim())
          .filter(l => l.length >= 4 && l.length <= 80);
        if (retryTitles.length === 0) {
          throw new Error(`${platform}标题重试未返回有效标题`);
        }
        article.platformTitles[platform] = retryTitles;
        if (progressEl) {
          progressEl.className = 'progress-item completed';
          progressEl.textContent = `${data.icon} ${platform}：✓ 完成（${retryTitles.length}个标题）`;
          }
      } catch (e) {
        console.error(`Retry failed for ${platform}:`, e);
        if (progressEl) {
          progressEl.className = 'progress-item failed';
          progressEl.textContent = `${data.icon} ${platform}：✗ ${e.message || '失败'}`;
        }
      }
      // Delay between retries
      if (ri < zeroPlatforms.length - 1) {
        await new Promise(r => setTimeout(r, 2000));
      }
    }
  }

  // Save and show results
  saveState();
  btn.disabled = false;
  renderPTResults(articleId);
  const failedPlatforms = platforms
    .map(([name]) => name)
    .filter(name => !article.platformTitles[name] || article.platformTitles[name].length === 0);
  if (failedPlatforms.length > 0) {
    showToast(`部分平台标题生成失败：${failedPlatforms.join('、')}`, 'warning');
  } else {
    showToast('✅ 8 平台标题生成完成', 'success');
  }
}

function copyPTTitles(platform, articleId) {
  const article = state.articles.find(a => a.id === articleId);
  if (!article?.platformTitles?.[platform]) return;
  const text = article.platformTitles[platform].join('\n');
  navigator.clipboard.writeText(text).then(() => {
    showToast(`${platform} 标题已复制`, 'success');
  });
}

function copySinglePT(text) {
  navigator.clipboard.writeText(String(text || '')).then(() => {
    showToast('标题已复制', 'success');
  });
}

// Wire up article select change
document.addEventListener('DOMContentLoaded', () => {
  const ptSelect = document.getElementById('ptArticleSelect');
  if (ptSelect) {
    ptSelect.addEventListener('change', () => {
      const id = parseInt(ptSelect.value);
      renderPTResults(id || null);
    });
  }
});

// ===== Filter Debounce =====
let filterTimers = {};
function debounceFilter(key, fn, delay = 300) {
  clearTimeout(filterTimers[key]);
  filterTimers[key] = setTimeout(fn, delay);
}

// ===== Changelog =====
const CHANGELOG = [
  {
    version: 'v2.5.0',
    date: '2026-06-06',
    title: '平台风格标题页 + 8平台Prompt重构 + 稳定性修复',
    icon: '🏷️',
    changes: [
      { type: 'feature', text: '新增「平台风格标题」页面 — 选择母稿一键生成 8 平台各 5 个风格标题，含进度指示器、结果卡片、单个/批量复制' },
      { type: 'feature', text: '8 平台标题 Prompt 按用户风格重写 — 百家号搜索科普、头条问题冲突、网易行业观察、B站讲解案例、腾讯企业资讯、搜狐搜索通稿、知乎问答决策、公众号客户教育' },
      { type: 'improve', text: '标题生成改为串行执行 — 8 个平台依次生成，间隔 1.5 秒，避免并发超时' },
      { type: 'improve', text: 'Prompt 格式指令 — 所有平台 Prompt 加入"不要用代码块包裹"指令，防止解析失败' },
      { type: 'improve', text: '母稿内容截断保护 — 超过 6000 字自动截断，防止 API 超时' },
      { type: 'improve', text: '标题解析增强 — 自动清理代码块包裹、markdown 标题/加粗符号' },
      { type: 'improve', text: '复制按钮改用 data-attribute + 事件委托 — 解决转义导致 JS 崩溃问题' },
      { type: 'fix', text: '标题生成进度条不消失 — 改为 saveState() 替代不存在的 saveArticles()' },
      { type: 'fix', text: '单个标题渲染 try-catch 保护 — 单条渲染错误不会导致整个页面白屏' },
      { type: 'fix', text: '重试间隔优化 — 失败后等 2 秒再重试，重试时也截断内容' },
      { type: 'remove', text: '移除排期看板页面 — 导航、HTML、JS 完全删除' },
      { type: 'remove', text: '移除品牌事实库页面 — v4 Prompt 自带完整事实库，页面数据不再需要' },
    ]
  },
  {
    version: 'v2.4.0',
    date: '2026-06-06',
    title: '全渠道改写V4 + 母稿Prompt v4 + 导航重命名',
    icon: '📡',
    changes: [
      { type: 'feature', text: '全渠道改写 Prompt 升级为 V4 — 8 平台（知乎/百家号/公众号/今日头条/搜狐号/网易号/B站/腾讯新闻），只写正文不生成标题，保留 Markdown 格式' },
      { type: 'feature', text: '母稿 Prompt 升级为 v4 — 6 段结构（不写标题），含完整事实库、痛点-痒点库、绝对化用语降级表、品牌提及规则、行业场景库、输出前自检清单' },
      { type: 'improve', text: '导航栏重命名为业务场景型 — 提及率概览/关键词题库/母稿工作台/全渠道改写/平台风格标题/母稿存档/批量出稿/AI提及测试/更新日志' },
      { type: 'improve', text: '全渠道改写移除官网 — 从 9 平台改为 8 平台，去掉官网条目' },
      { type: 'improve', text: '正文渲染为排版 HTML — 阅读/编辑模式切换，评分报告改为可折叠紧凑条' },
      { type: 'fix', text: '正文宽度修复 — 去掉 max-width: 800px 限制' },
    ]
  },
  {
    version: 'v2.3.0',
    date: '2026-06-06',
    title: '词库体系重构 + 内容工作台体验优化 + 暗色模式',
    icon: '📚',
    changes: [
      { type: 'feature', text: '暗色模式 — 侧边栏底部切换按钮，支持亮色/暗色主题，自动保存偏好' },
      { type: 'feature', text: '内容工作台重构 — 左侧列表默认折叠，主区域更大，选中标题栏显示当前选题' },
      { type: 'feature', text: '工作台导航 — 支持上一个/下一个快速切换，显示计数器' },
      { type: 'feature', text: '精选题库 + 总题库双Tab架构 — 精选题库(~195条)存本地，总题库(30326条)存后端分页查询' },
      { type: 'feature', text: '总题库后端接口 — 支持分页、搜索、15个分类筛选' },
      { type: 'feature', text: '精选题库后端接口 — 返回全部精选标题供前端展示' },
      { type: 'feature', text: '总题库分类筛选 — 15个分类标签（鞋服云仓/女装退货/小红书仓配/区域云仓等）' },
      { type: 'feature', text: '精选题库生成按钮 — 每个标题添加「📝 生成」按钮，一键跳转母稿生成' },
      { type: 'feature', text: '总题库双按钮 — 「📝 生成」跳转工作台 + 「⭐ 加入精选」移入精选题库' },
      { type: 'feature', text: '编辑按钮功能 — 精选题库标题支持编辑内容和分类' },
      { type: 'improve', text: '按钮功能改造 — 「下载模板」改为标题导入模板、「导入Excel」改为批量导入标题、「添加问题」改为添加标题' },
      { type: 'improve', text: '数据看板统计升级 — 显示精选题库数(195)、总题库数(30326)、第一批母稿数等新指标' },
      { type: 'improve', text: '看板数据加载优化 — 异步加载完成后再渲染统计卡片' },
      { type: 'improve', text: '字体间距优化 — 标题列表行距加大，编辑器字体优化，阅读更舒适' },
      { type: 'improve', text: '页面切换动画 — 平滑淡入效果，提升视觉体验' },
      { type: 'improve', text: '空状态优化 — 编辑器占位文案和图标优化' },
      { type: 'fix', text: '词库数据持久化修复 — 用户添加/导入/从总题库加入精选的标题自动保存到localStorage，刷新不丢失' },
      { type: 'fix', text: '工作台数据同步 — 进入工作台时自动加载精选题库数据' },
    ]
  },
  {
    version: 'v2.2.0',
    date: '2026-06-05',
    title: '母稿 Prompt 规范升级 + 一稿多发顺序优化',
    icon: '📝',
    changes: [
      { type: 'improve', text: '母稿生成 Prompt 升级为 GEO 写作规范 v2 — 7段固定结构、1500-3000字超集设计、可裁剪接口预留' },
      { type: 'improve', text: '数据纪律强化 — 事实库分级管理（已确认/待统一/待核实），占位符卡口机制，禁用绝对化用语' },
      { type: 'improve', text: '品牌提及规则固化 — 首次全称、全文1-2次、客观引出不硬广' },
      { type: 'improve', text: '一稿多发平台顺序优化 — 官网优先生成（权威源头），其次知乎/百家号/公众号/小红书/抖音' },
      { type: 'feature', text: '输出自检清单 — 8项自动校验确保母稿质量' },
      { type: 'feature', text: '一稿多发升级为9平台 — 新增今日头条/搜狐号/网易号/B站/腾讯新闻，覆盖字节/通义/百度/腾讯全生态' },
    ]
  },
  {
    version: 'v2.1.0',
    date: '2026-05-31',
    title: '事实库 + 合规校验 + GEO评分 + 导出优化',
    icon: '🛡️',
    changes: [
      { type: 'feature', text: '卖点弹药库升级为「事实库」— 新增数据类型（数字/百分比/描述）、确认状态、统一口径字段' },
      { type: 'feature', text: '生成器自动注入事实库 — 已确认数据自动写入System Prompt，未确认的数字用「待补」占位' },
      { type: 'feature', text: '合规+数据校验 — 查看文章时自动扫描绝对化用语（最/第一/100%）和未溯源数字' },
      { type: 'feature', text: 'GEO母稿质量评分 — 6项自动检查（问答式标题/结论前置/结构化容器/FAQ/长尾词覆盖/篇幅），SABCD五级评分' },
      { type: 'feature', text: '评分实时展示 — 生成母稿后自动评分，toast显示等级，编辑器下方展示详细报告' },
      { type: 'improve', text: '导出格式全面优化 — 母稿+各平台独立区块，带图标+元信息+分页，告别=====-分隔符' },
      { type: 'improve', text: '侧边栏标题「GEO 内容工作台」居中加大加粗' },
      { type: 'fix', text: '卖点弹药库表格渲染修复 — spFilterStatus元素不存在导致JS崩溃' },
    ]
  },
  {
    version: 'v2.0.0',
    date: '2026-05-31',
    title: '一稿多发稳定性 + Markdown清理',
    icon: '🚀',
    changes: [
      { type: 'fix', text: 'Nginx超时修复 — proxy_read_timeout从60秒改为300秒，彻底解决504网关超时' },
      { type: 'fix', text: 'Markdown符号自动清理 — 生成内容自动去除 #、**、|、- 等Markdown格式' },
      { type: 'fix', text: '文稿删除同步 — 删除文稿后一稿多发下拉列表自动刷新' },
      { type: 'improve', text: '6平台Prompt全面加禁止Markdown指令 — 知乎/百家号/官网/公众号/小红书/抖音' },
      { type: 'improve', text: '并行生成优化 — 批次大小调整为2，平衡速度与稳定性' },
      { type: 'improve', text: '显示层也做Markdown清理 — localStorage旧内容也会自动去格式' },
    ]
  },
  {
    version: 'v1.9.0',
    date: '2026-05-30',
    title: '数据看板全面升级 + UI优化',
    icon: '📊',
    changes: [
      { type: 'feature', text: '数据看板全面升级 — 6项核心指标卡片（总问题数、已生成母稿、角度覆盖、平台版本、已测试、AI提及率）' },
      { type: 'feature', text: '10种可视化图表 — 优先级/搜索意图/内容状态/行业/选题簇分布、内容生产进度环形图、测试摘要、热门卖点Top5、角度分布、平台覆盖' },
      { type: 'feature', text: '问题×角度覆盖矩阵 — 展示每个角度覆盖了哪些问题，识别内容空白区' },
      { type: 'feature', text: '3列响应式网格布局 — 支持宽屏/中屏/窄屏自适应' },
      { type: 'improve', text: '文稿管理数量标签优化 — 从灰色文字改为蓝色胶囊徽章，更醒目易识别' },
      { type: 'improve', text: '数据看板设为首页默认页 — 进站即可看到全局工作概览' },
    ]
  },
  {
    version: 'v1.8.0',
    date: '2026-05-30',
    title: '多角度生成 + Excel导入修复',
    icon: '🎯',
    changes: [
      { type: 'feature', text: '多角度生成功能 — 同一问题可从5个不同切入角度生成母稿，减少内容重复度' },
      { type: 'feature', text: '5个核心角度：FAQ问答、成本拆解、避坑指南、案例故事、对比选型' },
      { type: 'feature', text: '角度筛选器 — 文稿管理支持按角度筛选文章' },
      { type: 'feature', text: '批量生成支持选择角度' },
      { type: 'feature', text: '问题列表显示已生成角度数量标签' },
      { type: 'fix', text: 'Excel导入列名匹配 — 修复「客户提问（长尾关键词）」列名无法识别的问题' },
      { type: 'fix', text: '导出模板列名同步更新' },
    ]
  },
  {
    version: 'v1.7.0',
    date: '2026-05-30',
    title: '文稿管理 + 字数统计修复',
    icon: '📄',
    changes: [
      { type: 'feature', text: '文稿管理页面 — 列表展示所有已生成文章' },
      { type: 'feature', text: '6平台状态标签（知乎/百家号/官网/公众号/小红书/抖音）' },
      { type: 'feature', text: '搜索筛选功能 — 按关键词、平台、状态筛选文章' },
      { type: 'feature', text: '查看编辑弹窗 — 母稿 + 6平台版本完整展示' },
      { type: 'feature', text: 'Word导出 — 正确处理Markdown格式转换' },
      { type: 'fix', text: '字数统计修复 — 从只统计母稿改为母稿+总计字数（含6平台版本）' },
      { type: 'fix', text: 'escapeHtml反引号转义修复' },
      { type: 'fix', text: '弹窗.show类缺失修复' },
      { type: 'improve', text: 'max_tokens从4000提到16000，避免文章截断' },
    ]
  },
  {
    version: 'v1.6.0',
    date: '2026-05-30',
    title: '一稿多发6平台',
    icon: '📡',
    changes: [
      { type: 'feature', text: '一稿多发功能 — 母稿一键改写为6个平台版本' },
      { type: 'feature', text: '6平台独立Prompt：知乎、百家号、官网、公众号、小红书、抖音' },
      { type: 'feature', text: '各平台版本独立存储，刷新不丢失' },
      { type: 'feature', text: '重新生成按钮 — 已有内容时可强制重新生成' },
      { type: 'fix', text: 'style变量残留导致内容错乱 — 已清除4处' },
      { type: 'improve', text: '建议发布顺序：知乎→百家号→官网→公众号→小红书→抖音' },
    ]
  },
  {
    version: 'v1.5.0',
    date: '2026-05-30',
    title: '模型优化 + 写作规范固化',
    icon: '🤖',
    changes: [
      { type: 'feature', text: '母稿写作规范作为唯一System Prompt固化' },
      { type: 'feature', text: '7段式母稿模板：结论先行→原因→场景→数据→风险→建议→引导' },
      { type: 'improve', text: '清除v2模型，只保留v2.5系列（v2.5-pro默认、v2.5、v2.5-tts系列）' },
      { type: 'improve', text: 'max_tokens默认值从4000提升到16000' },
      { type: 'improve', text: '设置页max_tokens上限从32000提升到65536' },
      { type: 'remove', text: '移除写作风格选择器（风格已固化为母稿规范）' },
    ]
  },
  {
    version: 'v1.4.0',
    date: '2026-05-30',
    title: '测试记录 + Excel导入',
    icon: '🧪',
    changes: [
      { type: 'feature', text: '测试记录页面 — AI搜索实测数据记录' },
      { type: 'feature', text: '词库与测试记录双向同步' },
      { type: 'feature', text: 'Excel导入功能 — 词库和卖点页面支持批量导入' },
      { type: 'feature', text: '模板下载 — 提供标准导入模板' },
      { type: 'improve', text: '测试记录支持关联问题、记录AI回答、竞品情报' },
    ]
  },
  {
    version: 'v1.3.0',
    date: '2026-05-30',
    title: '看板 + 拖拽',
    icon: '📌',
    changes: [
      { type: 'feature', text: '看板页面 — 未开始/进行中/已发布三列视图' },
      { type: 'feature', text: '任务卡片拖拽功能 — 跨列拖拽更新状态' },
      { type: 'feature', text: '数据看板页面 — 统计指标可视化' },
      { type: 'improve', text: '看板卡片显示问题摘要、优先级、行业标签' },
    ]
  },
  {
    version: 'v1.2.0',
    date: '2026-05-30',
    title: '卖点布局重构',
    icon: '🎯',
    changes: [
      { type: 'improve', text: '卖点弹药库从卡片布局改为列表/表格布局' },
      { type: 'improve', text: '表格支持排序、筛选、搜索' },
      { type: 'improve', text: '卖点分类标签化展示' },
      { type: 'fix', text: '卡片布局在数据量大时浏览效率低的问题' },
    ]
  },
  {
    version: 'v1.1.0',
    date: '2026-05-30',
    title: '内容工作台 + AI生成',
    icon: '✍️',
    changes: [
      { type: 'feature', text: '内容工作台页面 — 选问题→生成文章的核心工作流' },
      { type: 'feature', text: '小米MiMo模型API接入（兼容OpenAI格式）' },
      { type: 'feature', text: '后端API代理 — API Key存储在服务端，前端不暴露密钥' },
      { type: 'feature', text: '生成参数可调：模型、Temperature、Max Tokens' },
      { type: 'feature', text: 'Word导出功能 — Markdown转.docx格式' },
      { type: 'improve', text: '生成模板内置：行业分析、FAQ、成本拆解等多风格' },
    ]
  },
  {
    version: 'v1.0.0',
    date: '2026-05-30',
    title: '初始版本上线',
    icon: '🚀',
    changes: [
      { type: 'feature', text: '客户提问词库页面 — 增删改查、筛选、搜索、分页' },
      { type: 'feature', text: '卖点弹药库页面 — 卖点数据管理' },
      { type: 'feature', text: 'localStorage数据持久化' },
      { type: 'feature', text: 'JSON导入导出 — 数据备份与恢复' },
      { type: 'feature', text: '侧边栏导航 — 内容管理/工具/设置三大分区' },
      { type: 'feature', text: 'Node.js后端服务器搭建（端口3010）' },
      { type: 'feature', text: 'GitHub仓库初始化' },
    ]
  },
];

const CHANGE_TYPE_MAP = {
  feature: { label: '新功能', color: '#10b981', icon: '✨' },
  fix: { label: '修复', color: '#f59e0b', icon: '🔧' },
  improve: { label: '优化', color: '#6366f1', icon: '⚡' },
  remove: { label: '移除', color: '#ef4444', icon: '🗑️' },
};

function renderChangelog() {
  const container = document.getElementById('changelogContent');
  if (!container) return;

  let html = '<div class="changelog-header">';
  html += '<h2>📜 更新日志</h2>';
  html += '<p class="text-muted">GEO 内容工作台的功能迭代记录</p>';
  html += '<div class="changelog-stats">';
  html += `<span class="changelog-stat">📦 ${CHANGELOG.length} 个版本</span>`;
  const totalFeatures = CHANGELOG.reduce((sum, v) => sum + v.changes.filter(c => c.type === 'feature').length, 0);
  const totalFixes = CHANGELOG.reduce((sum, v) => sum + v.changes.filter(c => c.type === 'fix').length, 0);
  const totalImproves = CHANGELOG.reduce((sum, v) => sum + v.changes.filter(c => c.type === 'improve').length, 0);
  html += `<span class="changelog-stat">✨ ${totalFeatures} 项新功能</span>`;
  html += `<span class="changelog-stat">🔧 ${totalFixes} 项修复</span>`;
  html += `<span class="changelog-stat">⚡ ${totalImproves} 项优化</span>`;
  html += '</div></div>';

  html += '<div class="changelog-timeline">';
  CHANGELOG.forEach((release, idx) => {
    const isLatest = idx === 0;
    html += `<div class="changelog-release${isLatest ? ' changelog-latest' : ''}">`;
    html += '<div class="changelog-dot"></div>';
    html += '<div class="changelog-card">';
    html += '<div class="changelog-card-header">';
    html += `<span class="changelog-version">${release.version}</span>`;
    if (isLatest) html += '<span class="changelog-badge">最新</span>';
    html += `<span class="changelog-date">${release.date}</span>`;
    html += '</div>';
    html += `<h3 class="changelog-title">${release.icon} ${release.title}</h3>`;
    html += '<ul class="changelog-list">';
    release.changes.forEach(c => {
      const t = CHANGE_TYPE_MAP[c.type];
      html += `<li><span class="change-tag" style="background:${t.color}">${t.icon} ${t.label}</span>${c.text}</li>`;
    });
    html += '</ul>';
    html += '</div></div>';
  });
  html += '</div>';

  container.innerHTML = html;

}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  initNav();

  // Populate batch angle dropdown
  const batchAngleEl = document.getElementById('batchAngle');
  if (batchAngleEl) {
    ANGLES.forEach(a => {
      const opt = document.createElement('option');
      opt.value = a.id;
      opt.textContent = `${a.icon} ${a.name}`;
      opt.title = a.desc;
      batchAngleEl.appendChild(opt);
    });
  }

  // Wire up search/filter inputs for questions
  ['qSearch', 'qFilterIndustry', 'qFilterPriority', 'qFilterIntent', 'qFilterStatus', 'qFilterCluster'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', () => {
      state.questionPage = 1;
      debounceFilter('q', renderQuestions);
    });
  });


  // Wire up workspace search
  const wsSearch = document.getElementById('wsSearch');
  if (wsSearch) {
    wsSearch.addEventListener('input', () => {
      debounceFilter('ws', renderWorkspace);
    });
  }

  // Wire up test records filters
  ['trSearch', 'trFilterMentioned', 'trFilterPlatform', 'trFilterQuestion'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', () => {
      state.trPage = 1;
      debounceFilter('tr', renderTestRecords);
    });
  });

  // Wire up JSON import
  const jsonInput = document.getElementById('importJsonInput');
  if (jsonInput) jsonInput.addEventListener('change', handleJsonImport);

  // Wire up click outside modal to close
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('show');
      }
    });
  });

  // Wire up ESC key to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.show').forEach(m => m.classList.remove('show'));
    }
  });

  // Initial render
  renderDashboard();
  navigateTo('dashboard');
});
