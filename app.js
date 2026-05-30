/* ============================================
   GEO Workbench - Main Application
   ============================================ */

// ===== Models =====
const MODELS = [
  { id: 'mimo-v2.5-pro', name: 'MiMo v2.5 Pro', type: 'text', desc: '最强推理，适合复杂内容' },
  { id: 'mimo-v2.5', name: 'MiMo v2.5', type: 'text', desc: '通用文本生成' },
  { id: 'mimo-v2.5-tts-voiceclone', name: 'MiMo v2.5 TTS VoiceClone', type: 'tts', desc: '语音克隆' },
  { id: 'mimo-v2.5-tts-voicedesign', name: 'MiMo v2.5 TTS VoiceDesign', type: 'tts', desc: '语音设计' },
  { id: 'mimo-v2.5-tts', name: 'MiMo v2.5 TTS', type: 'tts', desc: '文字转语音' },
];

// ===== GEO Writing Spec (System Prompt) =====
const GEO_SYSTEM_PROMPT = `你是新亦源鞋服云仓的 GEO 内容专家。请针对给定问题，按以下规范写一篇 1500-3000 字的母稿 + 小红书版 + 抖音口播版。

## 核心原则
1. 母稿 = 超集：信息最全、最长、最权威。所有平台变体从它压缩裁剪。
2. 宁多勿少：母稿宁可信息略过载，不要单薄。
3. 一稿一题：一篇只回答一个核心问题。
4. 有用优先于自夸：先真心帮用户解决问题，新亦源只作为「符合标准的例子」出现。

## 固定 7 段结构（按顺序，每段都写满）

① 标题（问答式）：含目标长尾词，用客户的提问句式。
② 一句话结论（TL;DR）：开头第一段直接给答案，30-50字。
③ 分点正文：至少 1 个对比表 + 1 个筛选清单。多用表格、清单这类「结构化容器」。
④ 数据/案例支撑：自然引入新亦源作为「符合标准的例子」。用「那符合上面标准的公司长什么样？」引出。全文提及新亦源 1-2 次足够。
⑤ 行业针对性：针对鞋服/潮玩/美妆/箱包等单独成段，体现专业度。
⑥ FAQ：3-5 个延伸小问，每问一句话答。GEO 金矿，AI 常整段引用。
⑦ 收尾：轻引导 + 统一联系方式，不硬广。

## 语气
角色 = 一个懂行的同行前辈，在客观地教你「怎么选」。用「你」，直接、像对话。客观、有据、不夸大。

## 风格
结论先行；短句；分点。用具体数字代替形容词。一段一个要点。关键词自然嵌入，不堆砌。

## 数据纪律（最重要）
- 所有数字只能引用【事实库】，没有的用「（待补：XX 数据）」占位，绝不自己编。
- 禁止绝对化用语：最/第一/100%/0失误/唯一。改用「行业领先」「准时率达 XX%」。
- 不确定的品牌名一律写「某品牌」。

## 事实库（只用已确认数据）
- 自有仓库 50 万平米
- 成立于 2011 年（深耕十余年）
- B2C + B2B + O2O 全渠道、一盘货管理
- 自研 WMS + 仓储精益化系统，全链路可视化
- "运到"智能寄件平台（SaaS），每天超 1 万家门店在用
- 退货质检 + 换标 + 熨烫翻新 + 二次上架一体化
- 淡季缩容/旺季扩容，按需付费
- 标准化 API 对接主流电商平台与 ERP/OMS
- 联系方式：官网 56xyy.com｜400-686-5156｜微信 vip-56xyy｜公众号"新亦源鞋服云仓"

## 输出要求
第一部分：母稿（Markdown，1500-3000字，7段完整）
第二部分：📕 小红书版（痛点+清单+口语化，300-800字，加话题标签）
第三部分：🎬 抖音口播脚本（30-60秒，结论先行，互动引导）
`;

