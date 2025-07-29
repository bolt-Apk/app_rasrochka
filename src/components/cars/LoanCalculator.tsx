import React, { useState, useEffect } from 'react'
import { Calculator } from 'lucide-react'
import { Input } from '../ui/Input'
import { Card, CardContent, CardHeader } from '../ui/Card'
import { formatPrice, calculateMonthlyPayment } from '../../lib/utils'

interface LoanCalculatorProps {
  carPrice: number
  onCalculate: (data: {
    loanAmount: number
    downPayment: number
    loanTerm: number
    monthlyPayment: number
  }) => void
}

export function LoanCalculator({ carPrice, onCalculate }: LoanCalculatorProps) {
  const [downPayment, setDownPayment] = useState(carPrice * 0.2) // 20% по умолчанию
  const [loanTerm, setLoanTerm] = useState(36) // 3 года по умолчанию
  const [monthlyPayment, setMonthlyPayment] = useState(0)

  const loanAmount = carPrice - downPayment
  const downPaymentPercent = (downPayment / carPrice) * 100

  useEffect(() => {
    const payment = calculateMonthlyPayment(carPrice, downPayment, loanTerm)
    setMonthlyPayment(payment)
    
    onCalculate({
      loanAmount,
      downPayment,
      loanTerm,
      monthlyPayment: payment
    })
  }, [carPrice, downPayment, loanTerm, onCalculate, loanAmount])

  const handleDownPaymentChange = (value: string) => {
    const amount = parseFloat(value) || 0
    if (amount >= 0 && amount <= carPrice) {
      setDownPayment(amount)
    }
  }

  const handleDownPaymentPercentChange = (percent: number) => {
    const amount = (carPrice * percent) / 100
    setDownPayment(amount)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Calculator className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold">Калькулятор рассрочки</h3>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Стоимость автомобиля */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Стоимость автомобиля
          </label>
          <div className="text-2xl font-bold text-gray-900">
            {formatPrice(carPrice)}
          </div>
        </div>

        {/* Первоначальный взнос */}
        <div>
          <Input
            label="Первоначальный взнос"
            type="number"
            value={downPayment}
            onChange={(e) => handleDownPaymentChange(e.target.value)}
            min={0}
            max={carPrice}
          />
          <div className="mt-2 text-sm text-gray-600">
            {downPaymentPercent.toFixed(1)}% от стоимости
          </div>
          
          {/* Быстрые кнопки процентов */}
          <div className="flex space-x-2 mt-3">
            {[10, 20, 30, 50].map((percent) => (
              <button
                key={percent}
                onClick={() => handleDownPaymentPercentChange(percent)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  Math.abs(downPaymentPercent - percent) < 1
                    ? 'bg-primary-100 border-primary-300 text-primary-700'
                    : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {percent}%
              </button>
            ))}
          </div>
        </div>

        {/* Срок кредита */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Срок рассрочки (месяцев)
          </label>
          <input
            type="range"
            min={12}
            max={60}
            step={6}
            value={loanTerm}
            onChange={(e) => setLoanTerm(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>1 год</span>
            <span className="font-medium text-gray-900">{loanTerm} мес</span>
            <span>5 лет</span>
          </div>
        </div>

        {/* Результаты расчета */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Сумма кредита:</span>
            <span className="font-semibold">{formatPrice(loanAmount)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Срок:</span>
            <span className="font-semibold">{loanTerm} месяцев</span>
          </div>
          
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900">
                Ежемесячный платеж:
              </span>
              <span className="text-2xl font-bold text-primary-600">
                {formatPrice(monthlyPayment)}
              </span>
            </div>
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Процентная ставка: 12% годовых</p>
          <p>• Без скрытых комиссий и переплат</p>
          <p>• Возможность досрочного погашения</p>
        </div>
      </CardContent>
    </Card>
  )
}