'use client'

import React from 'react'
import { useLanguage } from '@/lib/language-context'

interface GaussianChartProps {
  percentile: number
  title: string
  width?: number
  height?: number
}

export default function GaussianChart({ percentile, title, width = 320, height = 180 }: GaussianChartProps) {
  const { t } = useLanguage()
  
  // Round percentile to whole number (max 2 digits)
  const roundedPercentile = Math.round(percentile)
  
  // Helper function to get the percentage range text
  const getPercentileRangeText = (percentile: number): string => {
    if (percentile >= 99) return `${t('report.topPercent')} 1%`
    if (percentile >= 98) return `${t('report.topPercent')} 2%`
    if (percentile >= 97) return `${t('report.topPercent')} 3%`
    if (percentile >= 96) return `${t('report.topPercent')} 4%`
    if (percentile >= 95) return `${t('report.topPercent')} 5%`
    if (percentile >= 94) return `${t('report.topPercent')} 6%`
    if (percentile >= 93) return `${t('report.topPercent')} 7%`
    if (percentile >= 92) return `${t('report.topPercent')} 8%`
    if (percentile >= 91) return `${t('report.topPercent')} 9%`
    if (percentile >= 90) return `${t('report.topPercent')} 10%`
    if (percentile >= 85) return `${t('report.topPercent')} 15%`
    if (percentile >= 80) return `${t('report.topPercent')} 20%`
    if (percentile >= 75) return `${t('report.topPercent')} 25%`
    if (percentile >= 50) return t('report.aboveAverage')
    if (percentile >= 25) return t('report.belowAverage')
    return `${t('report.bottomPercent')} 25%`
  }
  
  // Generate unique IDs to avoid conflicts when multiple charts are on the same page
  const chartId = React.useId()
  const gradientId = `gradient-${chartId}`
  const patternId = `pattern-${chartId}`
  
  const generateBellCurve = () => {
    const points = []
    const numPoints = 100
    const mean = 50
    const stdDev = 16.67 // Roughly maps to percentiles where 95% of data is within ~3 standard deviations
    
    for (let i = 0; i <= numPoints; i++) {
      const x = (i / numPoints) * 100
      const exponent = -0.5 * Math.pow((x - mean) / stdDev, 2)
      const y = Math.exp(exponent)
      points.push({ x, y })
    }
    
    return points
  }

  const bellCurvePoints = generateBellCurve()
  const maxY = Math.max(...bellCurvePoints.map(p => p.y))
  
  const chartPadding = 30 // Increased padding to prevent text overflow
  const labelPadding = 15 // Additional padding for labels
  const chartWidth = width - (chartPadding * 2)
  const chartHeight = height - (chartPadding * 2) - labelPadding
  
  // Scale points to chart dimensions
  const scaledPoints = bellCurvePoints.map(p => ({
    x: chartPadding + (p.x / 100) * chartWidth,
    y: chartPadding + chartHeight - (p.y / maxY) * chartHeight
  }))
  
  // Create SVG path for the curve
  const pathData = scaledPoints
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(' ')
  
  // User's position on the curve - improved calculation
  const userX = chartPadding + (percentile / 100) * chartWidth
  const userPointIndex = Math.round((percentile / 100) * (scaledPoints.length - 1))
  const userY = scaledPoints[userPointIndex]?.y || (chartPadding + chartHeight * 0.5)
  
  return (
    <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
      <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 text-center truncate">{title}</h3>
      <div className="relative w-full flex justify-center">
        <svg 
          width="100%" 
          height={height} 
          viewBox={`0 0 ${width} ${height}`}
          className="max-w-full h-auto"
          preserveAspectRatio="xMidYMid meet"
          style={{ maxHeight: `${height}px`, minHeight: '120px' }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#374151" stopOpacity="0.2"/>
              <stop offset="100%" stopColor="#374151" stopOpacity="0.05"/>
            </linearGradient>
          </defs>
          
          {/* Fill under curve */}
          <path
            d={`${pathData} L ${(chartPadding + chartWidth).toFixed(2)} ${(chartPadding + chartHeight).toFixed(2)} L ${chartPadding.toFixed(2)} ${(chartPadding + chartHeight).toFixed(2)} Z`}
            fill={`url(#${gradientId})`}
            fillOpacity="0.8"
          />
          
          {/* Bell curve */}
          <path
            d={pathData}
            fill="none"
            stroke="#6b7280"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Percentile markers */}
          {[25, 50, 75].map(p => {
            const x = chartPadding + (p / 100) * chartWidth
            return (
              <g key={p}>
                <line
                  x1={x.toFixed(2)}
                  y1={chartPadding}
                  x2={x.toFixed(2)}
                  y2={chartPadding + chartHeight}
                  stroke="#d1d5db"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                  opacity="0.5"
                />
                <text
                  x={x.toFixed(2)}
                  y={chartPadding + chartHeight + 12}
                  textAnchor="middle"
                  fill="#6b7280"
                  fontSize="9"
                  fontFamily="system-ui, sans-serif"
                >
                  {p}th
                </text>
              </g>
            )
          })}
          
          {/* X-axis */}
          <line
            x1={chartPadding}
            y1={chartPadding + chartHeight}
            x2={chartPadding + chartWidth}
            y2={chartPadding + chartHeight}
            stroke="#9ca3af"
            strokeWidth="1"
          />
          
          {/* User's score marker */}
          <g>
            {/* Vertical line */}
            <line
              x1={userX.toFixed(2)}
              y1={userY.toFixed(2)}
              x2={userX.toFixed(2)}
              y2={chartPadding + chartHeight}
              stroke="#111827"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            
            {/* Circle marker */}
            <circle
              cx={userX.toFixed(2)}
              cy={userY.toFixed(2)}
              r="5"
              fill="#111827"
              stroke="#fff"
              strokeWidth="2"
            />
            
            {/* Score label background */}
            <rect
              x={userX - 18}
              y={userY - 25}
              width="36"
              height="16"
              rx="8"
              fill="#111827"
              opacity="0.95"
            />
            
            {/* Score label text */}
            <text
              x={userX.toFixed(2)}
              y={userY - 14}
              textAnchor="middle"
              fill="#fff"
              fontSize="10"
              fontWeight="600"
              fontFamily="system-ui, sans-serif"
            >
              {roundedPercentile}°
            </text>
          </g>
          
          {/* X-axis label */}
          <text
            x={chartPadding + chartWidth / 2}
            y={height - 3}
            textAnchor="middle"
            fill="#6b7280"
            fontSize="9"
            fontFamily="system-ui, sans-serif"
          >
            Percentile
          </text>
        </svg>
      </div>
      
      <div className="mt-2 sm:mt-3 text-center">
        <div className="text-sm sm:text-lg font-bold text-gray-900">{roundedPercentile}{t('report.thPercentile')}</div>
        <div className="text-xs text-gray-600 mt-1">
          {getPercentileRangeText(roundedPercentile)}
        </div>
      </div>
    </div>
  )
}