const { DatabaseWrapper } = require('./connection');
const db = require('./connection');

async function initialize() {
  await DatabaseWrapper.initialize();

  db.exec(`
  CREATE TABLE IF NOT EXISTS cards (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    name_en TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('major', 'minor')),
    suit TEXT CHECK(suit IN ('wands', 'cups', 'swords', 'pentacles')),
    number INTEGER,
    image_url TEXT,
    keywords TEXT,
    upright_meaning TEXT,
    reversed_meaning TEXT,
    symbolism TEXT,
    element TEXT,
    astrological TEXT
  );

  CREATE TABLE IF NOT EXISTS spreads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description TEXT,
    positions TEXT,
    card_count INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS readings (
    id TEXT PRIMARY KEY,
    spread_id INTEGER,
    cards_drawn TEXT,
    question TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (spread_id) REFERENCES spreads(id)
  );
`);

const majorArcana = [
  { id: 0, name: '愚者', name_en: 'The Fool', number: 0, keywords: '新的开始,冒险,天真,自发性', upright_meaning: '新的开始、冒险、纯真、自发性、自由精神', reversed_meaning: '鲁莽、愚蠢的决定、分心、缺乏方向', symbolism: '悬崖边的旅人，象征无畏与未知；白色玫瑰代表纯洁；小狗象征本能', element: '气', astrological: '天王星' },
  { id: 1, name: '魔术师', name_en: 'The Magician', number: 1, keywords: '意志力,专注,创造力,技能', upright_meaning: '意志力、专注、创造力、技能、资源充足', reversed_meaning: '操控、欺骗、缺乏焦点、滥用能力', symbolism: '无限符号象征无限可能；四元素工具代表掌控力；红白服装象征热情与纯洁', element: '火', astrological: '水星' },
  { id: 2, name: '女祭司', name_en: 'The High Priestess', number: 2, keywords: '直觉,潜意识,神秘,内在智慧', upright_meaning: '直觉、潜意识、神秘、内在智慧、静观其变', reversed_meaning: '隐藏的秘密、压抑直觉、肤浅、信息不足', symbolism: '黑白柱子代表二元对立；月亮冠冕象征潜意识；卷轴代表隐藏的知识', element: '水', astrological: '月亮' },
  { id: 3, name: '皇后', name_en: 'The Empress', number: 3, keywords: '丰饶,母性,自然,感官享受', upright_meaning: '丰饶、母性、自然、感官享受、创造力', reversed_meaning: '过度依赖、缺乏成长、空虚、控制欲', symbolism: '金星符号代表爱与美；麦田象征丰收；河流代表生命力', element: '土', astrological: '金星' },
  { id: 4, name: '皇帝', name_en: 'The Emperor', number: 4, keywords: '权威,结构,稳定,领导力', upright_meaning: '权威、结构、稳定、领导力、父亲形象', reversed_meaning: '专制、僵化、缺乏纪律、过度控制', symbolism: '王座象征权力；权杖代表统治力；盔甲表示防御与决心', element: '火', astrological: '白羊座' },
  { id: 5, name: '教皇', name_en: 'The Hierophant', number: 5, keywords: '传统,信仰,精神指引,教育', upright_meaning: '传统、信仰、精神指引、教育、遵循规范', reversed_meaning: '反叛传统、个人信念、质疑权威、非传统', symbolism: '三重冠代表三层世界；钥匙象征天国之门；信徒代表传承', element: '土', astrological: '金牛座' },
  { id: 6, name: '恋人', name_en: 'The Lovers', number: 6, keywords: '爱情,和谐,选择,关系', upright_meaning: '爱情、和谐、选择、关系、价值观一致', reversed_meaning: '不和谐、失衡、错误的选择、价值观冲突', symbolism: '天使祝福象征神圣结合；两棵树代表阴阳；裸体表示真诚', element: '风', astrological: '双子座' },
  { id: 7, name: '战车', name_en: 'The Chariot', number: 7, keywords: '胜利,决心,控制,意志力', upright_meaning: '胜利、决心、控制、意志力、克服障碍', reversed_meaning: '失控、攻击性、缺乏方向、受阻', symbolism: '黑白狮身人面像代表对立力量；星辰华盖象征神圣指引', element: '水', astrological: '巨蟹座' },
  { id: 8, name: '力量', name_en: 'Strength', number: 8, keywords: '勇气,毅力,耐心,内在力量', upright_meaning: '勇气、毅力、耐心、内在力量、温柔的控制', reversed_meaning: '自我怀疑、软弱、缺乏勇气、失控', symbolism: '女性驯服狮子象征以柔克刚；无限符号代表永恒力量', element: '火', astrological: '狮子座' },
  { id: 9, name: '隐士', name_en: 'The Hermit', number: 9, keywords: '内省,孤独,寻找真理,智慧', upright_meaning: '内省、孤独、寻找真理、智慧、灵魂探索', reversed_meaning: '孤立、退缩、拒绝建议、过度封闭', symbolism: '灯笼中的星星指引方向；登山杖代表精神支撑；灰袍象征谦逊', element: '土', astrological: '处女座' },
  { id: 10, name: '命运之轮', name_en: 'Wheel of Fortune', number: 10, keywords: '命运,循环,转折点,机遇', upright_meaning: '命运、循环、转折点、机遇、好运', reversed_meaning: '厄运、抵抗变化、循环中断、失控', symbolism: '轮子代表命运循环；四生物象征四元素；字母代表神圣之名', element: '火', astrological: '木星' },
  { id: 11, name: '正义', name_en: 'Justice', number: 11, keywords: '公正,真理,因果,法律', upright_meaning: '公正、真理、因果、法律、公平裁决', reversed_meaning: '不公正、偏见、逃避责任、不诚实', symbolism: '天平代表公平；剑象征真理与决断；紫色长袍象征智慧', element: '风', astrological: '天秤座' },
  { id: 12, name: '倒吊人', name_en: 'The Hanged Man', number: 12, keywords: '牺牲,新视角,等待,放下', upright_meaning: '牺牲、新视角、等待、放下、暂停', reversed_meaning: '拖延、无谓牺牲、固执、抗拒改变', symbolism: '倒挂姿势代表换个角度看世界；光环象征启蒙；T型树代表生命', element: '水', astrological: '海王星' },
  { id: 13, name: '死神', name_en: 'Death', number: 13, keywords: '结束,转变,重生,放下过去', upright_meaning: '结束、转变、重生、放下过去、新的开始', reversed_meaning: '抗拒改变、停滞、恐惧转变、无法释怀', symbolism: '骷髅骑士代表不可逆转的改变；倒下的人象征旧事物消亡；朝阳代表新生', element: '水', astrological: '天蝎座' },
  { id: 14, name: '节制', name_en: 'Temperance', number: 14, keywords: '平衡,调和,耐心,中庸', upright_meaning: '平衡、调和、耐心、中庸、融合', reversed_meaning: '失衡、过度、缺乏耐心、冲突', symbolism: '天使倒水代表元素融合；道路通往永恒；鸢尾花象征与神连接', element: '火', astrological: '射手座' },
  { id: 15, name: '恶魔', name_en: 'The Devil', number: 15, keywords: '束缚,物质主义,沉迷,阴影', upright_meaning: '束缚、物质主义、沉迷、阴影面、依赖', reversed_meaning: '解脱、独立、觉醒、打破束缚', symbolism: '锁链代表束缚；火炬象征虚假光明；裸体表示原始本性', element: '土', astrological: '摩羯座' },
  { id: 16, name: '塔', name_en: 'The Tower', number: 16, keywords: '突变,灾难,觉醒,破坏', upright_meaning: '突变、灾难、觉醒、破坏、意外变化', reversed_meaning: '避免灾难、恐惧改变、延迟不可避免的事', symbolism: '闪电代表突然启示；坠落的人象征旧信念崩塌；火焰代表净化', element: '火', astrological: '火星' },
  { id: 17, name: '星星', name_en: 'The Star', number: 17, keywords: '希望,灵感,宁静,治愈', upright_meaning: '希望、灵感、宁静、治愈、信心', reversed_meaning: '失去希望、缺乏信心、绝望、 disconnected', symbolism: '倒水女子代表给予与接受；星星象征希望与指引；裸体表示纯真', element: '风', astrological: '水瓶座' },
  { id: 18, name: '月亮', name_en: 'The Moon', number: 18, keywords: '幻觉,恐惧,焦虑,潜意识', upright_meaning: '幻觉、恐惧、焦虑、潜意识、迷惑', reversed_meaning: '释放恐惧、真相浮现、清晰、克服焦虑', symbolism: '月亮代表潜意识；狗和狼象征文明与野性；龙虾代表深层恐惧', element: '水', astrological: '双鱼座' },
  { id: 19, name: '太阳', name_en: 'The Sun', number: 19, keywords: '成功,快乐,活力,积极', upright_meaning: '成功、快乐、活力、积极、光明', reversed_meaning: '暂时的挫折、缺乏自信、过度乐观', symbolism: '太阳代表生命力；孩童象征纯真快乐；向日葵代表追随光明', element: '火', astrological: '太阳' },
  { id: 20, name: '审判', name_en: 'Judgement', number: 20, keywords: '重生,召唤,宽恕,觉醒', upright_meaning: '重生、召唤、宽恕、觉醒、反思', reversed_meaning: '自我怀疑、拒绝改变、忽视召唤、自责', symbolism: '天使号角代表神圣召唤；升起的人群象征复活；十字架旗帜代表救赎', element: '火', astrological: '冥王星' },
  { id: 21, name: '世界', name_en: 'The World', number: 21, keywords: '完成,成就,圆满,整合', upright_meaning: '完成、成就、圆满、整合、达成目标', reversed_meaning: '未完成、缺乏 closure、延迟、不满足', symbolism: '花环代表圆满；舞者象征平衡与和谐；四生物代表四元素完整', element: '土', astrological: '土星' }
];

const minorArcana = [
  // Wands (权杖) - Fire element
  { id: 22, name: '权杖王牌', name_en: 'Ace of Wands', type: 'minor', suit: 'wands', number: 1, keywords: '创造,新开始,热情,灵感', upright_meaning: '创造、新开始、热情、灵感、潜力', reversed_meaning: '缺乏动力、延迟、错失机会', symbolism: '手从云中伸出握着发芽的权杖，象征创造力的萌芽', element: '火', astrological: '' },
  { id: 23, name: '权杖二', name_en: 'Two of Wands', suit: 'wands', number: 2, keywords: '计划,决策,未来展望', upright_meaning: '计划、决策、未来展望、野心', reversed_meaning: '缺乏计划、优柔寡断、恐惧未知', symbolism: '手持地球仪象征掌控世界；城堡代表安全区', element: '火', astrological: '' },
  { id: 24, name: '权杖三', name_en: 'Three of Wands', suit: 'wands', number: 3, keywords: '扩张,远见,进展,机会', upright_meaning: '扩张、远见、进展、机会、前瞻', reversed_meaning: '延迟、挫折、缺乏远见', symbolism: '船只出海象征贸易与扩张；三根权杖代表稳固基础', element: '火', astrological: '' },
  { id: 25, name: '权杖四', name_en: 'Four of Wands', suit: 'wands', number: 4, keywords: '庆祝,和谐,家庭,稳定', upright_meaning: '庆祝、和谐、家庭、稳定、归属', reversed_meaning: '不稳定、冲突、家庭问题', symbolism: '花环装饰的权杖代表庆典；城堡象征家园', element: '火', astrological: '' },
  { id: 26, name: '权杖五', name_en: 'Five of Wands', suit: 'wands', number: 5, keywords: '竞争,冲突,紧张,挑战', upright_meaning: '竞争、冲突、紧张、挑战、争论', reversed_meaning: '回避冲突、内耗、和解', symbolism: '五人混战代表竞争与冲突；不同颜色的服装象征多样性', element: '火', astrological: '' },
  { id: 27, name: '权杖六', name_en: 'Six of Wands', suit: 'wands', number: 6, keywords: '胜利,成功,认可,自信', upright_meaning: '胜利、成功、认可、自信、好消息', reversed_meaning: '失败、缺乏认可、自负、延迟', symbolism: '骑马的胜利者头戴桂冠；群众欢呼代表公众认可', element: '火', astrological: '' },
  { id: 28, name: '权杖七', name_en: 'Seven of Wands', suit: 'wands', number: 7, keywords: '坚持,防御,挑战,决心', upright_meaning: '坚持、防御、挑战、决心、保卫立场', reversed_meaning: '放弃、被压倒、缺乏支持', symbolism: '高处的人防御下方攻击；六根权杖代表多方挑战', element: '火', astrological: '' },
  { id: 29, name: '权杖八', name_en: 'Eight of Wands', suit: 'wands', number: 8, keywords: '速度,行动,进展,旅行', upright_meaning: '速度、行动、进展、旅行、快速变化', reversed_meaning: '延迟、停滞、挫折、缓慢', symbolism: '八根权杖飞过天空象征快速行动；河流代表前进动力', element: '火', astrological: '' },
  { id: 30, name: '权杖九', name_en: 'Nine of Wands', suit: 'wands', number: 9, keywords: '坚韧,防御,警惕,经验', upright_meaning: '坚韧、防御、警惕、经验、最后防线', reversed_meaning: '疲惫、偏执、过度防御', symbolism: '受伤但仍站立的人代表坚韧；八根竖立的权杖是屏障', element: '火', astrological: '' },
  { id: 31, name: '权杖十', name_en: 'Ten of Wands', suit: 'wands', number: 10, keywords: '负担,责任,压力,辛劳', upright_meaning: '负担、责任、压力、辛劳、过度承担', reversed_meaning: '释放负担、委派、减轻压力', symbolism: '抱着十根权杖的人象征沉重负担；弯曲的脊背代表压力', element: '火', astrological: '' },
  { id: 32, name: '权杖侍从', name_en: 'Page of Wands', suit: 'wands', number: 11, keywords: '探索,热情,自由,新消息', upright_meaning: '探索、热情、自由、新消息、冒险精神', reversed_meaning: '缺乏方向、急躁、坏消息', symbolism: '年轻人手持发芽权杖；沙漠背景象征未知领域', element: '火', astrological: '' },
  { id: 33, name: '权杖骑士', name_en: 'Knight of Wands', suit: 'wands', number: 12, keywords: '行动,冒险,冲动,热情', upright_meaning: '行动、冒险、冲动、热情、充满魅力', reversed_meaning: '鲁莽、缺乏自制、延迟、挫折', symbolism: '奔腾的骏马代表行动力；火焰图案象征热情', element: '火', astrological: '' },
  { id: 34, name: '权杖王后', name_en: 'Queen of Wands', suit: 'wands', number: 13, keywords: '自信,魅力,决心,活力', upright_meaning: '自信、魅力、决心、活力、独立', reversed_meaning: '嫉妒、控制欲、霸道、缺乏自信', symbolism: '黑猫象征直觉；向日葵代表温暖；权杖代表力量', element: '火', astrological: '' },
  { id: 35, name: '权杖国王', name_en: 'King of Wands', suit: 'wands', number: 14, keywords: '领导力,远见,魅力,创业', upright_meaning: '领导力、远见、魅力、创业、大胆', reversed_meaning: '专制、冲动、不成熟的领导', symbolism: ' Salamander代表转化力量；王座上的狮子象征权威', element: '火', astrological: '' },

  // Cups (圣杯) - Water element
  { id: 36, name: '圣杯王牌', name_en: 'Ace of Cups', suit: 'cups', number: 1, keywords: '爱,新感情,同情,灵性', upright_meaning: '爱、新感情、同情、灵性、情感满溢', reversed_meaning: '情感空虚、压抑、冷漠', symbolism: ' overflowing的杯子代表情感满溢；鸽子象征圣灵；莲花代表精神觉醒', element: '水', astrological: '' },
  { id: 37, name: '圣杯二', name_en: 'Two of Cups', suit: 'cups', number: 2, keywords: '爱情,和谐,吸引,结合', upright_meaning: '爱情、和谐、吸引、结合、伙伴关系', reversed_meaning: '分离、失衡、误解、关系问题', symbolism: '两人交换杯子象征情感交流；双蛇杖代表和谐', element: '水', astrological: '' },
  { id: 38, name: '圣杯三', name_en: 'Three of Cups', suit: 'cups', number: 3, keywords: '友谊,庆祝,社交,快乐', upright_meaning: '友谊、庆祝、社交、快乐、团聚', reversed_meaning: '过度社交、孤立、八卦、不和谐', symbolism: '三人举杯庆祝；果实代表丰收；花环象征欢乐', element: '水', astrological: '' },
  { id: 39, name: '圣杯四', name_en: 'Four of Cups', suit: 'cups', number: 4, keywords: '冷漠,不满,沉思,拒绝', upright_meaning: '冷漠、不满、沉思、拒绝机会', reversed_meaning: '接受新机会、觉醒、感恩', symbolism: '树下沉思的人忽略云中递来的杯子；代表错失机会', element: '水', astrological: '' },
  { id: 40, name: '圣杯五', name_en: 'Five of Cups', suit: 'cups', number: 5, keywords: '失落,悲伤,遗憾,失望', upright_meaning: '失落、悲伤、遗憾、失望、聚焦负面', reversed_meaning: '接受损失、前进、希望、治愈', symbolism: '倒下的三个杯子代表损失；两个立着的杯子代表仍有希望', element: '水', astrological: '' },
  { id: 41, name: '圣杯六', name_en: 'Six of Cups', suit: 'cups', number: 6, keywords: '怀旧,童年,纯真,回忆', upright_meaning: '怀旧、童年、纯真、回忆、美好时光', reversed_meaning: '活在过去、不切实际、成长', symbolism: '孩童赠送花朵象征纯真；古堡代表过去', element: '水', astrological: '' },
  { id: 42, name: '圣杯七', name_en: 'Seven of Cups', suit: 'cups', number: 7, keywords: '幻想,选择,诱惑,梦想', upright_meaning: '幻想、选择、诱惑、梦想、想象', reversed_meaning: '清醒、做出选择、面对现实', symbolism: '云中七个杯子装着不同诱惑；人影代表选择者', element: '水', astrological: '' },
  { id: 43, name: '圣杯八', name_en: 'Eight of Cups', suit: 'cups', number: 8, keywords: '离开,放弃,寻找,失望', upright_meaning: '离开、放弃、寻找更深层意义、失望', reversed_meaning: '害怕改变、停滞、回到旧模式', symbolism: '离开八个杯子的人象征放弃物质追求；月亮代表潜意识召唤', element: '水', astrological: '' },
  { id: 44, name: '圣杯九', name_en: 'Nine of Cups', suit: 'cups', number: 9, keywords: '满足,愿望成真,舒适,自满', upright_meaning: '满足、愿望成真、舒适、自满、幸福', reversed_meaning: '不满足、贪婪、虚假满足', symbolism: '满意的人双臂交叉；九个杯子整齐排列代表圆满', element: '水', astrological: '' },
  { id: 45, name: '圣杯十', name_en: 'Ten of Cups', suit: 'cups', number: 10, keywords: '幸福,和谐,家庭,完美', upright_meaning: '幸福、和谐、家庭、完美、情感满足', reversed_meaning: '家庭冲突、破碎的关系、不和谐', symbolism: '彩虹上的十个杯子；幸福家庭代表理想生活', element: '水', astrological: '' },
  { id: 46, name: '圣杯侍从', name_en: 'Page of Cups', suit: 'cups', number: 11, keywords: '创意,直觉,新感情,消息', upright_meaning: '创意、直觉、新感情、好消息、敏感', reversed_meaning: '情绪化、不成熟、逃避情感', symbolism: '年轻人手持有鱼跳出的杯子；鱼象征潜意识的创意', element: '水', astrological: '' },
  { id: 47, name: '圣杯骑士', name_en: 'Knight of Cups', suit: 'cups', number: 12, keywords: '浪漫,魅力,想象,追求', upright_meaning: '浪漫、魅力、想象、追求理想、温柔', reversed_meaning: '不切实际、情绪化、失望、花心', symbolism: '骑马的骑士手持圣杯；白马代表纯洁动机', element: '水', astrological: '' },
  { id: 48, name: '圣杯王后', name_en: 'Queen of Cups', suit: 'cups', number: 13, keywords: '直觉,同情,情感支持,治愈', upright_meaning: '直觉、同情、情感支持、治愈、关怀', reversed_meaning: '过度敏感、依赖、情绪不稳定', symbolism: '装饰精美的杯子代表深层情感；王座在海边象征情感深度', element: '水', astrological: '' },
  { id: 49, name: '圣杯国王', name_en: 'King of Cups', suit: 'cups', number: 14, keywords: '情商,平衡,同情,成熟', upright_meaning: '情商、平衡、同情、成熟、情绪稳定', reversed_meaning: '情绪操控、冷漠、压抑情感', symbolism: '稳坐海中的国王代表掌控情感；鱼和船象征潜意识与意识', element: '水', astrological: '' },

  // Swords (宝剑) - Air element
  { id: 50, name: '宝剑王牌', name_en: 'Ace of Swords', suit: 'swords', number: 1, keywords: '清晰,真理,突破,正义', upright_meaning: '清晰、真理、突破、正义、新洞察', reversed_meaning: '混乱、谎言、伤害、模糊', symbolism: '手从云中伸出握着宝剑；皇冠代表胜利；棕榈叶象征胜利', element: '风', astrological: '' },
  { id: 51, name: '宝剑二', name_en: 'Two of Swords', suit: 'swords', number: 2, keywords: '僵局,选择,回避,平衡', upright_meaning: '僵局、选择、回避、平衡、难以决定', reversed_meaning: '信息过载、优柔寡断、真相浮现', symbolism: '蒙眼女子交叉双剑；月亮代表直觉；水面代表情感', element: '风', astrological: '' },
  { id: 52, name: '宝剑三', name_en: 'Three of Swords', suit: 'swords', number: 3, keywords: '心碎,悲伤,痛苦,分离', upright_meaning: '心碎、悲伤、痛苦、分离、伤害', reversed_meaning: '治愈、原谅、释放痛苦、恢复', symbolism: '三把剑刺穿红心；雨云代表悲伤；但云后有光明', element: '风', astrological: '' },
  { id: 53, name: '宝剑四', name_en: 'Four of Swords', suit: 'swords', number: 4, keywords: '休息,恢复,沉思,撤退', upright_meaning: '休息、恢复、沉思、撤退、冥想', reversed_meaning: '倦怠、不安、缺乏休息、焦躁', symbolism: '骑士躺在教堂休息；三把剑代表过去的战斗；一把悬挂代表暂停', element: '风', astrological: '' },
  { id: 54, name: '宝剑五', name_en: 'Five of Swords', suit: 'swords', number: 5, keywords: '冲突,失败,损失,背叛', upright_meaning: '冲突、失败、损失、背叛、不光彩的胜利', reversed_meaning: '和解、原谅、放下、接受失败', symbolism: '胜利者收集敌人的剑；离去的人代表失败；云代表不确定性', element: '风', astrological: '' },
  { id: 55, name: '宝剑六', name_en: 'Six of Swords', suit: 'swords', number: 6, keywords: '过渡,改变,离开,前进', upright_meaning: '过渡、改变、离开、前进、治愈之旅', reversed_meaning: '停滞、抵抗改变、未解决的问题', symbolism: '船载着人离开；六把剑代表思想；平静的水面代表更好的未来', element: '风', astrological: '' },
  { id: 56, name: '宝剑七', name_en: 'Seven of Swords', suit: 'swords', number: 7, keywords: '欺骗,策略,隐秘,不诚实', upright_meaning: '欺骗、策略、隐秘、不诚实、偷窃', reversed_meaning: '诚实、面对真相、被抓到、良心发现', symbolism: '偷偷带走五把剑的人；留下的两把剑代表被发现的风险', element: '风', astrological: '' },
  { id: 57, name: '宝剑八', name_en: 'Eight of Swords', suit: 'swords', number: 8, keywords: '束缚,限制,无助,困境', upright_meaning: '束缚、限制、无助、困境、自我设限', reversed_meaning: '释放、新视角、自由、 empowerment', symbolism: '被绑住的女子；八把剑形成牢笼；但束缚并不紧，可以挣脱', element: '风', astrological: '' },
  { id: 58, name: '宝剑九', name_en: 'Nine of Swords', suit: 'swords', number: 9, keywords: '焦虑,噩梦,恐惧,失眠', upright_meaning: '焦虑、噩梦、恐惧、失眠、担忧', reversed_meaning: '释放恐惧、面对问题、希望、治愈', symbolism: '床上坐起的人双手掩面；九把剑挂在墙上；代表精神痛苦', element: '风', astrological: '' },
  { id: 59, name: '宝剑十', name_en: 'Ten of Swords', suit: 'swords', number: 10, keywords: '结束,毁灭,低谷,背叛', upright_meaning: '结束、毁灭、低谷、背叛、痛苦结局', reversed_meaning: '生存、复兴、重新开始、最坏已过', symbolism: '被十把剑刺穿的人；黑暗天空；但东方有黎明曙光', element: '风', astrological: '' },
  { id: 60, name: '宝剑侍从', name_en: 'Page of Swords', suit: 'swords', number: 11, keywords: '好奇,消息,警觉,新想法', upright_meaning: '好奇、消息、警觉、新想法、沟通', reversed_meaning: '八卦、欺骗、缺乏专注', symbolism: '年轻人手持宝剑站在风中；云和鸟代表思想与沟通', element: '风', astrological: '' },
  { id: 61, name: '宝剑骑士', name_en: 'Knight of Swords', suit: 'swords', number: 12, keywords: '行动,冲动,决心,野心', upright_meaning: '行动、冲动、决心、野心、快速思考', reversed_meaning: '鲁莽、无方向、延迟、攻击性', symbolism: '冲锋的骑士；马匹奔腾代表快速行动；云和风代表思想速度', element: '风', astrological: '' },
  { id: 62, name: '宝剑王后', name_en: 'Queen of Swords', suit: 'swords', number: 13, keywords: '清晰,独立,直接,智慧', upright_meaning: '清晰、独立、直接、智慧、客观', reversed_meaning: '冷酷、苛刻、刻薄、过于理性', symbolism: '王座上的王后手持宝剑；云代表思想；蝴蝶代表转化', element: '风', astrological: '' },
  { id: 63, name: '宝剑国王', name_en: 'King of Swords', suit: 'swords', number: 14, keywords: '权威,真理,智力,公正', upright_meaning: '权威、真理、智力、公正、清晰思维', reversed_meaning: '独裁、操控、冷酷、滥用权力', symbolism: '国王手持直立的宝剑代表公正；紫色长袍象征智慧', element: '风', astrological: '' },

  // Pentacles (星币) - Earth element
  { id: 64, name: '星币王牌', name_en: 'Ace of Pentacles', suit: 'pentacles', number: 1, keywords: '新机会,财富,繁荣,物质', upright_meaning: '新机会、财富、繁荣、物质、新事业', reversed_meaning: '错失机会、财务损失、缺乏规划', symbolism: '云中伸出的手托着星币；花园代表物质世界；拱门代表机会', element: '土', astrological: '' },
  { id: 65, name: '星币二', name_en: 'Two of Pentacles', suit: 'pentacles', number: 2, keywords: '平衡,优先级,适应,管理', upright_meaning: '平衡、优先级、适应、管理、多任务', reversed_meaning: '失衡、超负荷、混乱、财务问题', symbolism: '杂耍两枚星币的人；无限符号代表平衡；海浪代表起伏', element: '土', astrological: '' },
  { id: 66, name: '星币三', name_en: 'Three of Pentacles', suit: 'pentacles', number: 3, keywords: '团队合作,技能,学习,建设', upright_meaning: '团队合作、技能、学习、建设、协作', reversed_meaning: '缺乏合作、平庸、不和谐', symbolism: '工匠在教堂工作；三人讨论代表协作；星币代表成果', element: '土', astrological: '' },
  { id: 67, name: '星币四', name_en: 'Four of Pentacles', suit: 'pentacles', number: 4, keywords: '稳定,安全,占有,保守', upright_meaning: '稳定、安全、占有、保守、财务安全', reversed_meaning: '贪婪、挥霍、过度消费、不安全感', symbolism: '紧抱星币的人代表守财；头顶、怀抱、脚踏代表紧紧抓住', element: '土', astrological: '' },
  { id: 68, name: '星币五', name_en: 'Five of Pentacles', suit: 'pentacles', number: 5, keywords: '困难,贫困,孤立,逆境', upright_meaning: '困难、贫困、孤立、逆境、财务损失', reversed_meaning: '改善、援助、希望、走出困境', symbolism: '风雪中行走的穷人；彩色玻璃窗代表被忽视的帮助', element: '土', astrological: '' },
  { id: 69, name: '星币六', name_en: 'Six of Pentacles', suit: 'pentacles', number: 6, keywords: '慈善,公平,给予,接受', upright_meaning: '慈善、公平、给予、接受、慷慨', reversed_meaning: '权力不平衡、债务、控制、自私', symbolism: '商人分发钱币给穷人；天平代表公平给予', element: '土', astrological: '' },
  { id: 70, name: '星币七', name_en: 'Seven of Pentacles', suit: 'pentacles', number: 7, keywords: '耐心,投资,成长,评估', upright_meaning: '耐心、投资、成长、评估、长期规划', reversed_meaning: '缺乏耐心、短期思维、浪费努力', symbolism: '农夫看着生长的作物；七枚星币代表等待收获', element: '土', astrological: '' },
  { id: 71, name: '星币八', name_en: 'Eight of Pentacles', suit: 'pentacles', number: 8, keywords: '勤奋,技能,精通,专注', upright_meaning: '勤奋、技能、精通、专注、学徒', reversed_meaning: '缺乏专注、完美主义、无聊', symbolism: '工匠专注雕刻星币；代表精益求精的工匠精神', element: '土', astrological: '' },
  { id: 72, name: '星币九', name_en: 'Nine of Pentacles', suit: 'pentacles', number: 9, keywords: '独立,自给自足,奢侈,成就', upright_meaning: '独立、自给自足、奢侈、成就、优雅', reversed_meaning: '依赖、财务不安全、虚荣', symbolism: '花园中的优雅女子；葡萄代表丰收；猎鹰代表独立', element: '土', astrological: '' },
  { id: 73, name: '星币十', name_en: 'Ten of Pentacles', suit: 'pentacles', number: 10, keywords: '财富,遗产,家庭,传承', upright_meaning: '财富、遗产、家庭、传承、长期成功', reversed_meaning: '家庭冲突、财务失败、失去传承', symbolism: '家族场景；老人代表传承；狗代表忠诚；拱门代表家庭', element: '土', astrological: '' },
  { id: 74, name: '星币侍从', name_en: 'Page of Pentacles', suit: 'pentacles', number: 11, keywords: '学习,新机会,勤奋,新计划', upright_meaning: '学习、新机会、勤奋、新计划、学生', reversed_meaning: '缺乏进步、懒惰、不切实际', symbolism: '年轻人专注看着星币；田野代表成长潜力', element: '土', astrological: '' },
  { id: 75, name: '星币骑士', name_en: 'Knight of Pentacles', suit: 'pentacles', number: 12, keywords: '勤奋,可靠,谨慎,耐心', upright_meaning: '勤奋、可靠、谨慎、耐心、努力工作', reversed_meaning: '懒惰、无聊、停滞、过于保守', symbolism: '静止的马代表稳定；骑士手持星币代表专注', element: '土', astrological: '' },
  { id: 76, name: '星币王后', name_en: 'Queen of Pentacles', suit: 'pentacles', number: 13, keywords: '务实, nurturing,舒适,财务', upright_meaning: '务实、 nurturing、舒适、财务安全、家庭', reversed_meaning: '过度关注物质、忽视自我、依赖', symbolism: '王座上的女子抱着星币；花园代表丰饶；兔子代表活力', element: '土', astrological: '' },
  { id: 77, name: '星币国王', name_en: 'King of Pentacles', suit: 'pentacles', number: 14, keywords: '成功,繁荣,稳定,商业', upright_meaning: '成功、繁荣、稳定、商业、财富', reversed_meaning: '贪婪、挥霍、物质主义、固执', symbolism: '国王手持星币坐在装饰葡萄藤的王座上；代表物质成功', element: '土', astrological: '' }
];

const allCards = [...majorArcana.map(c => ({ ...c, type: 'major' })), ...minorArcana.map(c => ({ ...c, type: 'minor' }))];

const insertCard = db.prepare(`
  INSERT OR REPLACE INTO cards (id, name, name_en, type, suit, number, keywords, upright_meaning, reversed_meaning, symbolism, element, astrological)
  VALUES (@id, @name, @name_en, @type, @suit, @number, @keywords, @upright_meaning, @reversed_meaning, @symbolism, @element, @astrological)
`);

const insertMany = db.transaction((cards) => {
  for (const card of cards) {
    insertCard.run(card);
  }
});

insertMany(allCards);

const spreads = [
  { name: '三卡牌阵', name_en: 'Three Card Spread', description: '最简单的牌阵，可解读过去-现在-未来或情况-行动-结果', positions: JSON.stringify(['第一张：过去/情况', '第二张：现在/行动', '第三张：未来/结果']), card_count: 3 },
  { name: '凯尔特十字', name_en: 'Celtic Cross', description: '最经典的复杂牌阵，提供全面深入的解读', positions: JSON.stringify(['第一张：现状', '第二张：挑战', '第三张：过去', '第四张：未来', '第五张：可能结果', '第六张：近期未来', '第七张：自我认知', '第八张：环境影响', '第九张：希望与恐惧', '第十张：最终结果']), card_count: 10 },
  { name: '关系牌阵', name_en: 'Relationship Spread', description: '专门用于解读两人关系的牌阵', positions: JSON.stringify(['第一张：问卜者', '第二张：对方', '第三张：关系现状', '第四张：关系挑战', '第五张：关系未来']), card_count: 5 },
  { name: '单牌占卜', name_en: 'Single Card', description: '抽取一张牌获取当日指引或简单问题的答案', positions: JSON.stringify(['今日指引/问题答案']), card_count: 1 },
  { name: '五牌阵', name_en: 'Five Card Cross', description: '十字形牌阵，提供平衡全面的解读', positions: JSON.stringify(['第一张：过去', '第二张：现在', '第三张：未来', '第四张：建议', '第五张：结果']), card_count: 5 }
];

const insertSpread = db.prepare(`
  INSERT OR REPLACE INTO spreads (name, name_en, description, positions, card_count)
  VALUES (@name, @name_en, @description, @positions, @card_count)
`);

const insertManySpreads = db.transaction((spreadsData) => {
  for (const spread of spreadsData) {
    insertSpread.run(spread);
  }
});

insertManySpreads(spreads);

  console.log('Database initialized successfully with 78 cards and 5 spreads');
  db.close();
}

initialize().catch(console.error);
