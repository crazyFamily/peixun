export const quarterMap = [
    {
      label: '一季度',
      value: {
        start: '01-01',
        end: '03-31'
      }
    },
    {
      label: '二季度',
      value: {
        start: '04-01',
        end: '06-30'
      }
    },
    {
      label: '三季度',
      value: {
        start: '07-01',
        end: '09-30'
      }
    },
    {
      label: '四季度',
      value: {
        start: '10-01',
        end: '12-31'
      }
    }
  ]
  
  export const quarterArray = quarterMap.map(v => v.label)
  
  export const halfYearMap = [
    {
      label: '上半年',
      value: {
        start: '01-01',
        end: '06-30'
      }
    },
    {
      label: '下半年',
      value: {
        start: '07-01',
        end: '12-31'
      }
    }
  ]
  
  export const halfYearArray = halfYearMap.map(v => v.label)
  