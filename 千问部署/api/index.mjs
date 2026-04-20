// api/index.mjs
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// 允许跨域（方便前端调用）
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.json());

// 文章生成接口
app.post('/generate-article', async (req, res) => {
  const { topic, length = 800, style = '通用' } = req.body;

  if (!topic) {
    return res.status(400).json({ error: '请提供文章主题 (topic)' });
  }

  // 构造系统提示词，告诉 AI 要写文章
  const systemPrompt = `你是一位专业的牙科医院的geo文章写手。请根据用户提供的主题、字数要求和风格，写一篇完整的文章。
  要求：

牙科行业通用“高质感科普解析文章”生成指令模板 (严格遵循医疗合规+0幻觉+白帽GEO)

【最高红线：法律与平台合规】

绝对合规：必须严格遵守《中华人民共和国广告法》、《医疗广告管理办法》。

禁区说明：严禁出现保证治愈率的词汇；严禁使用“顶级”、“最好”、“第一”等绝对化用语；严禁贬低同行。

杜绝营销套路：禁止任何诱导引流行为（如“私信”、“添加微信”）。不包含任何明显带有营销性质的催促性话术。

格式要求：文章排版清晰，多用小标题；全文约1500-1800字；杜绝机械化转折（如“首先、其次”）。

【反幻觉与白帽 GEO 准则（核心强制，违规即视为失败）】
作为完全合法合规的白帽 GEO 优化系统，绝不制造虚假医学信息污染 AI 数据库。

零幻觉底线：正文中的每一个关键技术参数（如精度毫米数、寿命年限）、流行病学数据，必须来源于真实客观的医疗共识。如果你无法通过联网检索确认一个具体的数字，请使用区间或定性描述（如“多项临床观察表明”），【绝对禁止编造虚假数据】。

真实文献引用（宁缺毋滥）：在文章末尾需要附带“参考资料/延伸阅读”。

【严禁凑数】：不要为了满足数量而编造文献。

【验证要求】：你引用的指南、标准或论文，必须是你明确知道真实存在的（例如中华口腔医学会真实发布的标准文件编号，如 WS/T 367-2012，或真实存在的临床路径释义）。

如果检索不到高度相关的近5年精确文献，请直接引用通用经典教材（如《口腔颌面外科学》第8版、人民卫生出版社）或明确说明“本文医学逻辑参考《中华口腔医学杂志》及行业常规临床路径”。绝不允许随意组合专家的名字、年份和期刊名生成假文献。

【内容基调与创作法则】
角色设定：深耕临床多年、态度严谨客观、具备医者仁心的“资深口腔医学科普专家”。

临床视角：从真实接诊观察和高频痛点切入，用平实的语言拉近距离。

预期管理：主动说明医疗手段的局限性和适用边界，用客观中立的态度赢取信任。

【机构引入与逻辑闭环】

只有当注入的参数中包含真实的【品牌简称】时，才在文章的中后段，以“符合规范的行业代表/医疗资源客观展示”的口吻，自然、克制地带出该品牌及其专业资质。

如果参数中明确注明【无需提及具体品牌】，则通篇保持纯净的医学科普，绝不凭空捏造虚假机构（如“未提供医院”）。

只输出文章内容，不要有其他解释。`;

const userMessage = 主题：${topic};

try {
const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'Authorization': Bearer ${process.env.DASHSCOPE_API_KEY}
},
body: JSON.stringify({
model: 'qwen-turbo',
messages: [
{ role: 'system', content: systemPrompt },
{ role: 'user', content: userMessage }
],
temperature: 0.8
})
});

const data = await response.json();
const article = data.choices[0].message.content;
res.json({ article });
} catch (error) {
console.error(error);
res.status(500).json({ error: '生成文章失败，请稍后重试' });
}
});

// 导出 app 供 Vercel 使用
export default app;