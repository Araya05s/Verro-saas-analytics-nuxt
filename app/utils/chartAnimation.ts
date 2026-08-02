import type { AnimationSpec, CoreChartOptions } from 'chart.js'

export interface CustomChartAnimationConfig {
  animation?: AnimationSpec<any> | false
  animations?: Record<string, any>
}
/** Line Chart Left-to-Right Draw Animation */
export const lineLeftToRightAnimation: CustomChartAnimationConfig = {
  animation: {
    duration: 1200,
    easing: 'easeInOutQuart'
  },
  animations: {
    x: {
      type: 'number',
      easing: 'linear',
      duration: 1000,
      from: 0 
    },
    opacity: {
      type: 'number',
      easing: 'easeInQuad',
      duration: 600,
      from: 0,
      to: 1
    }
  }
}

/** Bar Chart Left-to-Right Staggered Animation */
export const barProgressiveRiseAnimation: CustomChartAnimationConfig = {
  animation: {
    duration: 800,
    easing: 'easeOutQuart',
    delay: (context) => {
      let delay = 0
      if (context.type === 'data' && context.mode === 'default' && !context.dropped) {
        delay = context.dataIndex * 80 + context.datasetIndex * 100
      }
      return delay
    }
  },
  animations: {
    y: {
      type: 'number',
      easing: 'easeOutBounce',
      duration: 700
    },
    opacity: {
      from: 0,
      to: 1,
      duration: 400
    }
  }
}

export function withChartAnimation<T extends keyof CoreChartOptions>(
  baseOptions: Record<string, any>,
  animationPreset: CustomChartAnimationConfig
): Record<string, any> {
  return {
    ...baseOptions,
    ...animationPreset
  }
}