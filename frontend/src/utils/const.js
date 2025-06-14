export const GAN = {
  甲: { id: 1, wuxing: '木' },
  乙: { id: 2, wuxing: '木' },
  丙: { id: 3, wuxing: '火' },
  丁: { id: 4, wuxing: '火' },
  戊: { id: 5, wuxing: '土' },
  己: { id: 6, wuxing: '土' },
  庚: { id: 7, wuxing: '金' },
  辛: { id: 8, wuxing: '金' },
  壬: { id: 9, wuxing: '水' },
  癸: { id: 10, wuxing: '水' }
}

export const ZHI = {
  子: { id: 1, wuxing: '水' },
  丑: { id: 2, wuxing: '土' },
  寅: { id: 3, wuxing: '木' },
  卯: { id: 4, wuxing: '木' },
  辰: { id: 5, wuxing: '土' },
  巳: { id: 6, wuxing: '火' },
  午: { id: 7, wuxing: '火' },
  未: { id: 8, wuxing: '土' },
  申: { id: 9, wuxing: '金' },
  酉: { id: 10, wuxing: '金' },
  戌: { id: 11, wuxing: '土' },
  亥: { id: 12, wuxing: '水' }
}

// 木火土金水 顺序

export const SHISHEN_LIUYAO = {
  木: {
    木: '兄弟',
    火: '子孙',
    土: '妻财',
    金: '官鬼',
    水: '父母'
  },
  火: {
    木: '父母',
    火: '兄弟',
    土: '子孙',
    金: '妻财',
    水: '官鬼'
  },
  土: {
    木: '官鬼',
    火: '父母',
    土: '兄弟',
    金: '子孙',
    水: '妻财'
  },
  金: {
    木: '妻财',
    火: '官鬼',
    土: '父母',
    金: '兄弟',
    水: '子孙'
  },
  水: {
    木: '子孙',
    火: '妻财',
    土: '官鬼',
    金: '父母',
    水: '兄弟'
  }
}