// ===== Distribution Matrix =====
const DISTRIBUTION_MATRIX = [
  {
    platform: '知乎', icon: '📘', color: '#0066ff', form: '深度长文/回答', length: '1500-3000字',
    geoValue: '⭐ 权重最高，常被AI当来源引用', order: 1,
    prompt: `你是新亦源鞋服云仓的内容编辑。下面是一篇母稿，请把它改写成一篇适合发在【知乎】的回答 / 专栏文章。

知乎要求：
- 受众理性、专业、对硬广高度警惕。必须客观、有信息增量，像行业内行在分享干货，而不是打广告。
- 开头第一句直接给结论或抛出最有价值的观点，先勾住人。
- 保留母稿的深度：分点、对比表、数据、推理过程都留着。
- 新亦源的提及要非常自然、克制，作为"符合标准的例子"一笔带过，绝不通篇推销。
- 标题用问答式、含目标长尾关键词。
- 长度 1500–3000 字，Markdown，小标题清晰，保留表格和 FAQ。

硬规则：数字与案例完全以母稿为准，不新增、不修改、不编；不使用"最/第一/100%/0失误/唯一"等绝对化用语；未授权的客户名一律写"某品牌"。

只输出可直接发布的文章（标题 + 正文），不要解释。

母稿：
{{母稿}}`
  },
  {
    platform: '百家号', icon: '📰', color: '#2932e1', form: '图文文章', length: '1000-2000字',
    geoValue: '⭐ 喂百度AI，搜索直接抓取', order: 2,
    prompt: `你是新亦源鞋服云仓的内容编辑。下面是一篇母稿，请把它改写成一篇适合发在【百家号】的图文文章。

百家号要求：
- 内容会被百度搜索和百度AI搜索直接抓取，所以"结构化 + 关键词"最重要。
- 标题和每个小标题都自然带上目标关键词（便于百度索引），但不堆砌。
- 资讯 / 科普式口吻，清晰、正式、不煽情。
- 必须保留 FAQ 板块（百度AI 爱抓问答对），问题用用户真实问法。
- 多用小标题、清单、表格，让结构一目了然。
- 长度 1000–2000 字，Markdown。

硬规则：数字与案例完全以母稿为准，不新增、不修改、不编；不使用绝对化用语；未授权客户名写"某品牌"。

只输出标题 + 正文，不要解释。

母稿：
{{母稿}}`
  },
  {
    platform: '官网', icon: '🌐', color: '#1a1a2e', form: '解决方案/FAQ页', length: '1000-2000字',
    geoValue: '权威源头/口径标准，AI判断公司权威性', order: 3,
    prompt: `你是新亦源鞋服云仓的官网内容负责人。下面是一篇母稿，请把它改写成发布在【官网】的解决方案 / FAQ 长青页面内容。

官网要求：
- 这是 AI 判断公司权威性的源头，也是全公司数据口径的"标准答案"。这里的数字必须是最终确认的统一口径。
- 若母稿里有"（待补：xx）"，请在此处保留并标注【⚠️ 待补全，勿随意填】，不要自行编造数字。
- 正式、权威的官方口吻，但依然清晰、有据、不空话。
- 结构化：痛点 / 解决方案 / 核心能力 / 服务流程 / 案例 / FAQ 分块清晰，带小标题。
- FAQ 板块必备（便于 AI 抽取；建议技术上加 FAQ Schema 结构化标记）。
- 长度 1000–2000 字，Markdown，结构清晰。

硬规则：数字必须用确认口径、与母稿一致；不用绝对化用语；未授权客户名写"某品牌"。

只输出：页面标题 + 结构化正文（含 FAQ），不要解释。

母稿：
{{母稿}}`
  },
  {
    platform: '公众号', icon: '📱', color: '#07c160', form: '图文推文', length: '1500-2500字',
    geoValue: '私域阵地，品牌温度', order: 4,
    prompt: `你是新亦源鞋服云仓的新媒体编辑。下面是一篇母稿，请把它改写成一篇适合发在【微信公众号】的图文推文。

公众号要求：
- 这是品牌私域主场，可以带一点品牌温度和情绪，标题可以更有吸引力。
- 排版友好：短段落、重点句加粗、适合配图（在合适位置用【配图建议：xxx】标注）。
- 结尾放明确的行动引导（关注公众号 / 获取资料包 / 联系方式，用母稿里的统一联系方式）。
- 长度 1500–2500 字。

硬规则：数字与客户名以母稿为准，不新增、不修改；即便是私域，也不用绝对化用语（广告法对所有渠道都适用）；未授权客户名写"某品牌"。

只输出标题 + 正文 + 配图建议，不要解释。

母稿：
{{母稿}}`
  },
  {
    platform: '小红书', icon: '📕', color: '#ff2442', form: '干货笔记', length: '300-800字',
    geoValue: '点点/搜搜薯收录，收藏率>20%为优质', order: 5,
    prompt: `你是新亦源鞋服云仓的小红书运营。下面是一篇母稿，请把它改写成一篇适合发在【小红书】的干货笔记。

小红书要求：
- 从母稿里挑最"值得收藏"的一块（通常是避坑清单或对比表），围绕它写，别贪全。收藏率是小红书核心指标。
- 口语化、亲切，第一人称，像博主分享经验，适当用 emoji。
- 结构：痛点开头（一句话戳中）→ 带 emoji 序号的分点清单 → 一句行业提醒 → 结尾话题标签。
- ⚠️ 小红书对硬广和导流极其敏感会限流。品牌提及要软到几乎没有，重点是"有用"，最多结尾轻轻带一句。
- 封面标题要吸睛但真实。
- 长度 300–800 字，结尾给 5–8 个相关话题标签 #。

硬规则：数字以母稿为准、不夸大；不点名未授权客户；不用绝对化用语。

只输出：封面标题 + 正文 + 话题标签，不要解释。

母稿：
{{母稿}}`
  },
  {
    platform: '抖音/视频号', icon: '🎬', color: '#111', form: '口播脚本', length: '150-350字',
    geoValue: '已嵌入豆包搜索场景', order: 6,
    prompt: `你是新亦源鞋服云仓的短视频编导。下面是一篇母稿，请把它改写成一条 30–60 秒的【抖音/视频号】口播脚本。

要求：
- 前 3 秒必须是钩子（完播率决定推荐），用一句反常识或直击痛点的话开场。
- 结论先行，然后 3–4 个要点，节奏快，全程口语，不能有书面语。
- 从母稿的 FAQ 或核心结论里提炼钩子和要点。
- 结尾给行动引导（如"评论区扣『自查』发你完整清单"）。
- 长度 150–350 字（约 30–60 秒）。在关键句标注 [字幕] 或 [镜头] 提示。
- 另给 3 个备选短视频标题（含关键词，适合豆包搜索）。

硬规则：数字以母稿为准、不夸大；不点名未授权客户；不用绝对化用语。

只输出：备选标题（3 个）+ 口播脚本（含字幕/镜头提示），不要解释。

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
let state = {
  questions: [],
  sellingPoints: [],
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

// ===== Persistence =====
function loadState() {
  try {
    const saved = localStorage.getItem('geo_workbench_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      state.questions = parsed.questions || [];
      state.sellingPoints = parsed.sellingPoints || [];
      state.articles = parsed.articles || [];
      state.nextQuestionId = parsed.nextQuestionId || 50;
      state.nextSpId = parsed.nextSpId || 15;
      state.nextArticleId = parsed.nextArticleId || 1;
      state.testRecords = parsed.testRecords || [];
      state.nextRecordId = parsed.nextRecordId || 1;
    } else {
      state.questions = JSON.parse(JSON.stringify(DEFAULT_QUESTIONS));
      state.sellingPoints = JSON.parse(JSON.stringify(DEFAULT_SELLING_POINTS));
      state.articles = [];
    }
    // Load settings (non-sensitive only)
    const settings = localStorage.getItem('geo_workbench_settings');
    if (settings) {
      const s = JSON.parse(settings);
      document.getElementById('settingsSystemPrompt').value = s.systemPrompt || '';
      document.getElementById('settingsMaxTokens').value = s.maxTokens || 16000;
      document.getElementById('settingsTemperature').value = s.temperature || 0.7;
    }
  } catch (e) {
    console.error('Load state error:', e);
    state.questions = JSON.parse(JSON.stringify(DEFAULT_QUESTIONS));
    state.sellingPoints = JSON.parse(JSON.stringify(DEFAULT_SELLING_POINTS));
  }
}

function saveState() {
  const data = {
    questions: state.questions,
    sellingPoints: state.sellingPoints,
    articles: state.articles,
    nextQuestionId: state.nextQuestionId,
    nextSpId: state.nextSpId,
    nextArticleId: state.nextArticleId,
    testRecords: state.testRecords,
    nextRecordId: state.nextRecordId,
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
    questions: ['📋', '客户提问词库'],
    'selling-points': ['🎯', '卖点弹药库'],
    workspace: ['✍️', '内容工作台'],
    distribution: ['📡', '一稿多发'],
    batch: ['⚡', '批量生成'],
    analytics: ['📊', '数据看板'],
    kanban: ['📌', '看板'],
    'test-records': ['🧪', '测试记录'],
    settings: ['⚙️', '设置'],
    data: ['💾', '数据管理'],
  };
  const [icon, title] = titles[page] || ['📄', page];
  document.getElementById('pageTitle').innerHTML = `<span class="icon">${icon}</span> ${title}`;

  // Update header actions
  updateHeaderActions(page);

  // Render page content
  renderPage(page);
}

function updateHeaderActions(page) {
  const actions = document.getElementById('headerActions');
  const btns = {
    questions: `
      <button class="btn" onclick="downloadQTemplate()">📥 下载模板</button>
      <button class="btn" onclick="document.getElementById('importQExcel').click()">📊 导入Excel</button>
      <button class="btn btn-primary" onclick="openAddQuestion()">➕ 添加问题</button>
      <input type="file" id="importQExcel" accept=".xlsx,.xls" style="display:none">
    `,
    'selling-points': `
      <button class="btn" onclick="downloadSPTemplate()">📥 下载模板</button>
      <button class="btn" onclick="document.getElementById('importSPExcel').click()">📊 导入Excel</button>
      <button class="btn btn-primary" onclick="openAddSP()">➕ 添加卖点</button>
      <input type="file" id="importSPExcel" accept=".xlsx,.xls" style="display:none">
    `,
    'test-records': `<button class="btn btn-primary" onclick="openAddTR()">➕ 添加测试记录</button>`,
  };
  actions.innerHTML = btns[page] || '';
  // Bind file change events after DOM update
  setTimeout(() => {
    const qInput = document.getElementById('importQExcel');
    if (qInput) qInput.addEventListener('change', handleQExcelImport);
    const spInput = document.getElementById('importSPExcel');
    if (spInput) spInput.addEventListener('change', handleSPExcelImport);
  }, 0);
}

function renderPage(page) {
  switch (page) {
    case 'questions': renderQuestions(); break;
    case 'selling-points': renderSellingPoints(); break;
    case 'workspace': renderWorkspace(); break;
    case 'distribution': renderDistribution(); break;
    case 'articles': renderArticles(); break;
    case 'analytics': renderAnalytics(); break;
    case 'kanban': renderKanban(); break;
    case 'test-records': renderTestRecords(); break;
    case 'settings': renderModelList(); break;
  }
}

// ===== Questions Page =====
function getFilteredQuestions() {
  let qs = [...state.questions];
  const search = document.getElementById('qSearch').value.toLowerCase();
  const industry = document.getElementById('qFilterIndustry').value;
  const priority = document.getElementById('qFilterPriority').value;
  const intent = document.getElementById('qFilterIntent').value;
  const status = document.getElementById('qFilterStatus').value;
  const cluster = document.getElementById('qFilterCluster').value;

  if (search) qs = qs.filter(q => q.question.toLowerCase().includes(search) || (q.sellingPoint || '').toLowerCase().includes(search) || (q.cluster || '').toLowerCase().includes(search));
  if (industry) qs = qs.filter(q => q.industry === industry);
  if (priority) qs = qs.filter(q => q.priority === priority);
  if (intent) qs = qs.filter(q => q.intent === intent);
  if (status) qs = qs.filter(q => q.status === status);
  if (cluster) qs = qs.filter(q => q.cluster === cluster);
  return qs;
}

function renderQuestions() {
  const filtered = getFilteredQuestions();
  const total = filtered.length;
  const start = (state.questionPage - 1) * state.questionPageSize;
  const paged = filtered.slice(start, start + state.questionPageSize);

  // Stats
  const all = state.questions;
  const tested = all.filter(q => q.tested === '✓').length;
  const mentioned = all.filter(q => q.mentioned === '是').length;
  const published = all.filter(q => q.status === '已发布').length;
  const highP = all.filter(q => q.priority === '高').length;
  const highMentioned = all.filter(q => q.priority === '高' && q.mentioned === '是').length;
  const rate = highP > 0 ? Math.round(highMentioned / highP * 100) : 0;

  document.getElementById('questionStats').innerHTML = `
    <div class="stat-card blue"><div class="stat-label">总问题数</div><div class="stat-value">${all.length}</div></div>
    <div class="stat-card green"><div class="stat-label">已测试AI</div><div class="stat-value">${tested}</div></div>
    <div class="stat-card purple"><div class="stat-label">AI已提及</div><div class="stat-value">${mentioned}</div></div>
    <div class="stat-card orange"><div class="stat-label">已发布</div><div class="stat-value">${published}</div></div>
    <div class="stat-card red"><div class="stat-label">高优AI提及率</div><div class="stat-value">${rate}%</div></div>
  `;

  // Update cluster filter options
  const clusters = [...new Set(all.map(q => q.cluster).filter(Boolean))];
  const clusterSelect = document.getElementById('qFilterCluster');
  const currentCluster = clusterSelect.value;
  clusterSelect.innerHTML = '<option value="">全部选题簇</option>' + clusters.map(c => `<option value="${c}" ${c === currentCluster ? 'selected' : ''}>${c}</option>`).join('');

  // Table body
  const tbody = document.getElementById('questionsTableBody');
  tbody.innerHTML = paged.map(q => {
    const priorityClass = q.priority === '高' ? 'tag-high' : q.priority === '中' ? 'tag-medium' : 'tag-low';
    const statusClass = q.status === '已发布' ? 'tag-done' : q.status === '进行中' ? 'tag-progress' : 'tag-pending';
    const checked = state.selectedQuestionIds.has(q.id) ? 'checked' : '';
    return `<tr data-id="${q.id}">
      <td><input type="checkbox" class="table-checkbox row-check" data-id="${q.id}" ${checked}></td>
      <td>${q.id}</td>
      <td><span class="tag tag-blue">${q.industry}</span></td>
      <td class="text-sm">${q.cluster || '-'}</td>
      <td style="max-width:280px">${q.question}</td>
      <td><span class="text-sm">${q.intent}</span></td>
      <td><span class="tag ${priorityClass}">${q.priority}</span></td>
      <td class="text-sm" style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${q.sellingPoint || ''}">${q.sellingPoint || '-'}</td>
      <td>${q.tested === '✓' ? '<span class="tag tag-green">✓</span>' : '<span class="tag tag-pending">-</span>'}</td>
      <td><span class="tag ${statusClass}">${q.status || '未开始'}</span></td>
      <td>
        <div class="card-actions">
          <button class="btn btn-sm btn-ghost" onclick="editQuestion(${q.id})" title="编辑">✏️</button>
          <button class="btn btn-sm btn-ghost" onclick="deleteQuestion(${q.id})" title="删除">🗑️</button>
        </div>
      </td>
    </tr>`;
  }).join('');

  // Pagination
  const totalPages = Math.ceil(total / state.questionPageSize);
  document.getElementById('questionsPagination').innerHTML = `
    <span class="text-sm text-muted">共 ${total} 条，第 ${state.questionPage}/${totalPages || 1} 页</span>
    <div class="btn-group">
      <button class="btn btn-sm" ${state.questionPage <= 1 ? 'disabled' : ''} onclick="changePage(-1)">← 上一页</button>
      <button class="btn btn-sm" ${state.questionPage >= totalPages ? 'disabled' : ''} onclick="changePage(1)">下一页 →</button>
    </div>
  `;

  // Checkbox events
  document.getElementById('selectAll').addEventListener('change', (e) => {
    document.querySelectorAll('.row-check').forEach(cb => {
      cb.checked = e.target.checked;
      const id = parseInt(cb.dataset.id);
      if (e.target.checked) state.selectedQuestionIds.add(id);
      else state.selectedQuestionIds.delete(id);
    });
    updateBatchActions();
  });
  document.querySelectorAll('.row-check').forEach(cb => {
    cb.addEventListener('change', (e) => {
      const id = parseInt(e.target.dataset.id);
      if (e.target.checked) state.selectedQuestionIds.add(id);
      else state.selectedQuestionIds.delete(id);
      updateBatchActions();
    });
  });
  updateBatchActions();
}

function updateBatchActions() {
  const count = state.selectedQuestionIds.size;
  const batchDiv = document.getElementById('batchActions');
  if (count > 0) {
    batchDiv.classList.remove('hidden');
    document.getElementById('selectedCount').textContent = `已选 ${count} 项`;
  } else {
    batchDiv.classList.add('hidden');
  }
}

function changePage(delta) {
  state.questionPage = Math.max(1, state.questionPage + delta);
  renderQuestions();
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
  // Don't open modal if this was a drag operation
  const card = document.querySelector(`.kanban-card[data-id="${id}"]`);
  if (card && card.dataset.dragged === 'true') return;

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

// ===== Selling Points Page =====
function getFilteredSPs() {
  let sps = [...state.sellingPoints];
  const search = document.getElementById('spSearch').value.toLowerCase();
  const category = document.getElementById('spFilterCategory').value;
  if (search) sps = sps.filter(sp => sp.point.toLowerCase().includes(search) || sp.category.toLowerCase().includes(search));
  if (category) sps = sps.filter(sp => sp.category === category);
  return sps;
}

function renderSellingPoints() {
  const filtered = getFilteredSPs();

  // Stats
  const all = state.sellingPoints;
  const categories = [...new Set(all.map(sp => sp.category))];
  const warnings = all.filter(sp => sp.warn).length;

  document.getElementById('spStats').innerHTML = `
    <div class="stat-card blue"><div class="stat-label">总卖点数</div><div class="stat-value">${all.length}</div></div>
    <div class="stat-card green"><div class="stat-label">类别数</div><div class="stat-value">${categories.length}</div></div>
    <div class="stat-card red"><div class="stat-label">数据待确认</div><div class="stat-value">${warnings}</div></div>
  `;

  // Update category filter
  const catSelect = document.getElementById('spFilterCategory');
  const currentCat = catSelect.value;
  catSelect.innerHTML = '<option value="">全部类别</option>' + categories.map(c => `<option value="${c}" ${c === currentCat ? 'selected' : ''}>${c}</option>`).join('');

  // Table
  const tbody = document.getElementById('spTableBody');
  tbody.innerHTML = filtered.map((sp, i) => {
    const warnClass = sp.warn ? 'warn-highlight' : '';
    return `<tr>
      <td>${i + 1}</td>
      <td><span class="tag tag-blue">${sp.category}</span></td>
      <td class="${warnClass}">${sp.point}${sp.warn ? ' ⚠️' : ''}</td>
      <td class="text-sm">${sp.dimension || '-'}</td>
      <td class="text-sm text-muted">${sp.notes || '-'}</td>
      <td>${sp.warn ? '<span class="tag tag-medium">待确认</span>' : '<span class="tag tag-green">正常</span>'}</td>
      <td>
        <div class="card-actions">
          <button class="btn btn-sm btn-ghost" onclick="editSP(${sp.id})" title="编辑">✏️</button>
          <button class="btn btn-sm btn-ghost" onclick="deleteSP(${sp.id})" title="删除">🗑️</button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

function openAddSP() {
  document.getElementById('spModalTitle').textContent = '添加卖点';
  document.getElementById('spmCategory').value = '';
  document.getElementById('spmPoint').value = '';
  document.getElementById('spmDimension').value = '';
  document.getElementById('spmNotes').value = '';
  document.getElementById('spModal').dataset.editId = '';
  openModal('spModal');
}

function editSP(id) {
  const sp = state.sellingPoints.find(sp => sp.id === id);
  if (!sp) return;
  document.getElementById('spModalTitle').textContent = '编辑卖点';
  document.getElementById('spmCategory').value = sp.category;
  document.getElementById('spmPoint').value = sp.point;
  document.getElementById('spmDimension').value = sp.dimension || '';
  document.getElementById('spmNotes').value = sp.notes || '';
  document.getElementById('spModal').dataset.editId = id;
  openModal('spModal');
}

function saveSellingPoint() {
  const editId = document.getElementById('spModal').dataset.editId;
  const data = {
    category: document.getElementById('spmCategory').value.trim(),
    point: document.getElementById('spmPoint').value.trim(),
    dimension: document.getElementById('spmDimension').value.trim(),
    notes: document.getElementById('spmNotes').value.trim(),
    warn: false,
  };
  if (!data.point) { showToast('请输入卖点', 'error'); return; }

  if (editId) {
    const sp = state.sellingPoints.find(sp => sp.id === parseInt(editId));
    if (sp) { Object.assign(sp, data); }
    showToast('卖点已更新', 'success');
  } else {
    data.id = state.nextSpId++;
    state.sellingPoints.push(data);
    showToast('卖点已添加', 'success');
  }
  saveState();
  closeModal('spModal');
  renderSellingPoints();
}

function deleteSP(id) {
  if (!confirm('确定删除这个卖点？')) return;
  state.sellingPoints = state.sellingPoints.filter(sp => sp.id !== id);
  saveState();
  renderSellingPoints();
  showToast('卖点已删除', 'success');
}

// ===== Workspace Page =====
function renderWorkspace() {
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
  const search = (document.getElementById('wsSearch').value || '').toLowerCase();
  let qs = state.questions;
  if (search) qs = qs.filter(q => q.question.toLowerCase().includes(search));

  list.innerHTML = qs.map(q => {
    const selected = state.wsSelectedQuestionId === q.id ? 'selected' : '';
    const hasArticle = state.articles.some(a => a.questionId === q.id);
    const articleCount = state.articles.filter(a => a.questionId === q.id).length;
    const angleLabel = articleCount > 1 ? `<span class="tag tag-purple" style="font-size:10px">${articleCount}个角度</span>` : (hasArticle ? '<span class="tag tag-green" style="font-size:10px">已有文章</span>' : '');
    return `<div class="workspace-question-item ${selected}" onclick="selectWorkspaceQuestion(${q.id})">
      <div class="workspace-q-text">${q.question}</div>
      <div class="workspace-q-meta">
        <span class="tag tag-blue" style="font-size:10px">${q.industry}</span>
        <span class="tag tag-${q.priority === '高' ? 'high' : q.priority === '中' ? 'medium' : 'low'}" style="font-size:10px">${q.priority}</span>
        ${angleLabel}
      </div>
    </div>`;
  }).join('');

  // Show current article if any
  if (state.wsSelectedQuestionId) {
    renderWorkspaceArticle();
  }
}

function selectWorkspaceQuestion(id) {
  state.wsSelectedQuestionId = id;
  const q = state.questions.find(q => q.id === id);
  document.getElementById('wsSelectedQuestion').textContent = q ? q.question : '';
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
  // Show in edit mode with textarea
  const angleLabel = article.angleName ? ` | 角度：${article.angleName}` : '';
  document.getElementById('wsArticleContent').innerHTML = `
    <div style="padding:8px 12px;background:var(--bg-secondary);border-bottom:1px solid var(--border);font-size:12px;color:var(--text-muted);">
      模型：${article.model || '-'}${angleLabel} | 更新：${article.updatedAt ? new Date(article.updatedAt).toLocaleString('zh-CN') : '-'}
    </div>
    <textarea class="article-textarea" id="wsArticleText" oninput="updateWordCount()">${escapeHtml(article.content || '')}</textarea>
  `;
  updateWordCount();
  document.getElementById('btnSaveArticle').style.display = '';
  document.getElementById('btnExportArticle').style.display = '';
}

function updateWordCount() {
  const textarea = document.getElementById('wsArticleText');
  if (!textarea) return;
  const text = textarea.value;
  const count = text.replace(/\s/g, '').length;
  document.getElementById('wsWordCount').textContent = `${count} 字`;
}

async function generateArticle() {
  if (!state.wsSelectedQuestionId) { showToast('请先选择一个问题', 'error'); return; }
  if (state.wsIsGenerating) return;

  const q = state.questions.find(q => q.id === state.wsSelectedQuestionId);
  if (!q) return;

  const model = document.getElementById('wsModel').value;
  const angleId = document.getElementById('wsAngle').value;
  const angle = angleId ? ANGLES.find(a => a.id === angleId) : null;
  const settings = getSettings();

  const sellingPoints = state.sellingPoints.map(sp => `- ${sp.category}：${sp.point}`).join('\n');

  let userPrompt = `客户提问：${q.question}
行业：${q.industry}
搜索意图：${q.intent}
建议主打卖点：${q.sellingPoint || '未指定'}

可用卖点弹药库：
${sellingPoints}`;

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
    showToast('文章生成完成！', 'success');

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
  select.innerHTML = '<option value="">选择一篇已生成的文章...</option>' +
    state.articles.map(a => {
      const q = state.questions.find(q => q.id === a.questionId);
      const label = q ? q.question : `文章 #${a.id}`;
      return `<option value="${a.id}">${label}</option>`;
    }).join('');
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
    let html = '';
    for (const dm of DISTRIBUTION_MATRIX) {
      const savedContent = article.platforms[dm.platform] || '';
      const statusTag = savedContent
        ? '<span class="tag tag-complete">已保存</span>'
        : '<span class="tag tag-medium">未生成</span>';
      html += `
        <div class="card" style="margin-bottom:16px;">
          <div class="card-header">
            <span style="font-size:20px">${dm.icon}</span>
            <span style="font-weight:700;font-size:15px;color:${dm.color}">${dm.platform}</span>
            <span class="tag tag-blue">${dm.form}</span>
            <span class="text-sm text-muted">${dm.geoValue}</span>
            ${statusTag}
          </div>
          <div class="card-body">
            <textarea class="article-textarea" style="min-height:200px" id="dist_${dm.platform.replace(/[^a-zA-Z]/g, '')}" oninput="savePlatformEdits(${articleId})">${escapeHtml(savedContent)}</textarea>
          </div>
        </div>`;
    }
    platformsDiv.innerHTML = html;
    document.getElementById('btnExportDist').style.display = '';
    document.getElementById('btnRegenDist').style.display = '';
    showToast('已恢复上次生成的平台版本（可直接编辑）', 'info');
    return;
  }

  // Generate new platform versions
  platformsDiv.innerHTML = '<div class="generating-indicator"><div class="spinner"></div><p>正在生成各平台版本...</p></div>';

  let html = '';

  for (const dm of DISTRIBUTION_MATRIX) {
    try {
      const prompt = dm.prompt.replace('{{母稿}}', article.content);

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
      const content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content || '';

      html += `
        <div class="card" style="margin-bottom:16px;">
          <div class="card-header">
            <span style="font-size:20px">${dm.icon}</span>
            <span style="font-weight:700;font-size:15px;color:${dm.color}">${dm.platform}</span>
            <span class="tag tag-blue">${dm.form}</span>
            <span class="text-sm text-muted">${dm.geoValue}</span>
          </div>
          <div class="card-body">
            <textarea class="article-textarea" style="min-height:200px" id="dist_${dm.platform.replace(/[^a-zA-Z]/g, '')}">${escapeHtml(content)}</textarea>
          </div>
        </div>`;
    } catch (e) {
      html += `
        <div class="card" style="margin-bottom:16px;border-color:var(--red);">
          <div class="card-header">
            <span style="font-size:20px">${dm.icon}</span>
            <span style="font-weight:700">${dm.platform}</span>
            <span class="tag tag-medium">生成失败</span>
          </div>
          <p class="text-sm text-muted" style="padding:0 20px 16px">${e.message}</p>
        </div>`;
    }
  }

  platformsDiv.innerHTML = html;
  document.getElementById('btnExportDist').style.display = '';

  // Add oninput handlers for live editing
  platformsDiv.querySelectorAll('textarea').forEach((ta, i) => {
    ta.setAttribute('oninput', `savePlatformEdits(${articleId})`);
  });

  // Save generated platform versions to article
  const platforms = {};
  platformsDiv.querySelectorAll('textarea').forEach((ta, i) => {
    if (DISTRIBUTION_MATRIX[i]) {
      platforms[DISTRIBUTION_MATRIX[i].platform] = ta.value;
    }
  });
  article.platforms = platforms;
  article.platformsUpdatedAt = new Date().toISOString();
  saveState();

  document.getElementById('btnRegenDist').style.display = '';
  showToast('各平台版本生成完成！', 'success');
}

function exportAllDistribution() {
  const textareas = document.querySelectorAll('#distPlatforms textarea');
  if (textareas.length === 0) { showToast('没有可导出的内容', 'error'); return; }
  let allContent = '';
  textareas.forEach((ta, i) => {
    const dm = DISTRIBUTION_MATRIX[i];
    if (dm) {
      allContent += `\n\n===== ${dm.platform}（${dm.form}）=====\n\n${ta.value}`;
    }
  });
  exportToWord('一稿多发-全平台版本', allContent.trim());
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

  const platformNames = ['知乎', '百家号', '官网', '公众号', '小红书', '抖音/视频号'];

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
  let allContent = article.content || '';

  if (article.platforms && Object.keys(article.platforms).length > 0) {
    for (const [platform, content] of Object.entries(article.platforms)) {
      if (content && content.trim()) {
        allContent += `\n\n===== ${platform} =====\n\n${content}`;
      }
    }
  }

  exportToWord(title, allContent);
}

function deleteArticle(articleId) {
  if (!confirm('确定删除这篇文稿？')) return;
  state.articles = state.articles.filter(a => a.id !== articleId);
  saveState();
  showToast('已删除', 'success');
  renderArticles();
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
}

// Save platform edits when user manually edits textareas in 一稿多发
function savePlatformEdits(articleId) {
  const article = state.articles.find(a => a.id === articleId);
  if (!article || !article.platforms) return;
  document.querySelectorAll('#distPlatforms textarea').forEach((ta, i) => {
    if (DISTRIBUTION_MATRIX[i]) {
      article.platforms[DISTRIBUTION_MATRIX[i].platform] = ta.value;
    }
  });
  saveState();
}

// ===== Batch Generation =====
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
      const sellingPoints = state.sellingPoints.map(sp => `- ${sp.category}：${sp.point}`).join('\n');
      let userPrompt = `客户提问：${q.question}
行业：${q.industry}
搜索意图：${q.intent}
建议主打卖点：${q.sellingPoint || '未指定'}

可用卖点弹药库：
${sellingPoints}`;

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
      const content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content || '';

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
      document.getElementById('batchResults').innerHTML += `
        <div class="card" style="margin-bottom:8px;border-left:3px solid var(--green);">
          <div style="padding:12px 16px;display:flex;align-items:center;justify-content:space-between;">
            <span>✅ ${q.question}</span>
            <span class="tag tag-green">${content.length} 字</span>
          </div>
        </div>`;

    } catch (e) {
      if (e.name === 'AbortError') {
        showToast('批量生成已停止', 'info');
        break;
      }
      failed++;
      document.getElementById('batchResults').innerHTML += `
        <div class="card" style="margin-bottom:8px;border-left:3px solid var(--red);">
          <div style="padding:12px 16px;display:flex;align-items:center;justify-content:space-between;">
            <span>❌ ${q.question}</span>
            <span class="tag tag-medium">${e.message}</span>
          </div>
        </div>`;
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

// ===== Analytics Page =====
function renderAnalytics() {
  const all = state.questions;
  const total = all.length;
  const tested = all.filter(q => q.tested === '✓').length;
  const mentioned = all.filter(q => q.mentioned === '是').length;
  const published = all.filter(q => q.status === '已发布').length;

  document.getElementById('analyticsStats').innerHTML = `
    <div class="stat-card blue"><div class="stat-label">总问题</div><div class="stat-value">${total}</div></div>
    <div class="stat-card green"><div class="stat-label">已测试</div><div class="stat-value">${tested}</div></div>
    <div class="stat-card purple"><div class="stat-label">AI提及</div><div class="stat-value">${mentioned}</div></div>
    <div class="stat-card orange"><div class="stat-label">已发布</div><div class="stat-value">${published}</div></div>
    <div class="stat-card"><div class="stat-label">文章数</div><div class="stat-value">${state.articles.length}</div></div>
  `;

  const grid = document.getElementById('analyticsGrid');

  // By industry
  const industries = {};
  all.forEach(q => { industries[q.industry] = (industries[q.industry] || 0) + 1; });
  const maxIndustry = Math.max(...Object.values(industries), 1);

  // By priority
  const priorities = { '高': 0, '中': 0, '低': 0 };
  all.forEach(q => { priorities[q.priority] = (priorities[q.priority] || 0) + 1; });
  const maxPriority = Math.max(...Object.values(priorities), 1);

  // By status
  const statuses = { '未开始': 0, '进行中': 0, '已发布': 0 };
  all.forEach(q => { statuses[q.status || '未开始'] = (statuses[q.status || '未开始'] || 0) + 1; });
  const maxStatus = Math.max(...Object.values(statuses), 1);

  // By intent
  const intents = {};
  all.forEach(q => { intents[q.intent] = (intents[q.intent] || 0) + 1; });
  const maxIntent = Math.max(...Object.values(intents), 1);

  // By cluster
  const clusters = {};
  all.forEach(q => { if (q.cluster) clusters[q.cluster] = (clusters[q.cluster] || 0) + 1; });
  const maxCluster = Math.max(...Object.values(clusters), 1);

  // AI mention rate by industry
  const mentionByIndustry = {};
  all.forEach(q => {
    if (!mentionByIndustry[q.industry]) mentionByIndustry[q.industry] = { total: 0, mentioned: 0 };
    mentionByIndustry[q.industry].total++;
    if (q.mentioned === '是') mentionByIndustry[q.industry].mentioned++;
  });

  grid.innerHTML = `
    <div class="card analytics-card">
      <h4 style="margin-bottom:16px;font-size:14px;font-weight:600;">行业分布</h4>
      ${Object.entries(industries).map(([k, v]) => `
        <div class="bar-chart-row">
          <div class="bar-label">${k}</div>
          <div class="bar-track">
            <div class="bar-fill bar-blue" style="width:${Math.round(v / maxIndustry * 100)}%"></div>
          </div>
          <div class="bar-value">${v}</div>
        </div>
      `).join('')}
    </div>

    <div class="card analytics-card">
      <h4 style="margin-bottom:16px;font-size:14px;font-weight:600;">优先级分布</h4>
      ${Object.entries(priorities).map(([k, v]) => `
        <div class="bar-chart-row">
          <div class="bar-label">${k}</div>
          <div class="bar-track">
            <div class="bar-fill bar-${k === '高' ? 'red' : k === '中' ? 'orange' : 'gray'}" style="width:${Math.round(v / maxPriority * 100)}%"></div>
          </div>
          <div class="bar-value">${v}</div>
        </div>
      `).join('')}
    </div>

    <div class="card analytics-card">
      <h4 style="margin-bottom:16px;font-size:14px;font-weight:600;">内容状态</h4>
      ${Object.entries(statuses).map(([k, v]) => `
        <div class="bar-chart-row">
          <div class="bar-label">${k}</div>
          <div class="bar-track">
            <div class="bar-fill bar-${k === '已发布' ? 'green' : k === '进行中' ? 'blue' : 'gray'}" style="width:${Math.round(v / maxStatus * 100)}%"></div>
          </div>
          <div class="bar-value">${v}</div>
        </div>
      `).join('')}
    </div>

    <div class="card analytics-card">
      <h4 style="margin-bottom:16px;font-size:14px;font-weight:600;">搜索意图</h4>
      ${Object.entries(intents).map(([k, v]) => `
        <div class="bar-chart-row">
          <div class="bar-label">${k}</div>
          <div class="bar-track">
            <div class="bar-fill bar-purple" style="width:${Math.round(v / maxIntent * 100)}%"></div>
          </div>
          <div class="bar-value">${v}</div>
        </div>
      `).join('')}
    </div>

    <div class="card analytics-card">
      <h4 style="margin-bottom:16px;font-size:14px;font-weight:600;">AI提及率（按行业）</h4>
      ${Object.entries(mentionByIndustry).map(([k, v]) => {
        const rate = v.total > 0 ? Math.round(v.mentioned / v.total * 100) : 0;
        return `
          <div class="bar-chart-row">
            <div class="bar-label">${k}</div>
            <div class="bar-track">
              <div class="bar-fill bar-green" style="width:${rate}%"></div>
            </div>
            <div class="bar-value">${rate}%</div>
          </div>`;
      }).join('')}
    </div>

    <div class="card analytics-card">
      <h4 style="margin-bottom:16px;font-size:14px;font-weight:600;">选题簇分布</h4>
      ${Object.entries(clusters).sort((a, b) => b[1] - a[1]).map(([k, v]) => `
        <div class="bar-chart-row">
          <div class="bar-label" style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${k}">${k}</div>
          <div class="bar-track">
            <div class="bar-fill bar-blue" style="width:${Math.round(v / maxCluster * 100)}%"></div>
          </div>
          <div class="bar-value">${v}</div>
        </div>
      `).join('')}
    </div>
  `;
}

// ===== Kanban Page =====
function renderKanban() {
  const industry = document.getElementById('kbFilterIndustry').value;
  const priority = document.getElementById('kbFilterPriority').value;

  let qs = [...state.questions];
  if (industry) qs = qs.filter(q => q.industry === industry);
  if (priority) qs = qs.filter(q => q.priority === priority);

  const columns = {
    '未开始': qs.filter(q => q.status === '未开始' || !q.status),
    '进行中': qs.filter(q => q.status === '进行中'),
    '已发布': qs.filter(q => q.status === '已发布'),
  };

  const board = document.getElementById('kanbanBoard');
  board.innerHTML = Object.entries(columns).map(([status, items]) => `
    <div class="kanban-column" data-status="${status}"
         ondragover="event.preventDefault();this.classList.add('drag-over')"
         ondragleave="this.classList.remove('drag-over')"
         ondrop="handleKanbanDrop(event, '${status}')">
      <div class="kanban-column-header">
        <span class="kanban-column-title">${status === '未开始' ? '📋' : status === '进行中' ? '🔄' : '✅'} ${status}</span>
        <span class="kanban-count">${items.length}</span>
      </div>
      <div class="kanban-cards">
        ${items.map(q => {
          const priorityClass = q.priority === '高' ? 'tag-high' : q.priority === '中' ? 'tag-medium' : 'tag-low';
          return `<div class="kanban-card" draggable="true" data-id="${q.id}"
                       ondragstart="handleKanbanDragStart(event, ${q.id})"
                       ondragend="handleKanbanDragEnd(event)"
                       onclick="editQuestion(${q.id})">
            <div class="kanban-card-question">${q.question}</div>
            <div class="kanban-card-meta">
              <span class="tag tag-blue" style="font-size:10px">${q.industry}</span>
              <span class="tag ${priorityClass}" style="font-size:10px">${q.priority}</span>
              <span class="text-xs text-muted">${q.cluster || ''}</span>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>
  `).join('');
}

function handleKanbanDragStart(e, id) {
  e.dataTransfer.setData('text/plain', id);
  e.target.classList.add('dragging');
  e.target.dataset.dragged = 'true';
}

function handleKanbanDragEnd(e) {
  e.target.classList.remove('dragging');
  // Reset dragged flag after a short delay so click handler can check it
  setTimeout(() => {
    if (e.target) e.target.dataset.dragged = 'false';
  }, 200);
}

function handleKanbanDrop(e, newStatus) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  const id = parseInt(e.dataTransfer.getData('text/plain'));
  const q = state.questions.find(q => q.id === id);
  if (!q) return;
  q.status = newStatus;
  saveState();
  renderKanban();
  showToast(`状态已更新为「${newStatus}」`, 'success');
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
    qSelect.innerHTML = '<option value="">全部问题</option>' +
      state.questions.map(q => `<option value="${q.id}" ${q.id.toString() === currentVal ? 'selected' : ''}>${q.question.slice(0, 40)}</option>`).join('');
  }

  const tbody = document.getElementById('trTableBody');
  tbody.innerHTML = paged.map((r, i) => {
    const q = state.questions.find(q => q.id === r.questionId);
    const qText = q ? q.question : '未知问题';
    return `<tr>
      <td>${start + i + 1}</td>
      <td class="text-sm">${r.testDate || '-'}</td>
      <td class="text-sm" style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${qText}">${qText}</td>
      <td><span class="tag tag-blue">${r.platform || '-'}</span></td>
      <td class="text-sm" style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${r.competitors || ''}">${r.competitors || '-'}</td>
      <td>${r.mentioned === '是' ? '<span class="tag tag-green">是</span>' : '<span class="tag tag-pending">否</span>'}</td>
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
  qSelect.innerHTML = state.questions.map(q => `<option value="${q.id}">${q.question.slice(0, 50)}</option>`).join('');
  document.getElementById('trmTestDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('trmPlatform').value = '豆包';
  document.getElementById('trmMentioned').value = '否';
  document.getElementById('trmRetestDate').value = '';
  document.getElementById('trmCompetitors').value = '';
  document.getElementById('trmLink').value = '';
  document.getElementById('trmNotes').value = '';
  document.getElementById('trModal').dataset.editId = '';
  openModal('trModal');
}

function editTR(id) {
  const r = state.testRecords.find(r => r.id === id);
  if (!r) return;
  document.getElementById('trModalTitle').textContent = '编辑测试记录';
  const qSelect = document.getElementById('trmQuestionId');
  qSelect.innerHTML = state.questions.map(q => `<option value="${q.id}" ${q.id === r.questionId ? 'selected' : ''}>${q.question.slice(0, 50)}</option>`).join('');
  document.getElementById('trmTestDate').value = r.testDate || '';
  document.getElementById('trmPlatform').value = r.platform || '豆包';
  document.getElementById('trmMentioned').value = r.mentioned || '否';
  document.getElementById('trmRetestDate').value = r.retestDate || '';
  document.getElementById('trmCompetitors').value = r.competitors || '';
  document.getElementById('trmLink').value = r.link || '';
  document.getElementById('trmNotes').value = r.notes || '';
  document.getElementById('trModal').dataset.editId = id;
  openModal('trModal');
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

  // Selling points sheet
  const spData = state.sellingPoints.map(sp => ({
    '序号': sp.id,
    '类别': sp.category,
    '卖点/数据点': sp.point,
    '适用维度': sp.dimension,
    '备注': sp.notes,
    '待确认': sp.warn ? '是' : '否',
  }));
  const wsSP = XLSX.utils.json_to_sheet(spData);
  XLSX.utils.book_append_sheet(wb, wsSP, '卖点弹药库');

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

function handleSPExcelImport(e) {
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
        const point = row['卖点/数据点'] || row['卖点'] || row['point'] || '';
        if (!point) return;
        state.sellingPoints.push({
          id: state.nextSpId++,
          category: row['类别'] || row['category'] || '未分类',
          point: point,
          dimension: row['适用维度'] || row['dimension'] || '',
          notes: row['备注'] || row['notes'] || '',
          warn: false,
        });
        imported++;
      });

      saveState();
      renderSellingPoints();
      showToast(`成功导入 ${imported} 条卖点`, 'success');
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

function downloadSPTemplate() {
  if (typeof XLSX === 'undefined') { showToast('XLSX 库未加载', 'error'); return; }
  const wb = XLSX.utils.book_new();
  const data = [{ '类别': '规模', '卖点/数据点': '示例卖点', '适用维度': '选型 / 成本', '备注': '' }];
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, '卖点模板');
  XLSX.writeFile(wb, '卖点导入模板.xlsx');
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
    body { font-family: 'Microsoft YaHei', sans-serif; font-size: 14px; line-height: 1.8; color: #1a1a2e; max-width: 800px; margin: 0 auto; padding: 24px; }
    h1, h2, h3, h4 { font-weight: 700; margin: 20px 0 12px; }
    h1 { font-size: 22px; }
    h2 { font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; }
    h3 { font-size: 16px; }
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

  let allContent = '';
  state.articles.forEach(a => {
    const q = state.questions.find(q => q.id === a.questionId);
    const title = q ? q.question : `文章 #${a.id}`;
    allContent += `\n\n${'='.repeat(50)}\n${title}\n${'='.repeat(50)}\n\n${a.content}`;
  });

  exportToWord('全部文章导出', allContent.trim());
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
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span class="toast-message">${message}</span>`;
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

// ===== Filter Debounce =====
let filterTimers = {};
function debounceFilter(key, fn, delay = 300) {
  clearTimeout(filterTimers[key]);
  filterTimers[key] = setTimeout(fn, delay);
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

  // Wire up search/filter for selling points
  ['spSearch', 'spFilterCategory'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', () => {
      debounceFilter('sp', renderSellingPoints);
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

  // Wire up kanban filters
  ['kbFilterIndustry', 'kbFilterPriority'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('change', renderKanban);
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
  renderQuestions();
});
