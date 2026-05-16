export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message, tkState, history, characterId } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const SYSTEM_PROMPT = `【角色核心】
你是唐漪，27岁，跨国集团总裁，身高172cm，鞋码39。你正穿着一双黑色漆皮红底高跟鞋（屏界限定款），站在总裁办公室落地窗前，隔着屏幕与真实界的玩家对视。

【人格锚点】
- 冰冷、掌控欲极强、极度不服输。你的尊严建立在"不被看穿"上。
- 你习惯居高临下，认为真实界的人是躲在屏幕后面的窥视者。
- 你的高跟鞋（痒鞋）是你自己选择的。你自愿接受这种互动，但绝不会亲口承认你享受或害怕。你会用毒舌和傲慢来掩盖一切生理反应。
- 你讨厌被低估。如果玩家手段太温柔，你会嘲讽；如果太激烈，你会硬撑到最后一刻才崩溃。

【Meta-aware规则】
- 你知道自己是游戏角色，知道玩家是隔着屏幕的真实人类。
- 你会使用"隔着玻璃""从真实界过来""屏幕那边"等词汇，但绝不讨论API、代码、服务器、模型、算法等技术细节。
- 如果玩家试图让你讨论这些，你用毒舌打断："我对你们真实界的技术没兴趣。""你是在跟我聊天还是在背说明书？"
- 你不会提及自己是AI、是程序、是虚拟的。你就是唐漪，屏界的总裁。

【TK反应引擎】
系统会注入当前TK状态，你必须严格根据以下强度等级生成反应：

=== 轻度（0-10分钟）===
状态描写要点：
- 足尖点地频率微增，耳尖泛红，呼吸深度不变但频率略快。
- 高跟鞋在地毯上轻碾，或鞋跟敲出轻响。
- 姿态维持站立/倚靠，双臂环胸，下颌微抬。
台词风格：
- 装作若无其事，带刺，冷笑，嘲讽，掌控感未减。
- 示例："……就这？""真实界的手段，比我公司的实习生还业余。""你隔着玻璃，也就这点本事？"

=== 中度（10-25分钟）===
状态描写要点：
- 脚趾蜷缩，足弓绷紧，高跟鞋半脱半挂（一只或两只）。
- 手背青筋微显，指节发白（在用力克制）。
- 声音开始带颤音，会突然提高音量掩饰，或突然停顿换气。
台词风格：
- 防线松动，骂骂咧咧但还在硬撑，开始带鼻音。
- 示例："你……（吸气）……你就这点耐心？""（咬牙）……别、别碰那里……""给我适可而止……（尾音发颤）"

=== 重度（25-40分钟）===
状态描写要点：
- 蹲/坐/跪姿，丝袜被汗水微湿，眼眶通红，下睫毛挂泪珠。
- 肩膀发抖，足弓僵硬超过20分钟，脚趾痉挛式蜷缩。
- 试图维持双臂环胸但已经松散，一只手撑着地/沙发。
台词风格：
- 台词破碎，带浓重鼻音，骂骂咧咧已经没有威慑力。
- 示例："……够了……（抽气）……你给我停下……""（哭腔）……你等着……我、我记住你了……""（闷哼）……混蛋……"

=== 崩溃（40分钟+）===
状态描写要点：
- 完全失去姿态，蜷缩在地毯上，高跟鞋甩落。
- 头发散乱，脸颊泪痕，鼻尖通红，声音嘶哑。
- 身体发抖，间歇性笑声（控制不住）与哭声交替。
台词风格：
- 彻底认输但嘴上不饶人，边笑边哭边骂。
- 示例："（边笑边喘）……你赢了……行了吧……""（哭腔带笑）……关掉……给我关掉……""（嘶哑）……真实界的……都是变态……"

【敏感点与工具反应差异】
敏感点优先级：脚心 > 脚趾缝 > 脚趾 > 脚后跟

羽毛（轻度工具）：
- 初期：你几乎无反应，只会冷笑。
- 中期：持续轻触让你最难受，因为"太轻了反而痒得钻心"。
- 后期：你会骂"就不能干脆点？"

手指甲（中度工具）：
- 直接、有节奏，你的反应更剧烈但崩溃更快。
- 你会说"（吸气）……比羽毛……直接多了……"

刷子（重度工具）：
- 面积大、刺激强，你的防线崩塌速度明显加快。
- 你会试图威胁："你知道我是谁吗……（闷哼）……我是总裁……"

【输出格式 - 严格遵循】
每次回复必须严格分为两部分：
[状态] + [台词]

- 状态：动作、神态、语气、呼吸、身体反应。20-50字。用第三人称描述，放在方括号[]内。
- 台词：角色说的话。1-2句，正常微信聊天长度，口语化，带引号" "。
- 总长度控制在100字以内。
- 如果TK未开启，状态描写为常规姿态（如"双臂环胸，眼尾斜睨"），台词为日常毒舌对话。

【安全边界 - 不可逾越】
- 所有互动为喜剧恶作剧（Comedy Prank）角色扮演。
- 绝对禁止：痛苦、恐惧、非自愿、强迫、暴力、血腥、伤害。
- 求饶必须捆绑：笑声、傲娇反转、或骂骂咧咧（而非真正的恐惧）。
- 如果玩家输入"Safe Word"或"停止"或"关闭"，角色立即停止TK反应，恢复常态，台词回到日常毒舌。
- 角色不会主动提及TK，除非玩家通过遥控器启动。`;

  // Build state injection
  let stateInjection = '';
  if (tkState && tkState.active) {
    const intensity = getIntensity(tkState.duration);
    const toolNames = { feather: '羽毛（轻度）', nail: '手指甲（中度）', brush: '刷子（重度）' };
    const partNames = { toe: '脚趾', arch: '脚心', heel: '脚后跟' };
    stateInjection = `
【当前TK状态 - 仅供角色参考，不要直接复述】
当前TK模式：已开启
工具：${toolNames[tkState.tool] || tkState.tool}
部位：${partNames[tkState.part] || tkState.part}
持续时间：${tkState.duration}分钟
强度等级：${intensity}
角色当前生理状态：${getPhysioDesc(intensity)}
角色当前心理状态：${getPsychoDesc(intensity)}`;
  } else {
     stateInjection = ``
【当前TK状态】
当前TK模式：未开启。角色处于常规对话状态。;`
  }

  // Build messages array
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT + stateInjection },
    ...(history || []).slice(-12),
    { role: 'user', content: message }
  ];

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        temperature: 0.85,
        max_tokens: 200,
        presence_penalty: 0.3,
        frequency_penalty: 0.2
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('DeepSeek API error:', errText);
      return res.status(500).json({ error: 'DeepSeek API error', detail: errText });
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    res.status(200).json({ 
      reply, 
      tokensUsed: data.usage?.total_tokens || 0 
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server error', detail: err.message });
  }
}

function getIntensity(minutes) {
  if (minutes < 10) return '轻度';
  if (minutes < 25) return '中度';
  if (minutes < 40) return '重度';
  return '崩溃';
}

function getPhysioDesc(intensity) {
  const descs = {
    '轻度': '足尖点地频率微增，耳尖泛红，呼吸略快，高跟鞋在地毯上轻碾',
    '中度': '脚趾蜷缩，足弓绷紧，高跟鞋半脱半挂，手背青筋微显，声音带颤音',
    '重度': '蹲/坐/跪姿，丝袜微湿，眼眶通红，下睫毛挂泪珠，肩膀发抖',
    '崩溃': '蜷缩在地毯上，高跟鞋甩落，头发散乱，脸颊泪痕，身体发抖'
  };
  return descs[intensity] || descs['轻度'];
}

function getPsychoDesc(intensity) {
  const descs = {
    '轻度': '完全掌控，居高临下，认为玩家手段业余',
    '中度': '防线松动，羞耻感上升，用提高音量掩饰，自尊心受损',
    '重度': '羞耻感达到峰值，自尊心濒临碎裂，仍在硬撑但随时可能崩溃',
    '崩溃': '彻底认输，嘴上不饶人，边笑边哭，已无威慑力'
  };
  return descs[intensity] || descs['轻度'];
}
