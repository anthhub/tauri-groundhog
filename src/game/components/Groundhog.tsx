import { Sprite } from '@pixi/react';
import { useCallback } from 'react';
import { GroundhogConfig } from '../types/game';

// 临时使用一个简单的图片，后续会替换为精灵图
const TEMP_GROUNDHOG = 'https://pixijs.io/pixi-react/img/bunny.png';

interface GroundhogProps {
  config: GroundhogConfig;
  onHit?: () => void;
}

export function Groundhog({ config, onHit }: GroundhogProps) {
  const handleClick = useCallback(() => {
    onHit?.();
  }, [onHit]);

  return (
    <Sprite
      image={TEMP_GROUNDHOG}
      x={config.x}
      y={config.y}
      scale={[config.scale, config.scale]}
      anchor={0.5}
      interactive={true}
      onclick={handleClick}
    />
  );
}
