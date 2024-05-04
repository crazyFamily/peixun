import { ref } from "vue"

export const useReimbursement = () => {
  const originTaxRate = ref(0)
  const originInvoices = ref([])
  // 计算不含税金额
  const getExcludingTaxAmt = (row) => {
    console.log(originInvoices.value, originTaxRate.value, '====>>>> 这里是计算税')
    // 当关联了专票之后取专票里的税率，不含税金额=差额征税金额+（报销行金额-差额征税金额）/（1+专票税率），没有关联专票的时候税率取当前报销行的税率，
    let sum = 0
    const resultInvoices = (originInvoices.value && originInvoices.value.length) ? originInvoices.value : row.invoices
    if (resultInvoices && resultInvoices.length) {
      let balanceTaxAmount = 0
      let taxRate = 0
      sum = resultInvoices.forEach((v) => {
        taxRate = v.taxRate
        balanceTaxAmount += Number.parseFloat(v.balanceTaxAmount || 0)
      })
      sum = balanceTaxAmount + (Number.parseFloat(row.amt || 0) - balanceTaxAmount) / (1 + Number.parseFloat(taxRate || 0) / 100)
    } else {
      // 这里的计算，先看明细行中的值，再看自己的
      sum = Number.parseFloat(row.amt || 0) / (1 + Number.parseFloat(originTaxRate.value || row.taxRate || 0) / 100)
    }
    sum = sum.toFixed(2)
    row.excludingTaxAmt = sum
    return sum
  }
  // 含税金额计算规则
  const getRowTax = (row) => {
    let sum = 0
    // 税额 = 本次报销金额 - 不含税金额
    sum = (Number.parseFloat(row.amt || 0) - row.excludingTaxAmt).toFixed(2)
    row.taxAmt = sum
    return sum
  }
  return {
    getExcludingTaxAmt,
    getRowTax,
    originTaxRate,
    originInvoices
  }
}